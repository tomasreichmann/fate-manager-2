import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { startEditingSheet } from 'redux/modules/firebase';
import {
    App,
    Home,
    About,
    Block,
    EditSheet,
    Login,
    LoginSuccess,
    NotFound,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    const user = store.getState().firebase.get('user');
    if (!user) {
      // oops, not logged in, so can't be here!
      replace('/login');
    }
    cb();
  };

  const initEdit = (nextState, replace, cb) => {
    requireLogin(nextState, replace, cb);
    const user = store.getState().firebase.get('user');
    if (!user) {
      // oops, not logged in, so can't be here!
      replace('/login');
    } else {
      startEditingSheet(store.getState(), nextState.params.key);
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onEnter={requireLogin} />

      <Route path="/block/:keys" component={Block}/>
      <Route path="/edit/:key" onEnter={initEdit} component={EditSheet}/>
      <Route path="/login" component={Login}/>

      /*
      <Route onEnter={requireLogin}>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      <Route path="about" component={About}/>
      */

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
