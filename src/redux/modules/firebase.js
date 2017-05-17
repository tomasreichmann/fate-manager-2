import firebaseConfig from '../../../firebase-config';
import * as firebase from 'firebase';
import { Map, fromJS } from 'immutable';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseDb = firebaseApp.database();

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
    photoUrl: user.photoUrl,
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
      return state.updateIn(['sheets', 'selected', action.payload.key], (selected)=>(!selected) );
    }
    case LOGIN: {
      return state.set('loggingIn', true);
    }
    case LOGIN_SUCCESS: {
      console.log('LOGIN_SUCCESS action', action);
      return state.merge({
        loggingIn: false,
        user: action.result
      });
    }
    case LOGIN_FAIL: {
      return state.merge({
        loggingIn: false,
        user: null,
        loginError: Map(action.error),
      });
    }
    case LOGOUT: {
      return state.set('loggingOut', true);
    }
    case LOGOUT_SUCCESS: {
      return state.merge({
        loggingOut: false,
        user: null,
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

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: () => (
      firebase.auth().signInWithEmailAndPassword(email, password).then( getUser )
    )
  };
}

export function register({email, password}) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: () => (
      firebase.auth().createUserWithEmailAndPassword(email, password).then( ()=>{
        const user = getUser();
        firebaseDb.ref('users/' + user.uid).set({
          created: Date.now()
        });
      } )
    )
  };
}

export function updateDb(path, value, method = 'set') {
  const params = method !== 'remove' ? [value] : [];
  console.log('updateDb', path, value, method, params);
  firebaseDb.ref(path)[method](...params);
}

export function updateSession(path, value) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    updateDb('users/' + user.get('uid') + '/' + path, value);
  };
}

export function saveRoute(route) {
  const user = getUser();
  updateDb('users/' + user.get('uid') + '/route', route);
}

export function updateSheet(key, sheet) {
  updateDb('sheets/' + key, sheet);
}

export function discardSheetUpdates(key) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    updateDb('users/' + user.get('uid') + '/editedSheets/' + key, null, 'remove');
  };
}

export function connectSession() {
  console.log('connectSession');
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    firebaseDb.ref('users/' + user.get('uid') ).on('value', (snapshot)=>{
      dispatch({
        type: SESSION_UPDATE,
        payload: {
          session: fromJS(snapshot.val() || {})
        },
      });
    });
  };
}

export function startEditingSheet(state, key) {
  const sheetSession = state.firebase.getIn(['session', 'editedSheets', key]);
  console.log('startEditingSheet', state, key, sheetSession);
  if (!sheetSession) {
    const user = state.firebase.get('user');
    const originalSheet = state.firebase.getIn(['sheets', 'list', key]);
    console.log('no sheet session. Original sheet', originalSheet);
    firebaseDb.ref('users/' + user.get('uid') + '/editedSheets/' + key ).set(originalSheet.toJSON());
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

export function toggleSheetSelection(key) {
  return {
    type: SHEETS_TOGGLE,
    payload: {
      key
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
  console.log('connectSession');
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
