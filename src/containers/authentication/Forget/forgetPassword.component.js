import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { Form, Button, Image } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput, Helmet } from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';

const validator = new SimpleReactValidator();

function ForgetPassword() {
  // const history = useHistory();
  const [userData, setUserData] = useState({ email: '' });
  const [count, forceUpdate] = useState(0);
  const [title, setTitle] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    setTitle('Recover Password');
    dispatch({ type: 'LOGIN', value: false });
  }, [dispatch]);

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

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.forgetPasswordUrl}`,
      payload
    );

    if (data) {
      swal('Email has been sent successfully.');
    } else {
      swal(message);
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
      <Helmet title={title} />
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
