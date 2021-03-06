import {Action} from "@ngrx/store";
import {Indicator} from "../model/indicator";

export const TOGGLE_DATA_AREA_ACTION = 'TOGGLE_DATA_AREA_ACTION';
export const SELECT_GROUP_ACTION = 'SELECT_GROUP_ACTION';
export const SELECT_DATA_ACTION = 'SELECT_DATA_ACTION';
export const SELECT_PERIOD_ACTION = 'SELECT_PERIOD_ACTION';
export const SELECT_ORGANISATION_UNIT_ACTION = 'SELECT_ORGANISATION_UNIT_ACTION';
export const SET_LAYOUT_ACTION = 'SET_LAYOUT_ACTION';
export const SET_ORGANISATION_MODEL_ACTION = 'SET_ORGANISATION_MODEL_ACTION';
export const SET_YEAR_ACTION = 'SET_YEAR_ACTION';
export const SET_PERIOD_TYPE_ACTION = 'SET_PERIOD_TYPE_ACTION';
export const ADD_DATA_ANALYITICS = 'ADD_DATA_ANALYITICS';
export const ADD_EMPTY_ANALYITICS = 'ADD_EMPTY_ANALYITICS';
export const ADD_SINGLE_EMPTY_ANALYITICS = 'ADD_SINGLE_EMPTY_ANALYITICS';
export const ADD_SINGLE_AUTOGROWING_ANALYITICS = 'ADD_SINGLE_AUTOGROWING_ANALYITICS';
export const ADD_FUNCTIONS_ACTION = 'ADD_FUNCTIONS';
export const UPDATE_TABLE_ACTION = 'UPDATE_TABLE_ACTION';
export const ADD_FUNCTION_MAPPING_ACTION = 'ADD_FUNCTION_MAPPING';
export const UPDATE_OPTIONS_ACTION = 'UPDATE_OPTIONS_ACTION';
export const RESET_TABLE_OBJECTS_ACTION = 'RESET_TABLE_OBJECTS_ACTION';
export const SEND_NORMAL_DATA_LOADING_MESSAGE = 'SEND_NORMAL_DATA_LOADING_MESSAGE';
export const REMOVE_NORMAL_DATA_LOADING_MESSAGE = 'REMOVE_NORMAL_DATA_LOADING_MESSAGE';
export const UPDATE_CURRENT_ANALYTICS_OPTIONS_ACTION = 'UPDATE_CURRENT_ANALYTICS_OPTIONS_ACTION';


export class AddDataAnalyticsAction implements Action {
  type = ADD_DATA_ANALYITICS;
  constructor ( public payload: any ) {}
}

export class UpdateOptionsAction implements Action {
  type = UPDATE_OPTIONS_ACTION;
  constructor ( public payload: any ) {}
}

export class UpdateCurrentAnalyticsOptionsAction implements Action {
  type = UPDATE_CURRENT_ANALYTICS_OPTIONS_ACTION;
  constructor ( public payload: any ) {}
}

export class SendNormalDataLoadingAction implements Action {
  type = SEND_NORMAL_DATA_LOADING_MESSAGE;
  constructor ( public payload: any ) {}
}

export class RemoveNormalDataLoadingAction implements Action {
  type = REMOVE_NORMAL_DATA_LOADING_MESSAGE;
  constructor ( public payload: any ) {}
}

export class ResetTableObjectAction implements Action {
  type = RESET_TABLE_OBJECTS_ACTION;
}

export class UpdateTableAction implements Action {
  type = UPDATE_TABLE_ACTION;
  constructor ( public payload: any ) {}
}

export class AddEmptyAnalyticsAction implements Action {
  type = ADD_EMPTY_ANALYITICS;
  constructor ( public payload: any ) {}
}


export class AddFunctionsAction implements Action {
  type = ADD_FUNCTIONS_ACTION;
  constructor ( public payload: any ) {}
}


export class AddFunctionMappingAction implements Action {
  type = ADD_FUNCTION_MAPPING_ACTION;
  constructor ( public payload: any ) {}
}

export class AddSingleEmptyAnalyticsAction implements Action {
  type = ADD_SINGLE_EMPTY_ANALYITICS;
  constructor ( public payload: any ) {}
}

export class AddSingleAutogrowingAnalyticsAction implements Action {
  type = ADD_SINGLE_AUTOGROWING_ANALYITICS;
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

export class SetOrgunitModelAction implements Action {
  type = SET_ORGANISATION_MODEL_ACTION;

  constructor ( public payload: any ) {}
}

export class SetYearAction implements Action {
  type = SET_YEAR_ACTION;

  constructor ( public payload: any ) {}
}

export class SetPeriodTypeAction implements Action {
  type = SET_PERIOD_TYPE_ACTION;

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
