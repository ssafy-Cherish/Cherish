import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Index from './pages/MainPages/Index.jsx'
import RootLayout from './pages/RootLayout.jsx'
import CherryCallMainPage from './pages/CherryCallPages/CherryCallMainPage.jsx'
import './main.css'

const router = createBrowserRouter([
  // 메인 페이지
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {index: true, element: <Index />},
      {path: "cherrycall", element: <CherryCallMainPage />,},
      // {path: "diary", element:},
      // {path: "cherrybox", element:},
      // {path: "question", element:},
      // {path: "signup", element:}
      // {path: "login", element:}
    ],
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>,
)