const OPEN = 'modal/OPEN';
const CLOSE = 'modal/CLOSE';
const UPDATE = 'modal/UPDATE';

const initialState = {
  isOpen: false
};

export default function modal(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN: {
      return {
        ...state,
        isOpen: true,
        ...action.payload || {}
      };
    }
    case UPDATE: {
      return {
        ...action.payload
      };
    }
    case CLOSE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export function isOpen(globalState) {
  return globalState.modal && globalState.modal.isOpen;
}

export function openModal(props) {
  return {
    type: OPEN,
    payload: props
  };
}

export function updateModal(props) {
  return {
    type: UPDATE,
    payload: props
  };
}

export function closeModal() {
  return {
    type: CLOSE
  };
}
