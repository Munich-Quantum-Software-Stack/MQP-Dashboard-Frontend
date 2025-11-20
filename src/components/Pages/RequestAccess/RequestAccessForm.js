import React, { useState } from 'react';
import { isNotEmpty, isEmail } from 'src/components/utils/validationUserInput';
import { useInput } from 'src/hooks/use-input';
import Button from 'src/components/UI/Button/Button';
import AlertCard from 'src/components/UI/MessageBox/AlertCard';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import titles from 'src/data/titles.json';
import countries from 'src/data/countries.json';
import SuccessMessage from 'src/components/Pages/RequestAccess/SuccessMessage';

function RequestAccessForm() {
  const [httpErr, setHttpErr] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);

  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('Germany');

  // Name input
  const {
    value: name,
    handleInputChange: handleNameChange,
    handleInputBlur: handleNameBlur,
    hasError: nameHasError,
  } = useInput('', (value) => isNotEmpty(value));

  // Email input
  const {
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput('', (value) => isEmail(value));

  // Project input
  const {
    value: project,
    handleInputChange: handleProjectChange,
    handleInputBlur: handleProjectBlur,
    hasError: projectHasError,
  } = useInput('', (value) => isNotEmpty(value));

  // Organization input
  const {
    value: organization,
    handleInputChange: handleOrganizationChange,
    handleInputBlur: handleOrganizationBlur,
    hasError: organizationHasError,
  } = useInput('', (value) => isNotEmpty(value));

  // Title input
  const titleChangeHandler = (title) => {
    setTitle(title.name);
  };

  // Country input
  const countryChangeHandler = (country) => {
    setCountry(country.value);
  };
  const submitRequestAccessHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setHttpErr(null);

    // Validation
    const isEmailValid = isNotEmpty(email);
    if (!isEmailValid || emailHasError || nameHasError || projectHasError || organizationHasError) {
      setIsSubmitting(false);
      setValidationError('Required field must not be empty.');
      return;
    }

    const formData = new FormData(event.target);
    const request_data = {
      title: formData.get('title'),
      name: formData.get('name'),
      email: formData.get('email'),
      userID: formData.get('userID'),
      project: formData.get('project'),
      country: formData.get('country'),
      organization: formData.get('organization'),
      message: formData.get('message'),
    };

    const url = process.env.REACT_APP_API_ENDPOINT + '/request_access';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request_data),
      });
      if (!response.ok) {
        //setIsSubmitting(false);
        const error = new Error();
        error.message = 'Could not save your data.';
        throw error;
      } else {
        event.target.reset();
        setIsSubmitting(false);
        setIsSucceed(true);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      setHttpErr('Could not process your data due to an internal server error.');
    }
  };

  return (
    <div className="mb-4 request_access_content">
      <h4>Request Access</h4>
      {isSucceed && <SuccessMessage />}
      {httpErr && <AlertCard variant="danger">{httpErr}</AlertCard>}
      {!isSucceed && (
        <>
          <p className="required_text small">(*) Required field</p>
          <form id="request_form" onSubmit={submitRequestAccessHandler} method="POST">
            {validationError && <AlertCard variant="danger">{validationError}</AlertCard>}
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex justify-content-start request_name_field">
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Select
                      aria-label="Title Selection"
                      className="title_input"
                      value={title}
                      onChange={titleChangeHandler}
                      name="title"
                    >
                      {titles.map((title, index) => (
                        <option key={index}>{title.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3 name_input_field" controlId="name">
                    <Form.Label>Name (*)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Full Name"
                      name="name"
                      className={` ${nameHasError ? 'invalid_input' : 'name_input'}`}
                      value={name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      required
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address (*)</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Your Contact Email Address"
                    name="email"
                    value={email}
                    className={`${emailHasError ? ' invalid_input' : 'email_input'}`}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="userID">
                  <Form.Label>User-ID (if any)</Form.Label>
                  <Form.Control type="text" name="userID" placeholder="Your User-ID" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="project">
                  <Form.Label>Project Name (*)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name of project that you're working on"
                    name="project"
                    value={project}
                    onChange={handleProjectChange}
                    onBlur={handleProjectBlur}
                    className={`${projectHasError ? ' invalid_input' : 'project_input'}`}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Country (*)</Form.Label>
                  <Form.Select
                    aria-label="Country Selection"
                    className="country_input"
                    value={country}
                    onChange={countryChangeHandler}
                    name="country"
                  >
                    <option value=""></option>
                    {countries.map((country) => (
                      <option key={country.cca2}>{country.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization/Institute (*)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your Organization or Institute"
                    name="organization"
                    required
                    value={organization}
                    className={`${organizationHasError ? 'invalid_input' : 'organization_input'}`}
                    onChange={handleOrganizationChange}
                    onBlur={handleOrganizationBlur}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group className="mb-3" controlId="message">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={3} name="message" />
              </Form.Group>
            </div>
            <div className="row">
              <div className="my-3 d-flex justify-content-center align-items-center">
                <Button type="submit" className="me-4 request_submit_button" title="Send">
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
                <Link
                  to="/login"
                  className="dashboard_link text-center py-2 px-4 text_color_grey fs-7 dashboard_btn gray_btn"
                  title="Cancel"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default RequestAccessForm;
