import React, { Suspense } from "react";
//import { defer, useLoaderData, Await } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ContentCard from "../../UI/Card/ContentCard";
import CreateTokenForm from "./CreateTokenForm";
import { fetchUserLimits } from "../../utils/tokens-http";
import ErrorBlock from "../../UI/MessageBox/ErrorBlock";
import LoadingIndicator from "../../UI/LoadingIndicator";
import { getAuthToken } from "../../utils/auth";
//import { queryClient } from "../../utils/query";

const NewToken = () => {
    const darkmode = useSelector((state) => state.accessibilities.darkmode);
    const fs = useSelector((state) => state.accessibilities.font_size);
    const page_header_fs = +fs * 1.5;
    
    //const { userLimits } = useLoaderData();
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

                {/* <Suspense fallback={<LoadingIndicator />}>
                    <Await resolve={userLimits}>
                        {(loadedUserLimits) => (
                            <CreateTokenForm
                                key="create_form"
                                userLimits={loadedUserLimits}
                            />
                        )}
                    </Await>
                </Suspense> */}
            </div>
        </ContentCard>
    );
};

export default NewToken;

/*
async function loadUserTokenLimits() {
    const access_token = getAuthToken();
    return queryClient.fetchQuery({
        queryKey: ["userLimits"],
        queryFn: ({ signal }) => fetchUserLimits({ signal, access_token }),
    });
}

export async function loader() {
    return defer({
        userLimits: await loadUserTokenLimits(),
    });
}
*/
