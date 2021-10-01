import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import menu from '../../helper/menu';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function Sidebar() {
  const history = useHistory();
  const viewEvent = new Event('ViewEventButtonChange', { isUpdated: true });

  const [activeMenu, setActiveMenu] = useState(0);
  const [activeSubPath, setActiveSubPath] = useState(0);

  const [events,setEvents] = useState([]);
  const [birthdays,setBirthdayData] = useState([]);
  const [isBirthDayPresent, setIsBirthDayPresent] = useState(false);

  const BirthdayEvent = new Event('BirthdayUpdate', { isUpdated: true });

 const m_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const d = new Date();
const day = d.getDate();
const n = m_names[d.getMonth()];

  const onSubActiveClass = () => {
    if (activeSubPath !== window.location.pathname)
      setActiveSubPath(window.location.pathname);
  };

  const getBirthday = async () => {
     const endPoint = `${Api.birthdayUrl}?limit=3`;
     const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);
    if(data) {
      const bdayData = data.data;
      setBirthdayData(data.data);
      if(bdayData.length > 0) {
      setIsBirthDayPresent((bdayData.filter((e) => Number(e.dob) >= day)).length > 0 ? true : false); // eslint-disable-line
      }
      customFunctions.setLocalStorage('Employee',JSON.stringify(data.data));

    }
  };

  const getEvents = async () => {
    const endPoint = `${Api.eventsUrl}?upcoming=true&sort_by=event_time`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data) {
      setEvents(data.data);
    }
  };

  useEffect(()=>{
    const LoginToken = customFunctions.getLocalStorage('access_token');
    if(LoginToken){
      getBirthday();
      getEvents();
    }

    document.addEventListener('MenuChange', () => {
      onSubActiveClass();
    });

    document.addEventListener('ViewBtnChange', () => {
      onSubActiveClass();
    });

    document.addEventListener('ViewHolidayButtonChange', () => {
      onSubActiveClass();
      setActiveMenu();
    });

    document.addEventListener('ViewButtonChange', () => {
      onSubActiveClass();
      setActiveMenu();
    });

    document.addEventListener('ViewEventButtonChange', () => {
      onSubActiveClass();
      setActiveMenu();
    });

    document.addEventListener('ViewLeavesButtonChange', () => {
      onSubActiveClass();
      setActiveMenu();
    });
    
  },[]);

  const dispatch = useDispatch();
  const event = new Event('Login', { isLogin: false });

  const onViewEvent = () => {
  document.dispatchEvent(viewEvent);
  return true;
};

  return (
    <>
      <div className="main-sidebar main-sidebar-sticky side-menu ps">
        <div className="sidemenu-logo">
          <a className="main-logo" href="/">
            <img
              src="/images/logo.svg"
              className="header-brand-img desktop-logo svg"
              alt="logo"
            />
          </a>
        </div>
        <div className="main-sidebar-body">
          <ul className="nav">
            {menu.map((menuItem, menuIndex) => {
              const hasSubMenu =
                menuItem.submenu && menuItem.submenu.length > 0;
              const parentLiCls = `nav-item ${
                menuIndex === 0 || window.location.pathname === menuItem.path
                  ? 'show'
                  : ''
              }`;
              const parentActiveCls =
                (activeMenu === menuIndex &&
                  window.location.pathname === menuItem.path) ||
                window.location.pathname === menuItem.path ||
                (window.location.pathname.includes(menuItem.path) &&
                  menuItem.path.length > 1)
                  ? 'show active'
                  : '';

              const parentLinkCls = `nav-link ${hasSubMenu ? 'with-sub' : ''}`;
              return (
                <UserRestrictions permittedUsers={menuItem.roleaccess}>
                  <li className={`${parentLiCls} ${parentActiveCls}`}>
                    <Link
                      className={parentLinkCls}
                      to={
                        menuItem.redirect !== 'undefined' &&
                        menuItem.redirect === false
                          ? false
                          : menuItem.path
                      }
                      onClick={() => {
                        if (menuItem.title === 'Log Out') {
                          // customFunctions.clearLocalStorage();
                          customFunctions.onLogout();
                          document.dispatchEvent(event);
                          dispatch({ type: 'LOGIN', value: false });
                          history.push('/login');
                        }
                        setActiveMenu(menuIndex);
                      }}
                    >
                      <img
                        src={`/images/${menuItem.icon}`}
                        alt="Logout"
                        className="svg"
                      />
                      <span className="sidemenu-label">{menuItem.title}</span>
                    </Link>
                    
                    {hasSubMenu && (
                      <ul className="nav-sub list-unstyled">
                        {menuItem.submenu.map((submenuItem) => {
                          return (
                          <UserRestrictions
                            permittedUsers={submenuItem.roleaccess}
                          >

                           <li onClick={() => { onSubActiveClass(); }} // eslint-disable-line
                              className={`nav-sub-item ${
                                submenuItem.path === window.location.pathname
                                  ? 'show active'
                                  : ''
                              }`}
                            >
                              <Link
                                className="nav-sub-link"
                                to={submenuItem.path}
                              >
                                {submenuItem.title}
                              </Link>
                            </li>
                          </UserRestrictions>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                </UserRestrictions>
              );
            })}
          </ul>

          <div className="upcoming-events">

         <div className="upcoming-events">
            <div className="upcoming-bg">

            {events && events.length >=1 ? (

              <div className="upcoming-event-box up-event ">
                <div className="upcoming-event-img">
                  <img src="/images/up-coming-event.svg" alt="Upcoming event" />
                  <p>Events in {n}</p>
                   <Image 
                           src="/images/redirect.png"
                           className="ms-3 up-leaves"
                           onClick={() => {
                             history.push('/event'); 
                             onViewEvent();
                           }}

                          />
                </div>

                {events && events.map((ev) => (
                        <>
                          <div className="event-title date d-flex align-items-center">
                           <p className="bday-date">
                       <img src="/images/calendar-img.png"  alt="Upcoming event"/>
                       <span>{ev.datetime}</span>
                     </p> 
                            <p className="ms-1">{ev.title}</p>
                </div> <br />
                
                        </>
                      ))}

              </div>
              ) : ''}

            </div>

            {(isBirthDayPresent && birthdays && birthdays.length >= 1) ? (
              <>
            <div className="upcoming-bg bg-red birthday-wishes-chart">
              <div className="upcoming-event-box up-event">
                <div className="upcoming-event-img">
                  <img
                    src="/images/up-coming-birthday.svg"
                    alt="Upcoming event"
                  />
                  <p>Birthdays in {n}</p>
                </div>

                    <ul className="p-0 m-0 list-unstyled">
                {
                  birthdays && birthdays.map((bday) => (
                    <>
                  <li className="text-red">
                    <a 
                    href="#">
             
                      <>
                      {Number(bday.dob) >= day ? (
                        <>
                     <p className="bday-date">
                       <img src="/images/calendar-img.png"  alt="Upcoming event"/>
                       <span>{Number(bday.dob) >= day ? bday.dob : ''}</span>
                     </p>

                      <p onClick={() => { // eslint-disable-line 
                        if(bday.greeting) {
                        if(Number(bday.dob) > day) return false;
                        customFunctions.setLocalStorage(
                              'employeeId',
                              bday.id
                            );
                            customFunctions.setLocalStorage(
                              'gId',
                              bday.greeting
                            );
                            customFunctions.setLocalStorage(
                              'comment-allow',
                              bday.comment_allow
                            );
                            customFunctions.setLocalStorage(
                              'EmpID',
                              bday.id
                            );
                             customFunctions.setLocalStorage(
                            'EmpName',
                            bday.name
                          );
                      history.push('/wishes');
                      document.dispatchEvent(BirthdayEvent);
                        }

                    }}

                      >{bday.name}</p> 
                     </>
                        ) : ''}
                      </>
                    
                    </a>
                  </li>
                  </>
                    ))

                }
                </ul>     
              </div>
            </div>
              </>

              ) : ''}

          </div> 

            </div>
          </div>
      </div>
    </>
  );
}

export default Sidebar;
