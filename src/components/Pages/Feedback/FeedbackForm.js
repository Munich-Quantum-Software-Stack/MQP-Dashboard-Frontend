import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isNotEmpty } from "src/components/utils/validationUserInput";
import { useInput } from "src/hooks/use-input";
import Button from "src/components/UI/Button/Button";
import AlertCard from "src/components/UI/MessageBox/AlertCard";
import { Form, Spinner } from "react-bootstrap";
import SuccessMessage from "src/components/Pages/Feedback/SuccessMessage";
import { getAuthToken } from "src/components/utils/auth";
import mqp_categories from "src/data/mqp-categories.json";
import default_ratings from "src/data/ratings.json";

const FeedbackForm = () => {
    const fs = useSelector((state) => state.accessibilities.font_size);
    const text_fs = +fs;
    const [httpErr, setHttpErr] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [rateValue, setRateValue] = useState(null);
    // const [activeRateObj, setActiveRateObj] = useState(null);
    const [ratings, setRatings] = useState(default_ratings);
    const [categoryValue, setCategoryValue] = useState(mqp_categories[0].name);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSucceed, setIsSucceed] = useState(false);
    const access_token = getAuthToken();

    const {
        value: commentValue,
        handleInputChange: handleCommentChange,
        handleInputBlur: handleCommentBlur,
        hasError: commentHasError,
    } = useInput("", (value) => isNotEmpty(value));

    const updateRatingsList = (ratedObj = null) => {
        const newRatings = ratings.map((rate) => {
            if (ratedObj && rate.value <= ratedObj.value) {
                rate.isActive = ratedObj.isActive ? true : false;
            } else {
                rate.isActive = false;
            }
            return rate;
        });
        setRatings(newRatings);
    };

    const rateInputClickHandler = (ratedObj) => {
             
        if (!ratedObj.isActive) {
            ratedObj.isActive = true;   
        }
        else {            
            if (ratedObj.value === rateValue) {
                ratedObj.isActive = false;
            } else {
                ratedObj.isActive = true;
            }          
        }
        setRateValue(ratedObj.value);        
        updateRatingsList(ratedObj);
        
    }   

    const categoryChangeHandler = (cate_value) => {
        setCategoryValue(cate_value.target.value);
    }

    const feedbackSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setHttpErr(null);

        // Validation
        const isCommentValid = isNotEmpty(commentValue);
        if (!isCommentValid || commentHasError) {
            setIsSubmitting(false);
            setValidationError("This field must not be empty.");
            return;
        }

        const feedbackData = {
            rate: rateValue,
            category: categoryValue,
            note: commentValue,
        };
       
        const url = process.env.REACT_APP_API_ENDPOINT + "/feedbacks/new";
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedbackData),
            });
            if (!response.ok) {
                setIsSubmitting(false);
                const error = new Error();
                error.message = "Submitted data is not successful.";
                throw error;
            } else {
                event.target.reset();
                setIsSubmitting(false);
                setIsSucceed(true);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.log(error);
            setHttpErr("Could not save feedback due to an internal server error.");
            
        }
      
    }



    return (
        <React.Fragment>
            {isSucceed && <SuccessMessage />}
            {!isSucceed && (
                <>
                    {httpErr && (
                        <AlertCard variant="danger">{httpErr}</AlertCard>
                    )}
                    <div className="col-12 col-xxl-9 feedback_form_container">
                        <form
                            id="FeedbackForm"
                            method="POST"
                            onSubmit={feedbackSubmitHandler}
                        >
                            <div className="my-3">
                                <Form.Label style={{ fontSize: text_fs }}>
                                    How was your overall experience?
                                </Form.Label>
                                <div className="rate_field">
                                    {ratings.map((rate) => (
                                        <button
                                            key={`rating-${rate.value}`}
                                            id={`rating-${rate.value}`}
                                            className={`rating_input_wrap ${(rate.isActive) ? "active" : "undefined"}`}
                                            onClick={() => {
                                                rateInputClickHandler(rate);
                                            }
                                            }
                                        >
                                            <div className="star_icon_field">
                                                <span className="star_icon"></span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="my-3 category_field">
                                <Form.Label style={{ fontSize: text_fs }}>
                                    Which category would you like to give
                                    feedback to?
                                </Form.Label>
                                <div className="category_input_wrap">
                                    <select
                                        id="category_selection"
                                        className="form-select"
                                        defaultValue={mqp_categories[0].name}
                                        onChange={categoryChangeHandler}
                                        style={{ fontSize: text_fs }}
                                    >
                                        {mqp_categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="my-3 comment_field">
                                <Form.Label style={{ fontSize: text_fs }}>
                                    How can we improve?
                                </Form.Label>
                                {validationError && (
                                    <AlertCard variant="danger">
                                        {validationError}
                                    </AlertCard>
                                )}
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={commentValue}
                                    onChange={handleCommentChange}
                                    onBlur={handleCommentBlur}
                                    className={`${
                                        commentHasError
                                            ? "invalid_input"
                                            : "comment_input"
                                    }`}
                                />
                            </div>
                            <div className="my-3 d-flex justify-content-start align-items-center">
                                <Button
                                    type="submit"
                                    className="me-3 feedback_submit_button"
                                    style={{ fontSize: text_fs }}
                                >
                                    {isSubmitting ? "Sending..." : "Send"}
                                </Button>
                                {isSubmitting && (
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">
                                            Sending...
                                        </span>
                                    </Spinner>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            )}
        </React.Fragment>
    );
}

export default FeedbackForm;
