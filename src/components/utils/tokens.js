/**
 * tokens.js - Utility functions for transforming and calculating token data
 */

// Transform API token response into simplified array with name and revocation status
export const transformedTokens = (tokensObj) => {
  if (!tokensObj || !Array.isArray(tokensObj.tokens)) {
    return [];
  }

  return tokensObj.tokens.map(({ token_name, revoked, revoke_reason }) => ({
    token_name,
    revoked,
    revoke_reason,
  }));
};

// Calculate token expiration date from creation date and validity period in days
export const updateExpiration = (creation, validity) => {
  let expiredMsec = Date.parse(creation) + parseInt(validity) * 86400000;
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  let expiredDate = new Date(expiredMsec).toLocaleString('de-DE', options);
  return expiredDate;
};
