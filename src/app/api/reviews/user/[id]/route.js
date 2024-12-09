import { neon } from "@neondatabase/serverless";

//get all reviews by user
export async function GET(request, { params }) {
  const { id } = await params;
  const idNum = Number(id);
  const dbUrl = process.env.DATABASE_URL || "";
  const sql = neon(dbUrl);

  //get review records
  const response = await sql`SELECT * FROM reviews WHERE user_id = ${idNum}`;

  return new Response(JSON.stringify(response), { status: 200 });
}
