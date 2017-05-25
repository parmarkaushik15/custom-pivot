import {Component, OnInit, AfterViewInit, Output, EventEmitter, Input} from '@angular/core';
import {DataService} from "../../services/data.service";
import * as _ from 'lodash'
import {FuseSearchPipe} from "../../shared/pipes/fuse-search.pipe";

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css'],
  providers:[FuseSearchPipe]
})
export class DataFilterComponent implements OnInit, AfterViewInit {


  listItems:any[] = [];
  dataGroups: any[] = [];
  dataOptions: any[] = [
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
  ];
  selectedGroup:any = {id:'ALL',name:'All Data'};

  @Output() selected_data_option: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected_group: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDataUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedItems:any[] = [];
  querystring: string = null;
  listchanges: string = null;
  showGroups:boolean = false;
  showBody:boolean = false;
  metaData:any = {
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
    programs: [],
    dataSetGroups: [
      {id:'', name: "Reporting Rate"},
      {id:'.REPORTING_RATE_ON_TIME', name: "Reporting Rate on time"},
      {id:'.ACTUAL_REPORTS', name: "Actual Reports Submitted"},
      {id:'.ACTUAL_REPORTS_ON_TIME', name: "Reports Submitted on time"},
      {id:'.EXPECTED_REPORTS', name: "Expected Reports"}
    ]
  };
  loading:boolean = true;
  p:number = 1;
  k:number = 1;
  need_groups:boolean =true;
  searchOptions:any;
  constructor( private dataService: DataService, private fusePipe:FuseSearchPipe) { }

  ngOnInit() {
    this.searchOptions={
      shouldSort: true,
      tokenize: true,
      findAllMatches: true,
      threshold: 0,
      location: 0,
      distance: 100,
      maxPatternLength: 320,
      minMatchCharLength: 3,
      keys: [
        "name"
      ]
    };
    this.dataService.initiateData().subscribe(
      (items ) => {
        this.metaData = {
          dataElements: items[0],
          indicators: items[1],
          dataElementGroups: items[3],
          indicatorGroups: items[2],
          categoryOptions: items[5],
          dataSets: items[4],
          programs: items[6],
          dataSetGroups: [
            {id:'', name: "Reporting Rate"},
            {id:'.REPORTING_RATE_ON_TIME', name: "Reporting Rate on time"},
            {id:'.ACTUAL_REPORTS', name: "Actual Reports Submitted"},
            {id:'.ACTUAL_REPORTS_ON_TIME', name: "Reports Submitted on time"},
            {id:'.EXPECTED_REPORTS', name: "Expected Reports"}
          ]
        };
        this.loading = false;
        this.dataGroups = this.groupList();
        this.listItems = this.dataItemList();
      }
    )
  }

  ngAfterViewInit() {
     //
   }

  toggleDataOption(optionPrefix,event) {
    let someItems = this.manyItemsSelected(this.dataOptions, optionPrefix);
    if(event.ctrlKey) {
      this.dataOptions.forEach((value) => {
        if( value['prefix'] == optionPrefix ){
          value['selected'] = !value['selected'];
        }
      });
    } else {
      this.dataOptions.forEach((value) => {
        if( value['prefix'] == optionPrefix ){

          console.log(someItems)
          if(someItems.many && someItems.available){
            value['selected'] = true;
          }else{
            value['selected'] = !value['selected'];
          }
        }else{
            value['selected'] = false;

        }
      });
    }
    this.selectedGroup = {id:'ALL', name:'All Data'};
    this.dataGroups = this.groupList();
    this.listItems = this.dataItemList();
    this.p =1;
    this.listchanges = '';
  }

  manyItemsSelected(optios:any, optionPrefix:string){
    console.log(optios)
    let selected = {
      many: false,
      items: [],
      available: false
    };let counter = 0;
    optios.forEach(( option )=> {
      if(option['selected']) {
        counter++;
        selected.items.push(option);
        if(option['prefix'] == optionPrefix){
          selected.available = true;
        }
      }
    })
    if (counter > 1 ){
      selected.many = true
    }
    return selected;
  }

  setSelectedGroup(group) {
    this.listchanges = '';
    this.selectedGroup = group;
    this.listItems = this.dataItemList();
    this.showGroups = false;
    this.p = 1;
  }

  getSelectedOption(): any[] {
    let someArr = [];
    this.dataOptions.forEach((val) => {
      if (val.selected) {
        someArr.push(val);
      }
    });
    return _.map(someArr, 'prefix')
  }

  // get data Items data_element, indicators, dataSets
  getDataItems( ){
    let dataElements = [];
    this.metaData.dataElements.forEach((dataelement) => {
      dataElements.push(...this.getDetailedDataElements( dataelement ))
    });
    return {
      dx: dataElements,
      ind: this.metaData.indicators,
      dt: this.metaData.dataSets,
      at: this.metaData.programs
    }
  }

  // track by function to improve the list selection performance
  trackByFn(index, item) {
    return item.id; // or item.id
  }

  // this function helps you to get the detailed metadata
  getDetailedDataElements(dataElement ){
    let dataElements = [];
    let categoryCombo = this.getCategoryCombo( dataElement.categoryCombo.id);
    dataElements.push({
      id:dataElement.id,
      name:dataElement.name + "",
      dataSetElements:dataElement.dataSetElements
    });
    categoryCombo.categoryOptionCombos.forEach((option) => {
      if(option.name != 'default'){
        dataElements.push({
          id:dataElement.id+"."+option.id,
          name:dataElement.name + " "+option.name,
          dataSetElements:dataElement.dataSetElements
        })
      }

    });
    return dataElements;
  }

  // Helper to get the data elements option
  getCategoryCombo( uid ) : any{
    let category = null;
    this.metaData.categoryOptions.forEach((val) => {
      if( val.id == uid ){
        category = val;
      }
    });
    return category;

  }

  // Helper function to get data groups
  getData( ){
    return {
      dx: this.metaData.dataElementGroups,
      ind: this.metaData.indicatorGroups,
      dt: this.metaData.dataSetGroups
    }
  }

  // get the data list do display
  dataItemList() {
    let currentList = [];
    const group = this.selectedGroup;
    const selectedOptions = this.getSelectedOption();
    const data = this.getDataItems();
    // check if data element is in a selected group
    if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'de')){
      if( group.id == 'ALL' ){
        currentList.push(...data.dx)
      }else{
        if( group.hasOwnProperty('dataElements')){
          let newArray = _.filter(data.dx, (dataElement) => {
            return _.includes(_.map(group.dataElements,'id'), dataElement['id']);
          });
          currentList.push(...newArray)
        }

      }
      // check if data indicators are in a selected group
    }
    if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'in')){
      if( group.id == 'ALL' ){
        currentList.push(...data.ind)
      }else{
        if( group.hasOwnProperty('indicators')){
          let newArray = _.filter(data.ind, (indicator) => {
            return _.includes(_.map(group.indicators,'id'),indicator['id']);
          });
          currentList.push(...newArray)
        }
      }
      // check if data data sets are in a selected group
    }
    if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'cv')){
      if( group.id == 'ALL' ){
        this.metaData.dataSetGroups.forEach((group) => {
          currentList.push(...data.dt.map(data => {
            return {id:data.id + group.id, name:group.name+' '+data.name}
          }))
        });
      }else{
        currentList.push(...data.dt.map(data => {
          return {id:data.id + group.id, name:group.name+' '+data.name}
        }));
      }
    }
    if(_.includes(selectedOptions, 'ALL') || _.includes(selectedOptions,'at')){
      currentList.push(...data.at);
    }
    return currentList;

  }

  // Get group list to display
  groupList(){
    this.need_groups = true;
    let currentGroupList = [];
    const options = this.getSelectedOption();
    const data = this.getData();

    currentGroupList.push(...[{id:'ALL',name:'ALL'}]);
    if(_.includes(options, 'ALL') || _.includes(options,'de')){

      currentGroupList.push(...data.dx)
    }if(_.includes(options, 'ALL') || _.includes(options,'in')){
      currentGroupList.push(...data.ind)
    }if(_.includes(options, 'ALL') || _.includes(options,'cv')){
      currentGroupList.push(...data.dt)
    }if(_.includes(options,'at')){
      this.need_groups = false;
    }
    return currentGroupList;
  }

  // this will add a selected item in a list function
  addSelected(item){
    this.selectedItems.push(item);
    this.getSelectedPeriods();
    this.onDataUpdate.emit({
      itemList: this.selectedItems,
      auto_growing: this.getAutogrowingTables(this.selectedItems),
      selectedData: {name: 'dx', value: this.getDataForAnalytics(this.selectedItems)},
      hideQuarter:this.hideQuarter,
      hideMonth:this.hideMonth
    });
  }

  getAutogrowingTables(selections){
    let autogrowings = [];
    selections.forEach((value) => {
      if(value.hasOwnProperty('programType')){
        autogrowings.push(value);
      }
    });
    return autogrowings;
  }

  gettables(selections){
    let autogrowings = [];
    selections.forEach((value) => {
      if(value.hasOwnProperty('programType')){
      }else{
        autogrowings.push(value);
      }
    })
    return autogrowings;
  }

  // Remove selected Item
  removeSelected(item){
    this.selectedItems.splice(this.selectedItems.indexOf(item),1);
    this.getSelectedPeriods();
    this.onDataUpdate.emit({
      itemList: this.selectedItems,
      auto_growing: this.getAutogrowingTables(this.selectedItems),
      selectedData: {name: 'dx', value: this.getDataForAnalytics(this.selectedItems)},
      hideQuarter:this.hideQuarter,
      hideMonth:this.hideMonth
    });
  }

  //selecting all items
  selectAllItems(){
    let newList = this.fusePipe.transform(this.listItems , this.searchOptions , this.listchanges);
    newList.forEach((item) => {
      if(!this.checkDataAvailabilty(item, this.selectedItems )){
        this.selectedItems.push(item);
      }
    });
    this.onDataUpdate.emit({
      itemList: this.selectedItems,
      auto_growing: this.getAutogrowingTables(this.selectedItems),
      selectedData: {name: 'dx', value: this.getDataForAnalytics(this.selectedItems)},
      hideQuarter:this.hideQuarter,
      hideMonth:this.hideMonth
    });
  }

  //selecting all items
  deselectAllItems(){
    this.selectedItems = [];
    this.onDataUpdate.emit({
      itemList: this.selectedItems,
      auto_growing: this.getAutogrowingTables(this.selectedItems),
      selectedData: {name: 'dx', value: this.getDataForAnalytics(this.selectedItems)},
      hideQuarter:this.hideQuarter,
      hideMonth:this.hideMonth
    });
  }

  // Check if item is in selected list
  inSelected(item,list){
    let checker = false;
    for( let per of list ){
      if( per.id == item.id){
        checker =true;
      }
    }
    return checker;
  }

  // action that will fire when the sorting of selected data is done
  transferDataSuccess(data,current){
    if(data.dragData.id == current.id){
      console.log("Droping in the same area")
    }else{
      let number = (this.getDataPosition(data.dragData.id) > this.getDataPosition(current.id))?0:1;
      this.deleteData( data.dragData );
      this.insertData( data.dragData, current, number);
      this.onDataUpdate.emit({
        itemList: this.selectedItems,
        auto_growing: this.getAutogrowingTables(this.selectedItems),
        selectedData: {name: 'dx', value: this.getDataForAnalytics(this.selectedItems)},
        hideQuarter:this.hideQuarter,
        hideMonth:this.hideMonth
      });
    }
  }

  // helper method to find the index of dragged item
  getDataPosition(Data_id){
    let Data_index = null;
    this.selectedItems.forEach((Data, index) => {
      if(Data.id == Data_id){
        Data_index = index;
      }
    });
    return Data_index;
  }

  // help method to delete the selected Data in list before inserting it in another position
  deleteData( Data_to_delete ){
    this.selectedItems.forEach((Data, Data_index) => {
      if( Data_to_delete.id == Data.id){
        this.selectedItems.splice(Data_index,1);
      }
    });
  }

  // Helper method to insert Data in new position after drag drop event
  insertData( Data_to_insert, current_Data, num:number ){
    this.selectedItems.forEach((Data, Data_index) => {
      if( current_Data.id == Data.id && !this.checkDataAvailabilty(Data_to_insert,this.selectedItems) ){
        this.selectedItems.splice(Data_index+num,0,Data_to_insert);
      }
    });
  }

  // check if orgunit already exist in the orgunit display list
  checkDataAvailabilty(Data, array): boolean{
    let checker = false;
    for( let per of array ){
      if( per.id == Data.id){
        checker =true;
      }
    }
    return checker;
  }

  hideMonth:boolean = false;
  hideQuarter:boolean = false;
  getSelectedPeriods(){
    let periods = [];
    for (let data_item of this.selectedItems ){
      if(data_item.hasOwnProperty("dataSets")){
        for( let dataset of data_item.dataSets ){
          if(periods.indexOf(dataset.periodType) == -1){
            periods.push(dataset.periodType)
          }
        }
      }
      if(data_item.hasOwnProperty("dataSetElements")){
        for( let dataset of data_item.dataSetElements ){
          if(periods.indexOf(dataset.dataSet.periodType) == -1){
            periods.push(dataset.dataSet.periodType)
          }
        }

      }
    }
    if(this.selectedItems.length > 0){
      if(periods.indexOf("Monthly") == -1 && (periods.indexOf("Quarterly") != -1  || periods.indexOf("FinancialJuly") != -1 )){
        this.hideMonth = true;
      }else{
        this.hideMonth = false;
      }
      if(periods.indexOf("Monthly") == -1 && periods.indexOf("Quarterly") == -1 && periods.indexOf("FinancialJuly") != -1){
        this.hideMonth = true;
        this.hideQuarter = true;
      }else{
        this.hideQuarter = false;
      }
      if(periods.indexOf("Quarterly") != -1){
        this.hideQuarter = false;
      }

    }
  }

  getDataForAnalytics(selectedData) {
    let dataForAnalytics = "";
    selectedData.forEach((dataValue, dataIndex) => {
      if(dataValue.hasOwnProperty('programType')){
      }else{
        dataForAnalytics += dataIndex == 0 ? dataValue.id : ';' + dataValue.id;
      }
    });
    return dataForAnalytics;
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

}
