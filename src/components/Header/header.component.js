import React from 'react';

function Header() {
  return (
    <>
      <div className="main-header side-header sticky sticky-pin">
        <div className="container-fluid d-flex align-items-center justify-content-between h-100">
          <div className="main-header-left">
            <a className="main-header-menu-icon" href="" id="mainSidebarToggle">
              <span />
            </a>
          </div>
          <div className="main-header-right">
            <div className="day-date">
              <h5>Thursday, 18 Jun, 2021</h5>
            </div>
            <div className="profile-name-img d-flex align-items-center">
              <h6>Alexa John</h6>
              <div className="profile-img">
                <img src="images/profile-img.png" alt="Profile" />
              </div>
            </div>
            <div className="dropdown d-md-flex header-settings">
              <a
                href="#"
                className="nav-link icon"
                data-toggle="sidebar-right"
                data-target=".sidebar-right"
              >
                <img src="images/profile-setting.svg" alt="profile" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
