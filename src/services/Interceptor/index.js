import axios from 'axios';
import customFucntions from '../../helper/customFunctions';

export default {
  setupInterceptors: async () => {
    await axios.interceptors.request.use(
      async (config) => {
        const requestConfig = config;
        requestConfig.headers['Content-Type'] = 'application/json';
        const token = await localStorage.getItem('access_token');
        if (token) requestConfig.headers['Authorization'] = `Bearer ${token}`; // eslint-disable-line
        return requestConfig;
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
          await customFucntions.localStorageClear();
          window.location.href = '/login';
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response);
      }
    );
  },
};
