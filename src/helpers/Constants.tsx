//
// Other
export const STRICT_MODE = false;

export const STRING_TRUE = "True";
export const STRING_FALSE = "False";
export const STRING_NONE = "None";
// Other end
//

//
// UI
export const NOTIFICATION_CLOSE_MS = 5_000;

export const DEFAULT_CHART_HEIGHT = 400;
export const DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH = 600;

export const CHART_MAX_DATA_HOVER = 1_000;
// UI end
//

//
// Requests
export const MAX_FILE_SIZE_BYTES = 25_000_000;

export const SESSION_COOKIE_NAME = "session_cookie_id";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
// Requests end
//

//
// JSON
export const OUTPUT_ELEMENT_TITLE_KEY = "title";
export const OUTPUT_ELEMENT_RESULT_KEY = "result";

export const SUCCESS_KEY = "success";
export const EXCEPTION_KEY = "exception";

export const FREQUENCY_TYPE_KEY = "frequency";

// Tests
export const USED_P_VALUE_KEY = "used_p_value";
export const RESULT_P_VALUE_KEY = "result_p_value";
export const EVALUATION_KEY = "evaluation";
export const NULL_HYPOTHESIS_KEY = "null_hypothesis";
export const ALTERNATIVE_HYPOTHESIS_KEY = "alternative_hypothesis";

export const CONFIDENCE_INTERVAL_UPPER_BOUND_KEY =
    "confidence_interval_upper_bound";
export const CONFIDENCE_INTERVAL_LOWER_BOUND_KEY =
    "confidence_interval_lower_bound";

// Models
export const SUMMARY_KEY = "summary";

export const TRAIN_KEY = "train";
export const TEST_KEY = "test";
export const FORECAST_KEY = "forecast";

export const MODEL_DATE_KEY = "date";
export const MODEL_REAL_KEY = "real";
export const MODEL_FITTED_KEY = "fitted";
export const MODEL_RESIDUALS_KEY = "residuals";
export const MODEL_FORECAST_KEY = "forecast";

export const FORECAST_COUNT_KEY = "forecast_count";

// JSON end
//

//
// Frontend paths

// Other
export const HOME_LINK = "/";

export const UPLOAD_DATASET_LINK = "/data";
export const VIEW_DATASET_LINK = "/data/view";

export const TESTING_LINK = "/debug/testing";
export const TODO_LINK = "/debug/todo";

// Tests
export const DICKEY_FULLER_TEST_LINK = "/test/dicker-fuller-test";
export const KPSS_TEST_LINK = "/test/kpss-test";
export const SEASONAL_DECOMPOSE_LINK = "/test/seasonal-decompose";
export const PERIODOGRAM_LINK = "/test/periodogram";
export const CORRELOGRAM_LINK = "/test/correlogram";
export const ARCH_TEST_LINK = "/test/arch-test";
export const LJUNG_BOX_TEST_LINK = "/test/ljung-box-test";
export const LINEAR_REGRESSION_LINK = "/model/linear-regression";

// Transformations
export const DIFFERENCE_LINK = "/transformation/difference";
export const LOGARITHM_LINK = "/transformation/logarithm";
export const NORMALIZATION_LINK = "/transformation/normalization";
export const STANDARDIZATION_LINK = "/transformation/standardization";

// Models
export const ARIMA_LINK = "/model/arima";
export const SIMPLE_EXP_SMOOTHING_LINK = "/model/simple-exp-smoothing";
export const DOUBLE_EXP_SMOOTHING_LINK = "/model/double-exp-smoothing";
export const HOLT_WINTER_LINK = "/model/holt-winter";

// Frontend paths end
//

//
// Backend paths

// Other
export const BACKEND_PATH = "http://localhost:8080";

export const UPLOAD_DATASET_PATH = "/dataset/upload";
export const DOWNLOAD_DATASET_PATH = "/dataset/download";
export const EDIT_DATASET_PATH = "/dataset/edit/v2";

export const GET_DATASETS_OF_USER_PATH = "/dataset/get";

export const GET_DATASET_FOR_EDITING = "/dataset/get-for-editing";
export const EDIT_DATASET = "/dataset/edit";
export const DELETE_DATASET = "/dataset/delete";

// Tests
export const DICKEY_FULLER_TEST = "/test/dickey-fuller-test";
export const KPSS_TEST = "/test/kpss-test";
export const SEASONAL_DECOMPOSE = "/test/seasonal-decompose";
export const PERIODOGRAM = "/test/periodogram";
export const CORRELOGRAM_ACF = "/test/correlogram-acf";
export const CORRELOGRAM_PACF = "/test/correlogram-pacf";
export const ARCH_TEST = "/test/arch-test";
export const LJUNG_BOX_TEST = "/test/ljung-box-test";

// Transformations
export const DIFFERENCE = "/transformation/difference";
export const LOGARITHM = "/transformation/logarithm";
export const NORMALIZATION = "/transformation/normalization";
export const STANDARDIZATION = "/transformation/standardization";

// Models
export const ARIMA = "/model/arima";
export const SIMPLE_EXP_SMOOTHING = "/model/simple-exp-smoothing";
export const DOUBLE_EXP_SMOOTHING = "/model/double-exp-smoothing";
export const HOLT_WINTER = "/model/holt-winter";

// Backend paths end
//
