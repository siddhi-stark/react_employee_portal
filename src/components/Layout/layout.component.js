import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../Sidebar/sidebar.component';
import Header from '../Header/header.component';
import customFunctions from '../../helper/customFunctions';

function Layout(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    useSelector((state) => state.auth.isLoggedIn)
  );
  const { children } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    document.addEventListener('Login', () => {
      dispatch({ type: 'LOGIN', value: false });
      setIsLoggedIn(false);
    });
  }, [isLoggedIn]);

  const code = customFunctions.getLocalStorage('access_token');
  useEffect(() => {
    if (code) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    dispatch({ type: 'LOGIN', value: false });
  }, [code]);

  return (
    <>
      {isLoggedIn ? (
        <div className="admin-portal-leftright-sidebar">
          <Sidebar />
          <div className="main-content side-content pt-0">
            <Header />
            <div className="container-fluid">
              <section className="content-area">
                <div className="row">
                  <div className="col-xl-12" id="main-content">
                    {/* <WelcomeScreen /> */}
                    {children}
                  </div>
                  <div className="col-xl-4" id="right-sidebar">
                    {/* <RightContainer /> */}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default Layout;
