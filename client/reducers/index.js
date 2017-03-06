import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { accessLevel } from './accessLevel';
import { applications } from './applications';
import { auth } from './auth';
import { block } from './block';
import { cases } from './cases';
import { connections } from './connections';
import { emailChange } from './emailChange';
import { log } from './log';
import { logs } from './logs';
import { mfa } from './mfa';
import { order } from './order';
import { orderCreate } from './orderCreate';
import { orderDelete } from './orderDelete';
import { orders } from './orders';
import { passwordChange } from './passwordChange';
import { passwordReset } from './passwordReset';
import { scripts } from './scripts';
import { settings } from './settings';
import { unblock } from './unblock';
import { user } from './user';
import { userCreate } from './userCreate';
import { userDelete } from './userDelete';
import { usernameChange } from './usernameChange';
import { users } from './users';
import { verificationEmail } from './verificationEmail';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routerReducer,
  accessLevel,
  applications,
  auth,
  block,
  cases,
  connections,
  emailChange,
  log,
  logs,
  mfa,
  order,
  orderCreate,
  orderDelete,
  orders,
  passwordChange,
  passwordReset,
  scripts,
  settings,
  unblock,
  user,
  userCreate,
  userDelete,
  usernameChange,
  users,
  verificationEmail,
  lastAction,
  form: formReducer
});
