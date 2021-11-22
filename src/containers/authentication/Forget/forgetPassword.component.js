import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { Form, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput, Helmet } from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';
import customFunctions from '../../../helper/customFunctions';
import Loader from '../../../components/Loader/index';

function ForgetPassword() {
  const validator = useRef(new SimpleReactValidator());
  const [userData, setUserData] = useState({ email: '' });
  const [count, forceUpdate] = useState(0);
  const [title, setTitle] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setTitle('Recover Password');
    dispatch({ type: 'LOGIN', value: false });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((inputValues) => {
      return { ...inputValues, [name]: value };
    });
  };

  const onResetPasswordEmail = async () => {
    const payload = {
      email: userData.email,
    };

    setLoader(true);

    const postData = customFunctions.cleanObject(payload, 'O');
    const { data, message } = await AuthApi.postDataToServer(
      `${Api.forgetPasswordUrl}`,
      postData
    );

    if (data) {
      setLoader(false);
      swal('Email has been sent successfully.');
      setDisableButton(false);
    } else {
      setLoader(false);
      swal(message);
      setDisableButton(false);
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      onResetPasswordEmail();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <Loader showLoader={loader} needFullPage={false} />
      <div className="login-page recover-password">
        <div className="logo text-center">
          <a href="#">
            <Image src="/images/logo-black.svg" />
          </a>
        </div>
        <Form className="login-form" onSubmit={(e) => validateForm(e)}>
          <div className="title text-center">
            <h1>Recover Password</h1>
          </div>
          <TextInput
            inputIcon="/images/user.svg"
            inputClass="form-control form-control-lg"
            type="email"
            name="email"
            onInputChange={(e) => handleInputChange(e)}
            value={userData.email}
            placeholder="Enter your Email and instructions will be sent to you!"
            errorMessage={validator.current.message(
              'email',
              userData.email,
              'required|email'
            )}
          />
          <div className="text-center mt-3">
            <Button
              type="submit"
              className="btn btn-lg btn-primary"
              disabled={disableButton}
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
