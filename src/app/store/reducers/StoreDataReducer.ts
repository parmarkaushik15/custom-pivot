

import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {
  LOAD_META_DATA_ACTION, DATA_ELEMENT_LOADED_ACTION, INDICATOR_GROUP_LOADED_ACTION,
  INDICATOR_LOADED_ACTION, ORGANISATION_UNIT_LOADED_ACTION, CATEGORY_OPTION_LOADED_ACTION,
  DATA_ELEMENT_GROUP_LOADED_ACTION
} from "../actions";
import {stringifyElement} from "@angular/platform-browser/testing/src/browser_util";
import {
  DATAELEMENT_KEY, ORGANISATION_UNIT_KEY, CATEGORY_COMBOS_KEY,
  INDICATOR_KEY, INDICATOR_GROUP_KEY, DATAELEMENT_GROUP_KEY
} from "../../services/local-storage.service";


export function storeData(state: StoreData, action:Action) : StoreData {
    switch (action.type)  {

      case DATA_ELEMENT_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, DATAELEMENT_KEY);

      case INDICATOR_GROUP_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, INDICATOR_GROUP_KEY);

      case INDICATOR_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, INDICATOR_KEY);

      case ORGANISATION_UNIT_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, ORGANISATION_UNIT_KEY);

      case CATEGORY_OPTION_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, CATEGORY_COMBOS_KEY);

      case DATA_ELEMENT_GROUP_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, DATAELEMENT_GROUP_KEY);

        default:
            return state;
    }
}

function handleLoadMetaDataAction(state: StoreData, action: any , key:string):StoreData {
  let newStore = _.cloneDeep(state);
  switch (key) {
    case DATAELEMENT_KEY:
      newStore.dataElements = action.payload;
      break;
    case ORGANISATION_UNIT_KEY:
      newStore.organisationUnits = action.payload;
      break;
    case CATEGORY_COMBOS_KEY:
      newStore.categoryOptions = action.payload;
      break;
    case INDICATOR_KEY:
      newStore.indicators = action.payload;
      break;
    case INDICATOR_GROUP_KEY:
      newStore.indicatorGroups = action.payload;
      break;
    case DATAELEMENT_GROUP_KEY:
      newStore.dataElementGroups = action.payload;
      break;
    default:
      console.error("The key passed is not recognized");
      break;
  }
  return newStore
}


















