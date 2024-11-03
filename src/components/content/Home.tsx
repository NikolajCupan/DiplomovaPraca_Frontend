import Layout from "../layout/Layout";

function HomeComponent() {
    return (
        <div>
            <p>Home</p>
        </div>
    );
}

export default function Home() {
    return <Layout component={HomeComponent} />;
}
