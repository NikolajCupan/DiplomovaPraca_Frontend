import Layout from "../layout/Layout";

function DataComponent() {
    return (
        <div>
            <p>Data</p>
        </div>
    );
}

export default function Data() {
    return <Layout component={DataComponent} />;
}
