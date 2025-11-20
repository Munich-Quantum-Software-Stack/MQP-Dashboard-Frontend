import { rest } from 'msw';
import { resourcesResponse } from '../fixtures/resources-response';

export const resourcesHandlers = [
  rest.get('*/resources', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(resourcesResponse));
  }),
];
