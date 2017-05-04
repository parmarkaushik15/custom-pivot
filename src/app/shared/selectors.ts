import {ApplicationState} from "../store/application.state";
import * as _ from 'lodash';
import { createSelector } from 'reselect'
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

export function layoutSelector( state: ApplicationState ){
  return state.storeData.layout;
}


export function hideMonthSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedData.hideMonth;
}

export function hideQuarterSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedData.hideQuarter;
}
// const groupListSelectorlector = createSelector(getSelectedOption,getData,currentGroupListSelector);

export const groupListSelector = createSelector(
  [ getSelectedOption, getData ],
  (options, data) => {
    let currentGroupList = [];
    currentGroupList.push(...[{id:'all',name:'All'}]);
    if(_.includes(options, 'all') || _.includes(options,'de')){

      currentGroupList.push(...data.dx)
    }if(_.includes(options, 'all') || _.includes(options,'in')){
      currentGroupList.push(...data.ind)
    }if(_.includes(options, 'all') || _.includes(options,'cv')){
      currentGroupList.push(...data.dt)
    }
    return currentGroupList;
  }
);

function getData(state: ApplicationState ){
  return {
    dx: state.storeData.dataElementGroups,
    ind: state.storeData.indicatorGroups,
    dt: state.storeData.dataSetGroups
  }

}

function getSelectedGroup( state:ApplicationState ){
  return state.storeData.selectedGroup;
}

function getDataItems( state:ApplicationState ){
  return {
    dx: state.storeData.dataElements,
    ind: state.storeData.indicators,
    dt: state.storeData.dataSets
  }
}

export const currentDataItemListSelector = createSelector(
  [ getSelectedGroup, getDataItems,getSelectedOption ],
  (group, data,selectedOptions) => {

  let currentList = [];

  // check if data element is in a selected group
  if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'de')){
    if( group.id == 'all' ){
      currentList.push(...data.dx)
    }else{
      if( group.hasOwnProperty('dataElements')){
        let newArray = _.filter(data.dx, (dataElement) => {
          return _.includes(_.map(group.dataElements,'id'), dataElement['id']);
        });
        currentList.push(...newArray)
      }

    }
    // check if data indicators are in a selected group
  }
  if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'in')){
    if( group.id == 'all' ){
      currentList.push(...data.ind)
    }else{
      if( group.hasOwnProperty('indicators')){
        let newArray = _.filter(data.ind, (indicator) => {
          return _.includes(_.map(group.indicators,'id'),indicator['id']);
        });
        currentList.push(...newArray)
      }
    }
    // check if data data sets are in a selected group
  }
  if(_.includes(selectedOptions, 'all') || _.includes(selectedOptions,'cv')){
    if( group.id == 'all' ){
      currentList.push(...data.dt)
    }else{

    }
  }
  return currentList;
}
);

export function selectedGroupSelector( state: ApplicationState ){
  return state.storeData.selectedGroup;
}

function getSelectedOption( state:ApplicationState ): any[]{
  let someArr = [];
  state.storeData.dataOptions.forEach((val) => {
    if(val.selected){
      someArr.push(val);
    }
  });
  return _.map(someArr,'prefix')
export function selectedDataSelector(state: ApplicationState) {
  return state.storeData.selectedData;
}

export function selectedPeriodSelector(state: ApplicationState) {
  return state.storeData.selectedPeriod
}

export function selectedOrgUnitSelector(state: ApplicationState) {
  return state.storeData.selectedOrgUnits
}
function getSelectedOption( dataOptions ): any[]{
  let arr =  dataOptions.filter( (item) => item.selected );
  return _.map(arr,'prefix')
}

