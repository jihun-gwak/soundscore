import {
  ApiError,
  getSql,
  jsonOk,
  parseJsonBody,
  withHandler,
} from "@/app/_utils/apiResponse";
import { getSongDetailsServer } from "@/services/musicApiServer";
import { getBearerToken, verifyFirebaseToken } from "@/app/_utils/verifyAuth";

export const POST = withHandler(async (request) => {
  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) {
    throw new ApiError("Sign in required to submit a review", 401);
  }

  const body = await parseJsonBody(request);
  const { song_id, title, rating, date, body: reviewBody } = body;

  if (song_id == null || song_id === "") {
    throw new ApiError("Song id is required", 400);
  }

  const songId = Number(song_id);
  if (!Number.isFinite(songId) || songId <= 0) {
    throw new ApiError("Invalid song id", 400);
  }

  if (typeof rating !== "number" || rating < 0 || rating > 10) {
    throw new ApiError("Rating must be between 0 and 10", 400);
  }

  if (!reviewBody?.trim()) {
    throw new ApiError("Review comment is required", 400);
  }

  if (!date) {
    throw new ApiError("Review date is required", 400);
  }

  const sql = getSql();

  let dbUsers = await sql`
    SELECT user_id FROM users WHERE email = ${authUser.email}
  `;

  if (dbUsers.length === 0) {
    const displayName = authUser.email.split("@")[0];
    const created = await sql`
      INSERT INTO users (email, display_name)
      VALUES (${authUser.email}, ${displayName})
      ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name
      RETURNING user_id
    `;
    dbUsers = created;
  }

  const user_id = dbUsers[0].user_id;

  const songExists = await sql`
    SELECT song_id FROM songs WHERE song_id = ${songId}
  `;

  if (songExists.length === 0) {
    try {
      const songDetails = await getSongDetailsServer(songId);
      await sql`
        INSERT INTO songs (song_id, song_name, artist, album)
        VALUES (${songId}, ${songDetails.title}, ${songDetails.singers}, ${songDetails.album})
      `;
    } catch (error) {
      throw new ApiError(
        error?.message || "Could not load song metadata",
        502
      );
    }
  }

  const existingReview = await sql`
    SELECT * FROM reviews
    WHERE user_id = ${user_id} AND song_id = ${songId}
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
      WHERE user_id = ${user_id} AND song_id = ${songId}
      RETURNING *
    `;
  } else {
    result = await sql`
      INSERT INTO reviews (
        user_id, song_id, review_title, rating, review_date, review_body
      )
      VALUES (
        ${user_id}, ${songId}, ${title}, ${rating}, ${date}, ${reviewBody}
      )
      RETURNING *
    `;
  }

  return jsonOk(result[0], 201);
});
