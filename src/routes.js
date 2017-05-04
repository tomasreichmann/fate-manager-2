import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Home,
    About,
    Block,
    Login,
    LoginSuccess,
    NotFound,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="/block/:keys" component={Block}/>
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
