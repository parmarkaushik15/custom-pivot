import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from "lodash"
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application.state";
import {Observable} from "rxjs";
import {
  dataItemSelector, dataOptionsSelector, layoutSelector, visualizationObjectSelector, analyticsWithDataSelector,
  analyticsWithoutDataSelector, dataDimensionSelector, dataItemAnalyticsSelector, selectedDataSelector,
  selectedPeriodSelector, orgunitModelSelector, selectedPeriodTypeSelector, selectedPeriodYearSelector,
  functionsSelector, mappingSelector, tableObjectSelector
} from "./shared/selectors";
import {
  SelectGroupAction,
  SelectDataAction, SelectPeriodAction, SelectOrgunitAction, ToggleDataAreaAction, SetLayoutAction,
  AddDataAnalyticsAction, AddEmptyAnalyticsAction, AddSingleEmptyAnalyticsAction, SetOrgunitModelAction, SetYearAction,
  SetPeriodTypeAction, AddFunctionMappingAction, AddFunctionsAction, AddSingleAutogrowingAnalyticsAction,
  UpdateTableAction, ResetTableObjectAction, SendNormalDataLoadingAction
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
import {DataService} from "./services/data.service";
import {VisualizerService} from "./services/visualizer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('heroState', [
      state('inactive', style({
        display:'none'
      })),
      state('active',   style({
      })),
      transition('inactive => active', animate('100ms')),
      transition('active => inactive', animate('100ms'))
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
  autoGrowingData:any[] = [];
  analyticsWithoutData$: Observable<any>;
  visualizationObject$: Observable<any>;
  selectedData$: Observable<any>;
  selectedPeriod$: Observable<any>;
  selectedPeriodType$: Observable<any>;
  selectedPeriodYear$: Observable<any>;
  tableObject: any = null;
  layout: any;
  orgunitModel$: Observable<any>;
  functions: any;
  mappings: any;
  showTable: boolean = false;
  showAutoGrowingTable: boolean = false;
  loadingAutogrowing: boolean = false;

  // top data selection area selection
  showDx:boolean = false;
  showPe:boolean = false;
  showOu:boolean = false;
  @ViewChild(PeriodFilterComponent)
  public periodComponent: PeriodFilterComponent;

  @ViewChild(PeriodFilterComponent)
  public periodComponent1: PeriodFilterComponent;

  constructor( private store: Store<ApplicationState>,
               private analyticsService: AnalyticscreatorService,
               private dataService: DataService,
               private visualization: VisualizerService
  ){

    this.visualizationObject$ = store.select(visualizationObjectSelector);
    this.dataDimensions$ = store.select(dataItemSelector);
    this.analyticsWithoutData$ = store.select(analyticsWithoutDataSelector);
    this.selectedData$ = store.select(selectedDataSelector);
    this.selectedPeriod$ = store.select(selectedPeriodSelector);
    this.selectedPeriodType$ = store.select(selectedPeriodTypeSelector);
    this.selectedPeriodYear$ = store.select(selectedPeriodYearSelector);
    this.orgunitModel$ = store.select(orgunitModelSelector);
    // this.tableObject$ = store.select(tableObjectSelector);
    store.select(functionsSelector).subscribe( functions => this.functions= functions );
    store.select(layoutSelector).subscribe( layout => this.layout= layout );
    store.select(mappingSelector).subscribe( mappings => this.mappings=mappings );
    store.select(state => state.uiState).subscribe(uiState => this.uiState =  _.cloneDeep(uiState) );
    store.select(dataDimensionSelector).subscribe( dimension => this.dimensions=dimension);
    store.select(dataItemAnalyticsSelector).subscribe( dimension => this.analyticsItems = dimension);
  }

  ngOnInit() {
    //set initial layout
    this.currentLayout = this.layout;

    this.dataService.getMapping().subscribe((val) => {
      this.store.dispatch( new AddFunctionMappingAction(val) );
    });

    this.dataService.getFunctions().subscribe((val) => {
      this.store.dispatch( new AddFunctionsAction(val) );

    });
  }

  setSelectedOrgunit( value ){
    this.store.dispatch( new SelectOrgunitAction( value ) );
    // this.addAnalytics(this.dimensions)
  }

  setOrgunitModel( value ){
    this.store.dispatch( new SetOrgunitModelAction( value ) );
  }

  addAnalytics(dimensions){
    this.autoGrowingData = [];
    this.loadingAutogrowing = true;
    if(dimensions.dataItems.length > 0){
      // dimensions.dataItems.forEach( (value) => {
      //
      //   // check first if the item is autogrowing
      //   if (!value.hasOwnProperty('programType')) {
      //     // Constructing analytics parameters to pass on the function call
      //     let parameters = {
      //       dx: _.find(dimensions.dimensions, ['name', 'dx'])['value'],
      //       ou: _.find(dimensions.dimensions, ['name', 'ou'])['value'],
      //       pe: _.find(dimensions.dimensions, ['name', 'pe'])['value'],
      //       success: (results) => {
      //         // This will run on successfull function return, which will save the result to the data store for analytics
      //         console.log(results);
      //         this.store.dispatch(new AddSingleEmptyAnalyticsAction({analytics: results, dataId: value.id}));
      //       },
      //       error: (error) => {
      //         console.log('error');
      //       },
      //       progress: (progress) => {
      //         console.log('progress');
      //       }
      //     };
      //     // check if the data element is in function and if so return the mapping object
      //     let mapped = _.find(this.mappings, ['id', value.id]);
      //     if (mapped) {
      //       // If there is a function for a data find the function and run it.
      //       let use_function = _.find(this.functions, ['id', mapped['function']]);
      //       let execute = Function('parameters', use_function['function']);
      //       execute(parameters);
      //     }
      //   }
      // });
      //
      // //select first data and construct its analytics
      //   let count = 0;
      //   dimensions.dataItems.forEach( (value) => {
      //
      //     // check first if item is not an auto growing
      //     if (!value.hasOwnProperty('programType')) {
      //       if (_.find(this.mappings, ['id', value.id])) {
      //       }
      //       else {
      //         // this will ensure that the analytics call is called only once and then just use the same to update all others
      //         if (count == 0) {
      //           count++;
      //           let newDimension = _.cloneDeep(dimensions.dimensions);
      //           newDimension.splice(0, 1, {name: 'dx', value: value.id});
      //           this.analyticsService.prepareEmptyAnalytics(newDimension).subscribe(emptyAnalytics => {
      //             this.store.dispatch(new AddSingleEmptyAnalyticsAction({
      //               analytics: emptyAnalytics,
      //               dataId: dimensions.dataItems[0].id
      //             }));
      //             dimensions.dataItems.forEach((value) => {
      //               // check first if the data is from function or otherwise
      //               if (_.find(this.mappings, ['id', value.id])) {
      //               }
      //               else {
      //                 // Duplicate the  same analytics to save calling the same analytics call again and again
      //                 this.store.dispatch(new AddSingleEmptyAnalyticsAction({
      //                   analytics: this.analyticsService.duplicateAnalytics(emptyAnalytics, value, dimensions.dataItems[0].id),
      //                   dataId: value.id
      //                 }));
      //               }
      //             });
      //           });
      //         }
      //       }
      //     }
      //   });

        //////////////////////////////////////////////
      /////////////Dealing with auto-growing/////////
      ///////////////////////////////////////////////
      let counter = 0;
      dimensions.dataItems.forEach( (value) =>{
        if (value.hasOwnProperty('programType')) {
          counter++;
          let parameters = {
            dx: value.id,
            ou: _.find(dimensions.dimensions, ['name', 'ou'])['value'],
            pe: _.find(dimensions.dimensions, ['name', 'pe'])['value'],
            success: (results) => {
              // This will run on successfull function return, which will save the result to the data store for analytics

              this.showTable = true;
              // this.store.dispatch( new UpdateTableAction(tableObject));
              this.autoGrowingData.push( {analytics: results, dataId: value.id} );
              this.showAutoGrowingTable = true;
              this.loadingAutogrowing = false;
            },
            error: (error) => {
              console.log('error');
            },
            progress: (progress) => {
              console.log('progress');
            }
          };
          // If there is a function for a data find the function and run it.
          let use_function = _.find(this.functions, ['id', 'DDtZTbdxMsQ']);
          let execute = Function('parameters', use_function['function']);
          execute(parameters);
        }
      });
      if(counter == 0){
        this.loadingAutogrowing = false;
      }
    }
  }

  setSelectedPeriod( value ){
    this.store.dispatch( new SelectPeriodAction( value ) );
    // this.addAnalytics(this.dimensions)
  }

  setLayout( value ){
    this.store.dispatch( new SetLayoutAction( value ) );
    this.updateTable();
  }

  toogleDataArea() {
    this.store.dispatch( new ToggleDataAreaAction() );

  }

  setSelectedData( value ){
    this.store.dispatch( new SelectDataAction( value ) );
    // this.addAnalytics(this.dimensions);
    this.hideMonth = value.hideMonth;
    this.hideQuarter = value.hideQuarter;
    if(this.periodComponent){

      this.periodComponent.resetSelection( value.hideMonth, value.hideQuarter );
    }if(this.periodComponent1){

      this.periodComponent1.resetSelection( value.hideMonth, value.hideQuarter );
    }
  }

  updateTable() {
    this.tableObject = null;
    this.store.dispatch( new SendNormalDataLoadingAction({loading:true, message:"Loading data, Please wait"}));
    // this.showTable = false;
    this.showAutoGrowingTable = false;
    this.analyticsService.prepareAnalytics(this.dimensions.dimensions).subscribe(analytics => {
      // check first if there is normal data selected
      if(analytics){
        let table_structure = {
          showColumnTotal: false,
          showRowTotal: false,
          showRowSubtotal: false,
          showDimensionLabels: false,
          hideEmptyRows: false,
          showHierarchy: false,
          rows: this.layout.rows,
          columns: this.layout.columns,
          displayList: false,
        };
        console.log(analytics);
        const tableObject = this.visualization.drawTable(analytics, table_structure);
        this.showTable = true;
        this.tableObject = tableObject;
        this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
      }else{
        this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
      }

      this.addAnalytics(this.dimensions);
      this.showTable = true;
    });
    //this.store.dispatch( new AddDataAnalyticsAction())
    /**
     * Get current dimensions .i.e data (dx), period (pe), orgunit(ou) and catCombo (co) if any
     * @type {Array}
     */

  }

  addParentToAnalytics(analytics){

  }
}
