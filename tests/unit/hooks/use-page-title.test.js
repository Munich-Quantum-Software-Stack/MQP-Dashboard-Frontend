import { getPageTitle } from '@hooks/use-page-title';

describe('getPageTitle', () => {
  it('uses per-page titles when enabled', () => {
    expect(getPageTitle('/', true, 'myQPP Test')).toBe('Welcome - myQPP');
    expect(getPageTitle('/login', true, 'myQPP Test')).toBe('Login - myQPP');
    expect(getPageTitle('/status', true, 'myQPP Test')).toBe('Status - myQPP');
    expect(getPageTitle('/jobs/12/circuit', true, 'myQPP Test')).toBe('Jobs - myQPP');
    expect(getPageTitle('/resources/providers/lrz', true, 'myQPP Test')).toBe('Resources - myQPP');
    expect(getPageTitle('/unknown', true, 'myQPP Test')).toBe('myQPP');
  });

  it('uses the fixed title on non-production builds', () => {
    expect(getPageTitle('/status', false, 'myQPP Test')).toBe('myQPP Test');
    expect(getPageTitle('/', false, 'myQPP Test')).toBe('myQPP Test');
  });
});
