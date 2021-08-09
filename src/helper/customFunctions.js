import React, { Component } from 'react'; // eslint-disable-line
import { AES } from 'crypto-js';
import AuthApi from './authApi';

class CustomFunctions extends Component {
  getDate = (dateTime) => {
    const newdate = new Date(dateTime);
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate =
      y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d); //eslint-disable-line
    return formattedate;
  };

  getDDMMYYYYDate = (dateTime) => {
    const date = dateTime.split('/');

    const dateNew = date[2] + '/' + date[1] + '/' + date[0]; //eslint-disable-line
    return dateNew;
  };

  getTime = (time) => {
    const newDate = new Date(time);
    const h = newDate.getHours();
    const m = newDate.getMinutes();
    const formattedTime = h + ':' + m; //eslint-disable-line
    return formattedTime;
  };

  getTimeConversion = (time) => {
    const newDate = new Date(time);
    const h = newDate.getHours();
    const m = newDate.getMinutes();
    const formattedTime = h < 10 ? `0` + h : h + ':' + m < 10 ? `0` + m : m; //eslint-disable-line
    return formattedTime;
  };

  getNewTime = (dateTime) => {
    const newdate = new Date(dateTime);
    const h = newdate.getHours();
    const min = newdate.getMinutes();
    const formattedate = h + ':' + min; //eslint-disable-line
    return formattedate;
  };

  headerDate = (date) => {
    const newDate = new Date(date);
    const splitDate = newDate.split(' ');
    const formattedDate =
      splitDate[0] + ',' + splitDate[2] + splitDate[1] + ',' + splitDate[3]; //eslint-disable-line
    return formattedDate;
  };

  getDMYDate = (dateTime) => {
    const newdate = new Date(dateTime);
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate =
      (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y; //eslint-disable-line
    return formattedate;
  };

  getFormattedDate = (dateTime) => {
    const newdate = new Date(dateTime);
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate =
      (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y; //eslint-disable-line
    return formattedate;
  };

  getTimeFormatter = (dateTime) => {
    const newdate = new Date(dateTime);
    const h = newdate.getHours();
    const min = newdate.getMinutes();
    const formatTime = h + ':' + min; //eslint-disable-line
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate = (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y +       formatTime; //eslint-disable-line
    return formattedate;
  };

  getMonthDate = (dateTime) => {
    const newdate = new Date(dateTime);
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate =
      (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + '-' + y; //eslint-disable-line
    return formattedate;
  };

  getMonthDate = (dateTime) => {
    const newdate = new Date(dateTime);
    const d = newdate.getDate();
    const m = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const formattedate =
      (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + '-' + y; //eslint-disable-line
    return formattedate;
  };

  localStorageClear = () => {
    this.removeLocalStorage('access_token');
    this.removeLocalStorage('group');
    this.removeLocalStorage('userId');
    this.removeLocalStorage('quote');
  };

  clearLocalStorage = () => {
    this.removeLocalStorage('access_token');
    this.removeLocalStorage('quote');
    this.removeLocalStorage('userId');
    this.removeLocalStorage('headerDate');
    this.removeLocalStorage('name');
    this.removeLocalStorage('clockinTime');
    this.removeLocalStorage('time');
    this.removeLocalStorage('group');
    this.removeLocalStorage('TaskId');
    this.removeLocalStorage('userclockedin');
  };

  cleanStorage = () => {
    this.removeLocalStorage('access_token');
    this.removeLocalStorage('checkbox');
    this.removeLocalStorage('email');
    this.removeLocalStorage('quote');
    this.removeLocalStorage('password');
    this.removeLocalStorage('group');
    this.removeLocalStorage('userId');
  };

  setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  };

  encryptKey = (value, key) => {
    try {
      return AES.encrypt(value, key);
    } catch (error) {
      return false;
    }
  };

  getAESKey = () => {
    return 'employeePortal';
  };

  decryptKey = (value, key) => {
    try {
      return AES.decrypt(value, key);
    } catch (error) {
      return false;
    }
  };

  getLocalStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return false;
    }
  };

  removeLocalStorage = (key) => {
    try {
      if (typeof key === 'string') return localStorage.removeItem(key);

      if (typeof key === 'object') {
        key.map((item) => {
          return this.removeLocalStorage(item);
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  validateEmail = (email) => {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return emailReg.test(email);
  };

  validatePhone = (phone) => {
    var phoneformat = /^\d{10}$/; // eslint-disable-line
    return phone.match(phoneformat);
  };

  validatePrice = (price) => {
    var priceformat = /^\d{1,8}(\.\d{0,2})?$/g; // eslint-disable-line
    return price.match(priceformat);
  };

  loadScript = async (src) => {
    const ele = document.getElementById(src);
    if (ele) {
      ele.remove();
    }
    const script = document.createElement('script');
    script.id = src;
    script.src = src;
    script.type = 'text/javascript';
    script.async = false;
    await document.body.appendChild(script);
  };

  getUserData = async () => {
    try {
      const userdata = await localStorage.getItem('userdata');
      const decodedData = this.jsonParse(userdata);
      return decodedData;
    } catch (err) {
      return null;
    }
  };

  userRestrictions = (element, permittedUsers = [], isLink = false) => {
    const hasPermissions =
      permittedUsers &&
      permittedUsers.length &&
      permittedUsers.includes(this.getLocalStorage('group'));
    if (!hasPermissions) return isLink ? 'javascript:void(0)' : '';
    return element;
  };

  checkIfEmpty = (value, type = 'default') => {
    switch (type) {
      case 'A':
        return !value || (value && !value.length);
      case 'O':
        return !value || (value && !Object.keys(value).length);

      default:
        return !value;
    }
  };

  changeStatus = async (
    url,
    urlParams = {},
    type = 'put',
    successCallback = null,
    errorCallback = null
  ) => {
    try {
      if (this.checkIfEmpty(urlParams, 'O')) return false;

      const apiCall =
        type.toLowerCase() === 'put'
          ? AuthApi.putDataToServer
          : AuthApi.postDataToServer;
      const params = this.cleanObject(urlParams);
      const { data, message } = await apiCall(url, params);
      if (data && !data.success) {
        if (errorCallback) errorCallback(message);
        return data;
      }
      if (successCallback) successCallback(data);

      return data;
    } catch (e) {
      if (errorCallback) errorCallback(e);

      return e;
    }
  };

  localStorageClear = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('checkbox');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('group');
    localStorage.removeItem('userId');
  };

  cleanObject = (obj) => {
    const cleanedObject = Object.entries(obj).reduce(
      (a, [k, v]) => (v || v === false || v === 0 ? ((a[k] = v), a) : a), // eslint-disable-line
      {}
    );
    return cleanedObject;
  };

  generateUrl = (url, urlParams = {}) => {
    const searchParams = new URLSearchParams(
      this.cleanObject(urlParams)
    ).toString();
    let apiEndpoint = url;
    if (!this.checkIfEmpty(urlParams, 'O'))
      apiEndpoint = `${apiEndpoint}?${searchParams}`;
    return apiEndpoint;
  };

  validateAmount = (amount) => {
    const amountFormat = /^[1-9]\d{0,8}(((,\d{3}){1})?(\.\d{0,2})?)$/;
    return amountFormat.test(amount);
  };

  msToTime = (duration) => {
    const milliseconds = parseInt((duration % 1000) / 100, 10);
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? `${hours}` : hours;
    minutes = minutes < 10 ? `${minutes}` : minutes;
    seconds = seconds < 10 ? `${seconds}` : seconds;

    if (seconds >= 59 && milliseconds) {
      minutes = Number(minutes) + 1;
      seconds = 0;
    }
    if (Number(minutes) > 59 && (seconds || milliseconds)) {
      hours = Number(hours) + 1;
      minutes = 0;
    }

    return { hours, minutes, seconds, milliseconds };
  };

  jsonParse = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString;
    }
  };

  formatDate = (dt, seperator = '-', format = 'ymd') => {
    const dateObj = new Date(dt);
    let month = dateObj.getUTCMonth() + 1; // months from 1-12
    month = month < 10 ? `0${month}` : month;
    let day = dateObj.getDate();
    day = day < 10 ? `0${day}` : day;
    const year = dateObj.getUTCFullYear();
    let newdate;
    switch (format) {
      case 'ymd':
        newdate = year + seperator + month + seperator + day;
        break;
      case 'dmy':
        newdate = day + seperator + month + seperator + year;
        break;
      case 'mdy':
        newdate = month + seperator + day + seperator + year;
        break;
      case 'dM':
        newdate =
          day +
          seperator +
          dateObj.toLocaleString('default', { month: 'short' });
        break;
      default:
        newdate = year + seperator + month + seperator + day;
        break;
    }
    return newdate;
  };

  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':'); // eslint-disable-line

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };
}

export default new CustomFunctions();
