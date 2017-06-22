import firebaseConfig from '../../../firebase-config';
import * as firebase from 'firebase';
import { Map, List, fromJS } from 'immutable';

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
  templates: Map({
    list: List([fromJS({
      name: 'Vesmírná Sága - postava',
      key: -1,
      aspects: {
        types: [
          {
            label: 'Main',
            value: 'main',
          },
          {
            label: 'Trouble',
            value: 'trouble',
          },
          {
            label: 'Other',
            value: 'other',
          },
        ]
      },
      skills: {
        atletika: {
          key: 'atletika',
          name: 'Atletika',
          description: 'házení věcí, úhyb',
        },
        zlodejstvi: {
          key: 'zlodejstvi',
          name: 'Zlodějství',
          description: 'např. vypáčení zámku, vykrádání kapes',
        },
        konexe: {
          key: 'konexe',
          name: 'Konexe',
          description: 'např. sehnat nocleh na jednu noc, informace, apod.',
        },
        remeslo: {
          key: 'remeslo',
          name: 'Řemeslo',
          description: 'Ušít oblečení, zpravit boty, vyrobit nábytek, upéct dort, ukovat prsten, sváření',
        },
        klamani: {
          key: 'klamani',
          name: 'Klamání',
          description: 'Lhaní, padělání',
        },
        pilotovani: {
          key: 'pilotovani',
          name: 'Pilotování',
          description: 'manévrování s pilotovanou věcí, útok naražením (může dostat zranění i útočník)',
        },
        vciteni: {
          key: 'vciteni',
          name: 'Vcítění',
          description: 'čtení emocí, motivací, vyslýchání, léčení psychických následků, svádění',
        },
        provokace: {
          key: 'provokace',
          name: 'Provokace',
          description: 'manipulace, vyprovokování agrese',
        },
        boj: {
          key: 'boj',
          name: 'Boj',
          description: 'veškerý fyzický boj',
        },
        vysetrovani: {
          key: 'vysetrovani',
          name: 'Vyšetřování',
          description: 'Zjištění hlubšího smyslu ze stop, kriminalistika',
        },
        veda: {
          key: 'veda',
          name: 'Věda',
          description: 'hlubší znalost fyziky, programování',
        },
        medicina: {
          key: 'medicina',
          name: 'Medicína',
          description: 'léčení, znalost anatomie, léčení fyzických následků',
        },
        technologie: {
          key: 'technologie',
          name: 'Technologie',
          description: 'Tvorba a oprava elektroniky, hackování',
        },
        vsimavost: {
          key: 'vsimavost',
          name: 'Všímavost',
          description: 'Pohotovost, schopnost zpozorovat skryté věci',
        },
        fyzickaZdatnost: {
          key: 'fyzickaZdatnost',
          name: 'Fyzická zdatnost',
          description: 'schopnost ustát ránu, zápasení, překonání silou',
        },
        diplomacie: {
          key: 'diplomacie',
          name: 'Diplomacie',
          description: 'vyjednávání, obchodování',
        },
        zdroje: {
          key: 'zdroje',
          name: 'Zdroje',
          description: 'schopnost získat suroviny, nebo užitečné předměty',
        },
        strelba: {
          key: 'strelba',
          name: 'Střelba',
          description: 'veškerý nekontaktní boj',
        },
        kradmost: {
          key: 'kradmost',
          name: 'Kradmost',
          description: 'Plížení, útok ze zálohy, pokládání pastí',
        },
        vule: {
          key: 'vule',
          name: 'Vůle',
          description: 'schopnost odolat psychickému útoku',
        },
        artilerie: {
          key: 'artilerie',
          name: 'Artilérie',
          description: 'používání velkých zbraní, střílení pomocí lodních systémů nebo prostřednictvím dálkového ovládání',
        },
      },
      stress: [
        {
          label: 'Fyzický stress',
          key: 'physical',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'fyzickaZdatnost',
              level: 1,
              bonus: 1
            },
            {
              skill: 'fyzickaZdatnost',
              level: 3,
              bonus: 1
            }
          ]
        },
        {
          label: 'Psychický stress',
          key: 'mental',
          defaultCount: 2,
          bonusConditions: [
            {
              skill: 'vule',
              level: 1,
              bonus: 1
            },
            {
              skill: 'vule',
              level: 3,
              bonus: 1
            }
          ]
        }
      ],
      consequences: [
        {
          label: 'Mírný',
          value: 2
        },
        {
          label: 'Střední',
          value: 4
        },
        {
          label: 'Vážný',
          value: 6,
          condition: [
            {
              skill: 'fyzickaZdatnost',
              value: 5
            },
            {
              skill: 'vule',
              value: 5
            }
          ]
        }
      ]
    })])
  }),
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
      return state.updateIn(['sheets', 'selected', action.payload.key], (selected)=>(!selected) );
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
          created: Date.now()
        });
        return user;
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

export function pushToSession(path, value) {
  return function dispatchOnSessionValue(dispatch, getState) {
    const user = getState().firebase.get('user');
    updateDb('users/' + user.get('uid') + '/' + path, value, 'push');
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
