interface FormTitleProps {
    text: string;
}

function FormTitle(props: FormTitleProps) {
    return (
        <h1
            style={{
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "20px",
            }}
        >
            {props.text}
        </h1>
    );
}

export default FormTitle;
