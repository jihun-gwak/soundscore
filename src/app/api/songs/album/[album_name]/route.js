import {z} from "zod";
import {neon} from "@neondatabase/serverless";

//get all songs in album
export async function GET (request, {params}) {
    let {album_name} = await params;
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //get song records
    const response = await sql`SELECT * FROM songs WHERE album = ${album_name}`;

    return new Response(JSON.stringify(response), {status:200});
}