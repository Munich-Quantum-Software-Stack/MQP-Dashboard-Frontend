import React from "react";
import PropTypes from "prop-types";

function FAQList({ faqs }) {
    return (
        <ul className="faq_list">
            {faqs.map((faq) => (
                <li key={faq.id} className="faq_item">
                    <h5>{faq.question}</h5>
                    <p>{faq.answer}</p>
                </li>
            ))}
        </ul>
    );
}

FAQList.propTypes = {
    faqs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            question: PropTypes.string.isRequired,
            answer: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default FAQList;