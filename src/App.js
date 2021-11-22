import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout/layout.component';
import customFunctions from './helper/customFunctions';
import Menu from './helper/menu';

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
        extractedPath !== 'password' &&
        extractedPath !== 'verify' &&
        extractedPath !== 'temporary'
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

  useEffect(() => {
    const roleId = customFunctions.getLocalStorage('group');
    const path = window.location.pathname;

    const result =
      Menu &&
      Menu.filter((role) => {
        return path === role.path;
      });

    Menu &&
      Menu.map((role) => {
        if (role.path === '#' && role.submenu && role.submenu.length > 0) {
          const subResult =
            role &&
            role.submenu.filter((sub) => {
              return path === sub.path;
            });
          if (
            subResult &&
            subResult.length > 0 &&
            !subResult[0].roleaccess.includes(Number(roleId))
          ) {
            history.push('/');
          }
        }
        return role;
      });
    if (
      result &&
      result.length > 0 &&
      result[0].submenu &&
      result[0].submenu.length === 0
    ) {
      const access = result[0].roleaccess.includes(Number(roleId));
      if (!access) {
        history.push('/');
      }
    }
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
