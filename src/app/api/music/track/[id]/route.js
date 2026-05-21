import { ApiError, jsonOk, withHandler } from "@/app/_utils/apiResponse";
import { fetchDeezerTrack } from "@/services/deezer";

export const GET = withHandler(async (_request, { params }) => {
  const { id } = await params;
  if (!id) {
    throw new ApiError("Missing track id", 400);
  }

  try {
    const track = await fetchDeezerTrack(id);
    return jsonOk(track);
  } catch (error) {
    throw new ApiError(error.message || "Track not found", 404);
  }
});
