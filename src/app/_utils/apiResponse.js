import { neon } from "@neondatabase/serverless";

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function jsonError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

export function jsonOk(data, status = 200) {
  return Response.json(data, { status });
}

export function getDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new ApiError("Database is not configured", 503);
  }
  return dbUrl;
}

export function getSql() {
  return neon(getDatabaseUrl());
}

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
}

export function parseNumericId(value, fieldName = "id") {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    throw new ApiError(`Invalid ${fieldName}`, 400);
  }
  return num;
}

/**
 * Wraps a route handler with consistent try/catch error responses.
 */
export function withHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return jsonError(error.message, error.status);
      }
      console.error("API error:", error);
      return jsonError(
        error?.message || "An unexpected server error occurred",
        500
      );
    }
  };
}
