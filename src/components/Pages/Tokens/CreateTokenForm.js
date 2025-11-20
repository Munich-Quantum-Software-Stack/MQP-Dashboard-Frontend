import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import de from 'date-fns/locale/de';
import 'react-datepicker/dist/react-datepicker.module.css';
import Button from 'src/components/UI/Button/Button';
import { createNewToken } from 'src/components/utils/tokens-http';
import CustomTooltip from 'src/components/UI/Tooltip/Tooltip';
import { queryClient } from 'src/components/utils/query';
import { isNotEmpty, maxValue } from 'src/components/utils/validationUserInput';
import { useInput } from 'src/hooks/use-input';
import { updateExpiration } from 'src/components/utils/tokens';
import SuccessfullyToken from 'src/components/Pages/Tokens/SuccessfullyToken';
import AlertCard from 'src/components/UI/MessageBox/AlertCard';
import BlankCard from 'src/components/UI/Card/BlankCard';
import { getAuthToken } from 'src/components/utils/auth';

registerLocale('de', de);
setDefaultLocale('de');

function CreateTokenForm({ userLimits }) {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const text_fs = +fs;
  const small_fs = +fs * 0.8;

  const access_token = getAuthToken();

  const [expiration, setExpiration] = useState('');

  const {
    value: tokenName,
    handleInputChange: handleTokenNameChange,
    handleInputBlur: handleTokenNameBlur,
    hasError: tokenNameHasError,
  } = useInput('', (value) => isNotEmpty(value));

  const {
    value: maxJobs,
    handleInputChange: handleMaxJobsChange,
    handleInputBlur: handleMaxJobsBlur,
  } = useInput(1, (value) => maxValue(value, userLimits.max_jobs));
  const {
    value: maxBudgets,
    handleInputChange: handleMaxBudgetsChange,
    handleInputBlur: handleMaxBudgetsBlur,
  } = useInput(1, (value) => maxValue(value, userLimits.max_budget));
  const {
    value: validity,
    handleInputChange: handleValidityChange,
    handleInputBlur: handleValidityBlur,
  } = useInput(1, (value) => maxValue(value, userLimits.max_lifetime));

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: createNewToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });

  useEffect(() => {
    const creation = new Date();
    const customExpiration = updateExpiration(creation, validity);
    setExpiration(customExpiration);
  }, [validity]);

  const createTokenHandler = (event) => {
    event.preventDefault();

    const tokenData = {
      token_name: tokenName,
      validity: validity,
      max_nb_jobs: maxJobs,
      max_budget: maxBudgets,
    };
    mutate({ tokenData, access_token });
    event.target.reset();
  };

  if (!userLimits || Object.keys(userLimits).length === 0) {
    return (
      <BlankCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
        <p>User limits is undefined!</p>
      </BlankCard>
    );
  }

  return (
    <React.Fragment>
      {data && <SuccessfullyToken newToken={data} />}
      {isError && (
        <AlertCard variant="danger">
          <h5>An error occurs!</h5>
          <p>{error.message}</p>
        </AlertCard>
      )}
      {!data && (
        <div className="mb-4 tokenForm_container">
          <p className="form_indication_text" style={{ fontSize: small_fs }}>
            (*) Required field
          </p>
          <form id="token_form" onSubmit={createTokenHandler} method="POST">
            <div className="row mx-0 ">
              <div className="col-12 col-xl-6 ">
                <div className="form-group mb-3 token_input">
                  <label htmlFor="token_name" className="form-label" style={{ fontSize: text_fs }}>
                    Token Name *
                  </label>
                  <input
                    type="text"
                    id="token_name"
                    name="token_name"
                    className={`${
                      tokenNameHasError
                        ? 'form-control invalid_input'
                        : 'form-control token_name_field'
                    }`}
                    value={tokenName}
                    onChange={handleTokenNameChange}
                    onBlur={handleTokenNameBlur}
                  />
                  {tokenNameHasError && <p className="error-text">Token name must not be empty!</p>}
                </div>
                <div className="form-group mb-3 token_input">
                  <label htmlFor="validity" className="form-label" style={{ fontSize: text_fs }}>
                    Validity *
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={userLimits.max_lifetime}
                    step="1"
                    id="validity"
                    name="validity"
                    className="form-range"
                    value={validity}
                    onChange={handleValidityChange}
                    onBlur={handleValidityBlur}
                  />
                  <div className="range_value_wrap" style={{ fontSize: text_fs }}>
                    <span id="validity_value">{validity}</span>
                    <span>/{userLimits.max_lifetime} day(s)</span>
                  </div>
                </div>

                <div className="form-group mb-3 tokeninput">
                  <label htmlFor="expiration" className="form-label" style={{ fontSize: text_fs }}>
                    Expiration (read only)
                  </label>
                  <input
                    type="text"
                    id="expiration"
                    name="expiration"
                    className="form-control token_name_field"
                    value={expiration}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-12 col-xl-6 ">
                <div className="form-group mb-3 token_input">
                  <CustomTooltip
                    id="nb_job_tooltip"
                    tooltip="The number of jobs that token is used for"
                    placement="top"
                  >
                    <label htmlFor="max_jobs" className="form-label" style={{ fontSize: text_fs }}>
                      Maximum Job Count *
                    </label>
                  </CustomTooltip>
                  <input
                    type="range"
                    min="1"
                    max={userLimits.max_jobs}
                    id="max_jobs"
                    name="max_jobs"
                    className="form-range"
                    value={maxJobs}
                    onChange={handleMaxJobsChange}
                    onBlur={handleMaxJobsBlur}
                  />
                  <div className="range_value_wrap" style={{ fontSize: text_fs }}>
                    <span id="max_jobs_value">{maxJobs}</span>
                    <span>/{userLimits.max_jobs}</span>
                  </div>
                </div>
                <div className="form-group mb-3 token_input">
                  <CustomTooltip
                    id="max_budget_tooltip"
                    tooltip="The maximum budget comsumption allowed for this token."
                    placement="top"
                  >
                    <label
                      htmlFor="max_budget"
                      className="form-label"
                      style={{ fontSize: text_fs }}
                    >
                      Maximum Budget Usage *
                    </label>
                  </CustomTooltip>
                  <input
                    type="range"
                    id="max_budget"
                    name="max_budget"
                    min="1"
                    max={userLimits.max_budget}
                    className="form-range"
                    value={maxBudgets}
                    onChange={handleMaxBudgetsChange}
                    onBlur={handleMaxBudgetsBlur}
                  />
                  <div className="range_value_wrap" style={{ fontSize: text_fs }}>
                    <span id="max_budgets_value">{maxBudgets}</span>
                    <span>/{userLimits.max_budget}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-0">
              <div className="col-12 my-4 actions">
                <Button type="submit" className="createToken_btn" style={{ fontSize: text_fs }}>
                  {isPending ? 'Submitting...' : 'Submit'}
                </Button>
                <Link
                  to="/tokens"
                  className="btn gray_btn cancel_btn"
                  style={{ fontSize: text_fs }}
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </React.Fragment>
  );
}

export default CreateTokenForm;
