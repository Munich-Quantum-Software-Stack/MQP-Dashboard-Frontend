import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateExpiration } from '@utils/tokens';

const formatDate = (token) => {
  const date = token.expires_at ? Date.parse(token.expires_at) : NaN;
  if (!Number.isNaN(date)) {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  if (token.created_at && token.validity != null) {
    return updateExpiration(token.created_at, token.validity);
  }
  return '-';
};

const formatValue = (value) => (value === undefined || value === null ? '-' : value);

function ActivedTokenListItem({ token, onRevoke }) {
  const tokenName = token.token_name;
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;

  const [isLoading, setIsLoading] = useState(false);
  const revokeTokenHandler = (event) => {
    const proceed = window.confirm('Are you sure to revoke this token?');
    if (proceed) {
      event.preventDefault();
      setIsLoading(true);
      onRevoke(tokenName);
      setIsLoading(false);
    }
  };

  return (
    <>
      <li className="token_item_row" id={tokenName}>
        <div className="token_column token_name" style={{ fontSize: text_fs }}>
          {tokenName}
        </div>
        <div className="token_column token_expired" style={{ fontSize: text_fs }}>
          {formatDate(token)}
        </div>
        <div className="token_column token_max_jobs" style={{ fontSize: text_fs }}>
          {formatValue(token.max_nb_jobs)}
        </div>
        <div className="token_column token_max_budget" style={{ fontSize: text_fs }}>
          {formatValue(token.max_budget)}
        </div>
        <div className="token_column token_actions">
          <button className="token_btn " onClick={revokeTokenHandler} style={{ fontSize: text_fs }}>
            <span className="button_icon delete_icon"></span>
            {isLoading ? 'Revoking...' : 'Revoke'}
          </button>
        </div>
      </li>
    </>
  );
}

export default ActivedTokenListItem;
