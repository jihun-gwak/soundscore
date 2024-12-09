const RAPID_API_KEY = "ca49360033mshff7de1cbf8255f4p1d8419jsn9b2a2ea2129a";
const API_HOST = "deezerdevs-deezer.p.rapidapi.com";

export async function searchSongs(query) {
  const response = await fetch(
    `https://${API_HOST}/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    }
  );

  const data = await response.json();
  return data.data.map((song) => ({
    id: song.id,
    url: song.preview,
    title: song.title,
    singers: song.artist.name,
    image_url: song.album.cover_medium,
    album: song.album.title,
  }));
}

export async function getSongDetails(songId) {
  const response = await fetch(`https://${API_HOST}/track/${songId}`, {
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  });

  const data = await response.json();
  return {
    url: data.preview,
    title: data.title,
    singers: data.artist.name,
    image_url: data.album.cover_medium,
    album: data.album.title,
  };
}
