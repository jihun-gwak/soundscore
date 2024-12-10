import {neon} from "@neondatabase/serverless";

//get all songs by artist
export async function GET (request, {params}) {
    const {artist_name} = await params;
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //get song records
    const response = await sql`SELECT * FROM songs WHERE artist = ${artist_name}`;

    return new Response(JSON.stringify(response), {status:200});
}