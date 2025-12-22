/* eslint-disable */
import axios from 'axios';
import customFunctions from '../../helper/customFunctions';

export default {
  setupInterceptors: async () => {
    axios.interceptors.request.use(
      async (config) => {
        // const requestConfig = config;
        // requestConfig.headers['Content-Type'] = 'application/json';

        const configuration = config;
        // if (configuration?.url?.split('/')?.includes('file-upload')) {
        //   configuration.headers['Content-Type'] = 'multipart/form-data';
        //   // Ensure that the request data is an instance of FormData for file uploads
        //   if (!(configuration.data instanceof FormData)) {
        //     const formData = new FormData();
        //     // Append your form data to formData
        //     Object.entries(configuration.data).forEach(([key, value]) => {
        //       formData.append(key, value);
        //     });
        //     configuration.data = formData;
        //   }
        // }

        if (configuration.url.indexOf('document-upload') > -1) {
          configuration.headers['Content-Type'] = 'multipart/form-data'; // eslint-disable-line
        } else if (configuration.url.indexOf('upload-document') > -1) {
          configuration.headers['Content-Type'] = 'multipart/form-data'; // eslint-disable-line
        } else {
          configuration.headers['Content-Type'] = 'application/json'; // eslint-disable-line
        }

        // const configuration = config;
        // if (configuration.url.indexOf('file') > -1) {
        //   configuration.headers['Content-Type'] = 'multipart/form-data';
        //   // Ensure that the request data is an instance of FormData for file uploads
        //   if (!(configuration.data instanceof FormData)) {
        //     const formData = new FormData();
        //     // Append your form data to formData
        //     Object.entries(configuration.data).forEach(([key, value]) => {
        //       formData.append(key, value);
        //     });
        //     configuration.data = formData;
        //   }
        // } else {
        //   configuration.headers['Content-Type'] = 'application/json';
        // }
        // Get token - try both methods to ensure we get it
        let token = customFunctions.getLocalStorage('access_token');
        if (!token || token === false) {
          token = localStorage.getItem('access_token');
        }
        if (token && typeof token === 'string' && token.trim() !== '') {
          configuration.headers['Authorization'] = `Bearer ${token}`; // eslint-disable-line
        }
        return configuration;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const data = await error.response;
        if (
          data &&
          (data.status === 401 ||
            data.status === 403 ||
            data.statusText === 'Unauthorized')
        ) {
          // Check if we're in the middle of OIDC flow (token in URL)
          const urlParams = new URLSearchParams(window.location.search);
          const urlToken = urlParams.get('token');
          const isOidcFlow = !!urlToken;
          
          // Don't clear token if we're in OIDC flow or on login page
          const isLoginPage = window.location.pathname === '/login';
          
          if (!isOidcFlow && !isLoginPage) {
            // Token is expired or invalid - clear storage and reload
            customFunctions.localStorageClear();
            localStorage.clear();
            // Redirect to login instead of reload to avoid infinite loop
            window.location.href = '/login';
          }
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response);
      }
    );
  },
};
