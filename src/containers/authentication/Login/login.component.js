import React, { useEffect, useState, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';
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

  useEffect(() => {
    setTitle('Login');
    const emailLocal = CustomFunctions.getLocalStorage('email');
    const passwordLocal = CustomFunctions.getLocalStorage('password');
    if (localStorage.checkbox && localStorage.email !== '') {
      setUsername(emailLocal);
      setRemember(true);
      setPassword(passwordLocal);
    } else {
      setUsername('');
      setRemember('');
      setPassword('');
    }
    const token = CustomFunctions.getLocalStorage('access_token');
    if (token) {
      dispatch({ type: 'LOGIN', value: true });
      history.push('/');
    }
  }, [dispatch]);

  const loginUser = async () => {
    if (remember && username !== '') {
      await CustomFunctions.setLocalStorage('checkbox', remember);
      await CustomFunctions.setLocalStorage('email', username);
    } else {
      localStorage.email = '';
      localStorage.checkbox = '';
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
      await CustomFunctions.setLocalStorage(
        'access_token',
        data.data.token.access_token
      );
      await CustomFunctions.setLocalStorage(
        'access_token',
        data.data.token.access_token
      );
      await CustomFunctions.setLocalStorage('email', data.data.email);
      await CustomFunctions.setLocalStorage('userId', data.data.id);
      await CustomFunctions.setLocalStorage('password', password);
      await CustomFunctions.setLocalStorage('group', data.data.group);
      await CustomFunctions.setLocalStorage('name', data.data.full_name);
      dispatch({ type: 'LOGIN', value: true });

      setTimeout(async () => {
        setDisableButton(false);
        props.history.push('/');
        await window.location.reload();
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
