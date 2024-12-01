import Layout from "../layout2/Layout";

function HomeComponent() {
    const content = (
        <div>
            <p>Home</p>
        </div>
    );

    return <Layout component={content} />;
}

export default HomeComponent;
