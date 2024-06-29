import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ActivedTokenListItem from "./ActivedTokenListItem";
// import RevokedTokenListItem from "./RevokedTokenListItem";
import { queryClient } from "../../utils/query";
import { useMutation } from "@tanstack/react-query";
import { revokeToken } from "../../utils/tokens-http";
import NotificationCard from "../../UI/MessageBox/NotificationCard";
import AlertCard from "../../UI/MessageBox/AlertCard";
import { getAuthToken } from "../../utils/auth";

function TokensList({ tokens }) {
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
