import {ApplicationState} from "../store/application.state";
import * as _ from 'lodash';
import { createSelector } from 'reselect'
import {DataElement} from "../model/data-element";
import {CategoryCombo} from "../model/category-combo";
/**
 * Created by kelvin on 4/30/17.
 * This file will have ALL functions to convert from store specific details to what is needed by the view
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
    currentGroupList.push(...[{id:'ALL',name:'ALL'}]);
    if(_.includes(options, 'ALL') || _.includes(options,'de')){

      currentGroupList.push(...data.dx)
    }if(_.includes(options, 'ALL') || _.includes(options,'in')){
      currentGroupList.push(...data.ind)
    }if(_.includes(options, 'ALL') || _.includes(options,'cv')){
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
  let dataElements = [];
  state.storeData.dataElements.forEach((dataelement) => {
    dataElements.push(...getDetailedDataElements(state, dataelement))
  });
  return {
    dx: dataElements,
    ind: state.storeData.indicators,
    dt: state.storeData.dataSets
  }
}

function getDetailedDataElements( state:ApplicationState, dataElement: DataElement ){
  let dataElements = [];
  let categoryCombo = getCategoryCombo(state, dataElement.categoryCombo.id);
  dataElements.push({
    id:dataElement.id,
    name:dataElement.name + "",
    data:dataElement.dataSetElements
  });
  categoryCombo.categoryOptionCombos.forEach((option) => {
    if(option.name != 'default'){
      dataElements.push({
        id:dataElement.id+"."+option.id,
        name:dataElement.name + " "+option.name,
        data:dataElement.dataSetElements
      })
    }

  });
  return dataElements;
}

function getCategoryCombo( state:ApplicationState, uid ) : CategoryCombo{
  let category = null;
  state.storeData.categoryOptions.forEach((val) => {
    if( val.id == uid ){
      category = val;
    }
  });
  return category;

}

export const currentDataItemListSelector = createSelector(
  [ getSelectedGroup, getDataItems,getSelectedOption ],
  (group, data,selectedOptions) => {

  let currentList = [];

  // check if data element is in a selected group
  if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'de')){
    if( group.id == 'ALL' ){
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
  if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'in')){
    if( group.id == 'ALL' ){
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
  if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'cv')){
    if( group.id == 'ALL' ){
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

function getSelectedOption( state:ApplicationState ): any[] {
  let someArr = [];
  state.storeData.dataOptions.forEach((val) => {
    if (val.selected) {
      someArr.push(val);
    }
  });
  return _.map(someArr, 'prefix')
}


export function visualizationObjectSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  /**
   * Get current dimensions .i.e data (dx), period (pe), orgunit(ou) and catCombo (co) if any
   * @type {Array}
   */
  let dimensions = [];
  dimensions.push(otherStore.storeData.selectedData.selectedData);
  dimensions.push(otherStore.storeData.selectedPeriod);
  dimensions.push(otherStore.storeData.selectedOrgUnits);

  /**
   * Get current layout
   */
  let currentLayout: any = null;
  // this.store.select(layoutSelector).subscribe(layout => currentLayout = layout);

  return {
    id: 'pivot',
    name: null,
    type: 'TABLE',
    created: null,
    lastUpdated: null,
    shape: 'NORMAL',
    details: {
      externalDimensions: dimensions,
      externalLayout: otherStore.storeData.layout
    },
    layers: [],
    operatingLayers: []
  }
}
//
// function getSelectedOption( dataOptions ): any[]{
//   let arr =  dataOptions.filter( (item) => item.selected );
//   return _.map(arr,'prefix')
// }

