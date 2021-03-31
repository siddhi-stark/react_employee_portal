// import axios from 'axios';

// export default {
//   setupInterceptors: async () => {
//     await axios.interceptors.request.use(
//       async (config) => {
//         const requestConfig = config;
//         requestConfig.headers['Content-Type'] = 'application/json';
//          requestConfig.headers['Content-Type'] = 'application/json';
//         const token = await localStorage.getItem('token');
//         if (token) requestConfig.headers['x-access-token'] = `${token}`; // eslint-disable-line
//         return requestConfig;
//       },
//       (error) => {
//         Promise.reject(error);
//       }
//     );
//     // axios.interceptors.response.use(response => response, (error) => {
//     //   console.log(error, 'interceptor errorrrr');
//     //   return Promise.reject(error.response);
//     // });
//   },
// };

import axios from 'axios';

export default {
  setupInterceptors: async () => {
    await axios.interceptors.request.use(
      async (config) => {
        const requestConfig = config;
        requestConfig.headers['Content-Type'] = 'application/json';
        const token = await localStorage.getItem('access_token');
        if (token) requestConfig.headers['Authorization'] = Bearer`${token}`; // eslint-disable-line
        return requestConfig;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    // axios.interceptors.response.use(response => response, (error) => {
    // console.log(error, 'interceptor errorrrr');
    // return Promise.reject(error.response);
    // });
  },
};
