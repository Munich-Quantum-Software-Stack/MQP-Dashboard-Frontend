import { rest } from 'msw';
import { jobsResponse, jobDetailResponse } from '../fixtures/jobs-response';

export const jobsHandlers = [
  rest.get('*/jobs', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(jobsResponse));
  }),
  rest.get('*/jobs/:jobId', (req, res, ctx) => {
    if (req.params.jobId === jobDetailResponse.job.id) {
      return res(ctx.status(200), ctx.json(jobDetailResponse));
    }

    return res(ctx.status(404));
  }),
];
