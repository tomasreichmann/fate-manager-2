import React, { Component } from 'react';
import firebaseConfig from '../../../firebase-config';
import * as firebase from 'firebase';
import { Map, fromJS } from 'immutable';
import autobind from 'autobind-decorator';
import templates from './templates';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();

export function firebaseConnect(db, initialDefinitions) {
  let initialDefinitionsArray = initialDefinitions || [];
  if (!Array.isArray(initialDefinitions)) {
    initialDefinitionsArray = [initialDefinitions];
  }

  const defs = initialDefinitionsArray.map( (def) => (
    {
      once: false,
      event: 'value',
      adapter: (snapshot) => ( { [def.prop]: snapshot.val() } ),
      ...def,
    }
  ) );

  return (WrappedComponent) => {
    return class extends Component {

      constructor(props) {
        super(props);
        console.log('firebaseConnect', defs, defs.length);

        this.listeners = defs.reduce( (listenerMap, def, index) => ( {
          ...listenerMap,
          [index + '__' + def.path]: {
            ...def,
            connected: false
          }
        }), {} );


        this.dbRefs = {};

        this.state = {
          done: !defs.length,
          props: {},
        };

        console.log('WrappedComponent constructor this.listeners', this.listeners);
        console.log('WrappedComponent constructor this.checkDone()', this.checkDone());
      }

      componentWillReceiveProps(nextProps) {
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];
          const { path, pathResolver = (passPath) => (passPath), event } = listener;
          const newResolvedPath = pathResolver(path, nextProps);
          if ( newResolvedPath !== listener.resolvedPath ) {
            // unsubscribe previous connection
            listener.ref.off(event, listener.callback);
            // subscribe new connection
            this.subscribeListener(listener, newResolvedPath);
          }
        } );
      }

      componentWillMount() {
        // subscribe
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];
          const { path, pathResolver = (passPath) => (passPath) } = listener;
          const resolvedPath = pathResolver(path, this.props);
          this.subscribeListener(listener, resolvedPath);
        } );
      }

      @autobind
      subscribeListener(listener, resolvedPath) {
        const { once, event } = listener;
        listener.updated = false;
        listener.resolvedPath = resolvedPath;
        this.dbRefs[listener.resolvedPath] = this.dbRefs[listener.resolvedPath] || db.ref(listener.resolvedPath);
        listener.ref = this.dbRefs[listener.resolvedPath];
        listener.callback = this.onUpdate.bind(this, listener);
        const method = once ? 'once' : 'on';
        let subscriber = listener.ref;

        console.log('!subscribeListener listener', listener);

        if (listener.orderByChild) {
          console.log('!subscribeListener listener.orderByChild', listener.orderByChild);
          subscriber = subscriber.orderByChild(listener.orderByChild);
        } else if (listener.orderByKey) {
          subscriber = subscriber.orderByKey();
        } else if (listener.orderByValue) {
          subscriber = subscriber.orderByValue();
        }

        if (listener.limitToFirst) {
          subscriber = subscriber.limitToFirst(listener.limitToFirst);
        } else if (listener.limitToLast) {
          subscriber = subscriber.limitToLast(listener.limitToLast);
        } else if (listener.equalTo) {
          subscriber = subscriber.equalTo(listener.equalTo);
        } else if (listener.startAt || listener.endAt) {
          if (listener.startAt) {
            subscriber = subscriber.startAt(listener.startAt);
          }
          if (listener.endAt) {
            subscriber = subscriber.endAt(listener.endAt);
          }
        }

        subscriber[method](event, listener.callback);
      }

      @autobind
      checkDone() {
        let allDone = true;
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];
          allDone = allDone ? !!listener.updated : false;
        });
        return allDone;
      }

      @autobind
      onUpdate(listener, snapshot) {
        console.log('onUpdate', listener.resolvedPath, listener, snapshot);
        listener.updated = true;

        this.setState({
          done: this.checkDone(),
          props: {
            ...this.state.props,
            ...listener.adapter(snapshot, this.props, this.state.props, listener),
          },
        });
      }

      componentWillUnmount() {
        // unsubscribe
        Object.keys(this.listeners).map( (key)=>{
          const {ref, event, callback} = this.listeners[key];
          ref.off(event, callback);
        });
      }

      render() {
        const { ...props } = this.props;
        console.log('WrappedComponent render this.state.done', this.state.done);
        console.log('WrappedComponent render props', props);
        return <WrappedComponent firebaseConnectDone={this.state.done} {...props} {...this.state.props} />;
      }
    };
  };
}
export const myFirebaseConnect = firebaseConnect.bind(this, firebaseDb);

const SHEETS = 'fate-manager/firebase/SHEETS';
const SHEETS_SUCCESS = 'fate-manager/firebase/SHEETS_SUCCESS';
const SHEETS_FAIL = 'fate-manager/firebase/SHEETS_FAIL';
const SHEETS_UPDATE = 'fate-manager/firebase/SHEETS_UPDATE';
const SHEETS_TOGGLE = 'fate-manager/firebase/SHEETS_TOGGLE';
const LOGIN = 'fate-manager/firebase/LOGIN';
const LOGIN_SUCCESS = 'fate-manager/firebase/LOGIN_SUCCESS';
const LOGIN_FAIL = 'fate-manager/firebase/LOGIN_FAIL';
const REGISTER = 'fate-manager/firebase/REGISTER';
const REGISTER_SUCCESS = 'fate-manager/firebase/REGISTER_SUCCESS';
const REGISTER_FAIL = 'fate-manager/firebase/REGISTER_FAIL';
const LOGOUT = 'fate-manager/firebase/LOGOUT';
const LOGOUT_SUCCESS = 'fate-manager/firebase/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'fate-manager/firebase/LOGOUT_FAIL';
const SESSION_UPDATE = 'fate-manager/firebase/SESSION_UPDATE';

const initialUser = firebase.auth().currentUser;

export function processUser(user) {
  return user ? Map({
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    photoURL: user.photoURL,
    refreshToken: user.refreshToken,
    uid: user.uid
  }) : null;
}
const initialState = Map({
  sheets: Map({
    loaded: false,
    list: Map(),
    selected: Map(),
  }),
  templates,
  routeBeforeLogin: null,
  user: initialUser ? processUser(initialUser) : null,
  session: null,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SHEETS: {
      return state.setIn(['sheets', 'loading'], true);
    }
    case SHEETS_SUCCESS: {
      console.log('action', action);
      return state
        .mergeIn(['sheets'], {
          loading: false,
          loaded: true,
          list: action.result.val,
        })
      ;
    }
    case SHEETS_FAIL: {
      return state
        .mergeIn(['sheets'], {
          loading: false,
          loaded: false,
          error: action.error,
        })
      ;
    }
    case SHEETS_UPDATE: {
      console.log('action', action);
      return state
        .mergeIn(['sheets'], {
          loading: false,
          loaded: true,
          list: action.payload.list,
        })
      ;
    }
    case SHEETS_TOGGLE: {
      const toggleSheetKeys = Array.isArray(action.payload.keys) ? action.payload.keys : [action.payload.keys];
      return state.updateIn(['sheets', 'selected' ], (selectedKeys)=>(
        toggleSheetKeys.reduce( (updatedSelectedKeys, sheetKey) => (
          updatedSelectedKeys.update(sheetKey, (selected) => (!selected) )
        ), selectedKeys )
      ) );
    }
    case LOGIN:
    case REGISTER: {
      return state.merge({
        loggingIn: true,
        loginError: null,
        registerError: null
      });
    }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS: {
      console.log('LOGIN_SUCCESS action', action);
      return state.merge({
        loggingIn: false,
        user: action.result,
        routeBeforeLogin: action.payload.routeBeforeLogin || null
      });
    }
    case LOGIN_FAIL: {
      return state.merge({
        loggingIn: false,
        user: null,
        loginError: Map(action.error),
      });
    }
    case REGISTER_FAIL: {
      return state.merge({
        loggingIn: false,
        user: null,
        registerError: Map(action.error),
      });
    }
    case LOGOUT: {
      return state.set('loggingOut', true);
    }
    case LOGOUT_SUCCESS: {
      return state.merge({
        loggingOut: false,
        user: null,
        session: null,
        sheets: initialState.get('sheets'),
      });
    }
    case LOGOUT_FAIL: {
      return state.merge({
        loggingOut: false,
        logoutError: action.error,
      });
    }
    case SESSION_UPDATE: {
      return state.set('session', fromJS(action.payload.session) );
    }
    default:
      return state;
  }
}

export function getUserInterface() {
  return firebase.auth().currentUser;
}

export function getUser() {
  console.log('getUser', processUser(firebase.auth().currentUser));
  return processUser(firebase.auth().currentUser);
}

export function isSessionConnected(globalState) {
  return !!globalState.firebase.get('session');
}

export function isUserLoggedIn(globalState) {
  return !!globalState.firebase.get('user');
}

export function login(email, password, routeBeforeLogin) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    payload: {
      routeBeforeLogin
    },
    promise: () => (
      firebase.auth().signInWithEmailAndPassword(email, password).then( getUser )
    )
  };
}

export function register(email, password, routeBeforeLogin) {
  console.log('register1', email, password, routeBeforeLogin);
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    payload: {
      routeBeforeLogin
    },
    promise: () => (
      console.log('register2', email, password, routeBeforeLogin),
      firebase.auth().createUserWithEmailAndPassword(email, password).then( ()=>{
        const user = getUser();
        firebaseDb.ref('users/' + user.uid).set({
          created: Date.now(),
          ...user,
        });
        return user;
      } )
    )
  };
}

export function updateDb(path, value = null, method = 'set') {
  const params = method !== 'remove' ? [value] : [];
  console.log('updateDb', path, value, method, params);
  return firebaseDb.ref(path)[method](...params);
}

export function pushToDb(path, setter = ()=>(null) ) {
  console.log('pushToDb', path, setter);
  const ref = firebaseDb.ref(path);
  const key = ref.push().key;
  return ref.child(key).set( setter(key) );
}

export function updateSession(path, value) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    return updateDb('users/' + user.get('uid') + '/' + path, value);
  };
}

export function pushToSession(path, value) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    return updateDb('users/' + user.get('uid') + '/' + path, value, 'push');
  };
}

export function saveRoute(route) {
  const user = getUser();
  if (user) {
    updateDb('users/' + user.get('uid') + '/route', route);
  }
}

export function discardSheetUpdates(key) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    return updateDb('users/' + user.get('uid') + '/editedSheets/' + key, null, 'remove');
  };
}

export function connectSession() {
  console.log('connectSession');
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    return firebaseDb.ref('users/' + user.get('uid') ).on('value', (snapshot)=>{
      dispatch({
        type: SESSION_UPDATE,
        payload: {
          session: fromJS(snapshot.val() || {})
        },
      });
    });
  };
}

export function createNewSheet(state, templateKey, campaignKey) {
  console.log('createNewSheet', state, templateKey, campaignKey);
  const user = state.firebase.get('user');
  console.log('createNewSheet user', user);
  const ref = firebaseDb.ref('users/' + user.get('uid') + '/editedSheets/');
  const key = ref.push().key;
  const newSheet = Map({
    template: templateKey,
    created: Date.now(),
    createdBy: user.get('uid'),
    lastEdited: Date.now(),
    lastEditedBy: user.get('uid'),
    key,
  });
  ref.child(key).set(newSheet.toJSON());
  if (campaignKey) {
    updateDb('campaigns/' + campaignKey + '/sheetKeys/' + key, key);
  }
  return key;
}

export function createNewCampaign(state) {
  console.log('createNewCampaign', state);
  const user = state.firebase.get('user');
  console.log('createNewCampaign user', user);
  const ref = firebaseDb.ref('campaigns');
  const key = ref.push().key;
  const newCampaign = Map({
    created: Date.now(),
    createdBy: user.get('uid'),
    lastEdited: Date.now(),
    lastEditedBy: user.get('uid'),
    key,
  });
  ref.child(key).set(newCampaign.toJSON());
  return key;
}

export function createNewDocument(state, campaignKey) {
  console.log('createNewDocument', state);
  const user = state.firebase.get('user');
  const ref = firebaseDb.ref('campaigns/' + campaignKey + '/documents');
  const key = ref.push().key;
  const newDocument = Map({
    created: Date.now(),
    createdBy: user.get('uid'),
    lastEdited: Date.now(),
    lastEditedBy: user.get('uid'),
    key,
  });
  ref.child(key).set(newDocument.toJSON());
  return key;
}

export function createNewView(state) {
  console.log('createNewView', state);
  const user = state.firebase.get('user');
  const ref = firebaseDb.ref('views');
  const key = ref.push().key;
  const newView = Map({
    created: Date.now(),
    createdBy: user.get('uid'),
    lastEdited: Date.now(),
    lastEditedBy: user.get('uid'),
    key,
  });
  ref.child(key).set(newView.toJSON());
  return key;
}

export function startEditingSheet(state, key) {
  const sheetSession = state.firebase.getIn(['session', 'editedSheets', key]);
  console.log('startEditingSheet', state, key, sheetSession);
  if (!sheetSession) {
    const user = state.firebase.get('user');
    const originalSheet = state.firebase.getIn(['sheets', 'list', key]);
    console.log('no sheet session. Original sheet', originalSheet);
    if (originalSheet) {
      firebaseDb.ref('users/' + user.get('uid') + '/editedSheets/' + key ).set(originalSheet.toJSON());
    } else {
      console.log('Original sheet not found!');
    }
  }
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: ()=>(firebase.auth().signOut() )
  };
}

export function createUserData() {
  return processUser(firebase.auth().currentUser);
}

export function toggleSheetSelection(keys) {
  return {
    type: SHEETS_TOGGLE,
    payload: {
      keys
    }
  };
}

export function getSheets() {
  return {
    types: [SHEETS, SHEETS_SUCCESS, SHEETS_FAIL],
    promise: () => {
      return firebaseDb
        .ref('/sheets')
        .once('value')
        .then((snapshot) => {
          const val = fromJS(snapshot.val());
          return {
            val,
            key: snapshot.key
          };
        })
      ;
    }
  };
}

export function connectSheets() {
  console.log('connectSheets');
  return function dispatchOnSheetsValue(dispatch) {
    firebaseDb.ref('sheets/').orderByChild('name').on('value', (snapshot)=>{
      dispatch({
        type: SHEETS_UPDATE,
        payload: {
          list: fromJS(snapshot.val() || {})
        },
      });
    });
  };
}
