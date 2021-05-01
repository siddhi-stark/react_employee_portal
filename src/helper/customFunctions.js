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
    // script.type = "text/babel";
    // script.type = "text/jsx";
    //  document.getElementsByClassName("wrapper")[0].appendChild(script);
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

  validateAmount = (amount) => {
    const amountFormat = /^[1-9]\d{0,8}(((,\d{3}){1})?(\.\d{0,2})?)$/;
    return amountFormat.test(amount);
  };
}

export default new CustomFunctions();
