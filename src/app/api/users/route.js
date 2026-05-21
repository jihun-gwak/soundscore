import { z } from "zod";
import {
  ApiError,
  getSql,
  jsonOk,
  parseJsonBody,
  withHandler,
} from "@/app/_utils/apiResponse";

export const GET = withHandler(async () => {
  const sql = getSql();
  const response = await sql`SELECT * FROM users`;
  return jsonOk(response);
});

export const POST = withHandler(async (request) => {
  const newUser = await parseJsonBody(request);

  const newUserSchema = z.object({
    email: z.string().email().max(100),
    display_name: z.string().min(1).max(100),
  });

  const parsed = newUserSchema.safeParse(newUser);
  if (!parsed.success) {
    throw new ApiError("Invalid user data", 400);
  }

  const { email, display_name } = parsed.data;
  const sql = getSql();

  try {
    const inserted = await sql`
      INSERT INTO users (email, display_name)
      VALUES (${email}, ${display_name})
      RETURNING *
    `;
    return jsonOk(inserted[0], 201);
  } catch (error) {
    if (error.code === "23505") {
      const existing = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      if (existing.length > 0) {
        return jsonOk(existing[0], 200);
      }
    }
    throw new ApiError("Failed to create user", 500);
  }
});
