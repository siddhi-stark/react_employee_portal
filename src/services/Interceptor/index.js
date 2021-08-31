import axios from 'axios';
import customFucntions from '../../helper/customFunctions';

export default {
  setupInterceptors: async () => {
    await axios.interceptors.request.use(
      async (config) => {
        // const requestConfig = config;
        // requestConfig.headers['Content-Type'] = 'application/json';

        const configuration = config;
        if (configuration.url.indexOf('upload') > -1) {
          configuration.headers['Content-Type'] = 'multipart/form-data'; // eslint-disable-line
        } else {
          configuration.headers['Content-Type'] = 'application/json'; // eslint-disable-line
        }
        const token = customFucntions.getLocalStorage('access_token');
        if (token) configuration.headers['Authorization'] = `Bearer ${token}`; // eslint-disable-line
        return configuration;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    await axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const data = await error.response;
        if (
          data &&
          (data.status === 401 || data.statusText === 'Unauthorized')
        ) {
          customFucntions.localStorageClear();
        if (window.location.pathname !== '/login') {
          localStorage.clear();
          window.location.href = '/login';
        }
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response);
      }
    );
  },
};

// const configuration = config;
// if (configuration.url.indexOf('upload') > -1) {
// configuration.headers['Content-Type'] = 'multipart/form-data'; // eslint-disable-line
// } else {
// configuration.headers['Content-Type'] = 'application/json'; // eslint-disable-line
// }