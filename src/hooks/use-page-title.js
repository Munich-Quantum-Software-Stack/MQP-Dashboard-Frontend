import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'myQPP';

const PAGE_TITLES = new Map(
  Object.entries({
    '': 'Welcome',
    login: 'Login',
    status: 'Status',
    tokens: 'Tokens',
    jobs: 'Jobs',
    budgets: 'Budgets',
    resources: 'Resources',
    faq: 'FAQ',
    feedback: 'Feedback',
    funding: 'Funding',
  }),
);

/** Builds the tab title for a route; non-production builds use one fixed title. */
export function getPageTitle(pathname, perPageTitles, fixedTitle) {
  if (!perPageTitles) {
    return fixedTitle;
  }
  const section = pathname.split('/').filter(Boolean)[0] || '';
  const page = PAGE_TITLES.get(section);
  return page ? `${page} - ${SITE_NAME}` : SITE_NAME;
}

/** Keeps the browser tab title in sync with the current route. */
export default function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(
      pathname,
      process.env.REACT_APP_PAGE_TITLES === 'true',
      process.env.REACT_APP_DASHBOARD_NAME || SITE_NAME,
    );
  }, [pathname]);
}
