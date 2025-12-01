/**
 * App.js - Main application component defining routes and provider wrappers
 */

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@utils/query';
import RootLayout from '@components/Pages/RootLayout';
import DefaultLayout from '@components/Pages/DefaultLayout';
import Login from '@components/Pages/Login/Login';
import Logout, { action as logoutAction } from '@components/Pages/Logout';
import ForceResetLayout from '@components/Pages/ForcedReset/ForcedResetLayout';
import ForcedResetPassword from '@components/Pages/ForcedReset/ForcedResetPassword';
import ForgotPassword from '@components/Pages/ForgotPassword/ForgotPassword';
import Blocked from '@components/Pages/ErrorsHandling/Blocked';
import ErrorPage from '@components/Pages/ErrorsHandling/Error';
import DefaultErrorPage from '@components/Pages/ErrorsHandling/DefaultError';
import StatusRoot from '@components/Pages/Status/StatusRoot';
import Status from '@components/Pages/Status/Status';
import JobsRoot from '@components/Pages/Jobs/JobsRoot';
import Jobs from '@components/Pages/Jobs/Jobs';
import JobDetail, { loader as jobDetailLoader } from '@components/Pages/Jobs/JobDetail';
import JobCircuit, { loader as jobCircuitLoader } from '@components/Pages/Jobs/JobCircuit';
import Budgets from '@components/Pages/Budgets/Budgets';
import ResourcesRoot from '@components/Pages/Resources/ResourcesRoot';
import Resources from '@components/Pages/Resources/Resources';
import ResourceDetail from '@components/Pages/Resources/ResourceDetail';
import TokensRootLayout from '@components/Pages/Tokens/TokensRoot';
import Tokens from '@components/Pages/Tokens/Tokens';
import NewToken from '@components/Pages/Tokens/NewToken';
import { tokenLoader, checkTokenLoader } from '@utils/auth';
import Feedback from '@components/Pages/Feedback/Feedback';
import RequestAccess from '@components/Pages/RequestAccess/RequestAccess';
import FAQ from '@components/Pages/FAQ/FAQ';
import TelemetryRoot from '@components/Pages/Telemetry/TelemetryRoot';
import Telemetry from '@components/Pages/Telemetry/Telemetry';
import TelemetryRoomDetail from '@components/Pages/Telemetry/TelemetryRoomDetail';
import './App.scss';
import Funding from '@components/Pages/Funding/Funding';

function App() {
  // Define all application routes with nested layouts, loaders, and error boundaries
  const router = createBrowserRouter([
    {
      // Protected routes under RootLayout requiring authentication via tokenLoader
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      id: 'home',
      loader: tokenLoader,
      children: [
        {
          path: 'forced_reset_password',
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
          path: 'status',
          element: <StatusRoot />,
          errorElement: <ErrorPage />,
          id: 'status',
          loader: checkTokenLoader,
          children: [
            {
              index: true,
              element: <Status />,
            },
          ],
        },
        {
          path: 'tokens',
          element: <TokensRootLayout />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
          children: [
            {
              index: true,
              element: <Tokens />,
            },
            {
              path: 'new',
              element: <NewToken />,
            },
          ],
        },
        {
          // Jobs section with nested detail and circuit visualization routes
          path: 'jobs',
          element: <JobsRoot />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
          children: [
            {
              index: true,
              element: <Jobs />,
            },
            {
              path: ':jobId',
              id: 'job-detail',
              children: [
                {
                  index: true,
                  element: <JobDetail />,
                  loader: jobDetailLoader,
                },
                {
                  path: 'circuit',
                  element: <JobCircuit isExecutedCircuit={false} />,
                  loader: jobCircuitLoader,
                },
                {
                  path: 'executed-circuit',
                  element: <JobCircuit isExecutedCircuit={true} />,
                  loader: jobCircuitLoader,
                },
              ],
            },
          ],
        },
        {
          path: 'budgets',
          element: <Budgets />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
        },
        {
          // Resources section with list and detail views
          path: 'resources',
          element: <ResourcesRoot />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
          children: [
            {
              index: true,
              element: <Resources />,
            },
            {
              path: ':resourceId',
              id: 'resource-detail',
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
          // Telemetry section with dashboard and room detail views
          path: 'telemetry',
          element: <TelemetryRoot />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
          children: [
            {
              index: true,
              element: <Telemetry />,
            },
            {
              path: ':roomId',
              element: <TelemetryRoomDetail />,
            },
          ],
        },
        {
          path: 'faq',
          element: <FAQ />,
          errorElement: <ErrorPage />,
          loader: checkTokenLoader,
        },
        {
          path: 'feedback',
          element: <Feedback />,
          errorElement: <ErrorPage />,
        },
        {
          path: 'funding',
          element: <Funding />,
          errorElement: <ErrorPage />,
        },
        {
          path: 'logout',
          element: <Logout />,
          loader: checkTokenLoader,
          action: logoutAction,
        },
      ],
    },
    {
      // Public routes under DefaultLayout for unauthenticated users
      path: '/',
      element: <DefaultLayout />,
      errorElement: <DefaultErrorPage />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'blocked',
          element: <Blocked />,
        },
        {
          path: 'forgot_password',
          element: <ForgotPassword />,
        },
        {
          path: 'request_access',
          element: <RequestAccess />,
        },
      ],
    },
  ]);

  // Wrap app with React Query provider for data fetching and router for navigation
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
