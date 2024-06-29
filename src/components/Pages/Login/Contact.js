const Contact = (props) => {
    return (
        <div className="my-3 text-center fs-7 text_color_grey">
            <p>
                {props.children}
                <a
                    href="/request_access"
                    title="Contact"
                    className="dashboard_link text_color_grey underline_link"
                >
                    Request Access
                </a>
            </p>
        </div>
    );

}

export default Contact;