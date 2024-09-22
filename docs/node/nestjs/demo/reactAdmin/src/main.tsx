import "normalize.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router/index.tsx";

import { Provider } from "react-redux";
import store from "./store/store.tsx";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
