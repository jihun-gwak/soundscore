import { jsonOk, withHandler } from "@/app/_utils/apiResponse";
import { fetchDeezerChart } from "@/services/deezer";

export const GET = withHandler(async (request) => {
  const limit = Number(request.nextUrl.searchParams.get("limit") || 12);
  const tracks = await fetchDeezerChart(Math.min(Math.max(limit, 1), 25));
  return jsonOk(tracks);
});
