import fs from 'fs';
import path from 'path';

function readTestEnv() {
  const contents = fs.readFileSync(path.resolve(process.cwd(), '.env.test'), 'utf8');
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

test('uses the same-origin API proxy and test Keycloak realm', () => {
  const testEnv = readTestEnv();

  expect(testEnv.REACT_APP_API_ENDPOINT).toBe('/api');
  expect(testEnv.REACT_APP_KEYCLOAK_URL).toBe('https://test.quantumpathway.eu/auth');
  expect(testEnv.REACT_APP_KEYCLOAK_REALM).toBe('mqp-dashboard');
  expect(testEnv.REACT_APP_KEYCLOAK_CLIENT_ID).toBe('mqp-frontend');
});
