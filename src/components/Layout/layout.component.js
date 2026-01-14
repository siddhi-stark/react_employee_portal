/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../Sidebar/sidebar.component';
import Header from '../Header/header.component';
import customFunctions from '../../helper/customFunctions';
import { useHistory } from 'react-router-dom';

function Layout(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    useSelector((state) => state.auth.isLoggedIn)
  );
  
  // Sidebar visibility state for mobile/tablet
  // Initialize based on screen size: hidden on mobile/tablet, visible on desktop
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 992;
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // On mobile/tablet: hidden by default
    // On desktop: visible by default
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 992;
    }
    return false; // Default to hidden if window is not available
  });
  
  const navigate = useHistory();
  const isOpenPage =
    navigate?.location?.pathname?.split('/')?.includes('verify') ||
    navigate?.location?.pathname?.split('/')?.includes('temporary');
  const { children } = props;
  const dispatch = useDispatch();
  
  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 992;
      setIsMobile(isMobileNow);
      
      // On desktop: always show sidebar
      // On mobile/tablet: hide sidebar by default
      if (isMobileNow) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Close sidebar when clicking outside (mobile only)
  const handleBackdropClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };
  
  // Toggle sidebar function (memoized to prevent unnecessary re-renders)
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  // Expose toggle function globally for Header component
  useEffect(() => {
    window.toggleSidebar = toggleSidebar;
    return () => {
      delete window.toggleSidebar;
    };
  }, [toggleSidebar]);
  useEffect(() => {
    document.addEventListener('Login', () => {
      dispatch({ type: 'LOGIN', value: false });
      setIsLoggedIn(false);
    });
    
    const code = customFunctions.getLocalStorage('access_token');
    if (code) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    dispatch({ type: 'LOGIN', value: false });
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <div className="admin-portal-leftright-sidebar">
          {/* Sidebar Backdrop - Mobile Only */}
          {!isOpenPage && isMobile && isSidebarOpen && (
            <div 
              className="sidebar-backdrop show"
              onClick={handleBackdropClick}
              onTouchStart={handleBackdropClick}
              aria-hidden="false"
              role="button"
              tabIndex={-1}
              aria-label="Close sidebar"
            />
          )}
          
          {!isOpenPage && (
            <Sidebar isOpen={isSidebarOpen} />
          )}

          <div className="main-content side-content pt-0">
            {!isOpenPage && (
              <Header isMobile={isMobile} />
            )}

            <div className="container-fluid">
              <section className="content-area">
                <div className="row">
                  <div className="col-xl-12" id="main-content">
                    {children}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default Layout;
