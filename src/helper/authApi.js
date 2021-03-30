import httpService from '../services/HttpService';
import httpResponse from '../services/HttpResponse';

class AuthApi {
  getDataFromServer = async (endPoint) =>
    httpService
      .get(endPoint) // eslint-disable-line
      .then((response) => {
        if (response.status === 200 || response.data.status === 201) {
          httpResponse.data = response.data;
          httpResponse.isConnected = true;
          return httpResponse;
        }
        httpResponse.data = response.data;
        httpResponse.success = false;
        httpResponse.message = response.data.error;
        return httpResponse;
      }, this.setErrorResponse);

  postDataToServer = async (endPoint, payload) =>
    httpService
      .post(endPoint, payload) // eslint-disable-line
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          httpResponse.data = response.data;
          httpResponse.success = true;
          return httpResponse;
        }
        httpResponse.success = false;
        httpResponse.message = response.data.message;
        return httpResponse;
      }, this.setErrorResponse);

  putDataToServer = async (endPoint, payload) =>
    httpService
      .put(endPoint, payload) // eslint-disable-line
      .then((response) => {
        if (response.status === 200) {
          httpResponse.data = response.data;
          return httpResponse;
        }
        httpResponse.success = false;
        httpResponse.message = response.data.message;
        return httpResponse;
      }, this.setErrorResponse);

  deleteDataFromServer = async (endPoint) =>
    httpService
      .delete(endPoint) // eslint-disable-line
      .then((response) => {
        if (response.status === 200) {
          httpResponse.data = response.data;
          return httpResponse;
        }
        httpResponse.success = false;
        httpResponse.message = response.data.message;
        return httpResponse;
      }, this.setErrorResponse);

  setErrorResponse = (err) => {
    httpResponse.success = false;
    httpResponse.data = null;
    httpResponse.status =
      err.response && err.response.status ? err.response.status : 400;
    httpResponse.message =
      err.response && err.response.data && err.response.data.message // eslint-disable-line
        ? typeof err.response.data.message === 'object'
          ? err.response.data.message[0] // eslint-disable-line
          : err.response.data.message // eslint-disable-line
        : 'Something went wrong! Please try again later'; // eslint-disable-line
    return httpResponse;
  };
}

export default new AuthApi();
