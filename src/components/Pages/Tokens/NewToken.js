import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ContentCard from "src/components/UI/Card/ContentCard";
import CreateTokenForm from "src/components/Pages/Tokens/CreateTokenForm";
import { fetchUserLimits } from "src/components/utils/tokens-http";
import ErrorBlock from "src/components/UI/MessageBox/ErrorBlock";
import LoadingIndicator from "src/components/UI/LoadingIndicator";
import { getAuthToken } from "src/components/utils/auth";


const NewToken = () => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    

    const access_token = getAuthToken();
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["userLimits"],
        queryFn: ({ signal }) => fetchUserLimits({ signal, access_token }),
    });
    if (isError) {
        return <ErrorBlock title={error.message} />;
    }
    let newTokenContent;
    if (isPending) {
        newTokenContent = (
            <ContentCard
                className={`${
                    darkmode ? "dark_bg" : "white_bg"
                } tokens_container`}
            >
                <LoadingIndicator />
            </ContentCard>
        );
    }
    
    if (data) {
        newTokenContent = (
            <CreateTokenForm key="create_form" userLimits={data} />
        );
    }

    return (
        <ContentCard
            className={`${
                darkmode ? "dark_bg" : "white_bg"
            } tokens_container h-100`}
        >
            <div className="createToken_container">
                <h4
                    className="page_header"
                    style={{ fontSize: page_header_fs }}
                >
                    Create New Token
                </h4>
                {newTokenContent}


            </div>
        </ContentCard>
    );
};

export default NewToken;


