import Frame from "../frame/Frame";

function DataComponent() {
    return (
        <div>
            <p>Data</p>
        </div>
    );
}

export default function Data() {
    return <Frame component={DataComponent}/>;
}
