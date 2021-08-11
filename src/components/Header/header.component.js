import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';
import SharedService from '../../services/SharedService/sharedServices';

function Header() {
  const date = new Date().toDateString().split(' ');
  const formattedDate = `${date[0]}, ${date[1]} ${date[2]} ${date[3]} `;
  const [designation, setDesignation] = useState('');
  const [empId, setEmpId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [imageProfile, setImageProfile] = useState('');
  const [time, setTime] = useState('');
  const [clockedInTime, setClockInTime] = useState('');
  const [userRole, setUserRole] = useState('');
  const [notification,setNotificationData] = useState([]);
  const [notificationCount,setNotificationCount] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const event = new Event('Login', { isLogin: false });
  let token = customFunctions.getLocalStorage('access_token');

  const eventMenu = new Event('MenuChange', { isUpdated: true });

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

   const getNotificationCount = async () => {
    const endPoint = `${Api.notificationCountUrl}`;

    const {data} = await AuthApi.getDataFromServer(endPoint);
    if(data) {
      setNotificationCount(data.data.count);
    }
  };

  const getCLocTIme = () => {
    const clockTime = customFunctions.getLocalStorage('clockinTime');
    setClockInTime(clockTime);
  };

  const getClockOutTime = () => {
    const localTime = customFunctions.getLocalStorage('time');
    setTime(localTime);
  };

  useEffect(() => {
    SharedService.clockIn.subscribe((value) => {
      if (value) {
        getCLocTIme();
      }
    });

    SharedService.clockOut.subscribe((value) => {
      if (value) {
        getClockOutTime();
      }
    });

    document.addEventListener('ProfileUpdate', () => {
      getProfile();
    });

    getProfile();
    getCLocTIme();
    getClockOutTime();
    setInterval(()=>{
      getNotificationCount();
    },500000);

    const uRole = customFunctions.getLocalStorage('group');
    setUserRole(Number(uRole));
    token = customFunctions.getLocalStorage('access_token');
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

  const onMenuChange = () => {
    
    document.dispatchEvent(eventMenu);
    return true;
  };

  const onNotification = async (type) => {
    const endPoint = type === 1 ? `${Api.notificationUrl}?type=all` : `${Api.notificationUrl}?limit=${3}`;

    const {data} = await AuthApi.getDataFromServer(endPoint);
    if(data) {
      setNotificationData(data.data);
    }
  };

  const onMessageClick = async (notificatioId) => {
    const endPoint = `${Api.notificationUrl}`;

    const postData = {
     'is_read': true,
    'notifications': [notificatioId] 
    };
    const {data} = await AuthApi.putDataToServer(endPoint,postData);
    if(data && data.data.is_read) {
      getNotificationCount();

      // swal({
      //   title: data.message[0],
      //   icon: 'success',
      // })
      //   .then(okAction => {
      //     if (okAction) {
      //  props.handleModalCLose(false);
      //  props.onChanges();
      //  // customFunctions.removeLocalStorage('id');
      //  customFunctions.removeLocalStorage('hisotryID');
      //     }
      //   });
    }
  };

  return (
    <>
      <div className="main-header side-header sticky sticky-pin">
        <div className="container-fluid d-flex align-items-center justify-content-end h-100">
          <UserRestrictions permittedUsers={[2, 3, 4, 5]} roleId={userRole}>
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
          </UserRestrictions>

          <div className="main-header-right">
            <div className="day-date">
              <h5>{formattedDate}</h5>
            </div>

            <div className="profile-name-img d-flex align-items-center">
              <h6>{employeeName}</h6>
              <div className="profile-img">
                <a href="#">

                  {imageProfile ? (

                    <img
                      src={imageProfile}
                      alt="Profile" />
                  ) : <img
                    src={Api.s3UrlnoProfile}
                    alt="Edit Profile"
                  />}
                </a>
              </div>
            </div>
            
            <div className="dropdown main-header-notification"> 
              <a className="nav-link icon" href="javascript:void(0)" onClick={() => onNotification(0)}> 
                <img src="/images/notification.png" alt="notification" />
                <span className="badge badge-danger nav-link-badge">{notificationCount === 0 ? '' : notificationCount}</span> 
              </a> 
              <div className="dropdown-menu"> 
                <div className="header-navheading"> 
                  <p className="main-notification-text">You have {notificationCount} unread notification
                    <span className="badge badge-pill badge-primary ml-3" onClick={() => {onNotification(1); // eslint-disable-line
                    }} 
                    >View all</span>
                  </p>
                </div>
                <div className="main-notification-list"> 

                    { notification.map((note,i) => ( //eslint-disable-line
                      <>
                  <div className="media new"> 
                    <div className="main-img-user online">
                    {note.profile_image_url && (
                       <img alt="avatar" src={note.profile_image_url} />
                      )}

                      {!note.profile_image_url && (
                      <img alt="avatar" src="/images/5.jpg"/>
                      )}

                    </div> 
                    <div className="media-body"> 
                     <p onClick={() => {onMessageClick(note.id); onNotification(1);}} className= {note.is_read === false ? "active-media" : ''}  // eslint-disable-line
                      >
                      {note.message}</p>
                      <span>{note.time}</span> 
                    </div> 
                  </div>  
                  </>
                    )) }
                </div> 
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
                    <h5 className="main-notification-title">{employeeName || ''}</h5>

                    {
                      designation && (
                        <p className="main-notification-text" style={{ 'font-size': '13px' }}>({designation})</p>
                      )
                    }
                    {
                      empId && (
                        <UserRestrictions permittedUsers={[2, 3, 4]} roleId={userRole}>
                          <small>Employee ID {`SDMS${empId}`}</small>
                        </UserRestrictions>
                      )
                    }
                  </div>
                  <ul className="m-0 list-unstyled p-0">
                    <li>
                      <Link className="dropdown-item border-top" to="/profile" onClick={onMenuChange}>
                        <img
                          src="/images/user.svg"
                          alt="User"
                          className="svg"
                        />{' '}
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/manage-password" onClick={onMenuChange}>
                        <img
                          src="/images/change-password.svg"
                          alt="Change"
                          className="svg"
                        />{' '}
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => {
                          // customFunctions.clearLocalStorage();
                          customFunctions.onLogout();
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
