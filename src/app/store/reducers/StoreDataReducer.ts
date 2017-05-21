

import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {
  SELECT_GROUP_ACTION,
  SELECT_DATA_ACTION, SELECT_PERIOD_ACTION, SELECT_ORGANISATION_UNIT_ACTION, SET_LAYOUT_ACTION, ADD_DATA_ANALYITICS,
  ADD_EMPTY_ANALYITICS, ADD_SINGLE_EMPTY_ANALYITICS, SET_ORGANISATION_MODEL_ACTION, SET_PERIOD_TYPE_ACTION,
  SET_YEAR_ACTION, ADD_FUNCTION_MAPPING_ACTION, ADD_FUNCTIONS_ACTION, ADD_SINGLE_AUTOGROWING_ANALYITICS,
  UPDATE_TABLE_ACTION, RESET_TABLE_OBJECTS_ACTION,
} from "../actions";


export function storeData(state: StoreData, action:Action) : StoreData {
    switch (action.type)  {

      case ADD_DATA_ANALYITICS:
        return handleAddDataAnalyticsAction(state, <any>action,'with_data');

      case ADD_SINGLE_EMPTY_ANALYITICS:
        return handleAddSingleDataAnalyticsAction(state, <any>action);

      case ADD_SINGLE_AUTOGROWING_ANALYITICS:
        return handleAddSingleAutogrowingAnalyticsAction(state, <any>action);

      case SELECT_GROUP_ACTION:
        return handleGroupSelectionAction(state, <any>action);

      case SELECT_DATA_ACTION:
        let newStore = _.cloneDeep( state );
        newStore.selectedData = action.payload;
        newStore.selectedDataItems = action.payload.itemList;
        return newStore;

      case SELECT_PERIOD_ACTION:
        let store = _.cloneDeep( state );
        store.selectedPeriod = action.payload;
        return store;

      case SET_LAYOUT_ACTION:
        let layoutStore = _.cloneDeep( state );
        layoutStore.layout = action.payload;
        return layoutStore;

      case SET_ORGANISATION_MODEL_ACTION:
        let ouModelStore = _.cloneDeep( state );
        ouModelStore.orgunit_model = action.payload;
        return ouModelStore;

      case SET_PERIOD_TYPE_ACTION:
        let peStore = _.cloneDeep( state );
        peStore.selectedPeriodType = action.payload;
        return peStore;

      case SET_YEAR_ACTION:
        let yearStore = _.cloneDeep( state );
        yearStore.selectedYear = action.payload;
        return yearStore;

      case ADD_FUNCTION_MAPPING_ACTION:
        let fnmStore = _.cloneDeep( state );
        fnmStore.mapping = action.payload;
        return fnmStore;

      case ADD_FUNCTIONS_ACTION:
        let fnStore = _.cloneDeep( state );
        fnStore.functions = action.payload;
        return fnStore;

      case UPDATE_TABLE_ACTION:
        let tbStore = _.cloneDeep( state );
        tbStore.tableObject.push(action.payload);
        return tbStore;

      case RESET_TABLE_OBJECTS_ACTION:
        let reStore = _.cloneDeep( state );
        reStore.tableObject = [];
        return reStore;

      case SELECT_ORGANISATION_UNIT_ACTION:
        let ouStore = _.cloneDeep( state );
        ouStore.selectedOrgUnits = action.payload;
        return ouStore;

      default:
        return state;
    }
}

// Handling changing of data Options
function handleAddDataAnalyticsAction(state: StoreData, action: any, data_availability ): StoreData {
  let newStore = _.cloneDeep( state );
  if(data_availability == 'empty'){
    newStore.currentEmptyAnalytics = action.payload
  }else{
    newStore.currentAnalytics = action.payload
  }
  return newStore;
}

// Handling changing of data Options
function handleAddSingleDataAnalyticsAction(state: StoreData, action: any): StoreData {
  let newStore = _.cloneDeep( state );
  let analyticsExist = getIndexofAnalytics(newStore.dataAnalytics,action.payload.dataId);
  let add_item = true;
  if(analyticsExist.checker){
    if( newStore.dataAnalytics[analyticsExist.index].lastOu == newStore.selectedOrgUnits.value && newStore.dataAnalytics[analyticsExist.index].lastPe == newStore.selectedPeriod.value){
      add_item = false;
    }else{
      add_item = true;
      newStore.dataAnalytics.splice(analyticsExist.index,1)
    }
  }else{
  }
  action.payload.analytics.headers = [
    {
      name: "dx",
      column: "Data",
      valueType: "TEXT",
      type: "java.lang.String",
      hidden: false,
      meta: true
    },
    {
      name: "pe",
      column: "Period",
      valueType: "TEXT",
      type: "java.lang.String",
      hidden: false,
      meta: true
    },
    {
      name: "ou",
      column: "Organisation unit",
      valueType: "TEXT",
      type: "java.lang.String",
      hidden: false,
      meta: true
    },
    {
      name: "value",
      column: "Value",
      valueType: "NUMBER",
      type: "java.lang.Double",
      hidden: false,
      meta: false
    }
  ];
  if(add_item){
    newStore.dataAnalytics.push({
      id:action.payload.dataId,
      analytics: action.payload.analytics,
      lastOu: newStore.selectedOrgUnits.value,
      lastPe: newStore.selectedPeriod.value
    });
  }
  return newStore;
}

// Handling changing of data Options
function handleAddSingleAutogrowingAnalyticsAction(state: StoreData, action: any): StoreData {
  let newStore = _.cloneDeep( state );
  let analyticsExist = getIndexofAnalytics(newStore.autoGrowingAnalytics,action.payload.dataId);
  let add_item = true;
  if(analyticsExist.checker){
    if( newStore.autoGrowingAnalytics[analyticsExist.index].lastOu == newStore.selectedOrgUnits.value && newStore.autoGrowingAnalytics[analyticsExist.index].lastPe == newStore.selectedPeriod.value){
      add_item = false;
    }else{
      add_item = true;
      newStore.autoGrowingAnalytics.splice(analyticsExist.index,1)
    }
  }else{
  }
  if(add_item){
    newStore.autoGrowingAnalytics.push({
      id:action.payload.dataId,
      analytics: action.payload.analytics,
      lastOu: newStore.selectedOrgUnits.value,
      lastPe: newStore.selectedPeriod.value
    });
  }
  return newStore;
}


function getIndexofAnalytics(array,item){
  let checker = false;
  let index = null;
  array.forEach((value,itemIndex) => {
    if( value.id == item ){
      checker = true;
      index = itemIndex;
    }
  });
  return {checker:checker,index:index};
}

// Handling changing of data Options
function handleGroupSelectionAction(state: StoreData, action: any ): StoreData {
  let newStore = _.cloneDeep( state );
  newStore.selectedGroup = action.payload;
  return newStore;
}















