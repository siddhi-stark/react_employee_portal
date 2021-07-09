import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout/layout.component';
import customFunctions from './helper/customFunctions';

let token = customFunctions.getLocalStorage('access_token');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false); // eslint-disable-line

  const history = useHistory();
  const dispatch = useDispatch();
  const checkLoggedIn = () => {
    token = customFunctions.getLocalStorage('access_token');
    if (!token) {
      const path = window.location.pathname.split('/');
      const extractedPath = path.length > 1 ? path[1].toString() : '';
      if (
        extractedPath !== 'login' &&
        extractedPath !== 'forget-password' &&
        extractedPath !== 'password'
      ) {
        history.push('/login');
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(true);
      dispatch({ type: 'LOGIN', value: true });
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [isLoggedIn, token]);
  return (
    <>
      {isLoggedIn ? (
        <Layout>
          <Switch>
            <Route path="/" component={Routes} />
          </Switch>
        </Layout>
      ) : (
        ''
      )}
    </>
  );
}

export default App;
