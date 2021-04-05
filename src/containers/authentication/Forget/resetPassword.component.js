import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { TextInput } from '../../../components/FormInputs';
import Api from '../../../helper/api';
import AuthApi from '../../../helper/authApi';

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
  const dispatch = useDispatch();

  const verifyToken = async (tkn) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.verifyToken}?token=${tkn}`
    );
    if (data) {
      console.log('data', data.data.email); //eslint-disable-line
      setEmail(data.data.email);
    }
    if (!data) {
      swal('Token is invalid', '', 'error');
      props.history.push('/login');
    }
  };

  useEffect(() => {
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

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.resetPasswordUrl}`,
      payload
    );

    if (data && data.success === true) {
      swal('Password changed successfully', '', 'success');
      props.history.push('/login');
    } else {
      swal(message, '', 'error');
    }
  };

  const validateForm = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setNewPassword();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
    }
  };

  return (
    <>
      <div className="login-page recover-password">
        <div className="logo text-center">
          <a href="#">
            {' '}
            <img src="/images/logo-black.svg" alt="img" />
          </a>
        </div>
        <form className="login-form" id="resetPassword">
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
            <a
              href="dashboard-default.html"
              className="btn btn-lg btn-primary"
              onClick={(e) => validateForm(e)}
            >
              Reset
            </a>
          </div>
          <a href="/login" className="back-to-login">
            Back to Login
          </a>
        </form>
      </div>
    </>
  );
}

export default withRouter(ResetPassword);
