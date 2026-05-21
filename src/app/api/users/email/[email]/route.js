import { neon } from "@neondatabase/serverless";

export async function GET(_request, { params }) {
  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail);
  const dbUrl = process.env.DATABASE_URL || "";

  if (!dbUrl) {
    return Response.json({ error: "Database not configured" }, { status: 500 });
  }

  const sql = neon(dbUrl);
  const response = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (response.length === 0) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(response[0]);
}
