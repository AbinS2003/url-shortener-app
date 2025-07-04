import React from "react";
import { createBrowserRouter,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Urls from "./pages/Urls";
import Edit from "./pages/Edit";


const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: '/signup', element: <Signup /> },
    { path: '/login', element: <Login /> },
    { path: '/urls', element: <Urls />},
    { path: '/edit/:id', element: <Edit /> },
    { path: "*", element: <Navigate to="/login" replace />,
  },
]);

export default router;