import { router } from "./helpers/Router";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RouterProvider } from "react-router-dom";
import { UtilityProvider } from "./helpers/UtilityProvider";

const globalTheme = createTheme({
    typography: {
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
});

export default function App() {
    return (
        <ThemeProvider theme={globalTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="App">
                    <UtilityProvider>
                        <RouterProvider router={router} />
                    </UtilityProvider>
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
