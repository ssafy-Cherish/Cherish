import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query.js";

import Index from "./pages/MainPages/Index.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import DiaryMonthlyPage from "./pages/DiaryPages/DiaryMonthlyPage.jsx";
import "./main.css";
import DiaryYearlyPage from "./pages/DiaryPages/DiaryYearlyPage.jsx";
import DiaryDailyPage from "./pages/DiaryPages/DiaryDailyPage.jsx";
import DiaryLayout from "./pages/DiaryPages/DiaryLayout.jsx";
import CherryCallMainPage from "./pages/CherryCallPages/CherryCallMainPage.jsx";
import PotPage from "./pages/MainPages/PotPage.jsx";
import TodayQuestionRecodePage from "./pages/TodayQuestionPages/TodayQuestionRecodePage.jsx";
import UserLayout from "./pages/UserPages/UserLayout";
import Login from "./pages/UserPages/Login";
import Signup from "./pages/UserPages/Signup";
import STTandGPTPage from "./pages/STTandGPTPages/STTandGPTPage.jsx";
import CherryBoxPage from "./pages/CherryBoxPages/CherryBoxPage.jsx";

const router = createBrowserRouter([
  // 메인 페이지
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Index />,
        children: [
          {
            path: "pot",
            element: <PotPage />,
          },
          {
            path: "today",
            element: <TodayQuestionRecodePage />,
          },
          {
            path: "diary",
            element: <DiaryLayout />,
            children: [
              {
                path: "month",
                element: <DiaryMonthlyPage />,
              },
              {
                path: "year",
                element: <DiaryYearlyPage />,
              },
              {
                path: "day",
                element: <DiaryDailyPage />,
              },
            ],
          },
          {
            path: "cherrybox",
            element: <CherryBoxPage />,
          },
        ],
      },
      {
        path: "cherrycall",
        element: <CherryCallMainPage />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        index: true,
        loader: () => redirect("/user/login"),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "sttgpt",
    element: <STTandGPTPage />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
