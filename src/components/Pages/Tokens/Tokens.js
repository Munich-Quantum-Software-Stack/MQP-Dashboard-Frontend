import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import {
    Link,
    defer,
    useLoaderData,
    Await,
} from "react-router-dom";
//import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../utils/query";
import ContentCard from "../../UI/Card/ContentCard";
import BlankCard from "../../UI/Card/BlankCard";
import TokensList from "./TokensList";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { fetchTokens } from "../../utils/tokens-http";
import { getAuthToken } from "../../utils/auth";

import "./Tokens.scss";

function Tokens() {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const button_fs = +fs * 1.2;
    
    // const access_token = getAuthToken();
    // console.log("access token: ");
    // console.log(access_token);
    // const { state } = useNavigation();
    const { tokens } = useLoaderData();
    
    // const { data, isPending, isError, error } = useQuery({
    //     queryKey: ["tokens"],
    //     queryFn: ({ signal }) => fetchTokens({ signal, access_token }),
    // });

    // if (isError) {
    //     return (
    //         <ErrorBlock title={error.message} message={error.code} />
    //     );
    // }
    //    if (isPending) {
    // if (state === 'loading') {
    //   return (
    //       <ContentCard
    //           className={`${
    //               darkmode ? "dark_bg" : "white_bg"
    //           } tokens_container`}
    //       >
    //           <LoadingIndicator />
    //       </ContentCard>
    //   );
    // }
    // let tokensContent;
    // if (data) {
    //     tokensContent = (
    //         <div className="tokensList_container">
    //             <TokensList tokens={data} />
    //         </div>
    //     );
    // }

    return (
        <React.Fragment>
            <ContentCard
                className={`${
                    darkmode ? "dark_bg" : "white_bg"
                } tokens_container`}
            >
                <div key="create_button" className="d-flex">
                    <Link to="/tokens/new" className="create_token">
                        <span className="plus_icon"></span>
                        <span className="create_btn_text" style={{ fontSize: button_fs }}>Create Token</span>
                    </Link>
                </div>
            </ContentCard>

            <div className="listTokens_container">
                {tokens.length === 0 && (
                    <BlankCard
                        className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}
                    >
                        <h5>No token found.</h5>
                    </BlankCard>
                )}
                {tokens.length > 0 && (
                    <ContentCard
                        className={`${
                            darkmode ? "dark_bg" : "white_bg"
                        } tokens_container h-100`}
                    >
                        <Suspense fallback={<LoadingIndicator />}>
                            <Await resolve={tokens}>
                                {(loadedTokens) => (
                                    <div className="tokensList_container">
                                        <TokensList tokens={loadedTokens} />
                                    </div>
                                )}
                            </Await>
                        </Suspense>
                    </ContentCard>
                )}
            </div>
        </React.Fragment>
    );
}

export default Tokens;

/*
 * Load all tokens
 */

async function loaderTokensList() {
    // fetching to tokens
    const access_token = getAuthToken();
    return queryClient.fetchQuery({
        queryKey: ["tokens"],
        queryFn: ({ signal }) =>
            fetchTokens({ signal, access_token }),
    });
}

export async function loader() {
    return defer({
        tokens: await loaderTokensList(),
    });
}
