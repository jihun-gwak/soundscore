import { NextResponse } from "next/server";
import { fetchDeezerTrack } from "@/services/deezer";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }

  try {
    const track = await fetchDeezerTrack(id);
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch track" },
      { status: 404 }
    );
  }
}
