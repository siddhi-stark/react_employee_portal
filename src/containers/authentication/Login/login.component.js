import React, { useEffect, useState, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';
import { enc } from 'crypto-js';
import CustomFunctions from '../../../helper/customFunctions';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';
import { Helmet } from '../../../components/FormInputs';

function Login(props) {
  const dispatch = useDispatch();
  const validator = useRef(new SimpleReactValidator());
  const [count, forceUpdate] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [title, setTitle] = useState('');
  const history = useHistory();
  const [disableButton, setDisableButton] = useState(false);

  const checkRememberMe = () => {
    let emailLocal = '';
    if (CustomFunctions.getLocalStorage('email')) {
      const decryptedEmailString = CustomFunctions.decryptKey(
        CustomFunctions.getLocalStorage('email'),
        CustomFunctions.getAESKey()
      );
      emailLocal = decryptedEmailString.toString(enc.Utf8);
    }

    let passwordLocal = '';
    if (CustomFunctions.getLocalStorage('password')) {
      const decryptedStringPasswordString = CustomFunctions.decryptKey(
        CustomFunctions.getLocalStorage('password'),
        CustomFunctions.getAESKey()
      );
      passwordLocal = decryptedStringPasswordString.toString(enc.Utf8);
    }
    const checkboxLocal = CustomFunctions.getLocalStorage('checkbox');
    if (checkboxLocal && !CustomFunctions.checkIfEmpty(emailLocal)) {
      setUsername(emailLocal);
      setRemember(true);
      setPassword(passwordLocal);
    }
  };
  useEffect(() => {
    setTitle('Login');
    checkRememberMe();
    const token = CustomFunctions.getLocalStorage('access_token');
    if (token) {
      dispatch({ type: 'LOGIN', value: true });
      history.push('/');
    }
  }, []);

  const loginUser = async () => {
    if (remember && !CustomFunctions.checkIfEmpty(username)) {
      CustomFunctions.setLocalStorage('checkbox', remember);
      CustomFunctions.setLocalStorage('email', username);
    } else {
      CustomFunctions.removeLocalStorage('email');
      CustomFunctions.removeLocalStorage('checkbox');
    }
    const postData = {
      username,
      password,
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.loginUrl,
      postData
    );
    if (data && data.data && data.data.token && data.data.token.access_token) {
      CustomFunctions.setLocalStorage(
        'access_token',
        data.data.token.access_token
      );

      const envryptedPassword = CustomFunctions.encryptKey(
        password,
        CustomFunctions.getAESKey()
      );
      const envryptedUsername = CustomFunctions.encryptKey(
        data.data.email,
        CustomFunctions.getAESKey()
      );

      CustomFunctions.setLocalStorage(
        'access_token',
        data.data.token.access_token
      );
      CustomFunctions.setLocalStorage('email', envryptedUsername.toString());
      CustomFunctions.setLocalStorage('userId', data.data.id);
      CustomFunctions.setLocalStorage('password', envryptedPassword.toString());
      CustomFunctions.setLocalStorage('group', data.data.group);
      CustomFunctions.setLocalStorage('name', data.data.full_name);
      setDisableButton(false);

      setTimeout(async () => {
        dispatch({ type: 'LOGIN', value: true });
        window.location.href = '/';
      }, 1000);
    } else {
      setDisableButton(false);
      swal(message, '', 'error');
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      loginUser();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="login-page d-flex align-items-center justify-content-center flex-column">
        <div className="logo text-center">
          <a href="#">
            <img
              src="images/logo-black.svg"
              className="header-brand-img desktop-logo svg"
              alt="img"
            />
          </a>
        </div>
        <form
          className="login-form"
          autoComplete="off"
          onSubmit={(e) => validateForm(e)}
        >
          <div className="title text-center">
            <h1>Welcome!</h1>
          </div>
          <div className="form-group">
            <img src="images/user.svg" alt="Username" />
            <input
              className="form-control form-control-lg"
              type="email"
              name="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              maxLength="150"
            />
            {validator.current.message('Username', username, 'required', {
              className: 'text-danger',
            })}
          </div>

          <div className="form-group m-0">
            <img src="images/password.svg" alt="Username" />
            <input
              className="form-control form-control-lg"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              maxLength="128"
              minLength="1"
            />
            {validator.current.message('Password', password, 'required', {
              className: 'text-danger',
            })}
          </div>

          <div className="form-row d-flex align-items-center justify-content-between rememberme-password">
            <label className="login__rememberme">
              <input
                onChange={(e) => setRemember(e.target.checked)}
                name="remember"
                type="checkbox"
                checked={remember}
                id="remember"
                value={remember}
              />
              <span className="ms-2">Remember me</span>
            </label>
            <p className="lost_password">
              {' '}
              <a
                href="javascript:void(0)"
                onClick={() => props.history.push('/forget-password')}
              >
                Forgot password ?
              </a>
            </p>
          </div>
          <div className="text-center mt-3">
            <Button
              variant="btn btn-lg btn-primary"
              type="submit"
              className="ms-4"
              disabled={disableButton}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default withRouter(Login);
