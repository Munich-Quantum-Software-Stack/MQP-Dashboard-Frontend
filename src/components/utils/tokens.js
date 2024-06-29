export const transformedTokens = (tokensObj) => {
    console.log("tokensObj:");
    console.log(tokensObj);
    const tokens = [];
    if (tokensObj && tokensObj.length > 0) {
        const tokensList = tokensObj.tokens;
        for (let i = 0; i < tokensList.length; i++) {
            tokens.push({
                token_name: tokensList[i].token_name,
                revoked: tokensList[i].revoked,
                revoke_reason: tokensList[i].revoke_reason,
            });
        }
    }
    return tokens;    
};

export const updateExpiration = (creation, validity) => {
    let expiredMsec = Date.parse(creation) + parseInt(validity) * 86400000;
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    let expiredDate = new Date(expiredMsec).toLocaleString("de-DE", options);
    return expiredDate;
};

