import {Component, OnInit, ViewChild} from '@angular/core';
import * as _ from "lodash"
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application.state";
import {Observable} from "rxjs";
import {
  dataItemSelector, dataOptionsSelector, layoutSelector, visualizationObjectSelector, analyticsWithDataSelector,
  analyticsWithoutDataSelector, dataDimensionSelector, dataItemAnalyticsSelector, selectedDataSelector,
  selectedPeriodSelector, orgunitModelSelector, selectedPeriodTypeSelector, selectedPeriodYearSelector,
  functionsSelector, mappingSelector, tableObjectSelector, analyticsParamsSelector, optionsSelector
} from "./shared/selectors";
import {
  SelectDataAction, SelectPeriodAction, SelectOrgunitAction, ToggleDataAreaAction, SetLayoutAction, SetOrgunitModelAction,
  AddFunctionMappingAction, AddFunctionsAction,  SendNormalDataLoadingAction, UpdateCurrentAnalyticsOptionsAction,
  UpdateOptionsAction
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
import {Angular2Csv} from "angular2-csv";

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
  options: any;
  lastAnalyticsParams: any;
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
  needForUpdate:boolean = false;
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
    store.select(analyticsParamsSelector).subscribe( params => this.lastAnalyticsParams = params );
    store.select(optionsSelector).subscribe( options => this.options = options );
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
    // this.analyticsService.addRowSubtotal("");
  }

  setSelectedOrgunit( value ){
    this.store.dispatch( new SelectOrgunitAction( value ) );
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
    // this.addAnalytics(this.dimensions)
  }

  setOrgunitModel( value ){
    this.store.dispatch( new SetOrgunitModelAction( value ) );
  }

  performFunctionCalculations(dimensions,analytics,table_structure){
    this.analyticsService.analytics_lists = [];
    if(!analytics && dimensions.data.need_functions.length == 0){
      this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
    }
    if( dimensions.data.need_functions.length > 0 ) {
      let counter = 0;
      dimensions.data.need_functions.forEach( (value) => {

          // Constructing analytics parameters to pass on the function call
          let parameters = {
            dx: value.id,
            ou: _.find(dimensions.dimensions, ['name', 'ou'])['value'],
            pe: _.find(dimensions.dimensions, ['name', 'pe'])['value'],
            success: (results) => {
              // This will run on successfull function return, which will save the result to the data store for analytics
              console.log(results);
              counter++;
              this.analyticsService.analytics_lists.push(results);
              if(counter == dimensions.data.need_functions.length ){
                if(analytics){ this.analyticsService.analytics_lists.push(analytics) }
                const tableObject = this.visualization.drawTable(this.analyticsService.mergeAnalyticsCalls(this.analyticsService.analytics_lists), table_structure);
                this.showTable = true;
                this.tableObject = tableObject;
                this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
              }
              // this.store.dispatch(new AddSingleEmptyAnalyticsAction({analytics: results, dataId: value.id}));
            },
            error: (error) => {
              console.log('error');
            },
            progress: (progress) => {
              console.log('progress');
            }
          };
          // check if the data element is in function and if so return the mapping object
          let mapped = _.find(this.mappings, ['id', value.id]);
          if (mapped) {
            // If there is a function for a data find the function and run it.
            let use_function = _.find(this.functions, ['id', mapped['function']]);
            let execute = Function('parameters', use_function['function']);
            execute(parameters);
          }
      });

    }else{
      if(analytics){
        this.analyticsService.analytics_lists.push(analytics)
        const tableObject = this.visualization.drawTable(analytics, table_structure);
        this.showTable = true;
        this.tableObject = this.analyticsService.addRowTotal(tableObject);
        this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
      }
    }
  }

  loadAutoGrowing (dimensions) {
    this.autoGrowingData = [];
    this.loadingAutogrowing = true;
      //Dealing with auto-growing
      let counter = 0;
      if(dimensions.data.auto_growing.length == 0){
        this.loadingAutogrowing = false;
      }else{

      }
      dimensions.data.auto_growing.forEach( (value) =>{
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
      });
  }

  setSelectedPeriod( value ){
    this.store.dispatch( new SelectPeriodAction( value ) );
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
    // this.addAnalytics(this.dimensions)
  }

  setLayout( value ){
    this.store.dispatch( new SetLayoutAction( value ) );
    this.updateTable();
  }

  updateOptions( value ){
    this.store.dispatch( new UpdateOptionsAction( value ) );
    this.updateTable();
  }

  toogleDataArea() {
    this.store.dispatch( new ToggleDataAreaAction() );
  }

  setSelectedData( value ){
    console.log("emited value",value)
    this.store.dispatch( new SelectDataAction( value ) );
    console.log(this.analyticsService.getAnalyticsparams(this.dimensions.dimensions))
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
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
    let new_update_available = this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions);
    this.needForUpdate = false;
    this.analyticsService.prepareAnalytics(this.dimensions.dimensions, new_update_available).subscribe(analytics => {
      // check first if there is normal data selected
      this.store.dispatch( new UpdateCurrentAnalyticsOptionsAction(this.analyticsService.getAnalyticsparams(this.dimensions.dimensions)));
      this.analyticsService.current_normal_analytics = analytics;
      let table_structure = {
        showColumnTotal: this.options.column_totals,
        showRowTotal: this.options.hide_empty_row,
        showRowSubtotal: this.options.row_sub_total,
        showDimensionLabels: this.options.dimension_labels,
        hideEmptyRows: this.options.hide_empty_row,
        showHierarchy: this.options.show_hierarchy,
        title: this.options.table_title,
        rows: this.layout.rows,
        columns: this.layout.columns,
        displayList: false,
      };
      //loading additional functions
      this.performFunctionCalculations(this.dimensions,analytics,table_structure);


      //loading autogrowing tables
      this.loadAutoGrowing(this.dimensions);

    });
    //this.store.dispatch( new AddDataAnalyticsAction())
    /**
     * Get current dimensions .i.e data (dx), period (pe), orgunit(ou) and catCombo (co) if any
     * @type {Array}
     */

  }

  downloadExcel(){
    let headers = [];
    let newRows = _.cloneDeep(this.tableObject);
    this.tableObject.headers.forEach((header) => {
      let someItems = [];
      header.items.forEach((item) => {
        for( let i=0;i<item.span; i++){
          someItems.push(item.name)
        }
      });
      headers.push(someItems)
    });

    let length = newRows.rows[0].items.length;
    newRows.rows.forEach((row) => {
      console.log(length-row.items.length);
      for(let k=0; k < length-row.items.length; k++){
          row.items.unshift({name:"",value:""})
      }
    });
    let csvHeaders = [];
    headers.forEach((header) => {
      header.forEach((singleHeader, index) => {
        if(csvHeaders[index]){
          csvHeaders[index] += " "+singleHeader;
        }else{
          csvHeaders[index] = singleHeader;
        }
      });
    });
    csvHeaders = newRows.titles.rows.concat(csvHeaders);
    let dataValues = [];
    newRows.rows.forEach((row) => {
      let dataObject = {};
      csvHeaders.forEach((header,index) => {
        dataObject[header] = (row.items[index].val)?row.items[index].val:"";
      });
      dataValues.push(dataObject);
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false
    };
    new Angular2Csv(dataValues, 'My Report',options);
    return {
      headers: csvHeaders,
      data: dataValues
    }
  }

  addParentToAnalytics(analytics){

  }
}
