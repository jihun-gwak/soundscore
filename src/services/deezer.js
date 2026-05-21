const DEEZER_API = "https://api.deezer.com";

function mapTrack(track) {
  return {
    id: track.id,
    audio_url: track.preview ?? null,
    title: track.title,
    singers: track.artist?.name ?? "Unknown artist",
    image_url: track.album?.cover_medium ?? track.album?.cover ?? null,
    album: track.album?.title ?? "",
  };
}

export async function fetchDeezerTrack(trackId) {
  const response = await fetch(`${DEEZER_API}/track/${trackId}`, {
    next: { revalidate: 3600 },
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Track not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch track from Deezer");
  }

  return mapTrack(data);
}

export async function searchDeezerTracks(query, limit = 25) {
  const url = `${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url, { next: { revalidate: 300 } });
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Search failed");
  }

  if (!response.ok) {
    throw new Error("Failed to search Deezer");
  }

  return (data.data ?? [])
    .filter((track) => track.id && track.title)
    .map((track) => ({
      id: track.id,
      url: track.preview,
      title: track.title,
      singers: track.artist?.name ?? "Unknown artist",
      image_url: track.album?.cover_medium ?? null,
      album: track.album?.title ?? "",
    }));
}

export async function fetchDeezerChart(limit = 12) {
  const response = await fetch(`${DEEZER_API}/chart/0/tracks?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json();

  if (data.error || !response.ok) {
    throw new Error(data.error?.message || "Failed to load chart");
  }

  return (data.data ?? []).map((track) => ({
    id: track.id,
    title: track.title,
    singers: track.artist?.name ?? "Unknown artist",
    image_url: track.album?.cover_medium ?? track.album?.cover ?? null,
    album: track.album?.title ?? "",
  }));
}
