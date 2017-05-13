import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from "lodash"
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application.state";
import {Observable} from "rxjs";
import {
  dataItemSelector, dataOptionsSelector, layoutSelector, visualizationObjectSelector, analyticsWithDataSelector,
  analyticsWithoutDataSelector, dataDimensionSelector, dataItemAnalyticsSelector
} from "./shared/selectors";
import {
  SelectGroupAction,
  SelectDataAction, SelectPeriodAction, SelectOrgunitAction, ToggleDataAreaAction, SetLayoutAction,
  AddDataAnalyticsAction, AddEmptyAnalyticsAction, AddSingleEmptyAnalyticsAction
} from "./store/actions";
import {UiState} from "./store/ui-state";
import {PeriodFilterComponent} from "./components/period-filter/period-filter.component";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {AnalyticscreatorService} from "./services/analyticscreator.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        transform: 'scale(0)',
        display:'none'
      })),
      state('active',   style({
        transform: 'scale(1)'
      })),
      transition('inactive => active', animate('1000ms')),
      transition('active => inactive', animate('1000ms'))
    ])
  ]
})
export class AppComponent implements OnInit{

  hideMonth: boolean =false;
  hideQuarter:boolean = false;
  uiState: UiState;
  currentLayout: any;
  dimensions: any;
  dataDimensions$: Observable<any>;
  analyticsItems:any;
  analyticsWithData$: Observable<any>;
  analyticsWithoutData$: Observable<any>;
  visualizationObject$: Observable<any>;
  showTable: boolean = false;

  @ViewChild(PeriodFilterComponent)
  public periodComponent: PeriodFilterComponent;

  constructor( private store: Store<ApplicationState>,private analyticsService: AnalyticscreatorService ){

    this.visualizationObject$ = store.select(visualizationObjectSelector);
    this.dataDimensions$ = store.select(dataItemSelector);
    this.analyticsWithData$ = store.select(analyticsWithDataSelector);
    this.analyticsWithoutData$ = store.select(analyticsWithoutDataSelector);
    store.select(state => state.uiState).subscribe(uiState => this.uiState =  _.cloneDeep(uiState) );
    store.select(dataDimensionSelector).subscribe( dimension => this.dimensions=dimension);
    store.select(dataItemAnalyticsSelector).subscribe( dimension => this.analyticsItems = dimension);
  }

  ngOnInit() {
    //set initial layout
    this.currentLayout = {
      rows: ['ou'],
      columns: ['dx'],
      filters: ['pe'],
      excluded:['co']
    }
  }

  setSelectedOrgunit( value ){
    this.store.dispatch( new SelectOrgunitAction( value ) );
    this.addAnalytics(this.dimensions)
  }

  addAnalytics(dimensions){
    dimensions.dataItems.forEach( (value) => {
      let newDimension = _.cloneDeep(dimensions.dimensions);
      newDimension.splice(0,1,{name:'dx',value:value.id});
      this.analyticsService.prepareEmptyAnalytics(newDimension).subscribe(emptyAnalytics => {
        this.store.dispatch(new AddSingleEmptyAnalyticsAction({analytics:emptyAnalytics, dataId:value.id}));
      })
    })
  }

  setSelectedPeriod( value ){
    this.store.dispatch( new SelectPeriodAction( value ) );
    this.addAnalytics(this.dimensions)
  }

  setLayout( value ){
    this.store.dispatch( new SetLayoutAction( value ) );
  }

  toogleDataArea() {
    this.store.dispatch( new ToggleDataAreaAction() );
  }

  setSelectedData( value ){
    this.store.dispatch( new SelectDataAction( value ) );
    this.addAnalytics(this.dimensions)
    this.hideMonth = value.hideMonth;
    this.hideQuarter = value.hideQuarter;
    this.periodComponent.resetSelection( value.hideMonth, value.hideQuarter );
  }

  updateTable() {
    this.analyticsService.prepareAnalytics(this.dimensions.dimensions).subscribe(analytics => {
      this.store.dispatch(new AddDataAnalyticsAction(analytics));
    });
    console.log(this.analyticsService.mergeAnalyticsCalls(this.analyticsItems));
    //this.store.dispatch( new AddDataAnalyticsAction())
    /**
     * Get current dimensions .i.e data (dx), period (pe), orgunit(ou) and catCombo (co) if any
     * @type {Array}
     */
    this.showTable = true;
  }
}
