import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'LOGIN', value: false });
  }, [dispatch]);

  return (
    <>
      <div className="login-page d-flex align-items-center justify-content-center flex-column">
        <div className="logo text-center">
          <a href="#">
            <img src="images/logo-black.svg" alt="img" />
          </a>
        </div>
        <form className="login-form">
          <div className="title text-center">
            <h1>Welcome!</h1>
          </div>
          <div className="form-group">
            <img src="images/user.svg" alt="Username" />
            <input
              className="form-control form-control-lg"
              type="email"
              name="email"
              placeholder="Username"
            />
          </div>
          <div className="form-group m-0">
            <img src="images/password.svg" alt="Username" />
            <input
              className="form-control form-control-lg"
              type="password"
              name="password"
              placeholder="Password"
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
            <a href="dashboard-default.html" className="btn btn-lg btn-primary">
              Log in
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default withRouter(Login);
