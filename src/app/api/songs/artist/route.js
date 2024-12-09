import {neon} from "@neondatabase/serverless";

//get list of artists
export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT DISTINCT artist FROM songs`;

    return new Response(JSON.stringify(response), {status:200});
}