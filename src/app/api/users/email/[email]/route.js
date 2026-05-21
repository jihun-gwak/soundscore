import {
  ApiError,
  getSql,
  jsonOk,
  withHandler,
} from "@/app/_utils/apiResponse";

export const GET = withHandler(async (_request, { params }) => {
  const { email: rawEmail } = await params;
  if (!rawEmail) {
    throw new ApiError("Email is required", 400);
  }

  const email = decodeURIComponent(rawEmail);
  const sql = getSql();

  const response = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (response.length === 0) {
    throw new ApiError("User not found", 404);
  }

  return jsonOk(response[0]);
});
