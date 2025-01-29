import DatasetSelector from "../../common/DatasetSelector.tsx";
import Layout from "../../layout/Layout.tsx";

function DickerFullerTest() {
    const content = (
        <div>
            <DatasetSelector />
            <p>DK test</p>
        </div>
    );

    return <Layout component={content} />;
}

export default DickerFullerTest;
