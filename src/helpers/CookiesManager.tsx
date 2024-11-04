/* eslint-disable no-empty */
import Cookies from "universal-cookie";
import { SESSION_COOKIE_NAME } from "./Constants";
import { FetchRequest } from "./Types";

export const processResponse = (response: Response) => {
    try {
        const cookies = new Cookies();

        const currentSessionCookie = cookies.get(SESSION_COOKIE_NAME);
        const newSessionCookieID = response.headers.get("session_cookie_id");

        if (!currentSessionCookie) {
            cookies.set(SESSION_COOKIE_NAME, newSessionCookieID, { path: "/" });
        } else if (currentSessionCookie !== newSessionCookieID) {
            cookies.set(SESSION_COOKIE_NAME, newSessionCookieID, { path: "/" });
        }
    } catch (_) {}
};

export const prepareRequest = (request: FetchRequest) => {
    try {
        const cookies = new Cookies();
        const sessionCookie = cookies.get(SESSION_COOKIE_NAME);

        if (sessionCookie) {
            request.options.headers = {
                ...request.options.headers,
                [SESSION_COOKIE_NAME]: sessionCookie,
            };
        }
    } catch (_) {}
};
