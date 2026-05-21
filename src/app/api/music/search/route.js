import { ApiError, jsonOk, withHandler } from "@/app/_utils/apiResponse";
import { searchDeezerTracks } from "@/services/deezer";

export const GET = withHandler(async (request) => {
  const query = request.nextUrl.searchParams.get("q");

  if (!query?.trim()) {
    throw new ApiError("Missing search query", 400);
  }

  const results = await searchDeezerTracks(query);
  return jsonOk(results);
});
