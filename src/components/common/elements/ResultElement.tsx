import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as VariousElements from "../../../helpers/VariousElements.tsx";
import "../../../index.css";
import ScrollableContainer from "../elements/ScrollableContainer.tsx";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import * as React from "react";

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
            setResponseBodyData(null);
            return;
        }

        const json = JSON.parse(props.responseBody.data);
        setResponseBodyData(json);
    }, [props.responseBody]);

    const noTestDoneElement = (
        <div className="inner-container-style">
            Zvoľte parametre a vykonajte test
        </div>
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
                Helper.formatDecimalNumber(
                    usedPValueJson[Constants.OUTPUT_ELEMENT_RESULT_KEY],
                ),
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

        Object.entries(responseCopy).forEach(([key, value]) => {
            const jsonItem = value as Record<string, any>;
            let result = jsonItem[Constants.OUTPUT_ELEMENT_RESULT_KEY];

            if (typeof result === "object") {
                result = Helper.formatJSON(result);
            }

            if (key == Constants.RESULT_P_VALUE_KEY) {
                if (result === -1) {
                    result = "nie je k dispozícii";
                } else {
                    result = Helper.formatDecimalNumber(result);
                }
            }

            pairs.push([
                false,
                result,
                jsonItem[Constants.OUTPUT_ELEMENT_TITLE_KEY],
            ]);
        });

        return (
            <ScrollableContainer breakpointWidth={600}>
                <div className="inner-container-style-success">
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
            return VariousElements.actionInProgressElement;
        } else if (!responseBodyData) {
            return noTestDoneElement;
        } else {
            return getActionResultElement();
        }
    };

    return <div>{getResultElementBody()}</div>;
}

export default ResultElement;
