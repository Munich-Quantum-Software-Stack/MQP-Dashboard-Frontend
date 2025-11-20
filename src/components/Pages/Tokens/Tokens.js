import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ContentCard from 'src/components/UI/Card/ContentCard';

import ErrorBlock from 'src/components/UI/MessageBox/ErrorBlock';
import TokensList from 'src/components/Pages/Tokens/TokensList';
import LoadingIndicator from 'src/components/UI/LoadingIndicator';
import { fetchTokens } from 'src/components/utils/tokens-http';
import { getAuthToken } from 'src/components/utils/auth';

import './Tokens.scss';

function Tokens() {
  const access_token = getAuthToken();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const button_fs = +fs * 1.2;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: ({ signal }) => fetchTokens({ signal, access_token }),
  });

  let tokensContent;
  if (isError) {
    return <ErrorBlock title={error.message} message={error.code} />;
  }
  if (isPending) {
    tokensContent = (
      <>
        <LoadingIndicator />
        <p>Loading data...</p>
      </>
    );
  }
  if (data) {
    tokensContent = (
      <div className="tokensList_container">
        <TokensList tokens={data} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} tokens_container`}>
        <div key="create_button" className="d-flex">
          <Link to="/tokens/new" className="create_token">
            <span className="plus_icon"></span>
            <span className="create_btn_text" style={{ fontSize: button_fs }}>
              Create Token
            </span>
          </Link>
        </div>
      </ContentCard>

      <div className="listTokens_container">
        <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} tokens_container h-100`}>
          {tokensContent}
        </ContentCard>
      </div>
    </React.Fragment>
  );
}

export default Tokens;
