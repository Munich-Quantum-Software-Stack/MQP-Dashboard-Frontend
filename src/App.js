import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "src/components/utils/query";
import RootLayout from "src/components/Pages/RootLayout";
import DefaultLayout from "src/components/Pages/DefaultLayout";
import Login from "src/components/Pages/Login/Login";
import Logout, { action as logoutAction } from "src/components/Pages/Logout";
import ForceResetLayout from "src/components/Pages/ForcedReset/ForcedResetLayout";
import ForcedResetPassword from "src/components/Pages/ForcedReset/ForcedResetPassword";
import ForgotPassword from "src/components/Pages/ForgotPassword/ForgotPassword";
import Blocked from "src/components/Pages/ErrorsHandling/Blocked";
import ErrorPage from "src/components/Pages/ErrorsHandling/Error";
import DefaultErrorPage from "src/components/Pages/ErrorsHandling/DefaultError";
import StatusRoot from "src/components/Pages/Status/StatusRoot";
import Status from "src/components/Pages/Status/Status";
import JobsRoot from "src/components/Pages/Jobs/JobsRoot";
import Jobs from "src/components/Pages/Jobs/Jobs";
import JobDetail, { loader as jobDetailLoader } from "src/components/Pages/Jobs/JobDetail";
import JobCircuit, { loader as jobCircuitLoader } from "src/components/Pages/Jobs/JobCircuit";
import Budgets from "src/components/Pages/Budgets/Budgets";
import ResourcesRoot from "src/components/Pages/Resources/ResourcesRoot";
import Resources from "src/components/Pages/Resources/Resources";
import ResourceDetail from "src/components/Pages/Resources/ResourceDetail";
import TokensRootLayout from "src/components/Pages/Tokens/TokensRoot";
import Tokens from "src/components/Pages/Tokens/Tokens";
import NewToken from "src/components/Pages/Tokens/NewToken";
import { tokenLoader, checkTokenLoader } from "src/components/utils/auth";
import Feedback from "src/components/Pages/Feedback/Feedback";
import RequestAccess from "src/components/Pages/RequestAccess/RequestAccess";
import FAQ from "src/components/Pages/FAQ/FAQ";
import "./App.scss";
import Funding from "src/components/Pages/Funding/Funding";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorPage />,
            id: "home",
            loader: tokenLoader,
            children: [
                {
                    path: "forced_reset_password",
                    element: <ForceResetLayout />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                    children: [
                        {
                            index: true,
                            element: <ForcedResetPassword />,
                        },
                    ],
                },
                {
                    path: "status",
                    element: <StatusRoot />,
                    errorElement: <ErrorPage />,
                    id: "status",
                    loader: checkTokenLoader,
                    children: [
                        {
                            index: true,
                            element: <Status />,
                        },
                    ],
                },
                {
                    path: "tokens",
                    element: <TokensRootLayout />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                    children: [
                        {
                            index: true,
                            element: <Tokens />
                        },
                        {
                            path: "new",
                            element: <NewToken />
                        },
                    ],
                },
                {
                    path: "jobs",
                    element: <JobsRoot />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                    children: [
                        {
                            index: true,
                            element: <Jobs />
                        },
                        {
                            path: ":jobId",
                            id: "job-detail",
                            children: [
                                {
                                    index: true,
                                    element: <JobDetail />,
                                    loader: jobDetailLoader,
                                },
                                {
                                    path: "circuit",
                                    element: <JobCircuit isExecutedCircuit={false} />,
                                    loader: jobCircuitLoader,
                                },
                                {
                                    path: "executed-circuit",
                                    element: <JobCircuit isExecutedCircuit={true} />,
                                    loader: jobCircuitLoader,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "budgets",
                    element: <Budgets />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                },
                {
                    path: "resources",
                    element: <ResourcesRoot />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                    children: [
                        {
                            index: true,
                            element: <Resources />
                        },
                        {
                            path: ":resourceId",
                            id: "resource-detail",
                            children: [
                                {
                                    index: true,
                                    element: <ResourceDetail />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "faq",
                    element: <FAQ />,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,
                },
                {
                    path: "feedback",
                    element: <Feedback />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "funding",
                    element: <Funding />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "logout",
                    element: <Logout />,
                    loader: checkTokenLoader,
                    action: logoutAction,
                },
            ],
        },
        {
            path: "/",
            element: <DefaultLayout />,
            errorElement: <DefaultErrorPage />,
            children: [
                {
                    index: true,
                    element: <Login />,
                },
                {
                    path: "login",
                    element: <Login />,
                },
                {
                    path: "blocked",
                    element: <Blocked />,
                },
                {
                    path: "forgot_password",
                    element: <ForgotPassword />,
                },
                {
                    path: "request_access",
                    element: <RequestAccess />,
                },
            ],
        },
    ]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
