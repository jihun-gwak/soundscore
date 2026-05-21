export class ClientApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ClientApiError";
    this.status = status;
  }
}

export async function parseApiError(response, fallback = "Request failed") {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
  } catch {
    // response body was not JSON
  }

  const statusMessages = {
    400: "Invalid request",
    401: "Please sign in to continue",
    403: "You do not have permission",
    404: "Not found",
    406: "Invalid data",
    500: "Server error — try again later",
    502: "Service temporarily unavailable",
    503: "Service unavailable",
  };

  return statusMessages[response.status] || fallback;
}

/**
 * Fetch JSON from an API route with consistent error handling.
 */
export async function fetchJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ClientApiError(
      "Network error. Check your connection and try again.",
      0
    );
  }

  if (!response.ok) {
    const message = await parseApiError(response);
    throw new ClientApiError(message, response.status);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    throw new ClientApiError("Invalid response from server", response.status);
  }
}

export function getClientErrorMessage(error, fallback = "Something went wrong") {
  if (error instanceof ClientApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isUnauthorized(error) {
  return error instanceof ClientApiError && error.status === 401;
}
