// Deprecated brand-detail path.
//
// Franchisor.id brand pages live at /usaha/{slug} (see docs/data/SHARED_DATA_CONTRACT.md).
// Previously shared /peluang-usaha/{slug} links must reach the canonical page with a real
// HTTP 301 so crawlers and browsers both follow it. This Function is the redirect, and
// src/pages/peluang-usaha/[slug].astro remains only as a noindex meta-refresh fallback
// for the case where this handler cannot verify the row and lets the request fall through.
//
// Directory subroutes live under the same prefix. `kategori`, `kota`, and `modal` are
// single-segment paths that would otherwise be captured here, so they are reserved and
// fall through to their real pages. A slug is only redirected when the shared D1 database
// confirms a published Franchisor projection for it, which keeps an unknown one-segment
// path from being turned into a second soft-404.

const RESERVED_SLUGS = new Set([
  "index",
  "kategori",
  "kota",
  "modal",
  "abjad",
  "populer",
  "rekomendasi",
  "direktori-franchise",
]);

export async function onRequest(context) {
  const { request, env, params } = context;
  if (request.method !== "GET" && request.method !== "HEAD") return context.next();

  const slug = String(params?.slug || "").trim().toLowerCase();
  if (!slug || RESERVED_SLUGS.has(slug)) return context.next();
  if (!env?.franchise_db) return context.next();

  let isPublished = false;
  try {
    const row = await env.franchise_db
      .prepare(
        `SELECT 1 AS published FROM franchise_site_publications p
         JOIN franchises f ON f.id = p.franchise_id
         WHERE p.site_id = 'site_franchisor_id'
           AND p.slug = ?
           AND p.publication_status = 'published'
           AND f.status NOT IN ('archived', 'suspended')
         LIMIT 1`,
      )
      .bind(slug)
      .first();
    isPublished = Boolean(row);
  } catch {
    return context.next();
  }
  if (!isPublished) return context.next();

  const url = new URL(request.url);
  url.pathname = `/usaha/${slug}`;
  url.search = "";
  return new Response(null, {
    status: 301,
    headers: {
      location: url.toString(),
      "cache-control": "public, max-age=3600",
    },
  });
}
