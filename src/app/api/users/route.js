import { z } from "zod";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const sql = neon(dbUrl);
  const response = await sql`SELECT * FROM users`;
  return Response.json(response);
}

export async function POST(request) {
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    return Response.json({ error: "Database not configured" }, { status: 500 });
  }

  let newUser;
  try {
    newUser = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const newUserSchema = z.object({
    email: z.string().email().max(100),
    display_name: z.string().min(1).max(100),
  });

  const parsed = newUserSchema.safeParse(newUser);
  if (!parsed.success) {
    return Response.json({ error: "Invalid user data" }, { status: 400 });
  }

  const { email, display_name } = parsed.data;
  const sql = neon(dbUrl);

  try {
    const inserted = await sql`
      INSERT INTO users (email, display_name)
      VALUES (${email}, ${display_name})
      RETURNING *
    `;
    return Response.json(inserted[0], { status: 201 });
  } catch (error) {
    // Email already exists — return existing user
    if (error.code === "23505") {
      const existing = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      if (existing.length > 0) {
        return Response.json(existing[0], { status: 200 });
      }
    }
    console.error("Error creating user:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
