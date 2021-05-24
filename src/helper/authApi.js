/* eslint-disable */
import httpService from '../services/HttpService';
import httpResponse from '../services/HttpResponse';

class AuthApi {
  getDataFromServer = async (endPoint) =>
    httpService
      .get(endPoint) // eslint-disable-line
      .then(
        (response) => {
          if (response.data.code === 200 || response.data.code === 201) {
            httpResponse.data = response.data;
            httpResponse.isConnected = true;
            return httpResponse;
          }
          httpResponse.data = response.data;
          httpResponse.success = false;
          httpResponse.message = response.data.error;
          return httpResponse;
        },
        (err) => {
          httpResponse.data = null;
          httpResponse.success = false;
          httpResponse.message = err && err.data && err.data.message ? err.data.message[0] : err && err.response && err.response.data && err.response.data.message ? err.response.data.message[0] : 'Something went wrong! Please try again later'; // eslint-disable-line
          return httpResponse;
        }
      );

  postDataToServer = async (endPoint, payload) =>
    httpService
      .post(endPoint, payload) // eslint-disable-line
      .then(
        (response) => {
          if (response.data.code === 200 || response.data.code === 201) {
            httpResponse.data = response.data;
            return httpResponse;
          }
          httpResponse.success = false;
          httpResponse.message = response.data.message;
          return httpResponse;
        },
        (err) => {
          httpResponse.success = false;
          httpResponse.data = null;
          httpResponse.message = err && err.data && err.data.message ? err.data.message[0] : err && err.response && err.response.data && err.response.data.message ? err.response.data.message[0] : 'Something went wrong! Please try again later'; // eslint-disable-line
          return httpResponse;
        }
      );

  putDataToServer = async (endPoint, payload) =>
    httpService
      .put(endPoint, payload) // eslint-disable-line
      .then(
        (response) => {
          if (response.data.code === 200) {
            httpResponse.data = response.data;
            return httpResponse;
          }
          httpResponse.success = false;
          httpResponse.message = response.data.message;
          return httpResponse;
        },
        (err) => {
          httpResponse.success = false;
          httpResponse.data = null;
          httpResponse.message = err && err.data && err.data.message ? err.data.message[0] : err && err.response && err.response.data && err.response.data.message ? err.response.data.message[0] : 'Something went wrong! Please try again later'; // eslint-disable-line
          return httpResponse;
        }
      );

  deleteDataFromServer = async (endPoint) =>
    httpService
      .delete(endPoint) // eslint-disable-line
      .then(
        (response) => {
          if (response.data.code === 200) {
            httpResponse.data = response.data;
            return httpResponse;
          }
          httpResponse.success = false;
          httpResponse.message = response.data.message;
          return httpResponse;
        },
        (err) => {
          httpResponse.success = false;
          httpResponse.message = err && err.data && err.data.message  ? err.data.message[0]  : err &&  err.response && err.response.data && err.response.data.message ? err.response.data.message[0] : 'Something went wrong! Please try again later'; // eslint-disable-line
          return httpResponse;
        }
      );
}

export default new AuthApi();
