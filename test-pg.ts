import * as dotenv from 'dotenv'
dotenv.config()
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log("DB OK:", res.rows[0])
  } catch (e: any) {
    console.error("DB FAIL:", e)
  }
}
main()
