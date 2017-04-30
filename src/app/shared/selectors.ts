import {ApplicationState} from "../store/application.state";
import * as _ from 'lodash';
/**
 * Created by kelvin on 4/30/17.
 * This file will have all functions to convert from store specific details to what is needed by the view
 */

export function dataItemSelector( state: ApplicationState ){
  return state.storeData;
}

export function dataOptionsSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  console.log("Check Hapa", getSelectedOption(otherStore.storeData.dataOptions));
  return otherStore.storeData.dataOptions;
}

export function currentGroupListSelector( state: ApplicationState ){
  return state.storeData.currentGroupList;
}

export function currentDataItemListSelector( state: ApplicationState ){
  return state.storeData.currentDataItemList;
}

function getSelectedOption( dataOptions ): any[]{
  return _.map(dataOptions, 'selected')
}
