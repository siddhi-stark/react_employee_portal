import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar/sidebar.component';
import Header from '../Header/header.component';

function Layout(props) {
  const { children } = props;
  // const isLoggedIn = false;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log('isLoggedIN', isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <div className="admin-portal-leftright-sidebar">
          <Sidebar />
          <div className="main-content side-content pt-0">
            <Header />
            <div className="container-fluid">{children}</div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default Layout;
