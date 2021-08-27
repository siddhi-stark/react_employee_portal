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

  const onSubActiveClass = () => {
    if (activeSubPath !== window.location.pathname)
      setActiveSubPath(window.location.pathname);
  };


  const getBirthday = async () => {
     const endPoint = `${Api.birthdayUrl}`;
     const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);
    if(data) {
      setBirthdayData(data.data);
    }
  }

  const getEvents = async () => {
    const endPoint = `${Api.eventsUrl}?upcoming=true/`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data) {
      console.log(data.data);
      setEvents(data.data);
    }
  }

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
    {console.log('events',events)}
    {console.log('events',birthdays)}
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
                        if (menuItem.title === 'Logout') {
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
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img src="images/up-coming-event.svg" alt="Upcoming event" />
                  <p>Upcoming Events</p>
                   <Image 
                           src="/images/redirect.png"
                           className="ms-3"
                           onClick={() => {
                             history.push('/event'); 
                             onViewEvent();
                           }}

                          />
                </div>

                {events && events.map((ev) => (
                        <>
                          <div className="event-title date">
                  <p>{ev.title}</p>
                  <span>{ev.datetime}</span>
                </div> <br />
                
                        </>
                      ))}

              </div>
            </div>

            <div className="upcoming-bg bg-red birthday-wishes-chart">
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img
                    src="/images/up-coming-birthday.svg"
                    alt="Upcoming event"
                  />
                  <p>Upcoming Birthdays</p>
                </div>

                {
                  birthdays && birthdays.map((bday) => (
                    <ul className="p-0 m-0 list-unstyled">
                  <li className="text-red">
                    <a 
                    href="#">
                     <p><span>{bday.dob}</span></p> 
                     <p className="ms-3">{bday.name}</p>
                    </a>
                  </li>
                </ul>
                    ))

                }
              </div>
            </div>
          </div> 

            </div>
          </div>

        
      </div>
    </>
  );
}

export default Sidebar;
