import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Boards from "../pages/Boards";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }, {
        path: "/",
        element: <Boards />
    }
])