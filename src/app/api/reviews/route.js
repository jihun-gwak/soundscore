import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const reviewSchema = z.object({
  user_id: z.number(),
  song_id: z.string(),
  title: z.null(),
  rating: z.number().min(1).max(10),
  date: z.string(),
  body: z.string(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const review = reviewSchema.parse(body);

    await sql`
      INSERT INTO songs (song_id, song_name)
      VALUES (${review.song_id}::text::bigint, 'Unknown Song')
      ON CONFLICT (song_id) DO NOTHING
    `;

    const result = await sql`
      INSERT INTO reviews (user_id, song_id, rating, review_date, review_body)
      VALUES (
        ${review.user_id}, 
        ${review.song_id}::text::bigint,
        ${review.rating}, 
        ${review.date}, 
        ${review.body}
      )
      RETURNING *
    `;

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create review",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
