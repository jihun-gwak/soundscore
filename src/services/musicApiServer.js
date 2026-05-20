const API_HOST =
  process.env.RAPIDAPI_HOST || "deezerdevs-deezer.p.rapidapi.com";

export async function getSongDetailsServer(songId) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not configured");
  }

  const response = await fetch(`https://${API_HOST}/track/${songId}`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch song details");
  }

  const data = await response.json();
  return {
    title: data.title,
    singers: data.artist.name,
    album: data.album.title,
  };
}
