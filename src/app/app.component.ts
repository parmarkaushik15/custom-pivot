import {Component, OnInit} from '@angular/core';
import * as _ from "lodash"
import { createSelector } from 'reselect';
import {DataService} from "./services/data.service";
import {DATAELEMENT_KEY} from "./services/local-storage.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application.state";
import {Observable} from "rxjs";
import {
  dataItemSelector, currentGroupListSelector, dataOptionsSelector,
  currentDataItemListSelector
} from "./shared/selectors";
import {
  LOAD_META_DATA_ACTION, LoadDataElementAction, LoadIndicatorAction,
  LoadDataElementGroupAction, LoadIndicatorGroupAction, LoadCategoryOptionAction, LoadOrganisationUnitAction
} from "./store/actions";
import {UiState} from "./store/ui-state";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  dataItems$: Observable<any>;
  currentGroupList$: Observable<any>;
  currentDataItemList$: Observable<any>;
  dataOptions$: Observable<any>;
  uiState: UiState;
  constructor( private store: Store<ApplicationState> ){
    this.dataItems$ = store.select(dataItemSelector);
    this.currentGroupList$ = store.select(currentGroupListSelector);
    this.currentDataItemList$ = store.select(currentDataItemListSelector);
    this.dataOptions$ = store.select(dataOptionsSelector);
    store.select(state => state.uiState).subscribe(uiState => this.uiState =  _.cloneDeep(uiState) );
  }

  ngOnInit() {
    this.store.dispatch(new LoadDataElementAction());
    this.store.dispatch(new LoadIndicatorAction());
    this.store.dispatch(new LoadDataElementGroupAction());
    this.store.dispatch(new LoadIndicatorGroupAction());
    this.store.dispatch(new LoadCategoryOptionAction());
    this.store.dispatch(new LoadOrganisationUnitAction());
  }


}
