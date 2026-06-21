import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    // Test database connectivity
    await pool.query('SELECT 1');
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({ ok: false }, { status: 503 });
  }
}
