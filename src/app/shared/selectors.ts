import * as _ from 'lodash';
import {DataElement} from '../model/data-element';
import {CategoryCombo} from '../model/category-combo';
import {ApplicationState} from '../store';
import * as fromReducer from '../store';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {storeData} from '../store/reducers/StoreDataReducer';
import {StoreData} from '../store/store-data';
import {UiState} from '../store/ui-state';

/**
 * Created by kelvin on 4/30/17.
 * This file will have ALL functions to convert from store specific details to what is needed by the view
 */


export const basiData = createFeatureSelector<StoreData>('storeData');
export const uiData = createFeatureSelector<UiState>('uiState');

// export const dataItemSelector = createSelector(basiData, (storeData) => {
//   return {
//     data: storeData.selectedData,
//     period: storeData.selectedPeriod,
//     ou: storeData.selectedOrgUnits,
//   };
// })
export function dataItemSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return {
    data: otherStore.storeData.selectedData,
    period: otherStore.storeData.selectedPeriod,
    ou: otherStore.storeData.selectedOrgUnits,
  };
}

export function dataItemAnalyticsSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.dataAnalytics.map(item => item.analytics);
}

export function dataOptionsSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.dataOptions;
}

export function layoutSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.layout;
}

export function tableObjectSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.tableObject;
}

export function selectedDataSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedData.itemList;
}

export function selectedPeriodSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedPeriod.items;
}

export function selectedPeriodTypeSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedPeriod.type;
}

export function selectedPeriodYearSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.selectedPeriod.starting_year;
}

export function orgunitModelSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.orgunit_model;
}

// select last analytics parameters to check if there are changes
export function analyticsParamsSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.currentAnalyticsParams;
}

// select the selected options
export function optionsSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.options;
}

export const functionsSelector = createSelector(basiData, dataState => {
  return dataState.functions;
});

export function mappingSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.mapping;
}

export function visualizationObjectSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  /**
   * Get current dimensions .i.e data (dx), period (pe), orgunit(ou) and catCombo (co) if any
   * @type {Array}
   */
  const dimensions = [];
  dimensions.push(otherStore.storeData.selectedData.selectedData);
  dimensions.push(otherStore.storeData.selectedPeriod);
  dimensions.push(otherStore.storeData.selectedOrgUnits);

  /**
   * Get current layout
   */
  const currentLayout: any = null;
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

export function analyticsWithoutDataSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.currentEmptyAnalytics;
}

export function analyticsWithDataSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  return otherStore.storeData.autoGrowingAnalytics;
}

export function dataDimensionSelector(state: ApplicationState) {
  const otherStore = _.cloneDeep(state);
  const dimensions = [];
  dimensions.push(otherStore.storeData.selectedData.selectedData);
  dimensions.push(otherStore.storeData.selectedPeriod);
  dimensions.push(otherStore.storeData.selectedOrgUnits);

  return {
    data: otherStore.storeData.selectedData,
    dataItems: otherStore.storeData.selectedDataItems,
    dimensions: dimensions
  }
    ;
}

