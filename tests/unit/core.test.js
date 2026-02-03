/**
 * Core Unit Tests - Utilities, Hooks, and Redux Store
 */
/* eslint-disable security/detect-object-injection */
import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { authActions } from '@store/auth-slice';
import accessibilitiesReducer, { accessibilitiesAction } from '@store/accessibilities-slice';

// ---
import { isNotEmpty, hasMinLength, isEmail, maxValue } from '@utils/validationUserInput';

// ---
import {
  getMinutes,
  getSeconds,
  getExpiration,
  setExpiration,
  getTokenDuration,
  getAuthToken,
} from '@utils/auth';

// ---
import { getDarkmode, getDefaultFontsize, getFontsize } from '@utils/theme';

// ---
import { sortingJobs } from '@utils/jobs';

// ---
import { transformedTokens, updateExpiration } from '@utils/tokens';

// ---
import { useInput } from '@hooks/use-input';

// ---
import { formatTimestampGMT } from '@utils/date-utils';

// ---
import { queryClient } from '@utils/query';

// Mock localStorage properly
beforeEach(() => {
  const storage = {};
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storage[key] || null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => {
    storage[key] = String(val);
  });
  jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
    delete storage[key];
  });
});
afterEach(() => jest.restoreAllMocks());

describe('Validation Utils', () => {
  test.each([
    ['', false],
    ['  ', false],
    ['a', true],
    ['hello', true],
  ])('isNotEmpty(%j) = %s', (val, expected) => expect(isNotEmpty(val)).toBe(expected));

  test.each([
    ['ab', 3, false],
    ['abc', 3, true],
    ['', 0, true],
  ])('hasMinLength(%j, %d) = %s', (val, len, expected) =>
    expect(hasMinLength(val, len)).toBe(expected),
  );

  test.each([
    ['a@b.c', true],
    ['invalid', false],
    ['@', true],
  ])('isEmail(%j) = %s', (val, expected) => expect(isEmail(val)).toBe(expected));

  test.each([
    [5, 10, true],
    [10, 10, true],
    [11, 10, false],
  ])('maxValue(%d, %d) = %s', (val, max, expected) => expect(maxValue(val, max)).toBe(expected));
});

describe('Auth Utils', () => {
  test('getMinutes extracts minutes from ms', () => {
    expect(getMinutes(120000)).toBe(2);
    expect(getMinutes(90000)).toBe(1);
  });

  test('getSeconds extracts seconds from ms', () => {
    expect(getSeconds(65000)).toBe(5);
    expect(getSeconds(30000)).toBe(30);
  });

  test('setExpiration stores future timestamp', () => {
    setExpiration();
    expect(localStorage.setItem).toHaveBeenCalledWith('expiration', expect.any(String));
  });

  test('getExpiration retrieves stored value', () => {
    localStorage.setItem('expiration', '2025-01-01T00:00:00.000Z');
    expect(getExpiration()).toBe('2025-01-01T00:00:00.000Z');
  });

  test('getTokenDuration calculates remaining time', () => {
    localStorage.setItem('expiration', new Date(Date.now() + 60000).toISOString());
    expect(getTokenDuration()).toBeGreaterThan(0);
  });

  test('getAuthToken returns null when no token', () => {
    expect(getAuthToken()).toBeNull();
  });

  test('getAuthToken returns EXPIRED when duration < 0', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('expiration', new Date(Date.now() - 10000).toISOString());
    expect(getAuthToken()).toBe('EXPIRED');
  });

  test('getAuthToken returns token when valid', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('expiration', new Date(Date.now() + 60000).toISOString());
    expect(getAuthToken()).toBe('valid-token');
  });
});

describe('Theme Utils', () => {
  test('getDefaultFontsize returns 16', () => expect(getDefaultFontsize()).toBe('16'));

  test('getFontsize returns default when not set', () => expect(getFontsize()).toBe('16'));

  test('getFontsize returns stored value', () => {
    localStorage.setItem('font-size', '20');
    expect(getFontsize()).toBe('20');
  });

  test('getDarkmode returns false by default', () => expect(getDarkmode()).toBe(false));

  test('getDarkmode returns true when set', () => {
    localStorage.setItem('darkmode', 'true');
    expect(getDarkmode()).toBe(true);
  });
});

describe('Jobs Sorting', () => {
  const jobs = [
    { id: '3', timestamp_submitted: '2024-03-01T00:00:00Z' },
    { id: '1', timestamp_submitted: '2024-01-01T00:00:00Z' },
    { id: '2', timestamp_submitted: '2024-02-01T00:00:00Z' },
  ];

  test.each([
    [{ sortKey: 'id', sortOrder: 'asc' }, '1'],
    [{ sortKey: 'id', sortOrder: 'desc' }, '3'],
  ])('sortingJobs by ID %j returns first id=%s', (params, expectedFirst) => {
    expect(sortingJobs(params, [...jobs])[0].id).toBe(expectedFirst);
  });

  test.each([
    [{ sortKey: 'date', sortOrder: 'asc' }, '2024-01-01T00:00:00Z'],
    [{ sortKey: 'date', sortOrder: 'desc' }, '2024-03-01T00:00:00Z'],
  ])('sortingJobs by date %j returns first=%s', (params, expectedFirst) => {
    expect(sortingJobs(params, [...jobs])[0].timestamp_submitted).toBe(expectedFirst);
  });
});

describe('Tokens Utils', () => {
  test('transformedTokens handles null', () => expect(transformedTokens(null)).toEqual([]));
  test('transformedTokens handles empty', () => expect(transformedTokens({})).toEqual([]));

  test('transformedTokens extracts token data', () => {
    const result = transformedTokens({
      tokens: [{ token_name: 'T1', revoked: false, revoke_reason: null }],
    });
    expect(result).toEqual([{ token_name: 'T1', revoked: false, revoke_reason: null }]);
  });

  test('updateExpiration calculates expiry date', () => {
    const result = updateExpiration('2024-01-01', '30');
    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});

// ---
describe('Auth Slice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
  });

  test('logged_in stores token', () => {
    store.dispatch(authActions.logged_in({ access_token: 'abc123' }));
    expect(store.getState().auth.access_token).toBe('abc123');
    expect(store.getState().auth.isExpired).toBe(false);
  });

  test('logout clears state', () => {
    store.dispatch(authActions.logged_in({ access_token: 'abc' }));
    store.dispatch(authActions.logout());
    expect(store.getState().auth.access_token).toBeNull();
    expect(store.getState().auth.isExpired).toBe(true);
  });

  test('enable_reset/disable_reset toggles flag', () => {
    store.dispatch(authActions.disable_reset());
    expect(store.getState().auth.isForcedReset).toBe(false);
    store.dispatch(authActions.enable_reset());
    expect(store.getState().auth.isForcedReset).toBe(true);
  });

  test('set_expired marks session expired', () => {
    store.dispatch(authActions.set_expired());
    expect(store.getState().auth.isExpired).toBe(true);
  });
});

describe('Accessibilities Slice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { accessibilities: accessibilitiesReducer } });
  });

  test('toggleDarkmode updates state', () => {
    store.dispatch(accessibilitiesAction.toggleDarkmode(true));
    expect(store.getState().accessibilities.darkmode).toBe(true);
  });

  test('toggleFontsize updates state', () => {
    store.dispatch(accessibilitiesAction.toggleFontsize(20));
    expect(store.getState().accessibilities.font_size).toBe(20);
  });
});

describe('useInput Hook', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useInput('initial', (v) => v.length > 0));
    expect(result.current.value).toBe('initial');
    expect(result.current.hasError).toBe(false);
  });

  test('updates value on change', () => {
    const { result } = renderHook(() => useInput('', (v) => v.length > 0));
    act(() => result.current.handleInputChange({ target: { value: 'test' } }));
    expect(result.current.value).toBe('test');
  });

  test('shows error after blur with invalid value', () => {
    const { result } = renderHook(() => useInput('', (v) => v.length > 0));
    act(() => result.current.handleInputBlur());
    expect(result.current.hasError).toBe(true);
  });

  test('no error after blur with valid value', () => {
    const { result } = renderHook(() => useInput('valid', (v) => v.length > 0));
    act(() => result.current.handleInputBlur());
    expect(result.current.hasError).toBe(false);
  });
});

describe('Date Utils', () => {
  test('formatTimestampGMT returns empty for null', () => {
    expect(formatTimestampGMT(null)).toBe('');
    expect(formatTimestampGMT('')).toBe('');
  });

  test('formatTimestampGMT formats with seconds', () => {
    const result = formatTimestampGMT('2024-06-15T10:30:45Z', true);
    expect(result).toContain('2024-06-15');
    expect(result).toContain('GMT');
  });

  test('formatTimestampGMT formats without seconds', () => {
    const result = formatTimestampGMT('2024-06-15T10:30:45Z', false);
    expect(result).toContain('2024-06-15');
    expect(result).toContain('GMT');
  });
});

describe('Query Client', () => {
  test('queryClient is a QueryClient instance', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.invalidateQueries).toBe('function');
  });
});
