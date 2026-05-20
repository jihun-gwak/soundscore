import { neon } from "@neondatabase/serverless";

export async function GET(_request, { params }) {
  const { id } = await params;
  const idNum = Number(id);
  const dbUrl = process.env.DATABASE_URL || "";
  const sql = neon(dbUrl);

  const reviews = await sql`
    SELECT
      r.user_id,
      r.song_id,
      r.review_title,
      r.rating,
      r.review_date,
      r.review_body,
      u.display_name
    FROM reviews r
    JOIN users u ON u.user_id = r.user_id
    WHERE r.song_id = ${idNum}
    ORDER BY r.review_date DESC
  `;

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return Response.json({ reviews, averageRating: avg, count: reviews.length });
}
