import { Map, fromJS } from 'immutable';

const UPDATE = 'app/UPDATE';
const NOOP = 'app/NOOP';

const initialState = Map({
  users: Map({}),
});

export default function app(state = initialState, action = {}) {
  if ( typeof action.payload === 'function' && action.type === UPDATE ) {
    return action.payload(state, action);
  }
  return fromJS(state);
}

export function updateApp({ path, value }) {
  if ( !path ) {
    console.error('missing path');
    return {
      type: NOOP
    };
  }
  return {
    type: UPDATE,
    payload: typeof value === 'function' ? value : (state) => (state.set(path, value))
  };
}
