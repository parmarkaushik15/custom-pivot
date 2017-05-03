import {ApplicationState} from "../store/application.state";
import * as _ from 'lodash';
/**
 * Created by kelvin on 4/30/17.
 * This file will have all functions to convert from store specific details to what is needed by the view
 */

export function dataItemSelector( state: ApplicationState ){
  return state.storeData.tableObject;
}

export function dataOptionsSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.dataOptions;
}

export function hideMonthSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedData.hideMonth;
}

export function hideQuarterSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedData.hideQuarter;
}

export function currentGroupListSelector( state: ApplicationState ){
  let newStore = _.cloneDeep( state );
  let currentGroupList = [];
  let selectedItems = getSelectedOption(newStore.storeData.dataOptions);
  currentGroupList.push(...[{id:'all',name:'All'}]);
  if(_.includes(selectedItems, 'all') || _.includes(selectedItems,'de')){
    currentGroupList.push(...newStore.storeData.dataElementGroups)
  }if(_.includes(selectedItems, 'all') || _.includes(selectedItems,'in')){
    currentGroupList.push(...newStore.storeData.indicatorGroups)
  }if(_.includes(selectedItems, 'all') || _.includes(selectedItems,'cv')){
    currentGroupList.push(...newStore.storeData.dataSetGroups)
  }
  return currentGroupList;
}

export function currentDataItemListSelector( state: ApplicationState ){
  let newStore = _.cloneDeep( state );
  let currentList = [];
  let selectedOptions = getSelectedOption(newStore.storeData.dataOptions);

  // check if data element is in a selected group
  if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'de')){
    if( newStore.storeData.selectedGroup.id == 'all' ){
      currentList.push(...newStore.storeData.dataElements)
    }else{
      if( newStore.storeData.selectedGroup.hasOwnProperty('dataElements')){
        let newArray = _.filter(newStore.storeData.dataElements, (dataElement) => {
          return _.includes(_.map(newStore.storeData.selectedGroup.dataElements,'id'), dataElement.id);
        });
        currentList.push(...newArray)
      }

    }
    // check if data indicators are in a selected group
  }if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'in')){
    if( newStore.storeData.selectedGroup.id == 'all' ){
      currentList.push(...newStore.storeData.indicators)
    }else{
      if( newStore.storeData.selectedGroup.hasOwnProperty('indicators')){
        let newArray = _.filter(newStore.storeData.indicators, (indicator) => {
          return _.includes(_.map(newStore.storeData.selectedGroup.indicators,'id'),indicator.id);
        });
        currentList.push(...newArray)
      }
    }
    // check if data data sets are in a selected group
  }if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'cv')){
    if( newStore.storeData.selectedGroup.id == 'all' ){
      currentList.push(...newStore.storeData.dataSets)
    }else{

    }
  }

  let selectedItems = getSelectedOption(newStore.storeData.dataOptions);

  return currentList;
}

export function selectedGroupSelector( state: ApplicationState ){
  return state.storeData.selectedGroup;
}

function getSelectedOption( dataOptions ): any[]{
  let arr =  dataOptions.filter( (item) => item.selected );
  return _.map(arr,'prefix')
}

