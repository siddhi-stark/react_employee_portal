import { combineReducers } from 'redux';
import AuthReducers from './reducers/authentication';

const adminApp = combineReducers({
  auth: AuthReducers,
});

export default adminApp;
