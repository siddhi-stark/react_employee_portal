import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { Form, Button, Image } from 'react-bootstrap';
import { TextInput } from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';

const validator = new SimpleReactValidator();

function ForgetPassword() {
  // const history = useHistory();
  const [userData, setUserData] = useState({ email: '' });
  const [count, forceUpdate] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'LOGIN', value: false });
  }, [dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((inputValues) => {
      return { ...inputValues, [name]: value };
    });
  };

  // const sendResetPasswordEmail = async () => {
  //     const payload = {
  //       email: email.trim(),
  //     };
  //     const { data, message } = await AuthApi.postDataToServer(
  //       `${Api.forgotPasswordUrl}`,
  //       payload
  //     );

  //     if (data && data.success === true) {
  //       swal('Link successfully sent to your Email.', '', 'success');
  //       await resetData();
  //     } else {
  //       swal(message, '', 'error');
  //     }
  //   };

  const onResetPasswordEmail = async () => {
    const payload = {
      email: userData.email,
    };

    const { data } = await AuthApi.postDataToServer(
      `${Api.forgetPasswordUrl}`,
      payload
    );

    if (data) {
      console.log(data); //eslint-disable-line
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      onResetPasswordEmail();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  return (
    <>
      <div className="login-page recover-password">
        <div className="logo text-center">
          <a href="#">
            <Image src="images/logo-black.svg" />
          </a>
        </div>
        <Form className="login-form">
          <div className="title text-center">
            <h1>Recover Password</h1>
          </div>
          <TextInput
            inputIcon="images/user.svg"
            // containerClass="form-group"
            inputClass="form-control form-control-lg"
            type="email"
            name="email"
            onInputChange={(e) => handleInputChange(e)}
            value={userData.email}
            placeholder="Enter your Email and instructions will be sent to you!"
            errorMessage={validator.message(
              'email',
              userData.email,
              'required|email'
            )}
          />
          <div className="text-center mt-3">
            <Button
              type="submit"
              className="btn btn-lg btn-primary"
              onClick={(e) => submitForm(e)}
            >
              Reset
            </Button>
          </div>
          <a href="/login" className="back-to-login">
            Back to Login
          </a>
        </Form>
      </div>
    </>
  );
}

export default withRouter(ForgetPassword);
