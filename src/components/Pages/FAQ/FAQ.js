// components/Pages/FAQ/FAQ.js
import React from 'react';

const FAQ = () => {
    return (
        <div className="faq_container">
            <h1 className="faq_header">Frequently Asked Questions</h1>
            <div className="faq_list">
                <div className="faq_item">
                    <h2 className="faq_question">What is this platform for?</h2>
                    <p className="faq_answer">This platform is designed to provide users with access to various resources and services.</p>
                </div>
                <div className="faq_item">
                    <h2 className="faq_question">How do I get started?</h2>
                    <p className="faq_answer">To get started, simply sign up or log in to your account and explore the available features.</p>
                </div>
                <div className="faq_item">
                    <h2 className="faq_question">What if I have a problem?</h2>
                    <p className="faq_answer">If you encounter any issues, please contact our support team for assistance.</p>
                </div>
                {/* Add more FAQ items as needed */}
            </div>
        </div>
    );
};

export default FAQ;