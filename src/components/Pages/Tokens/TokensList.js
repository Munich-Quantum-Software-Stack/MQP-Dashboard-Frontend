import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ActivedTokenListItem from "src/components/Pages/Tokens/ActivedTokenListItem";
// import RevokedTokenListItem from "./RevokedTokenListItem";
import { queryClient } from "src/components/utils/query";
import { useMutation } from "@tanstack/react-query";
import { revokeToken } from "src/components/utils/tokens-http";
import NotificationCard from "src/components/UI/MessageBox/NotificationCard";
import BlankCard from "src/components/UI/Card/BlankCard";
import AlertCard from "src/components/UI/MessageBox/AlertCard";
import { getAuthToken } from "src/components/utils/auth";

function TokensList({ tokens }) {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const table_label_fs = +fs * 1.05;
    const page_header_fs = +fs * 1.5;

    const access_token = getAuthToken();
    const navigate = useNavigate();
    const activatedTokens = tokens.filter((token) => token.revoked === false);
    //const revokedTokens = tokens.filter((token) => token.revoked === true);
    
    const { mutate, isError, error, data } = useMutation({
        mutationFn: revokeToken,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokens"] });
            navigate('/tokens');
        },
    });
    const revokeHandler = (tokenName) => {
        mutate({ tokenName, access_token });
    }
    if (tokens.length === 0) {
        return (
            <BlankCard className={`${darkmode ? "dark_bg" : "white_bg"} h-100`}>
                <h5>No Token found.</h5>
            </BlankCard>
        );
    }
    return (
        <React.Fragment>
            {data && (
                <NotificationCard variant="primary">{data}</NotificationCard>
            )}
            {isError && <AlertCard variant="danger">{error.message}</AlertCard>}

            {activatedTokens && activatedTokens.length > 0 && (
                <div className="mb-5 activatedTokensList">
                    <div className="tokenContainer_header_wrap">
                        <h4
                            className="mb-3 page_header"
                            style={{ fontSize: page_header_fs }}
                        >
                            <span>Activated Tokens &nbsp;</span>
                            <span className="">({activatedTokens.length})</span>
                        </h4>
                    </div>

                    <div className="responsive_container">
                        <ul className="subTokensList">
                            <li className="token_row_header">
                                <div
                                    className="token_column token_name"
                                    style={{ fontSize: table_label_fs }}
                                >
                                    Token Name
                                </div>
                                <div className="token_column token_actions"></div>
                            </li>
                            {activatedTokens.map((token) => (
                                <ActivedTokenListItem
                                    key={token.token_name}
                                    tokenName={token.token_name}
                                    onRevoke={revokeHandler}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* {revokedTokens && revokedTokens.length > 0 && (
                <div className="mb-5 revokedTokensList">
                    <h5>Revoked Tokens</h5>
                    <div className="responsive_container">
                        <ul className="subTokensList">
                            <li className="token_row_header">
                                <div className="token_column token_name">
                                    Token Name
                                </div>
                                <div className="token_column token_note">
                                    Revoked Reason
                                </div>
                                <div className="token_column token_actions"></div>
                            </li>
                            {revokedTokens.map((token) => (
                                <RevokedTokenListItem
                                    key={token.token_name}
                                    tokenName={token.token_name}
                                    revoked_reason={token.revoke_reason}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            )} */}
        </React.Fragment>
    );
}

export default TokensList;
