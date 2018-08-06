import {UiState, INITIAL_UI_STATE} from '../ui-state';
import {Action} from '@ngrx/store';
import {
  TOGGLE_DATA_AREA_ACTION, SEND_NORMAL_DATA_LOADING_MESSAGE,
  REMOVE_NORMAL_DATA_LOADING_MESSAGE
} from '../actions';
import * as _ from 'lodash'


export function uiState(state: UiState = INITIAL_UI_STATE, action: Action): UiState {

  switch (action.type) {

    case TOGGLE_DATA_AREA_ACTION:
      return handleDataAreaToggleAction(state);

    case SEND_NORMAL_DATA_LOADING_MESSAGE:
      return handleAddingLoadingAction(state, action);

    case REMOVE_NORMAL_DATA_LOADING_MESSAGE:
      return handleRemoveLoadingAction(state, action);

    default:
      return state;
  }

}

function handleDataAreaToggleAction(state: UiState): UiState {
  const newStore = _.cloneDeep(state);
  newStore.dataAreaOpen = !newStore.dataAreaOpen;
  if (newStore.dataAreaOpen) {
    newStore.dataAreaOpenState = 'active';
  } else {
    newStore.dataAreaOpenState = 'inactive';
  }
  return newStore;

}

function handleAddingLoadingAction(state: UiState, action): UiState {
  const newStore = _.cloneDeep(state);
  newStore.loadingData = action.payload.loading;
  newStore.loadingDataMessage = action.payload.message;
  return newStore;
}

function handleRemoveLoadingAction(state: UiState, action): UiState {
  const newStore = _.cloneDeep(state);
  newStore.loadingData = false;
  return newStore;

}











