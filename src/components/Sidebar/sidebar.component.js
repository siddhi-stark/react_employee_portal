import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import menu from '../../helper/menu';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';
import customFunctions from '../../helper/customFunctions';

function Sidebar() {
  const history = useHistory();
  const [activeMenu, setActiveMenu] = useState(0);
  const [activeSubPath, setActiveSubPath] = useState(0);
  const onSubActiveClass = () => {
    if (activeSubPath !== window.location.pathname)
      setActiveSubPath(window.location.pathname);
  };

  useEffect(()=>{

    document.addEventListener('MenuChange', () => {
      onSubActiveClass();
    });

    document.addEventListener('ViewBtnChange', () => {
      onSubActiveClass();
    });

    document.addEventListener('ViewButtonChange', () => {
      onSubActiveClass();
      setActiveMenu();
    });
    
  },[]);

  const dispatch = useDispatch();
  const event = new Event('Login', { isLogin: false });

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
          {/* <div className="upcoming-events">
            <div className="upcoming-bg">
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img src="/images/up-coming-event.svg" alt="Upcoming event" />
                  <p>Up Coming Events</p>
                </div>
                <div className="event-title">
                  <p>SPL Cricket Tournament</p>
                </div>
                <div className="date">
                  <span>26 June, 2021</span>
                </div>
              </div>
            </div>
            <div className="upcoming-bg bg-red birthday-wishes-chart">
              <div className="upcoming-event-box">
                <div className="upcoming-event-img">
                  <img
                    src="/images/up-coming-birthday.svg"
                    alt="Upcoming event"
                  />
                  <p>Up Coming Birthdays</p>
                </div>
                <ul className="p-0 m-0 list-unstyled">
                  <li className="text-red">
                    <a href="#">
                      Kartik Shete
                      <span>18 June, 2021</span>
                    </a>
                  </li>
                  <li className="text-blue">
                    <a href="#">
                      Amit Mohol
                      <span>1 Jan, 2021</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
