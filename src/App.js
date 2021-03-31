import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Routes from './routes';
import Layout from './components/Layout/layout.component';

const token = localStorage.getItem('access_token');

function App() {
  const history = useHistory();

  const checkLoggedIn = () => {
    if (!token) {
      history.push('/login');
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

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
