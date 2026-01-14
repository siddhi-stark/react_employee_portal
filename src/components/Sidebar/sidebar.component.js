/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import menu from '../../helper/menu';
import UserRestrictions from '../UserRestrictions/userrestrictions.component';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import { ModalInput } from '../FormInputs';

function Sidebar({ isOpen = false }) {
  const initialState = {
    imgURL: '',
    eventTitle: '',
    eventDescription: '',
  };
  const history = useHistory();
  const viewEvent = new Event('ViewEventButtonChange', { isUpdated: true });

  const [activeMenu, setActiveMenu] = useState(0);
  const [activeSubPath, setActiveSubPath] = useState(0);

  const [events, setEvents] = useState([]);
  const [birthdays, setBirthdayData] = useState([]);
  const [isBirthDayPresent, setIsBirthDayPresent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(initialState);

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
    if (data) {
      const bdayData = data.data;
      setBirthdayData(data.data);
      if (bdayData.length > 0) {
        setIsBirthDayPresent(
          bdayData.filter((e) => Number(e.dob) >= day).length > 0 ? true : false
        ); // eslint-disable-line
      }
      customFunctions.setLocalStorage('Employee', JSON.stringify(data.data));
    }
  };

  const getEvents = async () => {
    const endPoint = `${Api.eventsUrl}?upcoming=true&sort_by=event_time`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if (data) {
      setEvents(data.data);
    }
  };

  useEffect(() => {
    const LoginToken = customFunctions.getLocalStorage('access_token');
    
    if (LoginToken) {
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
  }, []);

  const dispatch = useDispatch();
  const event = new Event('Login', { isLogin: false });

  const onViewEvent = () => {
    document.dispatchEvent(viewEvent);
    return true;
  };

  // Determine sidebar visibility classes
  const sidebarClasses = `main-sidebar main-sidebar-sticky side-menu ps ${
    isOpen ? 'visible' : 'sidebar-hidden'
  }`;

  return (
    <>
      <div className={sidebarClasses}>
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
              
              // Check if any submenu item matches current path
              const isSubmenuActive = hasSubMenu && menuItem.submenu.some(
                (sub) => sub.path === window.location.pathname
              );
              
              // For menu items with path '#', check if activeMenu matches or submenu is active
              const isMenuActive = menuItem.path === '#' 
                ? (activeMenu === menuIndex || isSubmenuActive)
                : (window.location.pathname === menuItem.path ||
                   (window.location.pathname.includes(menuItem.path) &&
                    menuItem.path.length > 1));
              
              // Show submenu if activeMenu matches and menu has submenu
              const shouldShowSubmenu = hasSubMenu && activeMenu === menuIndex;
              
              const parentLiCls = `nav-item ${
                menuIndex === 0 || isMenuActive || shouldShowSubmenu
                  ? 'show'
                  : ''
              }`;
              const parentActiveCls =
                (activeMenu === menuIndex && (isMenuActive || hasSubMenu)) ||
                isMenuActive ||
                isSubmenuActive ||
                shouldShowSubmenu
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
                          ? '#'
                          : menuItem.path
                      }
                      onClick={(e) => {
                        if (menuItem.title === 'Log Out') {
                          // customFunctions.clearLocalStorage();
                          customFunctions.onLogout();
                          document.dispatchEvent(event);
                          dispatch({ type: 'LOGIN', value: false });
                          history.push('/login');
                        } else if (
                          menuItem.redirect !== 'undefined' &&
                          menuItem.redirect === false
                        ) {
                          // Prevent navigation for menu items with redirect: false
                          e.preventDefault();
                          // Toggle submenu: if already active, close it; otherwise, open it
                          if (hasSubMenu) {
                            setActiveMenu(activeMenu === menuIndex ? -1 : menuIndex);
                          }
                        } else {
                          setActiveMenu(menuIndex);
                        }
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
                        {menuItem.submenu.map((submenuItem, i) => {
                          return (
                            <UserRestrictions
                              permittedUsers={submenuItem.roleaccess}
                            >
                              <li
                                key={i}
                                onClick={() => {
                                  onSubActiveClass();
                                }} // eslint-disable-line
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
                {events && events.length >= 1 ? (
                  <div className="upcoming-event-box up-event ">
                    <div className="upcoming-event-img">
                      <img
                        src="/images/up-coming-event.svg"
                        alt="Upcoming event"
                      />
                      <p>Events in {n}</p>
                      <a href="/event">
                        <Image
                          src="/images/redirect.png"
                          className="ms-3 up-leaves"
                          onClick={() => {
                            onViewEvent();
                          }}
                        />
                      </a>
                    </div>

                    {events &&
                      events.map((ev, i) => (
                        <>
                          <div
                            key={i}
                            className="event-title date d-flex align-items-center"
                          >
                            <p className="bday-date">
                              <img
                                src="/images/calendar-img.png"
                                alt="Upcoming event"
                              />
                              <span>{ev.datetime}</span>
                            </p>
                            {ev.image ? (
                              <p className="ms-1">
                                <Link
                                  onClick={() => {
                                    setEventDetails({
                                      imgURL: ev.image,
                                      eventTitle: ev.title,
                                      eventDescription: ev.description,
                                    });
                                    setShowModal(true);
                                  }}
                                >
                                  {ev.title}
                                </Link>
                              </p>
                            ) : (
                              <p className="ms-1">{ev.title}</p>
                            )}
                          </div>{' '}
                          <br />
                        </>
                      ))}
                  </div>
                ) : (
                  ''
                )}
              </div>

              {isBirthDayPresent && birthdays && birthdays.length >= 1 ? (
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
                        {birthdays &&
                          birthdays.map((bday, i) => (
                            <>
                              <li key={i} className="text-red">
                                <a href="#">
                                  <>
                                    {Number(bday.dob) >= day ? (
                                      <>
                                        <p className="bday-date">
                                          <img
                                            src="/images/calendar-img.png"
                                            alt="Upcoming event"
                                          />
                                          <span>
                                            {Number(bday.dob) >= day
                                              ? bday.dob
                                              : ''}
                                          </span>
                                        </p>

                                        <p
                                          onClick={() => {
                                            // eslint-disable-line
                                            if (bday.greeting) {
                                              if (Number(bday.dob) > day)
                                                return false;
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
                                              document.dispatchEvent(
                                                BirthdayEvent
                                              );
                                            }
                                          }}
                                        >
                                          {bday.name}
                                        </p>
                                      </>
                                    ) : (
                                      ''
                                    )}
                                  </>
                                </a>
                              </li>
                            </>
                          ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalInput
        size="md"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        className="event-image-popup"
        id="contained-modal-title-center"
        modalHeaderClass="reson-text-title d-flex align-items-center"
        label={eventDetails.eventTitle}
        modalBody={
          <div className="event-img">
            <Image alt="view" src={eventDetails.imgURL} />
          </div>
        }
        modalFooter={
          eventDetails.eventDescription && (
            <span className="modal-description">
              Description: {eventDetails.eventDescription}
            </span>
          )
        }
      />
    </>
  );
}

export default Sidebar;
