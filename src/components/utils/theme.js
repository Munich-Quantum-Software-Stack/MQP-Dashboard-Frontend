/**
 * Theme preference utilities
 */

/** Get dark mode setting from storage */
export function getDarkmode() {
  const darkmode = localStorage.getItem('darkmode');
  if (!darkmode || darkmode === 'false') {
    return false;
  } else {
    return true;
  }
}

/** Default font size value */
export function getDefaultFontsize() {
  return '16';
}

/** Get user's font size preference from storage */
export function getFontsize() {
  const fs = localStorage.getItem('font-size');
  if (!fs || fs === null) {
    return getDefaultFontsize();
  } else {
    return fs;
  }
}
