// ============================================================
// Edge Function : sync-actualites — PRODUCTION v1
// Scrape hilbert-wm.com/nos-articles + og:image par article
// puis upsert dans Supabase table "actualites"
// ============================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BASE_URL = "https://www.hilbert-wm.com";

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

// Mapping catégories Sanity → label FR
const CATEGORY_LABELS: Record<string, string> = {
  financial:    "Finances",
  tax:          "Fiscalité",
  real_estate:  "Immobilier",
  insurance:    "Assurance",
  retirement:   "Retraite",
  investment:   "Investissement",
  individual:   "Particulier",
  professional: "Professionnel",
};

function categoryLabel(cat: string | null, section: string | null): string {
  if (cat && CATEGORY_LABELS[cat]) return CATEGORY_LABELS[cat];
  if (section && CATEGORY_LABELS[section]) return CATEGORY_LABELS[section];
  return "Actualité";
}

// Extraire le premier texte significatif du body Sanity (portable text)
function extractIntro(body: unknown[]): string {
  if (!Array.isArray(body)) return "";
  for (const block of body) {
    const b = block as Record<string, unknown>;
    if (b._type === "block" && Array.isArray(b.children)) {
      const text = (b.children as Array<{ text?: string }>)
        .map((c) => c.text ?? "").join("").trim();
      if (text.length > 20) return text.slice(0, 220);
    }
  }
  return "";
}

// Désescaper les blocs __next_f.push([1, "..."])
function extractNextFData(html: string): string {
  const pushRe = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let combined = "";
  let m: RegExpExecArray | null;
  while ((m = pushRe.exec(html)) !== null) {
    try { combined += JSON.parse(`"${m[1]}"`); }
    catch { combined += m[1]; }
  }
  return combined;
}

// Extraire og:image depuis le HTML d'une page article
function extractOgImage(html: string): string | null {
  // <meta property="og:image" content="..." />
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (m) return m[1];

  // Fallback : twitter:image
  const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (tw) return tw[1];

  return null;
}

// Extraire le tableau solutions depuis le combined
function parseSolutions(combined: string): Record<string, unknown>[] {
  const solutionsIdx = combined.indexOf('"solutions":[');
  if (solutionsIdx < 0) throw new Error('Tableau "solutions" introuvable');

  const arrayStart = combined.indexOf('[', solutionsIdx);
  let depth = 0, arrayEnd = -1;
  for (let i = arrayStart; i < combined.length; i++) {
    const c = combined[i];
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) { arrayEnd = i; break; }
    }
  }
  if (arrayEnd < 0) throw new Error("Fin du tableau solutions introuvable");
  return JSON.parse(combined.substring(arrayStart, arrayEnd + 1));
}

// ── Main handler ──
Deno.serve(async (req) => {
  const isDryRun = new URL(req.url).searchParams.get("dry") === "1";

  try {
    // 1. Fetch page liste
    const listRes = await fetch(`${BASE_URL}/nos-articles`, { headers: FETCH_HEADERS });
    if (!listRes.ok) throw new Error(`Fetch liste failed: ${listRes.status}`);
    const listHtml = await listRes.text();

    // 2. Parser les solutions
    const combined = extractNextFData(listHtml);
    const solutions = parseSolutions(combined);

    // 3. Pour chaque article, fetch sa page pour récupérer og:image
    const articles = await Promise.all(
      solutions.map(async (s) => {
        const slug = s.slug as string;
        let imageUrl: string | null = null;

        try {
          const articleRes = await fetch(`${BASE_URL}/nos-articles/${slug}`, {
            headers: FETCH_HEADERS,
          });
          if (articleRes.ok) {
            const articleHtml = await articleRes.text();
            imageUrl = extractOgImage(articleHtml);
          }
        } catch {
          // Image non critique — on continue sans
        }

        const cat = categoryLabel(s.category as string | null, s.section as string | null);
        return {
          id:          s._id as string,
          titre:       ((s.title as string) ?? "").trim(),
          slug,
          extrait:     (s.metaDescription as string | null) ?? extractIntro(s.body as unknown[]),
          categories:  [cat],
          source:      "Hilbert WM",
          url:         `${BASE_URL}/nos-articles/${slug}`,
          date:        s._createdAt as string,
          image_url:   imageUrl,
        };
      })
    );

    // 4. Dry run → retourner sans écrire
    if (isDryRun || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return new Response(
        JSON.stringify({ success: true, dry: true, count: articles.length, articles }, null, 2),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Upsert Supabase
    const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/actualites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey":        SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Prefer":        "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(articles),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      throw new Error(`Supabase upsert failed (${upsertRes.status}): ${errText}`);
    }

    const upserted = await upsertRes.json() as unknown[];

    return new Response(
      JSON.stringify({ success: true, scraped: articles.length, upserted: upserted.length, articles }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
