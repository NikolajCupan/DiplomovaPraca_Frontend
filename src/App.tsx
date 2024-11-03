import { router } from "./helpers/Router";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RouterProvider } from "react-router-dom";

export default function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="App">
                <RouterProvider router={router} />
            </div>
        </LocalizationProvider>
    );
}
