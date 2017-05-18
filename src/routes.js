import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { startEditingSheet } from 'redux/modules/firebase';
import {
    App,
    Home,
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
      const path = nextState.location.pathname;
      const pathUri = path.length > 1 ? encodeURIComponent(path) : '';
      replace('/login/' + pathUri );
    }
    cb();
  };

  const initEdit = (nextState, replace, cb) => {
    startEditingSheet(store.getState(), nextState.params.key);
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
      <Route onEnter={requireLogin}>
        <Route path="/loginSuccess" component={LoginSuccess} />
        <Route path="/block/:keys" component={Block} />
        <Route path="/edit/:key" onEnter={initEdit} component={EditSheet}/>
      </Route>

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
