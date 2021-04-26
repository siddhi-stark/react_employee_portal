import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput } from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';

const validator = new SimpleReactValidator();

function Login(props) {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [count, forceUpdate] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const emailLocal = localStorage.getItem('email');
    const passwordLocal = localStorage.getItem('password');
    if (localStorage.checkbox && localStorage.email !== '') {
      setUsername(emailLocal);
      setRemember(true);
      setPassword(passwordLocal);
    } else {
      setUsername('');
      setRemember('');
      setPassword('');
    }
    dispatch({ type: 'LOGIN', value: false });
    const token = localStorage.getItem('access_token');
    if (token) {
      dispatch({ type: 'LOGIN', value: true });
      history.push('/');
    }
  }, [dispatch]);

  const loginUser = async () => {
    if (remember && username !== '') {
      await localStorage.setItem('checkbox', remember);
      await localStorage.setItem('email', username);
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
      await localStorage.setItem('access_token', data.data.token.access_token);
      await localStorage.setItem('email', data.data.email);
      await localStorage.setItem('password', password);

      dispatch({ type: 'LOGIN', value: true });

      setTimeout(async () => {
        props.history.push('/');
        await window.location.reload();
      }, 1000);
    } else {
      swal(message, '', 'error');
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      loginUser();
    } else {
      validator.showMessages();
      forceUpdate(count + 1);
    }
  };

  return (
    <>
      <div className="login-page d-flex align-items-center justify-content-center flex-column">
        <div className="logo text-center">
          <a href="#">
            <img src="images/logo-black.svg" alt="img" />
          </a>
        </div>
        <Form className="login-form" autoComplete="off">
          <div className="title text-center">
            <h1>Welcome!</h1>
          </div>
          <div className="form-group">
            <img src="images/user.svg" alt="Username" />

            <TextInput
              onInputChange={(e) => setUsername(e.target.value)}
              name="username"
              inputIcon="images/user.svg"
              containerClass="form-group"
              inputClass="form-control form-control-lg"
              value={username}
              placeholder="Username"
              errorMessage={validator.message('username', username, 'required')}
            />
          </div>
          <div className="form-group m-0">
            <img src="images/password.svg" alt="Username" />
            <TextInput
              onInputChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              inputIcon="images/user.svg"
              containerClass="form-group"
              inputClass="form-control form-control-lg"
              value={password}
              placeholder="Password"
              errorMessage={validator.message('password', password, 'required')}
            />
          </div>
          <div className="form-row d-flex align-items-center justify-content-between rememberme-password">
            <Form.Label className="login__rememberme">
              <input
                onChange={(e) => setRemember(e.target.checked)}
                name="remember"
                type="checkbox"
                checked={remember}
                id="remember"
                value={remember}
              />
              <span>Remember me</span>
            </Form.Label>
            <p className="lost_password">
              {' '}
              <a href="/forget-password">Forgot password ?</a>
            </p>
          </div>
          <div className="text-center mt-3">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => submitForm(e)}
            >
              Log in
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default withRouter(Login);
