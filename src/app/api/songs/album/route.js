import {neon} from "@neondatabase/serverless";

//get list of albums
export async function GET() {
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT DISTINCT album FROM songs`;

    return new Response(JSON.stringify(response), {status:200});
}