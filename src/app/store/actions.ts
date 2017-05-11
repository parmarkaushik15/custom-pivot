import {Action} from "@ngrx/store";
import {Indicator} from "../model/indicator";

export const LOAD_DATA_ELEMENT_ACTION = 'LOAD_DATA_ELEMENT_ACTION';
export const DATA_ELEMENT_LOADED_ACTION = 'DATA_ELEMENT_LOADED_ACTION';
export const LOAD_DATA_SET_ACTION = 'LOAD_DATA_SET_ACTION';
export const DATA_SET_LOADED_ACTION = 'DATA_SET_LOADED_ACTION';
export const LOAD_INDICATOR_ACTION = 'LOAD_INDICATOR_ACTION';
export const INDICATOR_LOADED_ACTION = 'INDICATOR_LOADED_ACTION';
export const LOAD_DATA_ELEMENT_GROUP_ACTION = 'LOAD_DATA_ELEMENT_GROUP_ACTION';
export const DATA_ELEMENT_GROUP_LOADED_ACTION = 'DATA_ELEMENT_GROUP_LOADED_ACTION';
export const LOAD_INDICATOR_GROUP_ACTION = 'LOAD_INDICATOR_GROUP_ACTION';
export const INDICATOR_GROUP_LOADED_ACTION = 'INDICATOR_GROUP_LOADED_ACTION';
export const LOAD_CATEGORY_OPTION_ACTION = 'LOAD_CATEGORY_OPTION_ACTION';
export const CATEGORY_OPTION_LOADED_ACTION = 'CATEGORY_OPTION_LOADED_ACTION';
export const LOAD_ORGANISATION_UNIT_ACTION = 'LOAD_ORGANISATION_UNIT_ACTION';
export const ORGANISATION_UNIT_LOADED_ACTION = 'ORGANISATION_UNIT_LOADED_ACTION';
export const TOGGLE_DATA_OPTION_ACTION = 'TOGGLE_DATA_OPTION_ACTION';
export const TOGGLE_DATA_AREA_ACTION = 'TOGGLE_DATA_AREA_ACTION';
export const SELECT_GROUP_ACTION = 'SELECT_GROUP_ACTION';
export const SELECT_DATA_ACTION = 'SELECT_DATA_ACTION';
export const SELECT_PERIOD_ACTION = 'SELECT_PERIOD_ACTION';
export const SELECT_ORGANISATION_UNIT_ACTION = 'SELECT_ORGANISATION_UNIT_ACTION';
export const SET_LAYOUT_ACTION = 'SET_LAYOUT_ACTION';
export const ADD_DATA_ANALYITICS = 'ADD_DATA_ANALYITICS';

export class ToggleDataOptionAction implements Action {
  type = TOGGLE_DATA_OPTION_ACTION;

  constructor ( public payload: any ) {}
}

export class AddDataAnalyticsAction implements Action {
  type = ADD_DATA_ANALYITICS;

  constructor ( public payload: any ) {}
}

export class ToggleDataAreaAction implements Action {
  type = TOGGLE_DATA_AREA_ACTION;
}

export class SelectGroupAction implements Action {
  type = SELECT_GROUP_ACTION;

  constructor ( public payload: any ) {}
}

export class SelectDataAction implements Action {
  type = SELECT_DATA_ACTION;

  constructor ( public payload: any ) {}
}

export class SetLayoutAction implements Action {
  type = SET_LAYOUT_ACTION;

  constructor ( public payload: any ) {}
}

export class SelectPeriodAction implements Action {
  type = SELECT_PERIOD_ACTION;

  constructor ( public payload: any ) {}
}

export class SelectOrgunitAction implements Action {
  type = SELECT_ORGANISATION_UNIT_ACTION;

  constructor ( public payload: any ) {}
}

/*
Loading metadata items
 */
export class LoadDataElementAction implements Action {
  type = LOAD_DATA_ELEMENT_ACTION;
}

export class DataElementLoadedAction implements Action {
  type = DATA_ELEMENT_LOADED_ACTION;

  constructor ( public payload: any ) {}
}

export class LoadDataSetAction implements Action {
  type = LOAD_DATA_SET_ACTION;
}

export class DataSetLoadedAction implements Action {
  type = DATA_SET_LOADED_ACTION;

  constructor ( public payload: any ) {}
}

export class LoadIndicatorAction implements Action {
  type = LOAD_INDICATOR_ACTION;
}

export class IndicatorLoadedAction implements Action {
  type = INDICATOR_LOADED_ACTION;

  constructor ( public payload: Indicator ) {}
}

export class LoadCategoryOptionAction implements Action {
  type = LOAD_CATEGORY_OPTION_ACTION;
}

export class CategoryOptionLoadedAction implements Action {
  type = CATEGORY_OPTION_LOADED_ACTION;

  constructor ( public payload: any ) {}
}

export class LoadIndicatorGroupAction implements Action {
  type = LOAD_INDICATOR_GROUP_ACTION;
}

export class IndicatorGroupLoadedAction implements Action {
  type = INDICATOR_GROUP_LOADED_ACTION;

  constructor ( public payload: any ) {}
}

export class LoadDataElementGroupAction implements Action {
  type = LOAD_DATA_ELEMENT_GROUP_ACTION;
}

export class DataElementGroupLoadedAction implements Action {
  type = DATA_ELEMENT_GROUP_LOADED_ACTION;

  constructor ( public payload: any ) {}
}

export class LoadOrganisationUnitAction implements Action {
  type = LOAD_ORGANISATION_UNIT_ACTION;
}

export class OrganisationUnitLoadedAction implements Action {
  type = ORGANISATION_UNIT_LOADED_ACTION;

  constructor ( public payload: any ) {}
}






