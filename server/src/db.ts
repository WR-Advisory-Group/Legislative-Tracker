import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  // TLS is enforced by the MySQL server (matches pymysql's ssl_verify_identity=True
  // used by CongressStore). rejectUnauthorized is false because the server presents a
  // self-signed cert and we don't have the CA bundle — this mirrors pymysql's default
  // behavior of encrypting in transit without strict chain validation.
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  connectionLimit: 10,
  connectTimeout: 60_000,
  dateStrings: true,
});

export async function query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
  // Using pool.query (simple protocol) rather than pool.execute (prepared statements)
  // to match pymysql behavior and avoid mysql2 quirks with LIMIT/OFFSET placeholders.
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}
