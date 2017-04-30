import {Action} from "@ngrx/store";

export const LOAD_META_DATA_ACTION = 'LOAD_META_DATA_ACTION';
export const LOAD_DATA_ELEMENT_ACTION = 'LOAD_DATA_ELEMENT_ACTION';
export const DATA_ELEMENT_LOADED_ACTION = 'DATA_ELEMENT_LOADED_ACTION';
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
export const META_DATA_LOADED_ACTION = 'META_DATA_LOADED_ACTION';

export class LoadDataElementAction implements Action {
  type = LOAD_DATA_ELEMENT_ACTION;

}

export class DataElementLoadedAction implements Action {
  type = DATA_ELEMENT_LOADED_ACTION;

  constructor ( public payload: any ) {}

}

export class LoadIndicatorAction implements Action {
  type = LOAD_INDICATOR_ACTION;

}

export class IndicatorLoadedAction implements Action {
  type = INDICATOR_LOADED_ACTION;

  constructor ( public payload: any ) {}

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




