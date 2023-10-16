import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
// import { Todo } from "../types";

async function get(req: VercelRequest, res: VercelResponse) {
  const { rows } = await sql`SELECT * FROM todos ORDER BY date DESC;`;

  return res.status(200).json(rows);
}

async function create(req: VercelRequest, res: VercelResponse) {
  await sql`INSERT INTO todos (task, done, who) VALUES (${req.body.task}, false, ${req.body.who});`;

  return res.status(200).json(req.body);
}

export default function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!req.url) return res.status(400);

  if (req.method === 'GET') {
    return get(req, res);
  }

  if (req.method === 'POST') {
    return create(req, res);
  }
}
