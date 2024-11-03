import Frame from "../frame/Frame";

function HomeComponent() {
    return (
        <div>
            <p>Home</p>
        </div>
    );
}

export default function Home() {
    return <Frame component={HomeComponent}/>;
}
