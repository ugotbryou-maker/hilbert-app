# Hilbert WM — Product Roadmap

> Document de référence produit. Mis à jour au fil des sessions.
> Stack : React + Vite / Supabase / Vercel / PWA → Capacitor

---

## Architecture cible : Multi-tenant avec Backoffice

Chaque cabinet dispose de son propre espace (branding, clients, documents, conseiller).
Le backoffice permet à chaque cabinet de tout gérer sans toucher au code.

```
[Backoffice cabinet]          [App client]
  ↓ configure                   ↓ affiche
  Supabase (source de vérité) ←→ cabinet.config.js (statique en V1, dynamique en V2)
```

**Schéma multi-tenant :**
- `cabinets` table → un cabinet = un slug, un branding, un domaine
- `users` table → chaque client appartient à un cabinet
- Row Level Security Supabase → chaque cabinet ne voit que ses données
- URL blanche par cabinet : `app.hilbert-wm.fr`, `app.autre-cabinet.fr`

---

## Phases produit

### V1 — MVP actuel + améliorations immédiates

#### À ajouter en V1 (décidé le 11/04/2026)

**Page Profil client** (nouvelle page `/profil`)
- Modifier son numéro de téléphone et email
- Ajouter / changer sa photo de profil
- Modifier son mot de passe
- Préférences notifications (activer/désactiver par type : doc, rdv, perf, news, blog)
- *Backoffice :* le conseiller voit les préférences client mais ne les modifie pas

**Sync articles de blog** (page Actualités + notifications)
- Webhook ou RSS : quand un article est publié sur le site cabinet → apparaît automatiquement dans l'onglet Actualités
- Les 2 derniers articles affichés en vignette thumbnail sur la Home
- Notification push automatique à la publication (désactivable dans le Profil)
- *API V2 :* intégration flux RSS du site cabinet, configurable URL dans le backoffice

**Onglet Réseaux sociaux** (dans Actualités)
- Feed des posts Instagram / LinkedIn du cabinet
- Section dédiée, non mélangée avec les articles
- *API V2 :* Meta Graph API (Instagram) + LinkedIn API

**Onglet Webinaires** (dans Actualités)
- Liste des webinaires à venir + replays
- Inscription en 1 clic (lien Zoom / Teams)
- Rappel automatique 24h avant (notification push)
- *Backoffice :* le cabinet crée/gère ses webinaires

#### Déjà fait ✅
- [x] Structure projet Vite + React
- [x] 5 pages : Home, Portefeuille, Documents, Contact, Actualités
- [x] Login mock (test@hilbert-wm.fr / demo)
- [x] Données mock API-ready dans `/mock/data.js`
- [x] PWA : manifest, service worker, meta iOS
- [x] Marque blanche centralisée dans `cabinet.config.js`
- [x] Navigation desktop (sidebar) + mobile (hamburger slide-in)
- [x] Panel notifications slide-in
- [x] Modal RDV 3 étapes (calendrier → créneau → confirmation)
- [x] Bottom sheet détail produit (Portefeuille)

---

### V2 — Supabase réel (priorité 1)
**Objectif : déployer la première démo cabinet avec de vraies données**

- [ ] Auth Supabase réelle (email/password)
- [ ] Tables Supabase : `users`, `portefeuilles`, `placements`, `documents`, `rdv`, `actualites`, `notifications`
- [ ] Supabase Storage pour les documents (PDF)
- [ ] Row Level Security (chaque client voit seulement ses données)
- [ ] `cabinet.config.js` chargé depuis Supabase (table `cabinets`) → plus de fichier statique
- [ ] Déploiement Vercel avec domaine custom (`app.hilbert-wm.fr`)
- [ ] Notifications push PWA via Supabase Edge Functions

---

### V3 — Backoffice cabinet (priorité 2)
**Objectif : chaque cabinet gère son espace sans intervention technique**

**Périmètre backoffice :**

#### Gestion clients
- Créer / inviter un client (envoi email onboarding)
- Voir la liste clients + statut actif/inactif
- Accéder au profil client (portefeuille, documents, RDV)
- Modifier le profil de risque client

#### Gestion documents
- Uploader des documents par client (PDF)
- Marquer un document comme "nouveau" → badge rouge côté client
- Catégoriser : rapport / attestation / relevé / fiscal / contrat

#### Gestion RDV
- Voir tous les RDV à venir par client
- Confirmer / annuler un RDV
- Connexion Google Calendar / Calendly (V3+)

#### Gestion actualités
- Publier un article (blog cabinet)
- Ajouter un lien externe (Les Échos, Le Revenu...)
- Programmer une publication à une date

#### Branding cabinet
- Logo, couleurs, nom (alimente `cabinet.config.js` dynamique)
- Photo et infos du conseiller référent
- Paramètres disponibilité conseiller

#### Tableau de bord cabinet
- Nombre de clients actifs
- Documents non lus par client
- Prochains RDV de la semaine

---

### V4 — Features haute valeur ajoutée (priorité 3)
**Objectif : différenciation produit, rétention client**

#### "Notifier mon conseiller" — Événements de vie ⭐⭐⭐
- Bouton dédié : le client signale un événement de vie (héritage, nouvel achat immobilier, projet d'investissement, changement de situation familiale)
- Le conseiller reçoit une notification sur le backoffice avec le type d'événement + message libre
- **Notification automatique tous les 6 mois** : "Avez-vous du nouveau à partager avec votre conseiller ?" — configurable dans le backoffice (fréquence, message, activation/désactivation par cabinet)
- Historique des événements signalés visible dans la timeline de la relation
- *Pourquoi :* le CGP rate souvent des opportunités faute d'information. Ce canal proactif crée des occasions de conseil et justifie les honoraires.

#### Messagerie sécurisée in-app ⭐⭐⭐
- Fil de conversation client ↔ conseiller
- Pièces jointes
- Accusé de lecture
- Notifications push à chaque message
- *Pourquoi :* canal unique manquant — email non sécurisé, WhatsApp non RGPD

#### Objectifs patrimoniaux ⭐⭐⭐
- Définir des objectifs : retraite, réduction IFI, études enfants, achat immobilier
- Barre de progression visuelle vers l'objectif
- Le conseiller pilote les jalons depuis le backoffice
- *Pourquoi :* transforme l'app d'un relevé passif en outil de suivi actif

#### Biométrie (Face ID / Touch ID) ⭐⭐⭐
- Login via Capacitor Biometrics Plugin
- Fallback PIN 6 chiffres
- *Pourquoi :* friction rédhibitoire pour 45-65 ans sans biométrie

#### Simulateur fiscal simplifié ⭐⭐
- "Si j'investis X€ dans ce produit, quel impact sur mon TMI ?"
- Hypothèses configurables par le conseiller
- Non normatif — accompagné d'un disclaimer conseil
- *Pourquoi :* raison n°1 d'avoir un CGP en France

#### Accès conjoint / famille ⭐⭐
- Compte secondaire en lecture seule
- Partage de la vue patrimoine et documents
- *Pourquoi :* très courant, double la valeur perçue

#### E-signature documents ⭐⭐
- Intégration **YouSign** (acteur français, RGPD natif) en priorité, DocuSign en fallback
- Signer lettre de mission, mandats d'arbitrage, fiches de conseil directement dans l'app
- Traçabilité réglementaire (DDA, MIF2) — piste d'audit complète
- Documents signés automatiquement archivés dans l'onglet Documents

#### Portefeuille — Détail approfondi par produit ⭐⭐
- Actuellement limité par l'absence d'API fournisseur
- **Sans API :** allocation par sous-classe d'actif (mock), graphique de performance historique, fiche produit enrichie
- **Avec API (V3) :** données temps réel AXA, Abeille, Amundi, Perial AM, Spirica
  - Valeur liquidative exacte (VL)
  - Composition détaillée du fonds (actions, obligataires, immobilier...)
  - Donut par ligne de détention
  - Frais réels
- *Note : on peut pré-câbler les écrans en V2 avec des données enrichies mock, prêts pour le branchement API*

#### Timeline de la relation ⭐
- Historique chronologique : RDV, documents, arbitrages, conseils
- Visualise la valeur du travail du conseiller sur plusieurs années

#### Alertes configurables ⭐
- Le client paramètre ses seuils de performance
- Le conseiller peut pousser des alertes ciblées

---

### V5 — App native (Capacitor)
- Build iOS (App Store) + Android (Google Play)
- Notifications natives
- Accès caméra pour photo de profil
- Biométrie native
- *Note : l'architecture actuelle est déjà compatible (pas de localStorage)*

---

## Ce qu'on ne fera PAS

- Flux marchés temps réel → c'est Boursorama
- Robo-advisor → retire de la valeur au conseiller
- Features sociales → hors cible

---

## Notes architecture backoffice

Le backoffice sera une **app React séparée** (même repo, `/admin` ou repo dédié) :
- Auth admin distincte (rôle `cabinet_admin` dans Supabase)
- Dashboard par cabinet (slug-based routing)
- Partage des composants UI avec l'app client via `/src/components/shared`
- Déployé sur `admin.hilbert-wm.fr` (ou `app.hilbert-wm.fr/admin`)

Les données saisies dans le backoffice se reflètent **en temps réel** côté client via Supabase Realtime.
