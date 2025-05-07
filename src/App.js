// Importing modules
import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/utils/query";

import RootLayout from "./components/Pages/RootLayout";
import DefaultLayout from "./components/Pages/DefaultLayout";
import Login from "./components/Pages/Login/Login";
import Logout, { action as logoutAction } from "./components/Pages/Logout";
import ForceResetLayout from "./components/Pages/ForcedReset/ForcedResetLayout";
import ForcedResetPassword from "./components/Pages/ForcedReset/ForcedResetPassword";
import ForgotPassword from "./components/Pages/ForgotPassword/ForgotPassword";
import Blocked from "./components/Pages/ErrorsHandling/Blocked";
import ErrorPage from "./components/Pages/ErrorsHandling/Error";
import DefaultErrorPage from "./components/Pages/ErrorsHandling/DefaultError";
import StatusRoot from "./components/Pages/Status/StatusRoot";
import Status from "./components/Pages/Status/Status";
import JobsRoot from "./components/Pages/Jobs/JobsRoot";
import Jobs, { loader as jobsLoader } from "./components/Pages/Jobs/Jobs";
import JobDetail, {
    loader as jobDetailLoader,
} from "./components/Pages/Jobs/JobDetail";
import Budgets from "./components/Pages/Budgets/Budgets";
import ResourcesRoot from "./components/Pages/Resources/ResourcesRoot";
import Resources, { loader as resourcesLoader } from "./components/Pages/Resources/Resources";
import ResourceDetail from "./components/Pages/Resources/ResourceDetail";
import Settings from "./components/Pages/Settings/Settings";
import TokensRootLayout from "./components/Pages/Tokens/TokensRoot";
import Tokens, {
    loader as tokensLoader
} from "./components/Pages/Tokens/Tokens";
import NewToken, {
    loader as newTokenLoader
} from "./components/Pages/Tokens/NewToken";
import { tokenLoader, checkTokenLoader } from "./components/utils/auth";
import Feedback from "./components/Pages/Feedback/Feedback";
import RequestAccess from "./components/Pages/RequestAccess/RequestAccess";
import Information from "./components/Pages/Information/Information";
import FAQ from "./components/Pages/FAQ/FAQ";
import FAQList from "./components/Pages/FAQ/FAQList";



import "./App.scss";
import Credits from "./components/Pages/Credits/Credits";
import FAQ from './components/Pages/FAQ/FAQ';


function App() 
{
    /*
     * Router with Authentication
     */

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
                            element: <Tokens />,
                            //loader: tokensLoader,
                        },
                        {
                            path: "new",
                            element: <NewToken />,
                            //loader: newTokenLoader,
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
                            element: <Jobs />,
                            //loader: jobsLoader,
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
                            element: <Resources />,
                            //loader: resourcesLoader,
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
                    path: "information",
                    element: <Information />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "faq",
                    element: <FAQ/>,
                    errorElement: <ErrorPage />,
                    loader: checkTokenLoader,

                },
                

               
                {
                    path: "feedback",
                    element: <Feedback />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "credits",
                    element: <Credits />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "faq",
                    element: <FAQ />,
                    errorElement: <ErrorPage />,
                },
            
                // {
                //     path: "settings",
                //     element: <Settings />,
                //     errorElement: <ErrorPage />,
                //     loader: checkTokenLoader,
                // },
                {
                    path: "logout",
                    element: <Logout />,
                    loader: checkTokenLoader,
                    action: logoutAction,
                },
            ]
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
