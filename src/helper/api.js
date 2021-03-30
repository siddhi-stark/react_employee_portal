import { Component } from 'react';

export default class Api extends Component {
  static baseUrl = Api.getBaseUrl();

  static loginUrl = `${Api.baseUrl}admin/login`;

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
          'https://85brgtkdy3.execute-api.ca-central-1.amazonaws.com/dev/api/';
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
