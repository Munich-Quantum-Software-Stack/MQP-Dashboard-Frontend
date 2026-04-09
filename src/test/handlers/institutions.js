import { rest } from 'msw';
import {
  institutionsResponse,
  institutionByIdResponse,
} from '@test/fixtures/institutions-response';

export const institutionHandlers = [
  rest.get('*/institutions', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(institutionsResponse));
  }),

  rest.get('*/institutions/:id', (req, res, ctx) => {
    const { id } = req.params;
    const body = institutionByIdResponse(id);
    if (!body) {
      return res(ctx.status(404), ctx.json({ error: `Institution "${id}" not found` }));
    }
    return res(ctx.status(200), ctx.json(body));
  }),
];
