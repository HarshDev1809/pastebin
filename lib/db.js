import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const savePaste = async (
  id,
  content,
  currentTime,
  expiryTime,
  ttl_seconds = null,
  max_views = null
) => {
  try {
    await pool.query(
      `INSERT INTO pastes (id,content,created_at,expires_at,ttl_seconds,remaining_views,max_views)
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, content, currentTime, expiryTime, ttl_seconds, max_views, max_views]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPaste = async(id)=>{
    try{
        const {rows} = await pool.query(`SELECT * FROM pastes WHERE id = $1`,[id])
        const data = rows[0];
        return data
    }catch(error){
        console.error(error);

        throw error;
    }
}

export const updateView = async(id,updatedView)=>{
    try{
        await pool.query(`UPDATE pastes SET remaining_views = $1 WHERE id = $2`,[updatedView,id]);
    }catch(error){
        console.error(error);
        throw error;
    }
}
