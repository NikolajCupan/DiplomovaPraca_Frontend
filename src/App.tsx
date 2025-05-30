import { router } from "./helpers/Router.tsx";
import { UtilityProvider } from "./helpers/UtilityProvider.tsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import * as ReactRouter from "react-router-dom";

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
                        <ReactRouter.RouterProvider router={router} />
                    </UtilityProvider>
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
