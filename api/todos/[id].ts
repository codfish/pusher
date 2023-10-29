import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { pusher  } from '../_utils.js';

async function patch(req: VercelRequest, res: VercelResponse) {
  const done = req.body.done ? true : false;
  const id = parseInt(req.query.id as string, 10);
  await sql`UPDATE todos SET done = ${done} WHERE id = ${id};`;
  await pusher.trigger('todos', 'updated', { id });

  return res.status(200).send('');
}

async function deleteTodo(req: VercelRequest, res: VercelResponse) {
  const id = parseInt(req.query.id as string, 10);
  await sql`DELETE FROM todos WHERE id = ${id};`;

  await pusher.trigger('todos', 'updated', { id });

  return res.status(202).send('');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!req.url) return res.status(400);

  if (req.method === 'PATCH') {
    return patch(req, res);
  }

  if (req.method === 'DELETE') {
    return deleteTodo(req, res);
  }
}
