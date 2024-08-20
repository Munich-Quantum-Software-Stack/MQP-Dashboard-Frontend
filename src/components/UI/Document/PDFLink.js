const PDFLink = ({src, pdf_link_class, pdf_text, target}) => {
    return (
        <a href={src} className={`${pdf_link_class} pdf_link`} target={target}>
            <img src="/images/pdf_icon.svg" className="pdf_icon" alt="Pdf icon" />
            <span className="pdf_text">{pdf_text}</span>
        </a>
    );
}
export default PDFLink;