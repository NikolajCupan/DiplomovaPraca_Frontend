import { router } from "./helpers/Router";

import { RouterProvider } from "react-router-dom";

export default function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}
