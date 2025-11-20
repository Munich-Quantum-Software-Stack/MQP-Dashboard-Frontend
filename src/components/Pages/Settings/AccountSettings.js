import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BlankCard from 'src/components/UI/Card/BlankCard';
import { Form } from 'react-router-dom';
import FormMessage from 'src/components/UI/MessageBox/AlertCard';
import Button from 'src/components/UI/Button/Button';

const AccountSettings = () => {
  //const data = useActionData();
  const fs = useSelector((state) => state.accessibilities.font_size);
  const btn_fs = +fs * 1.1;
  const data = {
    identity: 'Your Identity',
    password: 'password',
    lastLoggedIn: 'dd.mm.YYYY',
  };
  const [password, setPassword] = useState(data.password);
  let replacedPwd = '';
  if (data === null) {
    return <p>Could not load data of current user!</p>;
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  //const editPasswordHandler = () => {};

  if (password.trim().length > 0) {
    replacedPwd = password.replace('*' * password.trim().length);
  }

  return (
    <BlankCard>
      <Form id="AccountSettingForm" method="post">
        {data && data.message && <FormMessage message={data.message} />}
        <div className="form-field my-4">
          <label htmlFor="identity" style={{ fontSize: +fs }}>
            Identity
          </label>
          <input
            type="text"
            id="identity"
            name="identity"
            value={data.identity}
            disabled
            className="form-control"
            style={{ fontSize: +fs }}
          />
        </div>
        <div className="form-field my-4">
          <label htmlFor="password" style={{ fontSize: +fs }}>
            Password{' '}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={replacedPwd}
            onChange={passwordChangeHandler}
            className="form-control"
            style={{ fontSize: +fs }}
          />
          {/** 
          <button
            onClick={editPasswordHandler}
            className="text_color_grey fs-7 editPwd_btn"
            title="Change Password"
          >
            <span className="edit_icon"></span> Change Password
          </button>
           
          */}
        </div>
        <div className="form-field my-4">
          <label htmlFor="identity" style={{ fontSize: +fs }}>
            Last logged in
          </label>
          <input
            type="text"
            id="last_logged_in"
            name="last_logged_in"
            value={data.lastLoggedIn}
            disabled
            className="form-control"
            style={{ fontSize: +fs }}
          />
        </div>
        <div className=" mt-5">
          <Button type="submit" className="save_btn" style={{ fontSize: btn_fs }}>
            Save
          </Button>
        </div>
      </Form>
    </BlankCard>
  );
};

export default AccountSettings;
