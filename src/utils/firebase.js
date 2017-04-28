import firebaseConfig from '../../firebase-config';
import * as firebase from 'firebase';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export function getDb() {
  return firebaseApp.database();
}

export default getDb;
