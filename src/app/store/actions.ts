import {Action} from "@ngrx/store";
import {Indicator} from "../model/indicator";

export const TOGGLE_DATA_AREA_ACTION = 'TOGGLE_DATA_AREA_ACTION';
export const SELECT_GROUP_ACTION = 'SELECT_GROUP_ACTION';
export const SELECT_DATA_ACTION = 'SELECT_DATA_ACTION';
export const SELECT_PERIOD_ACTION = 'SELECT_PERIOD_ACTION';
export const SELECT_ORGANISATION_UNIT_ACTION = 'SELECT_ORGANISATION_UNIT_ACTION';
export const SET_LAYOUT_ACTION = 'SET_LAYOUT_ACTION';
export const ADD_DATA_ANALYITICS = 'ADD_DATA_ANALYITICS';
export const ADD_EMPTY_ANALYITICS = 'ADD_EMPTY_ANALYITICS';
export const ADD_SINGLE_EMPTY_ANALYITICS = 'ADD_SINGLE_EMPTY_ANALYITICS';


export class AddDataAnalyticsAction implements Action {
  type = ADD_DATA_ANALYITICS;
  constructor ( public payload: any ) {}
}

export class AddEmptyAnalyticsAction implements Action {
  type = ADD_EMPTY_ANALYITICS;
  constructor ( public payload: any ) {}
}

export class AddSingleEmptyAnalyticsAction implements Action {
  type = ADD_SINGLE_EMPTY_ANALYITICS;
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
