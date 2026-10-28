/* eslint-disable */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../Sidebar/sidebar.component';
import Header from '../Header/header.component';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import {
  getSurakshaEmbedConfig,
  resolveSurakshaBasesFromHandoff,
} from '../../helper/surakshaEmbedConfig';
import { useHistory } from 'react-router-dom';

// Suraksha purpose code (employee_medical_records is NOT published — 404 on resolve).
const SURAKSHA_MEDICAL_PURPOSE = 'stark_wellness.medical.record';
// Module-level in-flight lock — Layout remount must not stack a 2nd widget.
// Already-granted is handled by SDK skipPrompt (not sessionStorage).
let medicalConsentInFlight = false;

function removeSurakshaConsentWidgets() {
  if (typeof document === 'undefined') return;
  const nodes = document.querySelectorAll('suraksha-consent');
  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i].parentNode && nodes[i].parentNode.removeChild(nodes[i]);
  }
}

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

  // employee_medical_records on dashboard / app shell (not My Interviews — AI Screening there).
  const medicalOpenedRef = useRef(false);
  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const path = navigate?.location?.pathname || '';
    if (path.indexOf('interview-listing') !== -1) return undefined;

    // Claim lock synchronously — before any await — so a remount cannot start a 2nd init.
    if (medicalOpenedRef.current || medicalConsentInFlight) return undefined;
    medicalOpenedRef.current = true;
    medicalConsentInFlight = true;

    const access = customFunctions.getLocalStorage('access_token');
    if (!access) {
      medicalOpenedRef.current = false;
      medicalConsentInFlight = false;
      return undefined;
    }

    let cancelled = false;

    (async function openMedicalRecordsNotice() {
      try {
        // Staging Suraksha when EMP is not on localhost; .env REACT_APP_SURAKSHA_* on staging.
        const embed = getSurakshaEmbedConfig();
        const stagingApi = 'http://115.160.211.220:8080/api/v1';
        const stagingPublic = 'http://115.160.211.220:8080';
        // EMP staging / production must hit Suraksha staging (not laptop :3000).
        const apiBase = embed.isLocal ? stagingApi : embed.apiBase;
        const receiptVerifyBase = embed.isLocal ? stagingPublic : embed.publicBase;

        let tries = 0;
        while (
          !(window.SurakshaConsentSDK && typeof window.SurakshaConsentSDK.init === 'function') &&
          tries < 50
        ) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(function (r) { setTimeout(r, 100); });
          tries += 1;
        }
        if (cancelled) return;
        const SDK = window.SurakshaConsentSDK;
        if (!SDK || typeof SDK.init !== 'function') {
          console.warn('[Suraksha] SDK not loaded — medical records skipped');
          return;
        }

        // Logged-in principal token via portal SSO handoff → Suraksha exchange
        let principalToken = null;
        try {
          const portalApi2 = String(Api.baseUrl || 'http://127.0.0.1:8000/api/v1/').replace(
            /\/api\/v1\/?$/,
            '/api2/'
          );
          const hRes = await fetch(portalApi2 + 'consent/sso-handoff', {
            headers: { Authorization: 'Bearer ' + access },
          });
          if (hRes.ok) {
            const h = await hRes.json();
            const bases = resolveSurakshaBasesFromHandoff(h, {
              isLocal: false,
              apiBase: apiBase,
              publicBase: receiptVerifyBase,
            });
            const exRes = await fetch(bases.apiBase + '/citizen/auth/sso/exchange', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ handoff: h.handoff }),
            });
            if (exRes.ok) {
              const ex = await exRes.json();
              principalToken = ex.token || null;
            }
          }
        } catch (ssoErr) {
          console.warn('[Suraksha] medical SSO skipped', ssoErr);
        }
        if (cancelled) return;
        // Logged-in embed MUST have a principal token — without it the SDK shows email OTP.
        if (!principalToken) {
          throw new Error(
            'SSO exchange failed — no principal token (OTP would appear for anonymous users)'
          );
        }

        const r = await fetch(
          apiBase +
            '/consent/sdk/resolve?tenant=stark&purpose=' +
            encodeURIComponent(SURAKSHA_MEDICAL_PURPOSE)
        );
        if (!r.ok) throw new Error('resolve ' + r.status);
        const resolved = await r.json();
        const purposeVersionId =
          resolved.purposeVersionId ||
          (resolved.data && resolved.data.purposeVersionId);
        if (!purposeVersionId) {
          throw new Error('missing purposeVersionId for ' + SURAKSHA_MEDICAL_PURPOSE);
        }
        if (cancelled) return;

        // Never stack widgets — prior race left receipt on top of a 2nd notice.
        removeSurakshaConsentWidgets();
        console.log('[Suraksha] opening medical record notice (logged-in)', SURAKSHA_MEDICAL_PURPOSE, purposeVersionId);
        SDK.init({
          purposeVersionId: purposeVersionId,
          purposeCode: resolved.purposeCode || SURAKSHA_MEDICAL_PURPOSE,
          allowedOrigins: [
            window.location.origin,
            'http://localhost:3002',
            'http://115.160.211.220:8090',
          ],
          apiBase: apiBase,
          receiptVerifyBase: receiptVerifyBase,
          locale: 'mr-IN',
          principalToken: principalToken,
          fiduciaryNameEn: resolved.fiduciaryNameEn || undefined,
          fiduciaryNameMr: resolved.fiduciaryNameMr || undefined,
          fiduciaryCrest: resolved.fiduciaryCrest || undefined,
          logoUrl: resolved.logoUrl || undefined,
        });
        medicalConsentInFlight = false;
      } catch (e) {
        console.error('[Suraksha] medical record consent failed', e);
        // Allow a retry on next navigation if we never mounted a widget.
        medicalOpenedRef.current = false;
        medicalConsentInFlight = false;
      }
    })();

    return function cleanup() {
      cancelled = true;
      // Do NOT clear medicalOpenedRef here — Strict Mode cleanup would re-open a 2nd notice.
    };
  }, [isLoggedIn, navigate?.location?.pathname]);

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
