import { combineReducers } from 'redux';
/* import multireducer from 'multireducer'; */
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import { pagination } from 'violet-paginator';

import auth from './auth';
// import counter from './counter';
import firebase from './firebase';
import {reducer as form} from 'redux-form';
import info from './info';
import widgets from './widgets';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  firebase,
/*  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
*/
  info,
  pagination,
  widgets
});
