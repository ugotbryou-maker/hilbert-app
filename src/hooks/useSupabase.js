// ============================================================
// useSupabase — Mix : Supabase réel (actualites) + Mock (reste)
// ============================================================

import { useState, useCallback } from "react";
import * as mockData from "../mock/data.js";
import { supabase } from "../lib/supabase.js";

// Simule un délai réseau
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    // API V2: const { data } = await supabase.from('users').select('*').single()
    setLoading(true);
    await delay();
    setLoading(false);
    return mockData.mockUser;
  }, []);

  const fetchPortefeuille = useCallback(async () => {
    // API V2: const { data } = await supabase.from('portefeuilles').select('*, placements(*)')
    setLoading(true);
    await delay(400);
    setLoading(false);
    return mockData.mockPortefeuille;
  }, []);

  const fetchDocuments = useCallback(async () => {
    // API V2: const { data } = await supabase.from('documents').select('*').order('date', { ascending: false })
    setLoading(true);
    await delay(300);
    setLoading(false);
    return mockData.mockDocuments;
  }, []);

  const fetchRendezVous = useCallback(async () => {
    // API V2: const { data } = await supabase.from('rendez_vous').select('*').gte('date', new Date().toISOString())
    setLoading(true);
    await delay(200);
    setLoading(false);
    return mockData.mockRendezVous;
  }, []);

  const fetchActualites = useCallback(async () => {
    setLoading(true);
    try {
      if (!supabase) throw new Error("Supabase non configuré");

      const { data, error: sbError } = await supabase
        .from("actualites")
        .select("*")
        .order("date", { ascending: false });

      if (sbError) throw sbError;

      // Mapper vers le format attendu par les composants
      const mapped = (data ?? []).map((a) => ({
        id:       a.id,
        titre:    a.titre,
        extrait:  a.extrait,
        source:   a.source,
        url:      a.url,
        slug:     a.slug,
        date:     a.date,
        imageUrl: a.image_url ?? null,
        type:     Array.isArray(a.categories) ? a.categories[0] : (a.categories ?? "Actualité"),
      }));

      return mapped;
    } catch (e) {
      console.warn("fetchActualites Supabase error, fallback mock:", e.message);
      return mockData.mockActualites;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    // API V2: const { data } = await supabase.from('notifications').select('*').eq('user_id', userId)
    setLoading(true);
    await delay(200);
    setLoading(false);
    return mockData.mockNotifications;
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    // API V2: await supabase.from('notifications').update({ lu: true }).eq('id', id)
    await delay(100);
    return { success: true };
  }, []);

  const login = useCallback(async (email, password) => {
    // API V2: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    await delay(600);
    if (email === "test@hilbert-wm.fr" && password === "demo") {
      return { success: true, user: mockData.mockUser };
    }
    return { success: false, error: "Identifiants incorrects" };
  }, []);

  const logout = useCallback(async () => {
    // API V2: await supabase.auth.signOut()
    await delay(200);
    return { success: true };
  }, []);

  const updateUser = useCallback(async (updates) => {
    // API V2: await supabase.from('users').update(updates).eq('id', userId)
    await delay(400);
    return { success: true, user: { ...mockData.mockUser, ...updates } };
  }, []);

  const bookRendezVous = useCallback(async ({ date, heure, type }) => {
    // API V2: await supabase.from('rendez_vous').insert({ date, heure, type, statut: 'en_attente', user_id: userId })
    // API V2: Déclencher notification Calendly / Google Calendar via Edge Function
    await delay(500);
    return {
      success: true,
      rdv: {
        id: `rdv_${Date.now()}`,
        type,
        date,
        heure,
        statut: "en_attente",
      },
    };
  }, []);

  return {
    loading,
    error,
    fetchUser,
    fetchPortefeuille,
    fetchDocuments,
    fetchRendezVous,
    fetchActualites,
    fetchNotifications,
    markNotificationRead,
    login,
    logout,
    updateUser,
    bookRendezVous,
  };
}
