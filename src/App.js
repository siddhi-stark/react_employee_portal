import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout/layout.component';

const token = localStorage.getItem('access_token');

function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  const checkLoggedIn = () => {
    if (!token) {
      dispatch({ type: 'LOGIN', value: true });
      history.push('/login');
    } else {
      dispatch({ type: 'LOGIN', value: false });
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Routes} />
        </Switch>
      </Layout>
    </>
  );
}

export default App;
