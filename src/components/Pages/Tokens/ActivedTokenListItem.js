import React, { useState } from "react";
import { useSelector } from "react-redux";

function ActivedTokenListItem({ tokenName, onRevoke }) {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;

    const [isLoading, setIsLoading] = useState(false);
    const revokeTokenHandler = (event) => {
        const proceed = window.confirm("Are you sure to revoke this token?");
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
                <div
                    className="token_column token_name"
                    style={{ fontSize: text_fs }}
                >
                    {tokenName}
                </div>
                <div className="token_column token_actions">
                    <button
                        className="token_btn "
                        onClick={revokeTokenHandler}
                        style={{ fontSize: text_fs }}
                    >
                        <span className="button_icon delete_icon"></span>
                        {isLoading ? "Revoking..." : "Revoke"}
                    </button>
                </div>
            </li>
        </>
    );
}

export default ActivedTokenListItem;
