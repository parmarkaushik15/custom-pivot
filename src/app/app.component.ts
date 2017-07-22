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
import {
  CATEGORY_COMBOS_KEY,
  DATAELEMENT_GROUP_KEY, DATAELEMENT_KEY, DATASET_KEY, INDICATOR_GROUP_KEY, INDICATOR_KEY, LocalStorageService,
  ORGANISATION_UNIT_KEY, PROGRAM_KEY
} from "./services/local-storage.service";
import {DataFilterComponent} from "./components/data-filter/data-filter.component";
import {Http} from "@angular/http";

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
  hiddenDataElements: any = [];
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
               private localDbService: LocalStorageService,
               private visualization: VisualizerService,
               private http:Http
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
    // get a list of mappings
    this.dataService.getAllMappings().subscribe((val) => {
      this.store.dispatch( new AddFunctionMappingAction(val) );
    });

    // get a list of all available functions
    this.dataService.getFunctions().subscribe((val) => {
      this.store.dispatch( new AddFunctionsAction(val) );
    });

    // get a list of data-elements to be hidden
    this.dataService.getHiddenDataElements().subscribe((val) => {
      val.forEach((hiddenDx) => {
        this.hiddenDataElements.push(hiddenDx.replace("_","."))
      });
    });


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

  // This function holds the logic for combining the logic for dataelements that are using functions and those not using functions and return one analytics
  performFunctionCalculations(dimensions,analytics,table_structure){
    this.analyticsService.analytics_lists = [];
    if(!analytics && dimensions.data.need_functions.length == 0){
      this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
    }
    if( dimensions.data.need_functions.length > 0 ) {
      let counter = 0;
      let periodArray = _.find(dimensions.dimensions, ['name', 'pe'])['value'].split(";");
      let orgUnitArray = _.find(dimensions.dimensions, ['name', 'ou'])['value'].split(";");
      let times = 0;
      periodArray.forEach((singlePeriod) => {
        orgUnitArray.forEach((singleOu) => {
          times++;
        })
      })
      dimensions.data.need_functions.forEach( (mapping) => {
        // Constructing analytics parameters to pass on the function call
        periodArray.forEach((singlePeriod) => {
          orgUnitArray.forEach((singleOu) => {
            let parameters = {
              dx: mapping.id,
              ou: singleOu,
              pe: singlePeriod,
              success: (results) => {
                // console.log(JSON.stringify(results));
                // This will run on successfull function return, which will save the result to the data store for analytics
                counter++;
                this.analyticsService.analytics_lists.push(results);
                if(counter == dimensions.data.need_functions.length*times ){
                  if(analytics){ this.analyticsService.analytics_lists.push(analytics) }
                  this.analyticsService.mergeAnalyticsCalls(this.analyticsService.analytics_lists,table_structure.showHierarchy).subscribe((combined_analytics) => {
                    this.tableObject = this.prepareTableObject(combined_analytics, table_structure);
                  });
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
            // If there is a function for a data find the function and run it.
            let use_function = _.find(this.functions, ['id', mapping.func]);
            let execute = Function('parameters', use_function['function']);
            execute(parameters);
          })
        })


      });

    }else{
      if(analytics){
        this.analyticsService.analytics_lists.push(analytics);
        this.analyticsService.mergeAnalyticsCalls(this.analyticsService.analytics_lists,table_structure.showHierarchy).subscribe((combined_analytics) => {
          this.tableObject = this.prepareTableObject(combined_analytics, table_structure);
        })

      }
    }
  }

  // this method will help to solve the issue of reuse of table object creation
  prepareTableObject(analyticsObject, tableStructure){
    let tableObject:any = this.visualization.drawTable(analyticsObject, tableStructure);
    this.showTable = true;
    tableObject = (tableStructure.showRowTotal)?this.analyticsService.addRowTotal(tableObject):tableObject;
    tableObject = (tableStructure.showRowAverage)?this.analyticsService.addRowAverage(tableObject):tableObject;
    tableObject = (tableStructure.showColumnAverage)?this.analyticsService.addColumnAverage(tableObject):tableObject;
    tableObject = (tableStructure.showColumnTotal)?this.analyticsService.addColumnTotal(tableObject):tableObject;
    tableObject = (tableStructure.showRowSubtotal)?this.analyticsService.addRowSubtotal(tableObject):tableObject;
    tableObject = (tableStructure.showColumnSubTotal)?this.analyticsService.addColumnSubTotal(tableObject):tableObject;
    tableObject = (tableStructure.showHierarchy)?this.analyticsService.addParentOu(tableObject):tableObject;
    this.store.dispatch( new SendNormalDataLoadingAction({loading:false, message:"Loading data, Please wait"}));
    return tableObject
  }

  updatingStore:boolean = false;
  updatingParcentage = 0;
  updateStore(){
    let num = 0;
    this.updatingStore = true;
    this.localDbService.clearAll(DATASET_KEY)
    this.localDbService.clearAll(DATASET_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(DATAELEMENT_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(DATAELEMENT_GROUP_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(INDICATOR_GROUP_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(INDICATOR_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(PROGRAM_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
    this.localDbService.clearAll(CATEGORY_COMBOS_KEY).subscribe(()=>{ num++; this.updatingParcentage= Math.floor((num/7)*100); if(num == 7){
      this.updatingStore = false; this.datafilter.initiateData();
    }});
  }

  // This function is used to hold all logic necessary for loading auto-growing tables
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
        _.find(dimensions.dimensions, ['name', 'ou'])['arrayed_org_units'].forEach((orgUnits)=>{
          var orgUnitIds = "";
          orgUnits.forEach((ou,index)=>{
            if(index > 0){
              orgUnitIds += ";";
            }
            orgUnitIds += ou.id;
          })
          let parameters = {
            dx: value.id,
            ou: orgUnitIds,
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
        })
      });
  }

  // This will be called every time period is changed
  selected_periods:any;
  setSelectedPeriod( value ){
    this.selected_periods = value.items;
    this.store.dispatch( new SelectPeriodAction( value ) );
    this.needForUpdate = !(this.lastAnalyticsParams == this.analyticsService.getAnalyticsparams(this.dimensions.dimensions));
    // this.addAnalytics(this.dimensions)
  }

  // This function is used to update the table layout
  setLayout( value ){
    this.store.dispatch( new SetLayoutAction( value ) );
    this.updateTable();
  }

  // this will be called every time options are updated
  updateOptions( value ){
    this.store.dispatch( new UpdateOptionsAction( value ) );
    this.updateTable();
  }

  toogleDataArea() {
    this.store.dispatch( new ToggleDataAreaAction() );
  }

  // This will be called every time data selection changes
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

  // This function will use selected dimension and check if user has selected both data, period and administration units.
  allAvailable( dimensions ):boolean{
    let checker = true;
    if(dimensions.data.itemList.length == 0 || this.selected_orgunits.length == 0 || this.selected_periods.length == 0){
      checker = false;
    }
    return checker;
  }

  // The function that will handle the data updating
  allDimensionAvailable = false;
  updateTable() {

    this.tableObject = null;
    this.allDimensionAvailable = this.allAvailable(this.dimensions);
    if(this.allDimensionAvailable){
      this.store.dispatch( new SendNormalDataLoadingAction({loading:true, message:"Loading data, Please wait"}));
      this.showAutoGrowingTable = false;
      this.needForUpdate = false;
      this.analyticsService.prepareAnalytics(this.layout,this.dimensions.dimensions, false).subscribe(analytics => {
        // check first if there is normal data selected
        this.store.dispatch( new UpdateCurrentAnalyticsOptionsAction(this.analyticsService.getAnalyticsparams(this.dimensions.dimensions)));
        this.analyticsService.current_normal_analytics = analytics;
        let table_structure = {
          showColumnTotal: this.options.column_totals,
          showColumnAverage: this.options.column_avg,
          showColumnSubTotal: this.options.column_sub_total,
          showRowTotal: this.options.row_totals,
          showRowAverage: this.options.row_avg,
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

      //update the system for data usage
      let json = 'http://ipv4.myexternalip.com/json';
      let dhis2Evnts = {events:[]}
      this.http.get(json).map(res=>res.json()).subscribe((result) => {
        this.dimensions.data.itemList.forEach((itemToUpdate)=>{
          dhis2Evnts.events.push( this.updateAccessLogs(itemToUpdate,result.ip) )
        });
        console.log("Events",dhis2Evnts)
        this.http.post("../../../api/events",dhis2Evnts).map(res=>res.json()).subscribe((result1) => {
          console.log(result1)
        });
        //
      });
    }else{
      this.showTable = true
    }


  }

  // this will be called when oppening pivot table
  openFavorite(favorite){

    //set orgunits
    this.setSelectedOrgunit(favorite.dataDimensions.ou);
    //set periods
    this.setSelectedData(favorite.dataDimensions.data);
    //set data
    this.setSelectedPeriod(favorite.dataDimensions.period);
    //set layout
    this.store.dispatch( new SetLayoutAction( favorite.layout ) );
    //set options
    this.store.dispatch( new UpdateOptionsAction( favorite.options ) );
    //update table
    setTimeout(()=>{
      this.updateTable();
    })
  }

  // update access log for every indicator accessed
  updateAccessLogs(data,ipAddress){
    let d = new Date();
    let curr_date:any	= d.getDate();
    let curr_month:any	= d.getMonth()+1;
    let curr_year 	= d.getFullYear();
    if(curr_month<10){
      curr_month="0"+curr_month;
    }
    if(curr_date<10){
      curr_date="0"+curr_date;
    }
    let RequestDateTime = curr_year+"-"+curr_month+"-"+curr_date;
    return {
      program: 'UOwc7u7EOX4',
      programStage: 'wenwxWjxmJT',
      status: "ACTIVE",
      orgUnit: 'zs9X8YYBOnK',
      eventDate: RequestDateTime,
      dataValues: [
        {
          dataElement: 'tgyz9410LhM',
          value: ''
        },{
          dataElement: 'Fsn1VHHLO99',
          value: data.name
        },{
          dataElement: 'QUeMonQ9w7q',
          value: data.type
        },{
          dataElement: 'atwoYgdxvgg',
          value: navigator.platform
        },{
          dataElement: 'mgtwnvohcow',//dutty post
          value: ""
        },{
          dataElement: 'N6x8L5LAp6o',//ip Address
          value: ipAddress
        },{
          dataElement: 'UvEng3cCnhS',
          value: RequestDateTime
        },{
          dataElement: 'IcsZOKnNtBX',
          value: this.getBrowserName(navigator)
        },{
          dataElement: 'ulKVzFSbkry',
          value: ""
        },{
          dataElement: 'hjCMP7fuJSD',
          value: ""
        }
      ]
    };

  }

  // Determine browser name
  getBrowserName(navig){
    let nVer = navig.appVersion;
    let nAgt = navig.userAgent;
    let browserName  = navig.appName;
    let fullVersion  = ''+parseFloat(navig.appVersion);
    let majorVersion = parseInt(navig.appVersion,10);
    let nameOffset,verOffset,ix;

    // In Opera 15+, the true version is after "OPR/"
    if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset+4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset+6);
      if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset+7);
      if ((verOffset=nAgt.indexOf("Version"))!=-1)
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
      (verOffset=nAgt.lastIndexOf('/')) )
    {
      browserName = nAgt.substring(nameOffset,verOffset);
      fullVersion = nAgt.substring(verOffset+1);
      if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navig.appName;
      }
    }

    return browserName+" ( "+fullVersion+" )";
  }

}
