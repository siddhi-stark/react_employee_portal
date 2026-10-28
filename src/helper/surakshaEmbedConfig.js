/**
 * Suraksha embed bases — local vs staging. No UI; URL wiring only.
 *
 * Local (localhost / 127.0.0.1): laptop Suraksha :3000 / :3001
 * Else (e.g. http://115.160.211.220:8090): Suraksha staging :8080
 *   (REACT_APP_SURAKSHA_* from .env when set; else staging defaults)
 */
/* eslint-disable */

const STAGING_API = 'http://115.160.211.220:8080/api/v1';
const STAGING_PUBLIC = 'http://115.160.211.220:8080';
const STAGING_SDK = 'http://115.160.211.220:8080/sdk/v1/consent.js';

function isLocalHostname(hostname) {
  const h = String(hostname || '').toLowerCase();
  return h === 'localhost' || h === '127.0.0.1';
}

function stripSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

/**
 * @returns {{ apiBase: string, publicBase: string, sdkUrl: string, isLocal: boolean }}
 */
export function getSurakshaEmbedConfig() {
  const hostname =
    typeof window !== 'undefined' && window.location
      ? window.location.hostname
      : '';
  const isLocal = isLocalHostname(hostname);

  if (isLocal) {
    return {
      isLocal: true,
      apiBase: 'http://localhost:3000/api/v1',
      publicBase: 'http://localhost:3001',
      sdkUrl: 'http://localhost:3001/sdk/v1/consent.js',
    };
  }

  const apiBase = stripSlash(
    process.env.REACT_APP_SURAKSHA_API_BASE || STAGING_API
  );
  const publicBase = stripSlash(
    process.env.REACT_APP_SURAKSHA_PUBLIC_BASE || STAGING_PUBLIC
  );
  const sdkUrl =
    process.env.REACT_APP_SURAKSHA_SDK_URL ||
    `${publicBase}/sdk/v1/consent.js` ||
    STAGING_SDK;

  return { isLocal: false, apiBase, publicBase, sdkUrl };
}

/**
 * Prefer Django sso-handoff bases when on staging/remote.
 * On localhost, ALWAYS use laptop Suraksha (:3000/:3001) — local Django .env
 * often points SURAKSHA_* at staging :8080, which breaks CORS from :3002.
 */
export function resolveSurakshaBasesFromHandoff(handoff, embed) {
  const cfg = embed || getSurakshaEmbedConfig();
  if (cfg.isLocal) {
    return { apiBase: cfg.apiBase, publicBase: cfg.publicBase };
  }
  const apiBase = stripSlash(
    (handoff && handoff.surakshaApiBase) || cfg.apiBase
  );
  const publicBase = stripSlash(
    (handoff && handoff.surakshaPublicBase) || cfg.publicBase
  );
  return { apiBase, publicBase };
}

export default getSurakshaEmbedConfig;
