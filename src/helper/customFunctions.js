import React, { Component } from 'react'; // eslint-disable-line

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

  getTime = (time) => {
    const newDate = new Date(time);
    const h = newDate.getHours();
    const m = newDate.getMinutes();
    const formattedTime = h + ':' + m; //eslint-disable-line
    return formattedTime;
  };

  headerDate = (date) => {
    const newDate = new Date(date);
    const splitDate = newDate.split(' ');
    const formattedDate =
      splitDate[0] + ',' + splitDate[2] + splitDate[1] + ',' + splitDate[3]; //eslint-disable-line
    return formattedDate;
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
  };

  clearLocalStorage = () => {
    this.removeLocalStorage('access_token');
    this.removeLocalStorage('userId');
    this.removeLocalStorage('headerDate');
    this.removeLocalStorage('name');
    this.removeLocalStorage('clockinTime');
    this.removeLocalStorage('time');
    this.removeLocalStorage('group');
  };

  cleanStorage = () => {
    this.removeLocalStorage('access_token');
    this.removeLocalStorage('checkbox');
    this.removeLocalStorage('email');
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
        return !Object.keys(value).length;
      default:
        return !value;
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
}

export default new CustomFunctions();
