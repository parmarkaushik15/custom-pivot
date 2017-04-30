


import {OrganisationUnit} from "../model/organisation-unit";
import {DataElement} from "../model/data-element";
import {Indicator} from "../model/indicator";
import {DataelementGroup} from "../model/dataelement-group";
import {IndicatorGroup} from "../model/indicator-group";
import {CategoryCombo} from "../model/category-combo";
export interface StoreData {

    organisationUnits: OrganisationUnit[];
    dataElements: DataElement[];
    indicators: Indicator[];
    dataElementGroups: DataelementGroup[];
    indicatorGroups: IndicatorGroup[];
    categoryOptions: CategoryCombo[];
    selectedOrgUnits:string;
    selectedPeriod: string;
    selectedData: string[];
    selectedDataType: string[];
    selectedGroup: string;
    currentAnalytics: any;
    selectedPeriodType: string;
    currentGroupList:any[];
    currentDataItemList:any[];
    dataOptions: any;

}

export const INITIAL_STORE_DATA: StoreData = {

  organisationUnits: [],
  dataElements: [],
  indicators: [],
  dataElementGroups: [],
  indicatorGroups: [],
  categoryOptions: [],
  selectedOrgUnits: null,
  selectedPeriod: null,
  selectedData: [],
  selectedDataType: [],
  selectedGroup: "all",
  currentAnalytics: null,
  selectedPeriodType: "Monthly",
  currentGroupList:[],
  currentDataItemList:[],
  dataOptions: [
    {
      name: 'All',
      prefix: 'all',
      selected: true},
    {
      name: 'Data Elements',
      prefix: 'de',
      selected: false
    },
    {
      name: 'Computed Values',
      prefix: 'in',
      selected: false
    },
    {
      name: 'Submission Status',
      prefix: 'cv',
      selected: false
    }
  ]
};
