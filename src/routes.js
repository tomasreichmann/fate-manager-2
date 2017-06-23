import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { startEditingSheet, createNewSheet } from 'redux/modules/firebase';
import {
    App,
    Home,
    Block,
    EditSheet,
    Login,
    Register,
    LoginSuccess,
    NotFound,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    const user = store.getState().firebase.get('user');
    if (!user) {
      const path = nextState.location.pathname;
      const pathUri = path.length > 1 ? encodeURIComponent(path) : '';
      replace('/login/' + pathUri );
    }
    cb();
  };

  const initEditSheet = (nextState, replace, cb) => {
    startEditingSheet(store.getState(), nextState.params.key);
    cb();
  };

  const initNewSheet = (nextState, replace, cb) => {
    console.log('initNewSheet');
    const key = createNewSheet(store.getState(), nextState.params.template);
    replace(null, '/edit/' + key);
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onEnter={requireLogin} />

      <Route path="/login/:routeBeforeLogin" component={Login}/>
      <Route path="/login" component={Login}/>
      <Route path="/register/:routeBeforeLogin" component={Register}/>
      <Route path="/register" component={Register}/>
      <Route onEnter={requireLogin}>
        <Route path="/loginSuccess" component={LoginSuccess} />
        <Route path="/registrationSuccess" component={LoginSuccess} isNewUser />
        <Route path="/block/:keys" component={Block} />
        <Route path="/edit/:key" onEnter={initEditSheet} component={EditSheet}/>
        <Route path="/new/:template" onEnter={initNewSheet} component={EditSheet}/>
      </Route>

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
