/* eslint-disable no-empty */
import Cookies from "universal-cookie";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./Constants";
import { FetchRequest } from "./Types";

export const processResponse = (response: Response) => {
    try {
        const cookies = new Cookies();

        const currentSessionCookie = cookies.get(
            SESSION_COOKIE_NAME,
        ) as unknown;
        const newSessionCookieID = response.headers.get(SESSION_COOKIE_NAME);

        if (!currentSessionCookie) {
            cookies.set(SESSION_COOKIE_NAME, newSessionCookieID, {
                path: "/",
                maxAge: SESSION_MAX_AGE_SECONDS,
            });
        } else if (currentSessionCookie !== newSessionCookieID) {
            cookies.set(SESSION_COOKIE_NAME, newSessionCookieID, {
                path: "/",
                maxAge: SESSION_MAX_AGE_SECONDS,
            });
        }
    } catch (_) {}
};

export const prepareRequest = (request: FetchRequest) => {
    try {
        const cookies = new Cookies();
        const sessionCookie = cookies.get(SESSION_COOKIE_NAME) as unknown;

        if (sessionCookie) {
            request.options.headers = {
                ...request.options.headers,
                [SESSION_COOKIE_NAME]: sessionCookie as string,
            };
        }
    } catch (_) {}
};
