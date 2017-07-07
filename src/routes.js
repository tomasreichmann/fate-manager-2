import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { startEditingSheet, createNewSheet, createNewCampaign, createNewDocument, createNewView } from 'redux/modules/firebase';
import {
    App,
    Home,
    Sheets,
    CampaignOverview,
    CampaignDetail,
    DocumentDetail,
    Block,
    EditSheet,
    Login,
    Register,
    LoginSuccess,
    UserProfile,
    Views,
    View,
    ViewEdit,
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
    const key = createNewSheet(store.getState(), nextState.params.template, nextState.params.campaignKey);
    replace(null, '/sheet/' + key + '/edit');
    cb();
  };

  const initNewCampaign = (nextState, replace, cb) => {
    console.log('initNewCampaign');
    const key = createNewCampaign(store.getState());
    replace(null, '/campaign/' + key);
    cb();
  };

  const initNewDocument = (nextState, replace, cb) => {
    console.log('initNewDocument');
    const docKey = createNewDocument(store.getState(), nextState.params.campaignKey);
    replace(null, '/campaign/' + nextState.params.campaignKey + '/document/' + docKey);
    cb();
  };

  const initNewView = (nextState, replace, cb) => {
    console.log('initNewView');
    const viewKey = createNewView(store.getState());
    replace(null, '/view/' + viewKey + '/edit');
    cb();
  };

  const resolveUserId = (nextState, replace, cb) => {
    const uid = store.getState().firebase.getIn(['user', 'uid']);
    if (uid) {
      replace(null, '/user/' + uid);
    } else {
      replace(null, '/user-not-found');
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />

      <Route path="/login/:routeBeforeLogin" component={Login}/>
      <Route path="/login" component={Login}/>
      <Route path="/register/:routeBeforeLogin" component={Register}/>
      <Route path="/register" component={Register}/>

      <Route path="/campaigns" component={CampaignOverview}/>
      <Route path="/sheets" component={Sheets}/>
      <Route path="/sheet/:keys" component={Block} />
      <Route path="/views" component={Views}/>
      <Route onEnter={requireLogin}>
        <Route path="/loginSuccess" component={LoginSuccess} />
        <Route path="/registrationSuccess" component={LoginSuccess} isNewUser />
        <Route path="/sheet/new/:template" onEnter={initNewSheet} />
        <Route path="/sheet/:key/edit" onEnter={initEditSheet} component={EditSheet} />
        <Route path="/campaign/new-sheet" onEnter={initEditSheet} />
        <Route path="/campaign/new" onEnter={initNewCampaign} component={CampaignDetail}/>
        <Route path="/campaign/:campaignKey/new-sheet/:template" onEnter={initNewSheet} />
        <Route path="/campaign/:campaignKey/new-document" onEnter={initNewDocument} />
        <Route path="/campaign/:campaignKey/document/:docKey" component={DocumentDetail} />
        <Route path="/campaign/:key" component={CampaignDetail}/>
        <Route path="/user" onEnter={resolveUserId} />
        <Route path="/user/:key" component={UserProfile}/>
        <Route path="/view/new" onEnter={initNewView} />
        <Route path="/view/:key/edit" component={ViewEdit} />
        <Route path="/view/:key" component={View} />
      </Route>

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
