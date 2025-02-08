export const STRICT_MODE = false;

export const STRING_TRUE = "True";
export const STRING_FALSE = "False";

export const MAX_FILE_SIZE_BYTES = 25_000_000;
export const SESSION_COOKIE_NAME = "session_cookie_id";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const NOTIFICATION_CLOSE_MS = 3_000;

export const DEFAULT_LINE_CHART_HEIGHT = 400;
export const DEFAULT_BREAKPOINT_WIDTH = 600;
export const DEFAULT_P_VALUE = 0.05;

export const OUTPUT_ELEMENT_TITLE_KEY = "title";
export const OUTPUT_ELEMENT_RESULT_KEY = "result";

export const SUCCESS_KEY = "success";
export const EXCEPTION_KEY = "exception";

export const USED_P_VALUE_KEY = "used_p_value";
export const RESULT_P_VALUE_KEY = "result_p_value";
export const EVALUATION_KEY = "evaluation";
export const NULL_HYPOTHESIS_KEY = "null_hypothesis";
export const ALTERNATIVE_HYPOTHESIS_KEY = "alternative_hypothesis";

/*
 * Frontend paths
 */
export const HOME_LINK = "/";

export const UPLOAD_DATASET_LINK = "/data";
export const EDIT_DATASET_LINK = "/data/edit";

export const DICKEY_FULLER_TEST_LINK = "/test/dicker-fuller-test";
export const KPSS_TEST_LINK = "/test/kpss-test";
export const SEASONAL_DECOMPOSE_LINK = "/test/seasonal-decompose";
export const PERIODOGRAM_LINK = "/test/periodogram";
export const CORRELOGRAM_LINK = "/test/correlogram";
export const ARCH_TEST_LINK = "/test/arch-test";
export const LJUNG_BOX_TEST_LINK = "/test/ljung-box-test";
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

export const DICKEY_FULLER_TEST = "/test/dickey-fuller-test";
export const KPSS_TEST = "/test/kpss-test";
export const SEASONAL_DECOMPOSE = "/test/seasonal-decompose";
export const PERIODOGRAM = "/test/periodogram";
export const CORRELOGRAM = "/test/correlogram";
export const ARCH_TEST = "/test/arch-test";
export const LJUNG_BOX_TEST = "/test/ljung-box-test";
