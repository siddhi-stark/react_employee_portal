import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Routes from './routes';
import Layout from './components/Layout/layout.component';

function App() {
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
