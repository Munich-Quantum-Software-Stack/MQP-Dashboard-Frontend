import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../UI/Button/Button";
import ContentCard from "../../UI/Card/ContentCard";
import NotificationCard from "../../UI/MessageBox/NotificationCard";
import { useNavigate } from "react-router-dom";
const SuccessfullyToken = ({newToken}) => {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_subheader_fs = +fs * 1.25;
    const text_fs = +fs;
    

    // console.log(newToken);
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const copyHandler = () => {
        navigator.clipboard.writeText(newToken.token_value);
        //console.log("text is copied");
        setIsCopied(true);
    }
    const onClickHandler = () => {
        navigate('/tokens');
    }
   
    return (
        <ContentCard>
            <div className="tokenContainer_header_wrap">
                <h5 className="mb-4" style={{ fontSize: page_subheader_fs }}>
                    New token created successfully
                </h5>
            </div>
            <NotificationCard variant="primary">
                Notice: Token hash is displayed <b>only once</b>. Please store
                it to your own storage for later usages.
            </NotificationCard>
            <div className="token_detail">
                <div
                    className="token_detail_item"
                    style={{ fontSize: text_fs }}
                >
                    Token Name: <b>{newToken.token_name}</b>
                </div>
            </div>

            <div className="token_detail">
                <div
                    className="token_detail_item"
                    style={{ fontSize: text_fs }}
                >
                    Token Hash:
                </div>
                <div
                    className="token_detail_value token_hash"
                    style={{ fontSize: text_fs }}
                >
                    <span>{newToken.token_value}</span>
                </div>
                <button
                    className="my-1 copy_btn"
                    onClick={copyHandler}
                    style={{ fontSize: text_fs }}
                >
                    {isCopied ? "Copied" : "Copy"}
                </button>
            </div>
            <div className="token_detail token_detail_btn_wrap">
                <Button
                    onClick={onClickHandler}
                    className="my-4"
                    style={{ fontSize: text_fs }}
                >
                    OK
                </Button>
            </div>
        </ContentCard>
    );
}

export default SuccessfullyToken;