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
import {
  CATEGORY_COMBOS_KEY,
  DATAELEMENT_GROUP_KEY, DATAELEMENT_KEY, DATASET_KEY, INDICATOR_GROUP_KEY, INDICATOR_KEY,
  ORGANISATION_UNIT_KEY, PROGRAM_KEY
} from "./services/local-storage.service";
import {DataFilterComponent} from "./components/data-filter/data-filter.component";

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
  selected_orgunit_model:any;
  // top data selection area selection
  showDx:boolean = false;
  showPe:boolean = false;
  showOu:boolean = false;
  @ViewChild(PeriodFilterComponent)
  public periodComponent: PeriodFilterComponent;

  @ViewChild(PeriodFilterComponent)
  public periodComponent1: PeriodFilterComponent;

  @ViewChild(DataFilterComponent)
  public datafilter: DataFilterComponent;
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
    this.dataService.getDataFromLocalDatabase(ORGANISATION_UNIT_KEY).subscribe();
    this.currentLayout = this.layout;
    this.dataService.getAllMappings().subscribe((val) => {
      this.store.dispatch( new AddFunctionMappingAction(val) );
    });

    this.dataService.getFunctions().subscribe((val) => {
      this.store.dispatch( new AddFunctionsAction(val) );

    });
    // this.analyticsService.addParentOu("");
  }

  selected_orgunits: any;
  setSelectedOrgunit( value ){
    this.selected_orgunits = value.items;
    this.store.dispatch( new SelectOrgunitAction( value ) );
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
    // this.addAnalytics(this.dimensions)
  }

  setOrgunitModel( value ){
    this.selected_orgunit_model = value;
    this.store.dispatch( new SetOrgunitModelAction( value ) );
  }

  performFunctionCalculations(dimensions,analytics,table_structure){
    this.analyticsService.analytics_lists = [];
    if(!analytics && dimensions.data.need_functions.length == 0){
      this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
    }
    if( dimensions.data.need_functions.length > 0 ) {
      let counter = 0;
      dimensions.data.need_functions.forEach( (mapping) => {
        this.dataService.getMapping(mapping).subscribe( (value) => {
          // Constructing analytics parameters to pass on the function call
          console.log("period passed",_.find(dimensions.dimensions, ['name', 'pe'])['value']);
          let parameters = {
            dx: value.id,
            ou: _.find(dimensions.dimensions, ['name', 'ou'])['value'],
            pe: _.find(dimensions.dimensions, ['name', 'pe'])['value'],
            success: (results) => {
              // This will run on successfull function return, which will save the result to the data store for analytics
              console.log("returned analytics",results)
              counter++;
              this.analyticsService.analytics_lists.push(results);
              if(counter == dimensions.data.need_functions.length ){
                if(analytics){ this.analyticsService.analytics_lists.push(analytics) }
                const tableObject = this.visualization.drawTable(this.analyticsService.mergeAnalyticsCalls(this.analyticsService.analytics_lists), table_structure);
                this.showTable = true;
                this.tableObject = tableObject;
                this.tableObject = (table_structure.showRowTotal)?this.analyticsService.addRowTotal(this.tableObject):this.tableObject;
                this.tableObject = (table_structure.showColumnTotal)?this.analyticsService.addColumnTotal(this.tableObject):this.tableObject;
                this.tableObject = (table_structure.showRowSubtotal)?this.analyticsService.addRowSubtotal(this.tableObject):this.tableObject;
                this.tableObject = (table_structure.showColumnSubTotal)?this.analyticsService.addColumnSubTotal(this.tableObject):this.tableObject;
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
          console.log(value)
            // If there is a function for a data find the function and run it.
            let use_function = _.find(this.functions, ['id', value.function]);
            let execute = Function('parameters', use_function['function']);
            execute(parameters);
        })

      });

    }else{
      if(analytics){
        console.log("naanza kufanya kazi")
        this.analyticsService.analytics_lists.push(analytics)
        const tableObject = this.visualization.drawTable(analytics, table_structure);
        this.showTable = true;
        this.tableObject = tableObject;
        // this.tableObject = this.analyticsService.addParentOu(tableObject);
        this.tableObject = (table_structure.showRowTotal)?this.analyticsService.addRowTotal(this.tableObject):this.tableObject;
        this.tableObject = (table_structure.showColumnTotal)?this.analyticsService.addColumnTotal(this.tableObject):this.tableObject;
        this.tableObject = (table_structure.showRowSubtotal)?this.analyticsService.addRowSubtotal(this.tableObject):this.tableObject;
        this.tableObject = (table_structure.showColumnSubTotal)?this.analyticsService.addColumnSubTotal(this.tableObject):this.tableObject;
        this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
      }
    }
  }

  updatingStore:boolean = false;
  updatingParcentage = 0;
  updateStore(){
    let num = 0;
    this.updatingStore = true;
    this.dataService.addDataToLocalDatabase(DATASET_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(DATAELEMENT_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(DATAELEMENT_GROUP_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(INDICATOR_GROUP_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(INDICATOR_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(PROGRAM_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.dataService.addDataToLocalDatabase(CATEGORY_COMBOS_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
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
              // console.log(results)
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

  selected_periods:any;
  setSelectedPeriod( value ){
    this.selected_periods = value.items;
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
    this.store.dispatch( new SelectDataAction( value ) );
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
    this.hideMonth = value.hideMonth;
    this.hideQuarter = value.hideQuarter;
    if(this.periodComponent){

      this.periodComponent.resetSelection( value.hideMonth, value.hideQuarter );
    }if(this.periodComponent1){

      this.periodComponent1.resetSelection( value.hideMonth, value.hideQuarter );
    }
  }

  allAvailable( dimensions ):boolean{
    let checker = true;
    if(dimensions.data.itemList.length == 0 || this.selected_orgunits.length == 0 || this.selected_periods.length == 0){
      checker = false;
    }
    return checker;
  }

  allDimensionAvailable = false;
  updateTable() {
    this.tableObject = null;
    this.allDimensionAvailable = this.allAvailable(this.dimensions);
    this.store.dispatch( new SendNormalDataLoadingAction({loading:true, message:"Loading data, Please wait"}));
    // this.showTable = false;
    this.showAutoGrowingTable = false;
    // let new_update_available = this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions);
    this.needForUpdate = false;
    this.analyticsService.prepareAnalytics(this.layout,this.dimensions.dimensions, false).subscribe(analytics => {
      // check first if there is normal data selected
      this.store.dispatch( new UpdateCurrentAnalyticsOptionsAction(this.analyticsService.getAnalyticsparams(this.dimensions.dimensions)));
      this.analyticsService.current_normal_analytics = analytics;
      let table_structure = {
        showColumnTotal: this.options.column_totals,
        showColumnSubTotal: this.options.column_sub_total,
        showRowTotal: this.options.row_totals,
        showRowSubtotal: this.options.row_sub_total,
        showDimensionLabels: this.options.dimension_labels,
        hide_zeros: this.options.hide_empty_row,
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
