/* eslint-disable no-empty */
import * as Constants from "./Constants.tsx";
import * as Type from "./Types.tsx";

import Cookies from "universal-cookie";

export const processResponse = (response: Response) => {
    try {
        const cookies = new Cookies();

        const currentSessionCookie = cookies.get(
            Constants.SESSION_COOKIE_NAME,
        ) as unknown;
        const newSessionCookieID = response.headers.get(
            Constants.SESSION_COOKIE_NAME,
        );

        if (
            !currentSessionCookie ||
            currentSessionCookie !== newSessionCookieID
        ) {
            cookies.set(Constants.SESSION_COOKIE_NAME, newSessionCookieID, {
                path: "/",
                maxAge: Constants.SESSION_MAX_AGE_SECONDS,
            });
        }
    } catch (_) {}
};

export const prepareRequest = (request: Type.FetchRequest) => {
    try {
        const cookies = new Cookies();
        const sessionCookie = cookies.get(
            Constants.SESSION_COOKIE_NAME,
        ) as unknown;

        if (sessionCookie) {
            request.options.headers = {
                ...request.options.headers,
                [Constants.SESSION_COOKIE_NAME]: sessionCookie as string,
            };
        }
    } catch (_) {}
};
