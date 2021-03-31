import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput } from '../../../components/FormInputs';
import AuthApi from '../../../helper/authApi';
import Api from '../../../helper/api';

const validator = new SimpleReactValidator();

function Login(props) {
  const initialState = {
    email: '',
    password: '',
  };
  const [userData, setUserData] = useState(initialState);
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

  const loginUser = async () => {
    const payload = {
      username: userData.email,
      password: userData.password,
    };

    const { data, message } = await AuthApi.postDataToServer(
      Api.loginUrl,
      payload
    );

    console.log('data', data);
    if (data && data.data && data.data.token && data.data.token.access_token) {
      await localStorage.setItem('access_token', data.data.token.access_token);
      await localStorage.setItem('email', data.data.email);

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
        <Form className="login-form">
          <div className="title text-center">
            <h1>Welcome!</h1>
          </div>
          <div className="form-group">
            <img src="images/user.svg" alt="Username" />

            <TextInput
              onInputChange={(e) => handleInputChange(e)}
              name="email"
              inputIcon="images/user.svg"
              containerClass="form-group"
              inputClass="form-control form-control-lg"
              value={userData.email}
              placeholder="Username"
              errorMessage={validator.message(
                'email',
                userData.email,
                'required|name'
              )}
            />
          </div>
          <div className="form-group m-0">
            <img src="images/password.svg" alt="Username" />
            <TextInput
              onInputChange={(e) => handleInputChange(e)}
              name="password"
              inputIcon="images/user.svg"
              containerClass="form-group"
              inputClass="form-control form-control-lg"
              value={userData.password}
              placeholder="Username"
              errorMessage={validator.message(
                'password',
                userData.password,
                'required|name'
              )}
            />
          </div>
          <div className="form-row d-flex align-items-center justify-content-between rememberme-password">
            <label className="login__rememberme">
              <input
                name="rememberme"
                type="checkbox"
                id="rememberme"
                value="forever"
              />
              <span>Remember me</span>
            </label>
            <p className="lost_password">
              {' '}
              <a href="#">Forgot password ?</a>
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
