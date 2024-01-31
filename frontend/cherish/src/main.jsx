import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/MainPages/Index.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import DiaryMonthlyPage from "./pages/DiaryPages/DiaryMonthlyPage.jsx";
import "./main.css";
import DiaryYearlyPage from "./pages/DiaryPages/DiaryYearlyPage.jsx";
import DiaryDailyPage from "./pages/DiaryPages/DiaryDailyPage.jsx";
import DiaryLayout from "./pages/DiaryPages/DiaryLayout.jsx";
import CherryCallMainPage from "./pages/CherryCallPages/CherryCallMainPage.jsx";

const router = createBrowserRouter([
  // 메인 페이지
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "cherrycall",
        element: <CherryCallMainPage />,
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
      // {path: "cherrybox", element:},
      // {path: "question", element:},
      // {path: "signup", element:}
      // {path: "login", element:}
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
