import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import Header from "./Header.tsx";
import ScrollableContainer from "./ScrollableContainer.tsx";

interface ModelResultElementProps {
    responseBody: Type.RequestResult | null;
}

function ModelResultElement(props: ModelResultElementProps) {
    if (!props.responseBody) {
        return;
    }

    const responseBodyData: Record<string, any> = JSON.parse(
        props.responseBody.data,
    );
    if (!(Constants.SUMMARY_KEY in responseBodyData)) {
        return;
    }

    const summary =
        responseBodyData[Constants.SUMMARY_KEY][
            Constants.OUTPUT_ELEMENT_RESULT_KEY
        ];
    const parts: string[] = summary.split("\n");

    return (
        <>
            <Header
                text={"Podrobný výsledok"}
                breakpointWidth={250}
                excludeInfoTooltip={true}
                link={[]}
            />

            <ScrollableContainer breakpointWidth={500}>
                {parts.map((element, index) => {
                    return (
                        <div key={index} className="code">
                            {element}
                        </div>
                    );
                })}
            </ScrollableContainer>
        </>
    );
}

export default ModelResultElement;
