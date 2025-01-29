export const STRICT_MODE = false;

export const MAX_FILE_SIZE_BYTES = 25_000_000;
export const SESSION_COOKIE_NAME = "session_cookie_id";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const NOTIFICATION_CLOSE_MS = 3_000;

/*
 * Frontend paths
 */
export const HOME_LINK = "/";

export const UPLOAD_DATASET_LINK = "/data";
export const EDIT_DATASET_LINK = "/data/edit";

export const DICKER_FULLER_TEST_LINK = "/test/dicker-fuller-test";
export const LINEAR_REGRESSION_LINK = "/model/linear-regression";

export const TESTING_LINK = "/debug/testing";
export const TODO_LINK = "/debug/todo";

/*
 * Backend paths
 */
export const BACKEND_PATH = "http://localhost:8080";

export const UPLOAD_DATASET_PATH = "/dataset/upload";
export const DOWNLOAD_DATASET_PATH = "/dataset/download";

export const GET_DATASETS_OF_USER_PATH = "/dataset/get";

export const GET_DATASET_FOR_EDITING = "/dataset/get-for-editing";
export const EDIT_DATASET = "/dataset/edit";
export const DELETE_DATASET = "/dataset/delete";
