import { resourcesHandlers } from './resources';
import { jobsHandlers } from './jobs';
import { institutionHandlers } from './institutions';

export const handlers = [...resourcesHandlers, ...jobsHandlers, ...institutionHandlers];
