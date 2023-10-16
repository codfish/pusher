import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!request.url) return response.status(400);

  const todos = [{title: 'Todo 1', id: '1' }, {title: 'Todo 2', id: '2'}];

  return response.status(200).json(todos);
}
