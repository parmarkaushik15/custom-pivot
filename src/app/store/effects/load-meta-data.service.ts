import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {Action} from "@ngrx/store";
import {DataService} from "../../services/data.service";
import {
  LOAD_DATA_ELEMENT_ACTION,
  DataElementLoadedAction, OrganisationUnitLoadedAction, LOAD_ORGANISATION_UNIT_ACTION, LOAD_CATEGORY_OPTION_ACTION,
  CategoryOptionLoadedAction, LOAD_DATA_ELEMENT_GROUP_ACTION, LoadDataElementGroupAction, DataElementGroupLoadedAction,
  LOAD_INDICATOR_GROUP_ACTION, IndicatorGroupLoadedAction, LOAD_INDICATOR_ACTION, IndicatorLoadedAction,
  DataSetLoadedAction, LOAD_DATA_SET_ACTION
} from "../actions";
import {
  DATAELEMENT_KEY, INDICATOR_KEY, INDICATOR_GROUP_KEY,
  DATAELEMENT_GROUP_KEY, CATEGORY_COMBOS_KEY, ORGANISATION_UNIT_KEY, DATASET_KEY
} from "../../services/local-storage.service";

@Injectable()
export class LoadMetaDataService {

  constructor(private actions$: Actions, private dataService: DataService) {

  }

  @Effect() dataElements$: Observable<Action> = this.actions$
    .ofType(LOAD_DATA_ELEMENT_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(DATAELEMENT_KEY))
    .map(items => new DataElementLoadedAction(items) );

  @Effect() dataSets$: Observable<Action> = this.actions$
    .ofType(LOAD_DATA_SET_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(DATASET_KEY))
    .map(items => new DataSetLoadedAction(items) );

  @Effect() indicators$: Observable<Action> = this.actions$
    .ofType(LOAD_INDICATOR_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(INDICATOR_KEY))
    .map(items => new IndicatorLoadedAction(items) );

  @Effect() indicatorGroups$: Observable<Action> = this.actions$
    .ofType(LOAD_INDICATOR_GROUP_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(INDICATOR_GROUP_KEY))
    .map(items => new IndicatorGroupLoadedAction(items) );

  @Effect() dataElementGroups$: Observable<Action> = this.actions$
    .ofType(LOAD_DATA_ELEMENT_GROUP_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(DATAELEMENT_GROUP_KEY))
    .map(items => new DataElementGroupLoadedAction(items) );

  @Effect() categoryCombos$: Observable<Action> = this.actions$
    .ofType(LOAD_CATEGORY_OPTION_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(CATEGORY_COMBOS_KEY))
    .map(items => new CategoryOptionLoadedAction(items) );

  @Effect() organisationUnits$: Observable<Action> = this.actions$
    .ofType(LOAD_ORGANISATION_UNIT_ACTION)
    .switchMap(action => this.dataService.getDataFromLocalDatabase(ORGANISATION_UNIT_KEY))
    .map(items => new OrganisationUnitLoadedAction(items) );

}
