import {
  getSql,
  jsonOk,
  parseNumericId,
  withHandler,
} from "@/app/_utils/apiResponse";

export const GET = withHandler(async (_request, { params }) => {
  const { id } = await params;
  const songId = parseNumericId(id, "song id");
  const sql = getSql();

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
    WHERE r.song_id = ${songId}
    ORDER BY r.review_date DESC
  `;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return jsonOk({ reviews, averageRating, count: reviews.length });
});
