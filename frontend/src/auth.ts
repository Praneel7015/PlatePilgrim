// Cognito Hosted UI helpers for PlatePilgrim.
// Uses the Authorization Code grant flow — no client secret (SPA).

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN; // e.g. https://platepilgrim.auth.ap-south-1.amazoncognito.com
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/callback`;

export interface UserInfo {
  sub: string;
  email: string;
  name?: string;
}

/** Redirect the browser to Cognito Hosted UI login page. */
export function signIn() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "openid email profile",
  });
  window.location.href = `${COGNITO_DOMAIN}/login?${params}`;
}

/** Redirect to Cognito logout endpoint and clear local tokens. */
export function signOut() {
  clearTokens();
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: window.location.origin,
  });
  window.location.href = `${COGNITO_DOMAIN}/logout?${params}`;
}

/** Exchange the code from the URL for tokens, store them, return to app root. */
export async function handleCallback(): Promise<void> {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
  });

  const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) throw new Error("Token exchange failed");
  const data = await res.json();

  localStorage.setItem("pp_access_token", data.access_token);
  localStorage.setItem("pp_id_token", data.id_token);
  if (data.refresh_token) {
    localStorage.setItem("pp_refresh_token", data.refresh_token);
  }

  window.history.replaceState({}, "", "/");
}

/** JWT for API Gateway — HTTP API authorizer expects the ID token `aud` claim. */
export function getAccessToken(): string | null {
  return localStorage.getItem("pp_id_token") || localStorage.getItem("pp_access_token");
}

export function getIdToken(): string | null {
  return localStorage.getItem("pp_id_token");
}

function clearTokens() {
  localStorage.removeItem("pp_access_token");
  localStorage.removeItem("pp_id_token");
  localStorage.removeItem("pp_refresh_token");
}

/** Decode a JWT payload (no verification — verification happens on the server). */
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export function getCurrentUser(): UserInfo | null {
  const idToken = getIdToken();
  if (!idToken) return null;
  const payload = decodeJwtPayload(idToken);
  const exp = payload.exp as number | undefined;
  if (exp && Date.now() / 1000 > exp) {
    clearTokens();
    return null;
  }
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    name: (payload.name || payload.email) as string,
  };
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
