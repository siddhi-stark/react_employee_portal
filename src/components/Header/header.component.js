import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Header() {
  const date = new Date().toDateString().split(' ');
  const formattedDate = `${date[0]}, ${date[1]} ${date[2]} ${date[3]} `;
  // const formattedDate = date.toLocaleString('en-US', {
  //   weekday: 'short',
  //   day: 'numeric',
  //   year: 'numeric',
  //   month: 'long'
  // });
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      history.push('/login');
      // return false;
    } else {
      dispatch({ type: 'LOGIN', value: true });
    }
  }, []);

  return (
    <>
      <div className="main-header side-header sticky sticky-pin">
        <div className="container-fluid d-flex align-items-center justify-content-end h-100">
          <div className="main-header-left">
            <a href="" id="mainSidebarToggle">
              <span />
            </a>
          </div>
          {localStorage.getItem('clockinTime') ? (
            <div className="d-flex justify-content-end clock-in-time">
              <h7>
                You are clocked in at {localStorage.getItem('clockinTime')}{' '}
              </h7>
            </div>
          ) : (
            ''
          )}

          <div className="main-header-right">
            <div className="day-date">
              <h5>{formattedDate}</h5>
            </div>

            <div className="profile-name-img d-flex align-items-center">
              <h6>
                {localStorage.getItem('name')
                  ? localStorage.getItem('name')
                  : ''}
              </h6>
              <div className="profile-img">
                {/* <a href="#">
                  <img src="/images/profile-img.png" alt="Profile" />
                </a> */}
                <div className="dropdown-menu">
                  <div className="header-navheading text-center">
                    <h5 className="main-notification-title">Alexa John</h5>
                    <p className="main-notification-text">
                      Web & Graphic Designer
                    </p>
                    <div className="employee-id">
                      <span>Employee ID SDMS 204</span>
                    </div>
                  </div>
                  <ul className="m-0 list-unstyled p-0">
                    <li>
                      <a className="dropdown-item border-top" href="#">
                        <img
                          src="/images/user.svg"
                          alt="User"
                          className="svg"
                        />{' '}
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          src="/images/edit.svg"
                          alt="Edit"
                          className="svg"
                        />{' '}
                        Edit Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          src="/images/change-password.svg"
                          alt="Change"
                          className="svg"
                        />{' '}
                        Change Password
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          src="/images/logout-profile.svg"
                          alt="Logout"
                          className="svg"
                        />{' '}
                        Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="dropdown d-md-flex header-settings">
              <a
                href="#"
                className="nav-link icon"
                data-toggle="sidebar-right"
                data-target=".sidebar-right"
              >
                <img src="images/profile-setting.svg" alt="profile" />
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
