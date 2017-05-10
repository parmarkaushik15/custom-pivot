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
      name: string,
      value:string},
    selectedData: {
      itemList:any[],
      selectedData:any,
      hideQuarter:boolean,
      hideMonth:boolean
    };
    selectedDataType: string[];
    selectedGroup: any;
    tableObject:any;
    currentAnalytics: any;
    selectedPeriodType: string;
    currentGroupList:any[];
    currentDataItemList:any[];
    dataOptions: any;
    layout:any;

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
    items: null,
    name: 'pe',
    value: null},
  selectedData: {
    itemList:[],
    selectedData: {
      items: null,
      name: 'dx',
      value: null},
    hideQuarter:false,
    hideMonth:false
  },
  selectedDataType: [],
  selectedGroup: {id:'ALL',name:'All Data'},
  tableObject:null,
  currentAnalytics: null,
  selectedPeriodType: "Monthly",
  currentGroupList:[],
  currentDataItemList:[],
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
    excluded:['co']
  }
};
