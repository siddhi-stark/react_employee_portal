import { Component } from 'react';

export default class Api extends Component {
  static baseUrl = Api.getBaseUrl();

  static loginUrl = `${Api.baseUrl}login/`;
  
  static clockInUrl = `${Api.baseUrl}clock-in/`;

  // Get base URL of APIs
  static getBaseUrl() {
    const env = 'dev';
    let url = '';
    switch (env) {
      case 'production':
        url = '';
        break;
      // Default: development server
      default:
        url =
          'https://mvwnj2rhk7.execute-api.ap-south-1.amazonaws.com/dev/api/v1/';
        break;
    }
    return url;
  }

  environment;

  constructor(props) {
    super(props);
    this.state = {};
    this.getBaseUrl = this.getBaseUrl.bind(this);
  }
}
