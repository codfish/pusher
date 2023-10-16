import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!request.url) return response.status(400);

  const { rows } = await sql`SELECT * FROM todos;`;

  // const todos = [{title: 'Todo 1', id: '1' }, {title: 'Todo 2', id: '2'}];
  const todos = rows;

  return response.status(200).json(todos);
}
