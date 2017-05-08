import React from 'react';
import {IndexRoute, Route} from 'react-router';
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
      replace('/');
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="/block/:keys" component={Block}/>
      <Route path="/edit/:key" onEnter={requireLogin} component={EditSheet}/>
      /*
      <Route onEnter={requireLogin}>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      */

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
