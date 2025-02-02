import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import ScrollableContainer from "../elements/ScrollableContainer.tsx";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
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

        let pairs: [boolean, string, string][] = [];
        if (success) {
            const usedPValueJson: Record<string, any> =
                responseCopy[Constants.USED_P_VALUE_KEY];
            delete responseCopy[Constants.USED_P_VALUE_KEY];
            pairs.push([
                true,
                usedPValueJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                usedPValueJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);

            const nullHypothesisJson: Record<string, any> =
                responseCopy[Constants.NULL_HYPOTHESIS_KEY];
            delete responseCopy[Constants.NULL_HYPOTHESIS_KEY];
            pairs.push([
                true,
                nullHypothesisJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                nullHypothesisJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);

            const alternativeHypothesisJson: Record<string, any> =
                responseCopy[Constants.ALTERNATIVE_HYPOTHESIS_KEY];
            delete responseCopy[Constants.ALTERNATIVE_HYPOTHESIS_KEY];
            pairs.push([
                true,
                alternativeHypothesisJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                alternativeHypothesisJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);

            const evaluationJson: Record<string, any> =
                responseCopy[Constants.EVALUATION_KEY];
            delete responseCopy[Constants.EVALUATION_KEY];
            pairs.push([
                true,
                evaluationJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                evaluationJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        } else {
            const exceptionJson: Record<string, any> =
                responseCopy[Constants.EXCEPTION_KEY];
            delete responseCopy[Constants.EXCEPTION_KEY];
            pairs.push([
                true,
                exceptionJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                exceptionJson[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        }

        Object.entries(responseCopy).forEach(([_, value]) => {
            const jsonItem = value as Record<string, any>;
            let result = jsonItem[Constants.OUTPUT_ELEMENT_RESULT_KEY];
            if (typeof result === "object") {
                result = Helper.formatJSON(result);
            }

            pairs.push([
                false,
                result,
                jsonItem[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        });

        return (
            <ScrollableContainer breakpointWidth={600}>
                <div style={innerContainerStyleSuccess}>
                    <List>
                        {pairs.map(
                            ([elementIsImportant, first, second], index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <ArrowForwardIosIcon
                                            sx={
                                                elementIsImportant
                                                    ? {
                                                          color: "var(--primary-color)",
                                                      }
                                                    : { color: "gray" }
                                            }
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <span
                                                style={
                                                    elementIsImportant
                                                        ? {
                                                              color: "var(--primary-color)",
                                                              fontWeight:
                                                                  "bold",
                                                          }
                                                        : {}
                                                }
                                            >
                                                {first}
                                            </span>
                                        }
                                        secondary={
                                            <span
                                                style={
                                                    elementIsImportant
                                                        ? {
                                                              fontWeight:
                                                                  "bold",
                                                          }
                                                        : {
                                                              fontWeight:
                                                                  "normal",
                                                          }
                                                }
                                            >
                                                {second}
                                            </span>
                                        }
                                    />
                                </ListItem>
                            ),
                        )}
                    </List>
                </div>
            </ScrollableContainer>
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
