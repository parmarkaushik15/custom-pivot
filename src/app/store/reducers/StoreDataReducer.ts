

import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {
  SELECT_GROUP_ACTION,
  SELECT_DATA_ACTION, SELECT_PERIOD_ACTION, SELECT_ORGANISATION_UNIT_ACTION, SET_LAYOUT_ACTION, ADD_DATA_ANALYITICS,
  ADD_EMPTY_ANALYITICS, ADD_SINGLE_EMPTY_ANALYITICS,
} from "../actions";


export function storeData(state: StoreData, action:Action) : StoreData {
    switch (action.type)  {

      case ADD_DATA_ANALYITICS:
        return handleAddDataAnalyticsAction(state, <any>action,'with_data');

      case ADD_SINGLE_EMPTY_ANALYITICS:
        return handleAddSingleDataAnalyticsAction(state, <any>action);

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
  if(analyticsExist.checker){
    newStore.dataAnalytics.splice(analyticsExist.index,1)
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

  newStore.dataAnalytics.push({
    id:action.payload.dataId,
    analytics:action.payload.analytics
  });
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















