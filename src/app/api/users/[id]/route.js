import {z} from "zod";
import {neon} from "@neondatabase/serverless";

export async function DELETE (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //delete user from database
    await sql`DELETE FROM users WHERE user_id = ${idNum}`
    return new Response (null, {status:204});
}

export async function GET (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //get single user record
    const response = await sql`SELECT * FROM users WHERE user_id = ${idNum}`;

    return new Response(JSON.stringify(response), {status:200});
}

export async function POST (request, {params}) {
    const {id} = await params;
    const idNum = Number(id);
    const user = await request.json();
    const dbUrl = process.env.DATABASE_URL || "";
    const sql = neon(dbUrl);

    //validation
    const userSchema = z.object({
        email: z.string().min(1).max(100),
        display_name: z.string().min(1).max(100),
    })
    try {
        userSchema.parse(user);
    } catch (error) {
        return new Response(null, {status:406});
    }

    //update user in database
    const response = await sql`
    UPDATE users 
        SET email = ${user.email}, 
            display_name = ${user.display_name} 
        WHERE user_id = ${idNum} 
        RETURNING *`;
    return new Response(JSON.stringify(response), {status:200});
}