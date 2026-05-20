import { neon } from "@neondatabase/serverless";
import { getSongDetailsServer } from "@/services/musicApiServer";
import { getBearerToken, verifyFirebaseToken } from "@/app/_utils/verifyAuth";

export async function POST(request) {
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    return Response.json({ error: "Database not configured" }, { status: 500 });
  }

  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(dbUrl);

  try {
    const body = await request.json();
    const { song_id, title, rating, date, body: reviewBody } = body;

    if (rating < 0 || rating > 10 || !reviewBody?.trim()) {
      return Response.json({ error: "Invalid review data" }, { status: 400 });
    }

    const dbUsers = await sql`
      SELECT user_id FROM users WHERE email = ${authUser.email}
    `;
    if (dbUsers.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const user_id = dbUsers[0].user_id;

    const songExists = await sql`
      SELECT song_id FROM songs WHERE song_id = ${song_id}
    `;

    if (songExists.length === 0) {
      const songDetails = await getSongDetailsServer(song_id);
      await sql`
        INSERT INTO songs (song_id, song_name, artist, album)
        VALUES (${song_id}, ${songDetails.title}, ${songDetails.singers}, ${songDetails.album})
      `;
    }

    const existingReview = await sql`
      SELECT * FROM reviews
      WHERE user_id = ${user_id} AND song_id = ${song_id}
    `;

    let result;
    if (existingReview.length > 0) {
      result = await sql`
        UPDATE reviews
        SET
          review_title = ${title},
          rating = ${rating},
          review_date = ${date},
          review_body = ${reviewBody}
        WHERE user_id = ${user_id} AND song_id = ${song_id}
        RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO reviews (
          user_id, song_id, review_title, rating, review_date, review_body
        )
        VALUES (
          ${user_id}, ${song_id}, ${title}, ${rating}, ${date}, ${reviewBody}
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
