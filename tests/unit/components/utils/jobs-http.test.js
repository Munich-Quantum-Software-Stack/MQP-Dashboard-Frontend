/**
 * jobs-http.test.js - Unit tests for jobs API helpers (fetchJobs, queryFetchJobs, fetchJob)
 */

import { rest } from 'msw';
import { server } from '@test/server';
import { fetchJobs, queryFetchJobs, fetchJob } from '@utils/jobs-http';
import { jobsResponse, jobDetailResponse } from '@test/fixtures/jobs-response';

const API_BASE = 'https://api.test';
const ORIGINAL_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

describe('jobs-http API helpers', () => {
  // Set up and restore test API endpoint environment variable
  beforeAll(() => {
    process.env.REACT_APP_API_ENDPOINT = API_BASE;
  });

  afterAll(() => {
    process.env.REACT_APP_API_ENDPOINT = ORIGINAL_ENDPOINT;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test fetchJobs returns jobs array and includes Bearer token in auth header
  it('fetchJobs returns jobs payload and enforces auth header', async () => {
    const jobs = [{ id: '1' }, { id: '2' }];

    server.use(
      rest.get(`${API_BASE}/jobs`, (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe('Bearer token');
        return res(ctx.status(200), ctx.json({ jobs }));
      }),
    );

    const result = await fetchJobs('token');
    expect(result).toEqual(jobs);
  });

  // Test fetchJobs preserves all job properties from backend response
  it('fetchJobs preserves every job returned by the backend', async () => {
    server.use(
      rest.get(`${API_BASE}/jobs`, (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe('Bearer token');
        return res(ctx.status(200), ctx.json(jobsResponse));
      }),
    );

    const result = await fetchJobs('token');
    expect(result).toEqual(jobsResponse.jobs);
    expect(result).toHaveLength(jobsResponse.jobs.length);
    expect(result.every((job) => job.executed_resource)).toBe(true);
  });

  // Test fetchJobs maps 403 status to Forbidden error message
  it('fetchJobs maps 403 into Forbidden! error message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    server.use(
      rest.get(`${API_BASE}/jobs`, (_req, res, ctx) => {
        return res(ctx.status(403));
      }),
    );

    await expect(fetchJobs('token')).rejects.toMatchObject({ message: 'Forbidden!', code: 403 });

    consoleSpy.mockRestore();
  });

  // Test queryFetchJobs passes pagination params and sorts job IDs numerically descending
  it('queryFetchJobs forwards paging params and sorts IDs numerically in DESC order', async () => {
    server.use(
      rest.get(`${API_BASE}/jobs`, (req, res, ctx) => {
        const url = new URL(req.url); // req.url is string
        expect(url.searchParams.get('p')).toBe('2');
        expect(url.searchParams.get('jpp')).toBe('50');
        expect(url.searchParams.get('order')).toBe('DESC');
        expect(url.searchParams.get('order_by')).toBe('ID');

        return res(
          ctx.status(200),
          ctx.json({
            jobs: [
              { id: '2', status: 'COMPLETED' },
              { id: '10', status: 'RUNNING' },
              { id: '1', status: 'PENDING' },
            ],
            totaljob_nr: 3,
          }),
        );
      }),
    );

    const result = await queryFetchJobs({
      access_token: 'token',
      signal: undefined,
      page: 2,
      limit: 50,
      order: 'DESC',
      order_by: 'ID',
    });

    expect(result.totalJobs).toBe(3);
    expect(result.jobs.map((job) => job.id)).toEqual(['10', '2', '1']);
  });

  // Test fetchJob adds default circuit when missing and removes internal no_modify field
  it('fetchJob returns job with default circuit when missing and strips no_modify fields', async () => {
    server.use(
      rest.get(`${API_BASE}/jobs/42`, (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            job: {
              id: '42',
              status: 'COMPLETED',
              result: { counts: { '00': 512 } },
              no_modify: true,
            },
          }),
        );
      }),
    );

    const job = await fetchJob({ access_token: 'token', signal: undefined, id: '42' });
    expect(job.id).toBe('42');
    expect(job.circuit).toMatch(/OPENQASM/);
    expect(job.executed_circuit).toEqual(job.circuit);
    expect(job.no_modify).toBeUndefined();
  });

  // Test fetchJob throws error with code when backend returns error status
  it('fetchJob throws when backend responds with error code', async () => {
    server.use(
      rest.get(`${API_BASE}/jobs/99`, (_req, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    await expect(
      fetchJob({ access_token: 'token', signal: undefined, id: '99' }),
    ).rejects.toMatchObject({ message: 'Could not fetch job!', code: 404 });
  });

  // Test fetchJob correctly exposes result payload including quantum measurement counts
  it('fetchJob exposes the backend result payload for job detail consumers', async () => {
    const { job } = jobDetailResponse;

    server.use(
      rest.get(`${API_BASE}/jobs/${job.id}`, (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(jobDetailResponse));
      }),
    );

    const fetchedJob = await fetchJob({
      access_token: 'token',
      signal: undefined,
      id: job.id,
    });

    expect(fetchedJob.id).toBe(job.id);
    expect(fetchedJob.result).toEqual(job.result);
    expect(fetchedJob.result.counts['000']).toBe(512);
  });
});
