export async function onRequestGet({ env }) {
  const publishableKey =
    env.PUBLIC_CLERK_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    env.CLERK_PUBLISHABLE_KEY ||
    "";

  const isSatellite = parseBoolean(env.CLERK_IS_SATELLITE);
  const domain = normalizeText(env.CLERK_DOMAIN);
  const signInUrl = normalizeUrl(env.CLERK_SIGN_IN_URL);
  const signUpUrl = normalizeUrl(env.CLERK_SIGN_UP_URL);
  const allowedRedirectOrigins = parseOriginList(env.CLERK_ALLOWED_REDIRECT_ORIGINS);
  const satelliteAutoSync = parseBoolean(env.CLERK_SATELLITE_AUTO_SYNC);

  return new Response(
    JSON.stringify({
      publishableKey,
      configured: Boolean(publishableKey),
      isSatellite,
      domain,
      signInUrl,
      signUpUrl,
      allowedRedirectOrigins,
      satelliteAutoSync,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeUrl(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" || parsed.hostname === "localhost" ? parsed.href : "";
  } catch (_error) {
    return "";
  }
}

function parseBoolean(value) {
  return /^(?:1|true|yes|on)$/i.test(normalizeText(value));
}

function parseOriginList(value) {
  return normalizeText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => {
      try {
        return [new URL(item).origin];
      } catch (_error) {
        return [];
      }
    });
}
