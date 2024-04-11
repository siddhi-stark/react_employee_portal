/* eslint-disable */
import axios from 'axios';
import customFucntions from '../../helper/customFunctions';

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
        const token = customFucntions.getLocalStorage('access_token');
        if (token) configuration.headers['Authorization'] = `Bearer ${token}`; // eslint-disable-line
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
          customFucntions.localStorageClear();
          if (window.location.pathname !== '/login') {
            localStorage.clear();
            // window.location.replace = '/login';
            window.location.reload();
          }
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response);
      }
    );
  },
};
