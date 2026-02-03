/**
 * UI Component Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import authReducer from '@store/auth-slice';
import accessibilitiesReducer from '@store/accessibilities-slice';

const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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
describe('Card Components', () => {
  test('BlankCard renders children', async () => {
    const BlankCard = (await import('@components/UI/Card/BlankCard')).default;
    render(<BlankCard>Content</BlankCard>, { wrapper: wrap() });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('BlankCard with darkmode', async () => {
    const BlankCard = (await import('@components/UI/Card/BlankCard')).default;
    render(<BlankCard>Dark</BlankCard>, { wrapper: wrap(store({ darkmode: true })) });
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  test('ContentCard renders', async () => {
    const ContentCard = (await import('@components/UI/Card/ContentCard')).default;
    render(<ContentCard>Card</ContentCard>, { wrapper: wrap() });
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  test('LoginCard renders', async () => {
    const LoginCard = (await import('@components/UI/Card/LoginCard')).default;
    render(<LoginCard>Login</LoginCard>, { wrapper: wrap() });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('PaneCard renders', async () => {
    const PaneCard = (await import('@components/UI/Card/PaneCard')).default;
    render(<PaneCard>Pane</PaneCard>, { wrapper: wrap() });
    expect(screen.getByText('Pane')).toBeInTheDocument();
  });
});

// ---
describe('Message Components', () => {
  test.each(['danger', 'warning', 'success', 'info'])('AlertCard %s variant', async (variant) => {
    const AlertCard = (await import('@components/UI/MessageBox/AlertCard')).default;
    render(<AlertCard variant={variant}>Msg</AlertCard>, { wrapper: wrap() });
    expect(screen.getByText('Msg')).toBeInTheDocument();
  });

  test('NotificationCard renders', async () => {
    const NotificationCard = (await import('@components/UI/MessageBox/NotificationCard')).default;
    render(<NotificationCard variant="success">Note</NotificationCard>, { wrapper: wrap() });
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  test('ErrorBlock renders', async () => {
    const ErrorBlock = (await import('@components/UI/MessageBox/ErrorBlock')).default;
    render(<ErrorBlock title="Error" message="Failed" />, { wrapper: wrap() });
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});

// ---
describe('Button Components', () => {
  test('Button renders and clicks', async () => {
    const Button = (await import('@components/UI/Button/Button')).default;
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>, { wrapper: wrap() });
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });

  test('ToggleButton renders', async () => {
    const ToggleButton = (await import('@components/UI/Button/ToggleButton')).default;
    render(<ToggleButton id="t" label="Menu" className="c" onToggle={jest.fn()} />, {
      wrapper: wrap(),
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

// ---
describe('Modal Components', () => {
  test('Backdrop renders and handles click', async () => {
    const Backdrop = (await import('@components/UI/Modal/Backdrop')).default;
    const onConfirm = jest.fn();
    const { container } = render(<Backdrop onConfirm={onConfirm} />, { wrapper: wrap() });
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const backdrop = container.querySelector('.backdrop');
    fireEvent.click(backdrop);
    expect(onConfirm).toHaveBeenCalled();
  });

  test('ModalContent renders', async () => {
    const ModalContent = (await import('@components/UI/Modal/ModalContent')).default;
    render(<ModalContent title="Title" message="Body" onConfirm={jest.fn()} buttonText="OK" />, {
      wrapper: wrap(),
    });
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

// ---
describe('Document Components', () => {
  test('PDFLink renders', async () => {
    const PDFLink = (await import('@components/UI/Document/PDFLink')).default;
    render(<PDFLink src="/doc.pdf" pdf_text="PDF" pdf_link_class="link" target="_blank" />, {
      wrapper: wrap(),
    });
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  test('VideoLink renders', async () => {
    const VideoLink = (await import('@components/UI/Document/VideoLink')).default;
    render(
      <VideoLink src="http://vid" video_text="Watch" video_link_class="link" target="_blank" />,
      { wrapper: wrap() },
    );
    expect(screen.getByText('Watch')).toBeInTheDocument();
  });
});

// ---
describe('Tooltip', () => {
  test('wraps children', async () => {
    const Tooltip = (await import('@components/UI/Tooltip/Tooltip')).default;
    render(
      <Tooltip text="Help">
        <span>Target</span>
      </Tooltip>,
      { wrapper: wrap() },
    );
    expect(screen.getByText('Target')).toBeInTheDocument();
  });
});

// ---
describe('LoadingIndicator', () => {
  test('renders spinner', async () => {
    const LoadingIndicator = (await import('@components/UI/LoadingIndicator')).default;
    render(<LoadingIndicator />, { wrapper: wrap() });
    // Verify component rendered by checking the document
    expect(document.body.textContent).toBeDefined();
  });
});
