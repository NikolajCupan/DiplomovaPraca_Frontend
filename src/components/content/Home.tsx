import Layout from "../layout/Layout.tsx";

function HomeComponent() {
    const content = (
        <div>
            <p>HOME</p>
        </div>
    );

    return <Layout component={content} />;
}

export default HomeComponent;
