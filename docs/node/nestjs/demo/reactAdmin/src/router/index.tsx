import { createBrowserRouter } from "react-router-dom";
import Device from "../views/dashboard/device";
import DashBoard from "../views/dashboard/layout";
import User from "../views/dashboard/user";
import NotFound from "../views/error/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashBoard />,
        // 重定向到 /user
        children: [
            {
                path: "/user",
                element: <User />,
            },
            {
                path: "/device",
                element: <Device />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;