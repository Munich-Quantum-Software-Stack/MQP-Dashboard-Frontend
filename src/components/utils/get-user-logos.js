import user_logos from '@data/user_logos';

export function getLandingPageLogo() {
  let landing_logo = '';
  user_logos.forEach((logo) => {
    if (logo.name === 'landing_page_logo') {
      landing_logo = logo;
    }
  });
  return landing_logo;
}

export function getSidebarLogo() {
  let sidebar_logo = '';
  user_logos.forEach((logo) => {
    if (logo.name === 'sidebar_logo') {
      sidebar_logo = logo;
    }
  });
  return sidebar_logo;
}
