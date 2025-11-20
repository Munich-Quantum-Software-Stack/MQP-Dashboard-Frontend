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
