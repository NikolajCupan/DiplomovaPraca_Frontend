import * as Utility from "../../helpers/UtilityProvider.tsx";

import * as React from "react";
import * as ReactRouter from "react-router-dom";

function HelperElement() {
    const { closeNotification } = Utility.useUtility();
    const location = ReactRouter.useLocation();

    React.useEffect(() => {
        closeNotification();
    }, [location]);

    return <></>;
}

export default HelperElement;
