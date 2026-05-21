import {
  ApiError,
  getSql,
  jsonOk,
  parseNumericId,
  withHandler,
} from "@/app/_utils/apiResponse";
import { getBearerToken, verifyFirebaseToken } from "@/app/_utils/verifyAuth";

export const GET = withHandler(async (request, { params }) => {
  const token = getBearerToken(request);
  const authUser = await verifyFirebaseToken(token);
  if (!authUser) {
    throw new ApiError("Sign in required to view your reviews", 401);
  }

  const { id } = await params;
  const requestedUserId = parseNumericId(id, "user id");
  const sql = getSql();

  const dbUsers = await sql`
    SELECT user_id FROM users WHERE email = ${authUser.email}
  `;

  if (dbUsers.length === 0) {
    throw new ApiError("Account not found. Try signing out and back in.", 404);
  }

  const ownUserId = dbUsers[0].user_id;
  if (ownUserId !== requestedUserId) {
    throw new ApiError("You can only view your own reviews", 403);
  }

  const reviews = await sql`
    SELECT * FROM reviews WHERE user_id = ${ownUserId}
    ORDER BY review_date DESC
  `;

  return jsonOk(reviews);
});
