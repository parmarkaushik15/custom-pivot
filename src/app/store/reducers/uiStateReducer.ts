import {UiState, INITIAL_UI_STATE} from "../ui-state";
import {Action} from "@ngrx/store";
import {TOGGLE_DATA_AREA_ACTION} from "../actions";
import * as _ from "lodash"


export function uiState(state: UiState = INITIAL_UI_STATE, action: Action) : UiState {

    switch (action.type)  {

      case TOGGLE_DATA_AREA_ACTION:
        return handleDataAreaToggleAction(state);

        default:
            return state;
    }

}


function handleDataAreaToggleAction(state: UiState ): UiState {
  let newStore = _.cloneDeep( state );
  newStore.dataAreaOpen = !newStore.dataAreaOpen
  return newStore;

}











