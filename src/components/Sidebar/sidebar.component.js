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

// const time = new Date();
// console.log(
//   time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
// ); 


  const onSubActiveClass = () => {
    if (activeSubPath !== window.location.pathname)
      setActiveSubPath(window.location.pathname);
  };


  const getBirthday = async () => {
     const endPoint = `${Api.birthdayUrl}?limit=3`;
     const url = customFunctions.generateUrl(endPoint);
    const { data } = await AuthApi.getDataFromServer(url);
    if(data) {
      setBirthdayData(data.data);
      customFunctions.setLocalStorage('Employee',JSON.stringify(data.data));

    }
  }

  const getEvents = async () => {
    const endPoint = `${Api.eventsUrl}?upcoming=true&sort_by=event_time`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data) {
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

// function formatAMPM(date) {
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const ampm = hours >= 12 ? 'pm' : 'am';
//   const hoursNew = hours % 12; // eslint-disable-line
//   const hoursN = hoursNew ? hoursNew : 12; //  eslint-disable-line
//   const minutesN = minutes < 10 ? '0'+minutes : minutes; //  eslint-disable-line
//   const strTime = hoursN + ':' + minutesN + ' ' + ampm; //  eslint-disable-line
//   return strTime;
// }

// console.log(formatAMPM(new Date));


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
                  <p>Events In {n}</p>
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

            {birthdays && birthdays.length >= 1 ? (

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
                        {console.log('UserId',bday.id)}
                      {Number(bday.dob) >= day ? (
                        <>
                     <p className="bday-date">
                       <img src="/images/calendar-img.png"  alt="Upcoming event"/>
                       <span>{Number(bday.dob) >= day ? bday.dob : ''}</span>
                     </p>

                      <p onClick={() => { // eslint-disable-line 
                      customFunctions.setLocalStorage('employeeId',bday.id); // eslint-disable-line 
                      customFunctions.setLocalStorage('gId',bday.greeting); // eslint-disable-line 
                      history.push('/birthday-wishes')
                      console.log('gId',Number(bday.dob),day);
                      Number(bday.dob) > day ? '' : history.push('/birthday-wishes') // eslint-disable-line 
                      document.dispatchEvent(BirthdayEvent);

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
              ) : ''}

          </div> 

            </div>
          </div>

        
      </div>
    </>
  );
}

export default Sidebar;

 // <p onClick={() => {customFunctions.setLocalStorage('employeeId',bday.id); history.push('/birthday-wishes')}} // eslint-disable-line 
 //                      >{bday.name}</p> 