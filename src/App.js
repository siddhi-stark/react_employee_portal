import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout/layout.component';

const token = localStorage.getItem('access_token');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false); // eslint-disable-line

  const history = useHistory();
  const dispatch = useDispatch();
  const checkLoggedIn = () => {
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

      // return false;
    } else {
      setIsLoggedIn(true);
      dispatch({ type: 'LOGIN', value: true });
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [isLoggedIn, token]);

  useEffect(() => {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      alert('browser');

      if (e) {
        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
  }, []);

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
