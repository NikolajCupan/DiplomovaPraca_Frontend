import * as Constants from "../../helpers/Constants.tsx";
import * as Type from "../../helpers/Types.tsx";

import FolderIcon from "@mui/icons-material/Folder";
import {
    Avatar,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";

import * as React from "react";

const innerContainerStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "14px",
    marginBottom: "14px",
};

const innerContainerStyleSuccess: React.CSSProperties = {
    fontSize: "18px",
};

interface ResultElementProps {
    responseBody: Type.RequestResult | null;
    actionInProgress: boolean;
}

function ResultElement(props: ResultElementProps) {
    console.log("kk");
    const [responseBodyData, setResponseBodyData] = React.useState<Record<
        string,
        any
    > | null>(null);

    React.useEffect(() => {
        if (!props.responseBody) {
            return;
        }

        const json = JSON.parse(props.responseBody.data);
        setResponseBodyData(json);
    }, [props.responseBody]);

    const actionInProgressElement = (
        <div style={innerContainerStyle}>
            <CircularProgress />
        </div>
    );

    const noTestDoneElement = (
        <div style={innerContainerStyle}>Zvoľte parametre a vykonajte test</div>
    );

    const getActionResultElement = () => {
        if (!responseBodyData) {
            return;
        }

        const responseCopy = { ...responseBodyData };
        const success = responseCopy[Constants.SUCCESS_KEY];
        delete responseCopy[Constants.SUCCESS_KEY];

        let pairs: [string, string][] = [];
        if (success) {
            const nullHypothesisJson: Record<string, any> =
                responseCopy[Constants.NULL_HYPOTHESIS_KEY];
            delete responseCopy[Constants.NULL_HYPOTHESIS_KEY];
            pairs.push([
                nullHypothesisJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                nullHypothesisJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);

            const alternativeHypothesisJson: Record<string, any> =
                responseCopy[Constants.ALTERNATIVE_HYPOTHESIS_KEY];
            delete responseCopy[Constants.ALTERNATIVE_HYPOTHESIS_KEY];
            pairs.push([
                alternativeHypothesisJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                alternativeHypothesisJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);

            const evaluationJson: Record<string, any> =
                responseCopy[Constants.EVALUATION_KEY];
            delete responseCopy[Constants.EVALUATION_KEY];
            pairs.push([
                evaluationJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                evaluationJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        } else {
            const exceptionJson: Record<string, any> =
                responseCopy[Constants.EXCEPTION_KEY];
            delete responseCopy[Constants.EXCEPTION_KEY];
            pairs.push([
                exceptionJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                exceptionJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        }

        Object.entries(responseCopy).forEach(([_, value]) => {
            const jsonItem = value as Record<string, any>;
            pairs.push([
                jsonItem[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                jsonItem[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        });

        console.log(pairs);

        return (
            <div style={innerContainerStyleSuccess}>
                <List>
                    {pairs.map(([first, second], index) => (
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={first.toString()}
                                secondary={second.toString()}
                            />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    };

    const getResultElementBody = () => {
        if (props.actionInProgress) {
            return actionInProgressElement;
        } else if (!responseBodyData) {
            return noTestDoneElement;
        } else {
            return getActionResultElement();
        }
    };

    return <div>{getResultElementBody()}</div>;
}

export default ResultElement;
