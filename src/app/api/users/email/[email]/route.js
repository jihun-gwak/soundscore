import {neon} from "@neondatabase/serverless";

export async function GET(request, {params}) {
    const {email} = params;
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    const response = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (response.length === 0) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify(response[0]), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
