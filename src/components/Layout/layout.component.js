import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar/sidebar.component';
import Header from '../Header/header.component';
// import WelcomeScreen from '../WelcomScreen/WelcomeScreen.component';
// import Breadcrumb from '../Breadcrumb/breadcrumb.component';
// import RightContainer from '../RightContainer/RightContainer.component';

function Layout(props) {
  const { children } = props;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
