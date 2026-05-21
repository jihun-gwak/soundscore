import { z } from "zod";
import {
  ApiError,
  getSql,
  jsonOk,
  parseJsonBody,
  parseNumericId,
  withHandler,
} from "@/app/_utils/apiResponse";
import { getBearerToken, verifyFirebaseToken } from "@/app/_utils/verifyAuth";

async function getOwnUserId(sql, authEmail, requestedUserId) {
  const dbUsers = await sql`
    SELECT user_id FROM users WHERE email = ${authEmail}
  `;
  if (dbUsers.length === 0) {
    throw new ApiError("Account not found", 404);
  }
  const ownUserId = dbUsers[0].user_id;
  if (ownUserId !== requestedUserId) {
    throw new ApiError("Forbidden", 403);
  }
  return ownUserId;
}

export const GET = withHandler(async (request, { params }) => {
  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) throw new ApiError("Sign in required", 401);

  const { id, songid } = await params;
  const userId = parseNumericId(id, "user id");
  const songId = parseNumericId(songid, "song id");
  const sql = getSql();

  await getOwnUserId(sql, authUser.email, userId);

  const response = await sql`
    SELECT * FROM reviews WHERE user_id = ${userId} AND song_id = ${songId}
  `;

  return jsonOk(response);
});

export const DELETE = withHandler(async (request, { params }) => {
  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) throw new ApiError("Sign in required", 401);

  const { id, songid } = await params;
  const userId = parseNumericId(id, "user id");
  const songId = parseNumericId(songid, "song id");
  const sql = getSql();

  await getOwnUserId(sql, authUser.email, userId);

  await sql`
    DELETE FROM reviews WHERE user_id = ${userId} AND song_id = ${songId}
  `;

  return new Response(null, { status: 204 });
});

export const POST = withHandler(async (request, { params }) => {
  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) throw new ApiError("Sign in required", 401);

  const { id, songid } = await params;
  const userId = parseNumericId(id, "user id");
  const songId = parseNumericId(songid, "song id");
  const review = await parseJsonBody(request);
  const sql = getSql();

  await getOwnUserId(sql, authUser.email, userId);

  const reviewSchema = z.object({
    title: z.string().max(100).nullish(),
    rating: z.number().int().min(0).max(10),
    date: z.string(),
    body: z.string().max(2000).nullish(),
  });

  const parsed = reviewSchema.safeParse(review);
  if (!parsed.success) throw new ApiError("Invalid review data", 400);

  const response = await sql`
    UPDATE reviews
    SET
      review_title = ${parsed.data.title},
      rating = ${parsed.data.rating},
      review_date = ${parsed.data.date},
      review_body = ${parsed.data.body}
    WHERE user_id = ${userId} AND song_id = ${songId}
    RETURNING *
  `;

  if (response.length === 0) {
    throw new ApiError("Review not found", 404);
  }

  return jsonOk(response[0]);
});
