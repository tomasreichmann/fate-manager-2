import firebaseConfig from '../../../firebase-config';
import * as firebase from 'firebase';
import { Map, fromJS } from 'immutable';
import firebaseConnect from '../../helpers/firebaseConnect';
import firebaseConnect2 from '../../helpers/firebaseConnect2';
import templates from './templates';
import { isEmail } from '../../utils/utils';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebaseApp.database();

export const myFirebaseConnect = firebaseConnect.bind(this, firebaseDb);
export const myFirebaseConnect2 = firebaseConnect2.bind(this, firebaseDb);

const SHEETS = 'fate-manager/firebase/SHEETS';
const SHEETS_SUCCESS = 'fate-manager/firebase/SHEETS_SUCCESS';
const SHEETS_FAIL = 'fate-manager/firebase/SHEETS_FAIL';
const SHEETS_UPDATE = 'fate-manager/firebase/SHEETS_UPDATE';
const SHEETS_TOGGLE = 'fate-manager/firebase/SHEETS_TOGGLE';
const USER_UPDATE = 'fate-manager/firebase/USER_UPDATE';
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

export function processUser({
  displayName,
  email,
  emailVerified,
  isAnonymous,
  photoURL,
  refreshToken,
  uid
}) {
  return uid ? Map({
    displayName,
    email,
    emailVerified,
    isAnonymous,
    photoURL,
    refreshToken,
    uid
  }) : null;
}

export function getInitialUser() {
  return function dispatchOnGetInitialUser(dispatch) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: USER_UPDATE,
          payload: {
            user: processUser(user)
          },
        });
      }
    });
  };
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
    case USER_UPDATE: {
      return state.set('user', action.payload.user);
    }
    case REGISTER_SUCCESS: {
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
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    payload: {
      routeBeforeLogin
    },
    promise: () => (
      firebase.auth().createUserWithEmailAndPassword(email, password).then( ()=>{
        const user = getUser();
        firebaseDb.ref('users/' + user.uid).set({
          created: Date.now(),
          ...user,
          uid: user.uid,
          photoURL: 'http://i.imgur.com/VSCr50R.gif'
        });
        return user;
      } )
    )
  };
}

export function updateDb(path, value = null, method = 'set') {
  const params = method !== 'remove' ? [value] : [];
  return firebaseDb.ref(path)[method](...params);
}

export function getPushKey(path) {
  const ref = firebaseDb.ref(path);
  return ref.push().key;
}

export function pushToDb(path, setter ) {
  const ref = firebaseDb.ref(path);
  const key = getPushKey(path);
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
  const user = state.firebase.get('user');
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
  const user = state.firebase.get('user');
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
  if (!sheetSession) {
    const user = state.firebase.get('user');
    const originalSheet = state.firebase.getIn(['sheets', 'list', key]);
    if (originalSheet) {
      console.log('originalSheet.toJSON()', originalSheet.toJSON());
      const editedSheet = {
        ...originalSheet,
        stress: originalSheet.stress ? originalSheet.stress.map(stressLane => (stressLane || null)) : []
      };
      firebaseDb.ref('users/' + user.get('uid') + '/editedSheets/' + key ).set(editedSheet);
    } else {
      console.error('original sheet ' + key + ' not found');
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

export function sendResetEmail(email) {
  if (isEmail(email)) {
    return firebase.auth().sendPasswordResetEmail(email).then(() => {
      alert('Reset email has been sent.');
    }).catch((error) => {
      alert('There was a problem sening your email. ' + error);
    });
  }
  alert('Please fill in valid email');
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
