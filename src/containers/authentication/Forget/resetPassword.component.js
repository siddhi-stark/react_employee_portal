import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Form, Button } from 'react-bootstrap';
import { TextInput, Helmet } from '../../../components/FormInputs';
import Api from '../../../helper/api';
import AuthApi from '../../../helper/authApi';
import customFunctions from '../../../helper/customFunctions';

function ResetPassword(props) {
  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        in: 'Passwords need to match!',
      },
    })
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [count, forceUpdate] = useState(0);
  const [title, setTitle] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const dispatch = useDispatch();

  const verifyToken = async (tkn) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.verifyToken}?token=${tkn}`
    );
    if (data) {
      setEmail(data.data.email);
    }
    if (!data) {
      swal('Token is invalid', '', 'error');
      props.history.push('/login');
    }
  };

  useEffect(() => {
    setTitle('Reset Password');
    dispatch({ type: 'LOGIN', value: false });
    const matchUrltoken = props.match.params.token;
    setToken(matchUrltoken);
    if (!matchUrltoken) {
      window.location = '/login';
    }
    verifyToken(matchUrltoken);
  }, [dispatch]);

  const setNewPassword = async () => {
    const payload = {
      token,
      email,
      password,
      confirm_password: confirmPassword,
    };

    const postData = customFunctions.cleanObject(payload);

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.resetPasswordUrl}`,
      postData
    );

    if (data && data.success) {
      setDisableButton(false);
      swal('Password changed successfully', '', 'success');
      props.history.push('/login');
    } else {
      setDisableButton(true);
      swal(message, '', 'error');
    }
  };

  const validateForm = async (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      setNewPassword();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="login-page recover-password">
        <div className="logo text-center">
          <a href="#">
            {' '}
            <img src="/images/logo-black.svg" alt="img" />
          </a>
        </div>
        <Form
          className="login-form"
          id="resetPassword"
          onSubmit={(e) => validateForm(e)}
        >
          <div className="title text-center">
            <h1>Reset Password</h1>
          </div>
          <div className="form-group">
            <img src="/images/user.svg" alt="Email" />
            <TextInput
              className="form-control form-control-lg"
              type="text"
              name="email"
              placeholder="Email"
              onInputChange={(e) => setEmail(e.target.value)}
            />
            {validator.current.message('Email', email, 'required|email', {
              className: 'text-danger',
            })}
          </div>

          <div className="form-group">
            <img src="/images/password.svg" alt="Password" />
            <TextInput
              className="form-control form-control-lg"
              type="password"
              name="password"
              placeholder="Password"
              onInputChange={(e) => setPassword(e.target.value)}
            />
            {validator.current.message('Password', password, 'required', {
              className: 'text-danger',
            })}
          </div>
          <div className="form-group">
            <img src="/images/password.svg" alt="Confirm Password" />
            <TextInput
              className="form-control form-control-lg"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onInputChange={(e) => setConfirmPassword(e.target.value)}
            />
            {validator.current.message(
              'confirmPassword',
              confirmPassword,
              `required|in:${password}`,
              {
                className: 'text-danger',
              }
            )}
          </div>

          <div className="text-center mt-3">
            <Button
              
              className="btn btn-lg btn-primary"
              type="submit"
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

export default withRouter(ResetPassword);
