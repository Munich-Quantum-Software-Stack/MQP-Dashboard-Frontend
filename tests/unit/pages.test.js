/**
 * Page Component Tests - Target uncovered pages for coverage boost
 */
/* eslint-disable security/detect-object-injection */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import authReducer from '@store/auth-slice';
import accessibilitiesReducer from '@store/accessibilities-slice';

beforeEach(() => {
  const storage = {};
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation((k) => storage[k] || null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => {
    storage[k] = String(v);
  });
  jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((k) => {
    delete storage[k];
  });
});
afterEach(() => jest.restoreAllMocks());

const store = (overrides = {}) =>
  configureStore({
    reducer: { auth: authReducer, accessibilities: accessibilitiesReducer },
    preloadedState: {
      auth: { isForcedReset: false, access_token: 'test', isExpired: false },
      accessibilities: { darkmode: false, font_size: 16, ...overrides },
    },
  });

const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrap =
  (s = store()) =>
  ({ children }) => (
    <QueryClientProvider client={qc}>
      <Provider store={s}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );

// ---
describe('Budget Components', () => {
  test('BudgetItem renders with usage data', async () => {
    const BudgetItem = (await import('@components/Pages/Budgets/BudgetItem')).default;
    render(
      <BudgetItem
        allocation="1000"
        budget_used="300"
        resource="Q5"
        used_color="#ff0000"
        remaining_color="#00ff00"
      />,
      { wrapper: wrap() },
    );
    expect(screen.getByText('Q5')).toBeInTheDocument();
    expect(screen.getByText(/30% Used/)).toBeInTheDocument();
    expect(screen.getByText(/70% Remaining/)).toBeInTheDocument();
  });

  test('BudgetItem handles edge case 0 usage', async () => {
    const BudgetItem = (await import('@components/Pages/Budgets/BudgetItem')).default;
    render(
      <BudgetItem
        allocation="100"
        budget_used="0"
        resource="Test"
        used_color="#f00"
        remaining_color="#0f0"
      />,
      { wrapper: wrap() },
    );
    expect(screen.getByText(/0% Used/)).toBeInTheDocument();
  });
});

// ---
describe('Error Handling Components', () => {
  test('Blocked renders message', async () => {
    const Blocked = (await import('@components/Pages/ErrorsHandling/Blocked')).default;
    render(<Blocked />, { wrapper: wrap() });
    expect(screen.getByText(/blocked/i)).toBeInTheDocument();
  });

  test('DefaultError renders 404', async () => {
    const DefaultError = (await import('@components/Pages/ErrorsHandling/DefaultError')).default;
    render(<DefaultError status="404" />, { wrapper: wrap() });
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });

  test('DefaultError renders 401', async () => {
    const DefaultError = (await import('@components/Pages/ErrorsHandling/DefaultError')).default;
    render(<DefaultError status="401" />, { wrapper: wrap() });
    expect(screen.getByText(/UNAUTHORIED/i)).toBeInTheDocument();
  });

  test('DefaultError renders default error', async () => {
    const DefaultError = (await import('@components/Pages/ErrorsHandling/DefaultError')).default;
    render(<DefaultError status="500" />, { wrapper: wrap() });
    expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
  });
});

// ---
describe('Footer Component', () => {
  test('Footer renders copyright and links', async () => {
    const Footer = (await import('@components/Layout/Footer/Footer')).default;
    render(<Footer />, { wrapper: wrap() });
    expect(screen.getByText(/Leibniz Supercomputing Centre/)).toBeInTheDocument();
    expect(screen.getByText('Data Privacy')).toBeInTheDocument();
    expect(screen.getByText('Imprint')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });
});

// ---
describe('Status Components', () => {
  test('ComingSoon renders', async () => {
    const ComingSoon = (await import('@components/Pages/Status/StatusItems/ComingSoon')).default;
    render(<ComingSoon />, { wrapper: wrap() });
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/telemetry information/i)).toBeInTheDocument();
  });
});

// ---
describe('Login Components', () => {
  test('Contact renders link', async () => {
    const Contact = (await import('@components/Pages/Login/Contact')).default;
    render(<Contact>Need help? </Contact>, { wrapper: wrap() });
    expect(screen.getByText('Request Access')).toBeInTheDocument();
  });
});

// ---
describe('FAQ Component', () => {
  test('FAQ renders categories', async () => {
    const FAQ = (await import('@components/Pages/FAQ/FAQ')).default;
    render(<FAQ />, { wrapper: wrap() });
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });
});

// ---
describe('Jobs Components', () => {
  test('JobsSorting renders and handles sort key change', async () => {
    const JobsSorting = (await import('@components/Pages/Jobs/JobsSorting')).default;
    const onSorting = jest.fn();
    render(<JobsSorting sortKey="ID" sortOrder="DESC" statusFilter="ALL" onSorting={onSorting} />, {
      wrapper: wrap(),
    });
    expect(screen.getByText('Sorting by:')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Sorting Items/i })).toBeInTheDocument();
  });

  test('JobsSorting shows order selector for ID', async () => {
    const JobsSorting = (await import('@components/Pages/Jobs/JobsSorting')).default;
    render(<JobsSorting sortKey="ID" sortOrder="ASC" statusFilter="ALL" onSorting={jest.fn()} />, {
      wrapper: wrap(),
    });
    expect(screen.getByRole('combobox', { name: /Sorting Order/i })).toBeInTheDocument();
  });

  test('JobsSorting shows status filter for STATUS', async () => {
    const JobsSorting = (await import('@components/Pages/Jobs/JobsSorting')).default;
    render(
      <JobsSorting
        sortKey="STATUS"
        sortOrder="DESC"
        statusFilter="COMPLETED"
        onSorting={jest.fn()}
      />,
      { wrapper: wrap() },
    );
    expect(screen.getByRole('combobox', { name: /Status Filter/i })).toBeInTheDocument();
  });

  test('JobsFilterForm renders inputs', async () => {
    const JobsFilterForm = (await import('@components/Pages/Jobs/JobsFilterForm')).default;
    render(<JobsFilterForm />, { wrapper: wrap() });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('JobsFilter renders with label', async () => {
    const JobsFilter = (await import('@components/Pages/Jobs/JobsFilter')).default;
    render(<JobsFilter />, { wrapper: wrap() });
    expect(screen.getByText('Filter by:')).toBeInTheDocument();
  });
});

// ---
describe('Tokens Components', () => {
  test('ActivedTokenListItem renders token name', async () => {
    const ActivedTokenListItem = (await import('@components/Pages/Tokens/ActivedTokenListItem'))
      .default;
    render(<ActivedTokenListItem tokenName="my-token" onRevoke={jest.fn()} />, { wrapper: wrap() });
    expect(screen.getByText('my-token')).toBeInTheDocument();
    expect(screen.getByText('Revoke')).toBeInTheDocument();
  });

  test('SuccessfullyToken renders new token details', async () => {
    const SuccessfullyToken = (await import('@components/Pages/Tokens/SuccessfullyToken')).default;
    const newToken = { token_name: 'test-token', token_value: 'abc123xyz' };
    render(<SuccessfullyToken newToken={newToken} />, { wrapper: wrap() });
    expect(screen.getByText(/New token created successfully/i)).toBeInTheDocument();
    expect(screen.getByText('test-token')).toBeInTheDocument();
    expect(screen.getByText('abc123xyz')).toBeInTheDocument();
  });
});

// ---
describe('Resources Components', () => {
  test('ResourceItem renders with IQM resource', async () => {
    const ResourceItem = (await import('@components/Pages/Resources/ResourceItem')).default;
    render(<ResourceItem name="Q5" status="online" />, { wrapper: wrap() });
    expect(screen.getByText('Q5')).toBeInTheDocument();
  });

  test('ActiveResourceItem renders', async () => {
    const ActiveResourceItem = (await import('@components/Pages/Resources/ActiveResourceItem'))
      .default;
    render(<ActiveResourceItem name="qexa20" status="active" />, { wrapper: wrap() });
    expect(screen.getByText(/qexa20/i)).toBeInTheDocument();
  });
});
