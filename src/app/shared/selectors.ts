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
  return state.storeData.dataAnalytics;
}

export function dataItemAnalyticsSelector( state: ApplicationState ){
  return state.storeData.dataAnalytics.map(item => item.analytics);
}

export function dataOptionsSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  return otherStore.storeData.dataOptions;
}

export function layoutSelector( state: ApplicationState ){
  return state.storeData.layout;
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

export function analyticsWithoutDataSelector( state: ApplicationState ){
  return state.storeData.currentEmptyAnalytics;
}

export function analyticsWithDataSelector( state: ApplicationState ){
  return state.storeData.currentAnalytics;
}

export function dataDimensionSelector( state: ApplicationState ){
  let otherStore = _.cloneDeep(state);
  let dimensions = [];
  dimensions.push(otherStore.storeData.selectedData.selectedData);
  dimensions.push(otherStore.storeData.selectedPeriod);
  dimensions.push(otherStore.storeData.selectedOrgUnits);

  return {
    dataItems: otherStore.storeData.selectedDataItems,
    dimensions:dimensions}
    ;
}

