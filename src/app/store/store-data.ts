import {OrganisationUnit} from "../model/organisation-unit";
import {DataElement} from "../model/data-element";
import {Indicator} from "../model/indicator";
import {DataelementGroup} from "../model/dataelement-group";
import {IndicatorGroup} from "../model/indicator-group";
import {CategoryCombo} from "../model/category-combo";
import {DataSet} from "../model/dataset";
export interface StoreData {

    organisationUnits: OrganisationUnit[];
    dataElements: DataElement[];
    indicators: Indicator[];
    dataElementGroups: DataelementGroup[];
    indicatorGroups: IndicatorGroup[];
    categoryOptions: CategoryCombo[];
    dataSets: DataSet[];
    dataSetGroups:any;
    selectedOrgUnits:any;
    selectedPeriod: {
      items: any,
      type: string,
      starting_year: number,
      name: string,
      value:string},
    selectedData: {
      auto_growing:any[],
      need_functions:any[],
      itemList:any[],
      selectedData:any,
      hideQuarter:boolean,
      hideMonth:boolean
    };
    selectedDataItems: string[];
    selectedGroup: any;
    tableObject:any[];
    dataAnalytics:any[];
    autoGrowingAnalytics:any[];
    currentAnalytics: any;
    currentEmptyAnalytics: any;
    selectedPeriodType: string;
    selectedYear: number;
    currentGroupList:any[];
    currentDataItemList:any[];
    dataOptions: any;
    layout:any;
    currentAnalyticsParams:string;
    orgunit_model: {
      selection_mode: string,
      selected_levels: any[],
      show_update_button:true,
      selected_groups: any[],
      orgunit_levels: any[],
      orgunit_groups: any[],
      selected_orgunits: any[],
      user_orgunits: any[],
      type:string,
      selected_user_orgunit: any[]
    },
    mapping:any[],
    functions:any[],
  options: {
    column_totals: boolean,
    row_totals: boolean,
    column_sub_total: boolean,
    row_sub_total: boolean,
    dimension_labels: boolean,
    hide_empty_row: boolean,
    show_hierarchy: boolean,
    table_title:string
  }

}

export const INITIAL_STORE_DATA: StoreData = {

  organisationUnits: [],
  dataElements: [],
  indicators: [],
  dataElementGroups: [],
  indicatorGroups: [],
  categoryOptions: [],
  dataSets: [],
  selectedOrgUnits: null,
  selectedPeriod: {
    items: [],
    type:"Monthly",
    starting_year:new Date().getFullYear(),
    name: 'pe',
    value: null},
  selectedData: {
    auto_growing:[],
    need_functions:[],
    itemList:[],
    selectedData: {
      items: null,
      name: 'dx',
      value: null},
    hideQuarter:false,
    hideMonth:false
  },
  selectedDataItems: [],
  selectedGroup: {id:'ALL',name:'All Data'},
  tableObject:[],
  dataAnalytics:[],
  autoGrowingAnalytics:[],
  currentAnalytics: null,
  currentEmptyAnalytics: null,
  selectedPeriodType: "Monthly",
  selectedYear: new Date().getFullYear(),
  currentGroupList:[],
  currentDataItemList:[],
  currentAnalyticsParams:"",
  dataOptions: [
    {
      name: 'All Data',
      prefix: 'ALL',
      selected: false},
    {
      name: 'Data Elements',
      prefix: 'de',
      selected: true
    },
    {
      name: 'Computed',
      prefix: 'in',
      selected: true
    },
    {
      name: 'Submissions',
      prefix: 'cv',
      selected: false
    },
    {
      name: 'Auto Growing',
      prefix: 'at',
      selected: false
    }
  ],
  dataSetGroups: [
    {id:'', name: "Reporting Rate"},
    {id:'.REPORTING_RATE_ON_TIME', name: "Reporting Rate on time"},
    {id:'.ACTUAL_REPORTS', name: "Actual Reports Submitted"},
    {id:'.ACTUAL_REPORTS_ON_TIME', name: "Reports Submitted on time"},
    {id:'.EXPECTED_REPORTS', name: "Expected Reports"}
  ],
  layout:{
    rows: ['pe'],
    columns: ['dx'],
    filters: ['ou'],
    excluded:[]
  },
  orgunit_model: {
    selection_mode: "Usr_orgUnit",
    selected_levels: [],
    show_update_button:true,
    selected_groups: [],
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type:"report", // can be 'data_entry'
    selected_user_orgunit: []
  },
  mapping:[],
  functions:[],
  options: {
    column_totals: false,
    row_totals: false,
    column_sub_total: false,
    row_sub_total: false,
    dimension_labels: false,
    hide_empty_row: false,
    show_hierarchy: false,
    table_title:""
  }
};
