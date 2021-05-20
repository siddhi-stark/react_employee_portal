import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function Header() {
  const date = new Date().toDateString().split(' ');
  const formattedDate = `${date[0]}, ${date[1]} ${date[2]} ${date[3]} `;
  const [designation, setDesignation] = useState('');
  const [empId, setEmpId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [imageProfile, setImageProfile] = useState('');
  const [time, setTime] = useState('');
  const [clockedInTime, setClockInTime] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const event = new Event('Login', { isLogin: false });
  const token = customFunctions.getLocalStorage('access_token');

  const getProfile = async () => {
    const userToken = customFunctions.getLocalStorage('access_token');
    if (!userToken) return false;

    const { data } = await AuthApi.getDataFromServer(`${Api.profileUrl}`);

    if (data && data.data) {
      setDesignation(data.data.designation_name);
      setEmpId(data.data.emp_code);
      setEmployeeName(data.data.full_name);
      setImageProfile(data.data.profile_image_url);
    }
    return true;
  };

  const getCLocTIme = () => {
    const clockTime = customFunctions.getLocalStorage('clockinTime');
    setClockInTime(clockTime);
  };

  useEffect(() => {
    document.addEventListener('ProfileUpdate', () => {
      getProfile();
    });

    document.addEventListener('TimeUpdate', () => {
      getCLocTIme();
    });

    getProfile();
    getCLocTIme();
    const localTime = customFunctions.getLocalStorage('time');
    setTime(localTime);

    if (!token) {
      const path = window.location.pathname.split('/');
      const extractedPath = path.length > 1 ? path[1].toString() : '';
      if (
        extractedPath !== 'login' &&
        extractedPath !== 'forget-password' &&
        extractedPath !== 'password'
      ) {
        history.push('/login');
      }
    } else {
      dispatch({ type: 'LOGIN', value: true });
    }
  }, []);

  return (
    <>
      <div className="main-header side-header sticky sticky-pin">
        <div className="container-fluid d-flex align-items-center justify-content-end h-100">
          <div className="main-header-left">
            {time ? (
              <div className="d-flex justify-content-start clock-in-time">
                <h7>You are clocked out at {time} </h7>
              </div>
            ) : (
              ''
            )}
          </div>
          {clockedInTime ? (
            <div className="d-flex justify-content-end clock-in-time">
              <h7>You are clocked in at {clockedInTime} </h7>
            </div>
          ) : (
            ''
          )}

          <div className="main-header-right">
            <div className="day-date">
              <h5>{formattedDate}</h5>
            </div>

            <div className="profile-name-img d-flex align-items-center">
              <h6>{employeeName}</h6>
              <div className="profile-img">
                <a href="#">
                  <img src={imageProfile} alt="Profile" />
                </a>
              </div>
            </div>
            <div className="dropdown d-md-flex header-settings">
              <a
                href="#"
                className="nav-link icon"
                data-toggle="sidebar-right"
                data-target=".sidebar-right"
              >
                <img src="/images/profile-setting.svg" alt="profile" />
              </a>

              <div className="main-header-menu-icon">
                <div className="dropdown-menu">
                  <div className="header-navheading text-center">
                    <h5 className="main-notification-title">{employeeName}</h5>

                    <p className="main-notification-text">{designation}</p>
                    <small>Employee ID {empId}</small>
                  </div>
                  <ul className="m-0 list-unstyled p-0">
                    <li>
                      <a className="dropdown-item border-top" href="/profile">
                        <img
                          src="/images/user.svg"
                          alt="User"
                          className="svg"
                        />{' '}
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/manage-password">
                        <img
                          src="/images/change-password.svg"
                          alt="Change"
                          className="svg"
                        />{' '}
                        Change Password
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => {
                          customFunctions.cleanStorage();
                          document.dispatchEvent(event);
                          dispatch({ type: 'LOGIN', value: false });
                          history.push('/login');
                        }}
                      >
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
