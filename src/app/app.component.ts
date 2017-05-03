import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from "lodash"
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application.state";
import {Observable} from "rxjs";
import {
  dataItemSelector, currentGroupListSelector, dataOptionsSelector,
  currentDataItemListSelector, selectedGroupSelector, hideMonthSelector, hideQuarterSelector
} from "./shared/selectors";
import {
  LoadDataElementAction, LoadIndicatorAction, LoadDataElementGroupAction, LoadIndicatorGroupAction,
  LoadCategoryOptionAction, LoadOrganisationUnitAction, ToggleDataOptionAction, LoadDataSetAction, SelectGroupAction,
  SelectDataAction, SelectPeriodAction, SelectOrgunitAction, ToggleDataAreaAction, SetLayoutAction
} from "./store/actions";
import {UiState} from "./store/ui-state";
import {PeriodFilterComponent} from "./components/period-filter/period-filter.component";
import {LocalStorageService, DATAELEMENT_GROUP_KEY, INDICATOR_GROUP_KEY} from "./services/local-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  dataItems$: Observable<any>;
  currentGroupList$: Observable<any>;
  currentDataItemList$: Observable<any>;
  selectedGroup$: Observable<any>;
  dataOptions$: Observable<any>;
  hideMonth: boolean =false;
  hideQuarter:boolean = false;
  uiState: UiState;
  currentLayout: any;

  @ViewChild(PeriodFilterComponent)
  public periodComponent: PeriodFilterComponent;

  constructor( private store: Store<ApplicationState> ){
    this.dataItems$ = store.select(dataItemSelector);
    this.currentGroupList$ = store.select(currentGroupListSelector);
    this.currentDataItemList$ = store.select(currentDataItemListSelector);
    this.selectedGroup$ = store.select(selectedGroupSelector);
    this.dataOptions$ = store.select(dataOptionsSelector);
    store.select(state => state.uiState).subscribe(uiState => this.uiState =  _.cloneDeep(uiState) );
  }

  ngOnInit() {
    this.store.dispatch(new LoadDataElementAction());
    this.store.dispatch(new LoadIndicatorAction());
    this.store.dispatch(new LoadDataElementGroupAction());
    this.store.dispatch(new LoadIndicatorGroupAction());
    this.store.dispatch(new LoadCategoryOptionAction());
    // this.store.dispatch(new LoadOrganisationUnitAction());
    this.store.dispatch(new LoadDataSetAction());

    //set initial layout
    this.currentLayout = {
      rows: ['ou'],
      columns: ['dx'],
      filters: ['pe'],
      excluded:['co']
    }
  }

  toogleDataOption( value ){
    this.store.dispatch( new ToggleDataOptionAction(value) );
  }

  setSelectedGroup( value ){
    this.store.dispatch( new SelectGroupAction( value ) );
  }

  setSelectedOrgunit( value ){
    this.store.dispatch( new SelectOrgunitAction( value ) );
  }

  setSelectedPeriod( value ){
    this.store.dispatch( new SelectPeriodAction( value ) );
  }

  setLayout( value ){
    this.store.dispatch( new SetLayoutAction( value ) );
  }

  toogleDataArea() {
    this.store.dispatch( new ToggleDataAreaAction() );
  }

  setSelectedData( value ){
    console.log(value);
    this.store.dispatch( new SelectDataAction( value ) );
    this.hideMonth = value.hideMonth;
    this.hideQuarter = value.hideQuarter;
    this.periodComponent.resetSelection( value.hideMonth, value.hideQuarter );
  }

}
