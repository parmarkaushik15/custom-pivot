

import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {
  DATA_ELEMENT_LOADED_ACTION, INDICATOR_GROUP_LOADED_ACTION,
  INDICATOR_LOADED_ACTION, ORGANISATION_UNIT_LOADED_ACTION, CATEGORY_OPTION_LOADED_ACTION,
  DATA_ELEMENT_GROUP_LOADED_ACTION, TOGGLE_DATA_OPTION_ACTION, DATA_SET_LOADED_ACTION, SELECT_GROUP_ACTION,
  SELECT_DATA_ACTION, SELECT_PERIOD_ACTION, SELECT_ORGANISATION_UNIT_ACTION, TOGGLE_DATA_AREA_ACTION, SET_LAYOUT_ACTION,
} from "../actions";
import {
  DATAELEMENT_KEY, ORGANISATION_UNIT_KEY, CATEGORY_COMBOS_KEY,
  INDICATOR_KEY, INDICATOR_GROUP_KEY, DATAELEMENT_GROUP_KEY, DATASET_KEY
} from "../../services/local-storage.service";


export function storeData(state: StoreData, action:Action) : StoreData {
    switch (action.type)  {

      case TOGGLE_DATA_OPTION_ACTION:
        return handleDataOptionToggleAction(state, <any>action);


      case SELECT_GROUP_ACTION:
        return handleGroupSelectionAction(state, <any>action);

      case SELECT_DATA_ACTION:
        let newStore = _.cloneDeep( state );
        newStore.selectedData = action.payload;
        return newStore;

      case SELECT_PERIOD_ACTION:
        let store = _.cloneDeep( state );
        store.selectedData = action.payload;
        return store;

      case SET_LAYOUT_ACTION:
        let layoutStore = _.cloneDeep( state );
        layoutStore.layout = action.payload;
        return layoutStore;

      case SELECT_ORGANISATION_UNIT_ACTION:
        let ouStore = _.cloneDeep( state );
        ouStore.selectedOrgUnits = action.payload;
        return ouStore;

      case DATA_ELEMENT_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, DATAELEMENT_KEY);

      case DATA_SET_LOADED_ACTION:
        return handleLoadMetaDataAction(state, <any>action, DATASET_KEY);

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


// Handling changing of data Options
function handleDataOptionToggleAction(state: StoreData, action: any ): StoreData {
  let newStore = _.cloneDeep( state );
  if(action.payload == 'all'){
    newStore.dataOptions[1].selected = false;
    newStore.dataOptions[2].selected = false;
    newStore.dataOptions[3].selected = false;
  }else{
    newStore.dataOptions[0].selected = false;
  }
  newStore.dataOptions.forEach((value) => {
    if( value['prefix'] == action.payload ){
      value['selected'] = !value['selected'];
    }
  });
  newStore.selectedGroup = {id:'all', name:'all'};
  return newStore;
}


// Handling changing of data Options
function handleGroupSelectionAction(state: StoreData, action: any ): StoreData {
  let newStore = _.cloneDeep( state );
  newStore.selectedGroup = action.payload;
  return newStore;
}

// Handling assigning initial metadata to the store
function handleLoadMetaDataAction(state: StoreData, action: any , key:string):StoreData {
  let newStore = _.cloneDeep(state);
  switch (key) {
    case DATAELEMENT_KEY:
      newStore.dataElements = action.payload;
      break;
    case DATASET_KEY:
      newStore.dataSets = action.payload;
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















