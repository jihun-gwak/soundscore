export async function submitReview(songId, review) {
  const response = await fetch(`/api/songs/${songId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error("Failed to submit review");
  }

  return response.json();
}

export async function getReviews(songId) {
  const response = await fetch(`/api/songs/${songId}/reviews`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}
