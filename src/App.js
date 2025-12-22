import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout/layout.component';
import customFunctions from './helper/customFunctions';
import Menu from './helper/menu';
import AuthApi from './helper/authApi';
import Api from './helper/api';

let token = customFunctions.getLocalStorage('access_token');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false); // eslint-disable-line
  const [profileLoaded, setProfileLoaded] = useState(false); // Track when profile is loaded

  const history = useHistory();
  const dispatch = useDispatch();

  // Handle OIDC token from URL - run immediately on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      // Store token immediately and synchronously
      localStorage.setItem('access_token', urlToken);
      customFunctions.setLocalStorage('access_token', urlToken);
      token = urlToken;
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      
      // Fetch user profile to get group/role and other user data BEFORE redirecting
      AuthApi.getDataFromServer(Api.profileUrl).then((response) => {
        if (response && response.data && response.data.data) {
          const userData = response.data.data;
          
          // Store user data (especially group/role_id for menu access)
          if (userData.id) {
            customFunctions.setLocalStorage('userId', userData.id);
          }
          // Use role_id if available, otherwise fallback to group
          const roleId = userData.role_id || userData.group;
          if (roleId) {
            customFunctions.setLocalStorage('group', roleId);
          }
          if (userData.department_id) {
            customFunctions.setLocalStorage('department', userData.department_id);
          }
          if (userData.full_name) {
            customFunctions.setLocalStorage('name', userData.full_name);
          }
          if (userData.email) {
            const encryptedEmail = customFunctions.encryptKey(
              userData.email,
              customFunctions.getAESKey()
            );
            customFunctions.setLocalStorage('email', encryptedEmail.toString());
          }
          
          // Dispatch event to notify components that profile data is loaded
          const profileUpdateEvent = new Event('ProfileUpdate');
          document.dispatchEvent(profileUpdateEvent);
          
          // Set profile loaded state to force re-render
          setProfileLoaded(true);
          
          // Set auth state AFTER profile is fetched and stored
          setIsLoggedIn(true);
          dispatch({ type: 'LOGIN', value: true });
          
          // Small delay to ensure localStorage is written and event is processed
          setTimeout(() => {
            history.push('/');
          }, 50);
        } else {
          // Still set auth state even if profile fails
          setIsLoggedIn(true);
          dispatch({ type: 'LOGIN', value: true });
          history.push('/');
        }
      }).catch(() => {
        // Still set auth state even if profile fails
        setIsLoggedIn(true);
        dispatch({ type: 'LOGIN', value: true });
        history.push('/');
      });
    }
  }, [history, dispatch]);

  const checkLoggedIn = async () => {
    token = customFunctions.getLocalStorage('access_token');
    if (!token) {
      const path = window.location.pathname.split('/');
      const extractedPath = path.length > 1 ? path[1].toString() : '';
      if (
        extractedPath !== 'login' &&
        extractedPath !== 'forget-password' &&
        extractedPath !== 'password' &&
        extractedPath !== 'verify' &&
        extractedPath !== 'temporary'
      ) {
        history.push('/login');
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(true);
      }
    } else {
      // Validate token by calling profile API
      // This ensures token is still valid (not expired)
      try {
        const response = await AuthApi.getDataFromServer(Api.profileUrl);
        if (response && response.data && response.data.data) {
          // Token is valid, update user data if needed
          const userData = response.data.data;
          
          // Update user data in localStorage (in case it changed)
          if (userData.id) {
            customFunctions.setLocalStorage('userId', userData.id);
          }
          const roleId = userData.role_id || userData.group;
          if (roleId) {
            customFunctions.setLocalStorage('group', roleId);
          }
          if (userData.department_id) {
            customFunctions.setLocalStorage('department', userData.department_id);
          }
          if (userData.full_name) {
            customFunctions.setLocalStorage('name', userData.full_name);
          }
          
          // Dispatch event to notify components that profile data is loaded
          const profileUpdateEvent = new Event('ProfileUpdate');
          document.dispatchEvent(profileUpdateEvent);
          
          setProfileLoaded(true);
          setIsLoggedIn(true);
          dispatch({ type: 'LOGIN', value: true });
        } else {
          // Profile API returned invalid response, token might be expired
          throw new Error('Invalid profile response');
        }
      } catch (error) {
        // Token is invalid or expired - clear storage and redirect to login
        customFunctions.localStorageClear();
        localStorage.clear();
        const path = window.location.pathname.split('/');
        const extractedPath = path.length > 1 ? path[1].toString() : '';
        if (
          extractedPath !== 'login' &&
          extractedPath !== 'forget-password' &&
          extractedPath !== 'password' &&
          extractedPath !== 'verify' &&
          extractedPath !== 'temporary'
        ) {
          setIsLoggedIn(false);
          dispatch({ type: 'LOGIN', value: false });
          history.push('/login');
        } else {
          setIsLoggedIn(false);
          dispatch({ type: 'LOGIN', value: false });
        }
      }
    }
  };

  useEffect(() => {
    // Only check if there's no OIDC token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (!urlToken) {
      checkLoggedIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const roleId = customFunctions.getLocalStorage('group');
    const path = window.location.pathname;

    const result =
      Menu &&
      Menu.filter((role) => {
        return path === role.path;
      });

    Menu &&
      Menu.map((role) => {
        if (role.path === '#' && role.submenu && role.submenu.length > 0) {
          const subResult =
            role &&
            role.submenu.filter((sub) => {
              return path === sub.path;
            });
          if (
            subResult &&
            subResult.length > 0 &&
            !subResult[0].roleaccess.includes(Number(roleId))
          ) {
            history.push('/');
          }
        }
        return role;
      });
    if (
      result &&
      result.length > 0 &&
      result[0].submenu &&
      result[0].submenu.length === 0
    ) {
      const access = result[0].roleaccess.includes(Number(roleId));
      if (!access) {
        history.push('/');
      }
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Layout key={profileLoaded ? 'profile-loaded' : 'profile-loading'}>
          <Switch>
            <Route path="/" component={Routes} />
          </Switch>
        </Layout>
      ) : (
        ''
      )}
    </>
  );
}

export default App;
