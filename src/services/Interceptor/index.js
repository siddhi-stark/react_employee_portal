import axios from 'axios';

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
  },
};
