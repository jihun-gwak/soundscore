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

    // Remove title field and use the correct column names
    const result = await sql`
      INSERT INTO reviews (user_id, song_id, rating, review_date, review_body)
      VALUES (${body.user_id}, ${body.song_id}, ${body.rating}, ${body.date}, ${body.body})
      ON CONFLICT (user_id, song_id) 
      DO UPDATE SET 
        rating = ${body.rating},
        review_date = ${body.date},
        review_body = ${body.body}
      RETURNING *;
    `;

    return Response.json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    return Response.json({ error: "Failed to save review" }, { status: 500 });
  }
}
