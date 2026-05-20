/**
 * Verifies a Firebase ID token using the Identity Toolkit REST API.
 * Requires NEXT_PUBLIC_FIREBASE_API_KEY (same as client Firebase config).
 */
export async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !idToken) {
    return null;
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const account = data.users?.[0];
  if (!account?.email) {
    return null;
  }

  return {
    email: account.email,
    uid: account.localId,
  };
}

export function getBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}
