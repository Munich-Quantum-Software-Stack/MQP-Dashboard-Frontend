import { resourcesHandlers } from './resources';
import { jobsHandlers } from './jobs';

export const handlers = [...resourcesHandlers, ...jobsHandlers];
