import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { getSongDetails } from "@/services/musicApi";

export async function POST(request) {
  const dbUrl = process.env.DATABASE_URL || "";
  const sql = neon(dbUrl);

  try {
    const body = await request.json();
    console.log("Received request body:", body);

    // First check if song exists
    const songExists = await sql`
      SELECT song_id FROM songs WHERE song_id = ${body.song_id}
    `;

    if (songExists.length === 0) {
      // Fetch song details from Deezer API
      const songDetails = await getSongDetails(body.song_id);

      // Insert the song with details from the API
      await sql`
        INSERT INTO songs (
          song_id, 
          song_name, 
          artist, 
          album
        ) 
        VALUES (
          ${body.song_id}, 
          ${songDetails.title}, 
          ${songDetails.singers}, 
          ${songDetails.album}
        )
      `;
    }

    // Check if review already exists
    const existingReview = await sql`
      SELECT * FROM reviews 
      WHERE user_id = ${body.user_id} AND song_id = ${body.song_id}
    `;

    let result;
    if (existingReview.length > 0) {
      // Update existing review
      result = await sql`
        UPDATE reviews 
        SET 
          review_title = ${body.title},
          rating = ${body.rating},
          review_date = ${body.date},
          review_body = ${body.body}
        WHERE user_id = ${body.user_id} AND song_id = ${body.song_id}
        RETURNING *
      `;
    } else {
      // Create new review
      result = await sql`
        INSERT INTO reviews (
          user_id, 
          song_id, 
          review_title, 
          rating, 
          review_date, 
          review_body
        ) 
        VALUES (
          ${body.user_id}, 
          ${body.song_id}, 
          ${body.title}, 
          ${body.rating}, 
          ${body.date}, 
          ${body.body}
        ) 
        RETURNING *
      `;
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error saving review:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
