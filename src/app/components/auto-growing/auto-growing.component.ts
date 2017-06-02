import {Component, OnInit, Input, ViewChild,ElementRef} from '@angular/core';
import {VisualizerService} from "../../services/visualizer.service";
import {ExcelDownloadService} from "../../services/excel-download.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {PeriodService} from "../../services/period.service";
declare var $:any, HTMLCollection:any, Element:any, NodeList:any,unescape:any;

HTMLCollection.prototype.sort = function (callback) {
  //this.slice(callback);
  var items = Array.prototype.slice.call(this);
// Now we can sort it.  Sort alphabetically
  items.sort(callback);
  for (var i = 0, len = items.length; i < len; i++) {
    // store the parent node so we can reatach the item
    var parent = items[i].parentNode;
    // detach it from wherever it is in the DOM
    var detatchedItem = parent.removeChild(items[i]);
    // reatach it.  This works because we are itterating
    // over the items in the same order as they were re-
    // turned from being sorted.
    parent.appendChild(detatchedItem);
  }
}
HTMLCollection.prototype.forEach = function (callback) {
  //this.slice(callback);
  var items = Array.prototype.slice.call(this);
// Now we can sort it.  Sort alphabetically
  items.forEach(callback);
  for (var i = 0, len = items.length; i < len; i++) {
    // store the parent node so we can reatach the item
    var parent = items[i].parentNode;
    // detach it from wherever it is in the DOM
    var detatchedItem = parent.removeChild(items[i]);
    // reatach it.  This works because we are itterating
    // over the items in the same order as they were re-
    // turned from being sorted.
    parent.appendChild(detatchedItem);
  }
}
Element.prototype.remove = function () {
  if (this.parentElement)
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

@Component({
  selector: 'app-auto-growing',
  templateUrl: './auto-growing.component.html',
  styleUrls: ['./auto-growing.component.css']
})
export class AutoGrowingComponent implements OnInit {

  @Input() autogrowing:any = null;
  @Input() dataItems:any = null;
  @Input() layoutItems:any = {
    rows: ['pe'],
    columns: ['dx'],
    filters: ['ou'],
    excluded:['co']
  };
  @Input() title:string = "";
  tableObject:any = null;

  constructor(private localDbService: LocalStorageService,private excelDownloadService:ExcelDownloadService,private periodService:PeriodService) {

  }

  @ViewChild('tbody') private tbody:ElementRef;
  @ViewChild('autogrowingTable') private autogrowingTable:ElementRef;

  ngOnInit() {
    let table_structure = {
      showColumnTotal: false,
      showRowTotal: false,
      showRowSubtotal: false,
      showDimensionLabels: false,
      hideEmptyRows: false,
      showHierarchy: false,
      rows: ['event'],
      columns: ['dx'],
      displayList: false
    };
    if (this.autogrowing) {
      this.autogrowing.analytics.merge.config.dataElements.unshift("eventdate");
      this.autogrowing.analytics.merge.config.groupBy.unshift("eventdate");
      this.autogrowing.analytics.merge.config.dataElementsDetails.unshift({id:"eventdate",name:"Period",valueType:"TEXT",aggregationType: "NONE"});

      this.autogrowing.analytics.merge.config.dataElements.unshift("ouname");
      this.autogrowing.analytics.merge.config.groupBy.unshift("ouname");
      this.autogrowing.analytics.merge.config.dataElementsDetails.unshift({id:"ouname",name:"Organisation unit name",valueType:"TEXT",aggregationType: "NONE"});
      this.autogrowing.analytics.merge.config.dataElementsDetails.forEach(function(dataElementDetails:any,index){
        dataElementDetails.sortOrder = index;
      })

      this.$scope = this.autogrowing.analytics.merge;
      this.controller();
      var orgUnitIds:Array<any> = [];
      this.autogrowing.analytics.merge.config.data.forEach((event)=>{
        if(orgUnitIds.indexOf(event["Organisation unit"]) == -1){
          orgUnitIds.push(event["Organisation unit"]);
        }
      })
      console.log(JSON.stringify(this.autogrowing.analytics.merge.config.data));
      this.localDbService.getByKeys('organisation-units',orgUnitIds).subscribe((results)=>{
        console.log("Results:",this.autogrowing.analytics.metaData);
        var newData = [];
        this.autogrowing.analytics.metaData.pe.forEach((pe)=>{
          this.autogrowing.analytics.metaData.names[pe] = this.periodService.getPeriodName(pe);
          console.log("Wowo:",this.autogrowing.analytics.metaData.names[pe],this.autogrowing.analytics.metaData.ou,this.autogrowing.analytics.merge.config.data);
          this.autogrowing.analytics.metaData.ou.forEach((ou)=>{
            this.autogrowing.analytics.merge.config.data.forEach((event)=>{
              results.some((eventOU)=>{
                if(event["Organisation unit"] == eventOU.id){
                  if(eventOU.path.indexOf(ou) > -1){
                    console.log("Isue:",this.autogrowing.analytics.metaData.names[ou]);
                    event["Period"] = event["Event date"]
                    event["Organisation unit name"] = this.autogrowing.analytics.metaData.names[ou];
                    newData.push(event);
                  }
                  return true;
                }
              })
            })
          })
        })
        this.autogrowing.analytics.merge.config.data = newData;
        //this.mergingCallBack()();
        setTimeout(this.mergingCallBack())
      })
      //this.tableObject = this.visualization.drawAutogrowingTable(this.autogrowing.analytics, table_structure);
      //setTimeout(this.mergingCallBack())
    }
  }

  getOrganisationUnits(ids){

  }
  dynamicSort(property) {
    return (obj1, obj2) =>{
      return obj1.children[property].innerHTML.trim().toLowerCase() > obj2.children[property].innerHTML.trim().toLowerCase() ? 1
        : obj1.children[property].innerHTML.trim().toLowerCase() < obj2.children[property].innerHTML.trim().toLowerCase() ? -1 : 0;
    }
  }

  dynamicSortMultiple(indexes) {
    return (obj1, obj2)=> {
      var i = 0, result = 0;
      while (result === 0 && i < indexes.length) {
        result = this.dynamicSort(indexes[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }

  show = false;

  $scope:any;
  mergingCallBack() {

    return ()=> {
      let elem = this.tbody.nativeElement;
      let dataElementIndexes = [];
      this.$scope.config.groupBy.forEach((group, index)=> {
        this.$scope.data.dataElements.forEach((dataElement, cindex) =>{
          if (this.$scope.config.groupBy[index] == dataElement.id) {
            dataElementIndexes.push(cindex);
          }
        });
      });

      elem.children.sort(this.dynamicSortMultiple(dataElementIndexes));

      var firstColumnBrakes = [];
      var toFixed = [];

      function adjacentToGroup(row, column) {
        var adjacentString = "";
        dataElementIndexes.forEach(function (dataElementIndex) {
          //if (column > (dataElementIndex + 1))
          {
            elem.children.forEach((trElement, index)=> {
              if (trElement.children[dataElementIndex]) {
                let el = trElement.children[dataElementIndex];
                {
                  if (row == index) {
                    adjacentString += $(el).html().trim().toLowerCase();
                  }
                }
              }
            })
          }
        });
        return adjacentString;
      }

      for (var i = 0; i < this.$scope.data.dataElements.length; i++) {
        /*var dataIndex = i;
        if(dataIndex > 0){
          dataIndex = i - 1;
        }*/
        var dataIndex = i;
        var previous = null, previousFromFirst = null, cellToExtend = null, rowspan = 1;
        if (this.$scope.config.groupBy.indexOf(this.$scope.data.dataElements[dataIndex].id) > -1) {

          this.elementFind(elem,i,(index, el)=> {
            if ((previous == $(el).text().trim().toLowerCase() && $.inArray(index, firstColumnBrakes) === -1)) {
              $(el).addClass('hidden');
              cellToExtend.attr("rowspan", (rowspan = rowspan + 1));
            } else {
              if ($.inArray(index, firstColumnBrakes) === -1) {
                firstColumnBrakes.push(index);
              }
              rowspan = 1;
              previous = $(el).text().trim().toLowerCase();
              cellToExtend = $(el);
            }
          })
        } else //if(scope.config.continuous)
        {
          elem.children.forEach((trElement, index)=> {
            if (trElement.children[i]) {
              let el = trElement.children[i];
              {
                if (previous == adjacentToGroup(index, i)) {
                  $(el).addClass('hidden');
                  if (this.$scope.config.valueTypes) {
                    if (this.$scope.config.valueTypes[this.$scope.config.dataElements[i - 1]] == 'min' ||
                      this.$scope.config.valueTypes[this.$scope.config.dataElements[i - 1]] == 'max') {
                      cellToExtend.attr("rowspan", (rowspan = rowspan + 1));
                      return;
                    }
                  }
                  var firstValue = cellToExtend.html(), secondValue = $(el).html();
                  var firstValueSet = false, secondValueSet = false;
                  if (firstValue == "") {
                    firstValue = 0.0;
                    firstValueSet = true;
                  }
                  if (secondValue == "") {
                    secondValue = 0.0;
                    secondValueSet = true;
                  }
                  try {
                    if (this.$scope.config.valueTypes) {
                      if (this.$scope.config.valueTypes[this.$scope.config.dataElements[i - 1]] == 'int') {
                        cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")"));
                      } else if (this.$scope.config.valueTypes[this.$scope.config.dataElements[i - 1]] == 'min' ||
                        this.$scope.config.valueTypes[this.$scope.config.dataElements[i - 1]] == 'max') {

                      } else {
                        cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")").toFixed(1));
                      }
                    } else {
                      if (this.$scope.config.list) {
                        if (this.$scope.config.list == this.$scope.config.dataElements[i - 1]) {
                          if (firstValue.indexOf(secondValue) == -1) {
                            cellToExtend.html(firstValue + "<br /> " + secondValue);
                          }
                        } else {
                          cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")").toFixed(1));
                        }
                      } else {
                        if (this.$scope.config.dataElementsDetails[i - 1].aggregationType == "AVERAGE") {
                          cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")"));
                        } else {
                          cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")").toFixed(1));
                        }
                      }
                    }
                  } catch (e) {
                    //alert("Catch:" + scope.config.dataElements[i]);
                  }

                  cellToExtend.attr("rowspan", (rowspan = rowspan + 1));
                } else {
                  rowspan = 1;
                  //previous = $(el).text();
                  previous = adjacentToGroup(index, i).trim().toLowerCase();
                  cellToExtend = $(el);
                }
              }
            }
          })
        }

      }
      if (this.$scope.config.valueTypes) {
        for (var i = 1; i <= this.$scope.data.dataElements.length; i++) {
          this.elementFind(elem,i,(index, el)=> {

            if ((this.$scope.config.valueTypes[this.$scope.config.dataElements[i]] == 'min' || this.$scope.config.valueTypes[this.$scope.config.dataElements[i]] == 'max') && $(el).attr('rowspan') != null) {
              for (var counter = index + 1; counter <= (index + ($(el).attr('rowspan') - 1)); counter++) {
                var topHtml = parseFloat($(elem.children[index].children[i]).html());
                var current = parseFloat($(elem.children[counter].children[i]).html());

                if (this.$scope.config.valueTypes[this.$scope.config.dataElements[i]] == 'min') {
                  if (topHtml > current) {
                    $(elem.children[index].children[i]).html(current.toFixed(1));
                  }
                }
                if (this.$scope.config.valueTypes[this.$scope.config.dataElements[i]] == 'max') {
                  if (topHtml < current) {
                    $(elem.children[index].children[i]).html(current.toFixed(1));
                  }
                }
              }
            }
          })
        }
      }
      if (this.$scope.config.dec) {
        for (var i = 1; i <= this.$scope.data.dataElements.length; i++) {
          this.elementFind(elem,i, (index, el)=> {
            if (this.$scope.config.dec == this.$scope.config.dataElements[i]) {
              $(elem.children[index].children[i]).html(parseFloat($(elem.children[index].children[i]).html()).toFixed(1));
            }
          })
        }
      }

      if (this.$scope.config.groupAdd) {
        firstColumnBrakes = [];
        this.$scope.config.groupAdd.forEach((dataElementId)=> {
          this.$scope.data.dataElements.forEach((dataElement, i) =>{
            if (dataElementId == dataElement.id) {
              this.elementFind(elem,i, (index, el)=> {
                if (elem.children[index].children[i - 1].getAttribute('rowspan') != null) {
                  var span = parseInt(elem.children[index].children[i - 1].getAttribute('rowspan'));
                  elem.children[index].children[i].setAttribute('rowspan', span);
                  var previousVal = "";
                  for (var counter = 1; counter < span; counter++) {
                    $(elem.children[index + counter].children[i]).addClass('hidden');
                    if (elem.children[index + counter].children[i + 1].innerHTML != previousVal) {
                      elem.children[index].children[i].innerHTML = (parseFloat(elem.children[index].children[i].innerHTML) + parseFloat(elem.children[index + counter].children[i].innerHTML)).toFixed(1);
                    }
                    previousVal = elem.children[index + counter].children[i + 1].innerHTML;
                  }
                }
              })
            }
          })
        })
      }
      //re-calculate indicator values after merging rows
      if (this.$scope.config.indicators) {
        this.$scope.config.indicators.forEach((indicator)=>{
          if (indicator.position) {
            this.$scope.config.dataElements.splice(indicator.position, 0, indicator.position);
          }
        });
        elem.children.forEach((trElement,trIndex) =>{
          this.$scope.config.indicators.forEach((indicator)=>{
            var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
            this.$scope.data.dataElements.forEach((dataElement)=>{
              if (eventIndicator.indexOf(dataElement.id) > -1) {
                var dataElementIndex = this.$scope.config.dataElements.indexOf(dataElement.id);
                var value = trElement.children[dataElementIndex].innerText;
                eventIndicator = eventIndicator.replace("#{" + dataElement.id + "}", value);
              }
            });
            var valueCalculated = (eval('(' + eventIndicator + ')')).toFixed(1);
            if (isNaN(valueCalculated)) {
              valueCalculated = "";
            }
            trElement.children[indicator.position].innerText = valueCalculated;
          });
        });
      }
      toFixed.forEach((child)=> {
        child.html(parseFloat(child.html()).toFixed(1));
      })
      this.show = true;
    }
  }

  elementFind(elem,i,callback){
    elem.children.forEach((trElement, index)=> {
      if (trElement.children[i]) {
        callback(index,trElement.children[i])
      }
    })
  }
  controller() {
    this.$scope.data = {
      dataElements: [],
      events: []
    };
    this.$scope.getDataElementName = (id) => {
      var name = "";
      this.$scope.config.dataElementsDetails.forEach( (dataElement)=> {
        if (dataElement.id == id) {
          name = dataElement.name;
        }
      });
      return name;
    };

    if (this.$scope.config.cumulativeToDate) {
      var addDataElements = [];
      var addedIndexes = 0;
      this.$scope.config.cumulativeToDate.forEach((cumulativeDataElement)=> {
        this.$scope.config.dataElementsDetails.forEach((dataElement, index)=>{
          if (cumulativeDataElement.after == dataElement.id) {
            addDataElements.push({
              dataElement: {
                id: dataElement.id + index,
                name: dataElement.name + index,
                valueType: dataElement.valueType
              }, index: index + 1 + addedIndexes
            });
            addedIndexes++;
          }
        });
      });
      addDataElements.forEach((addDataElements)=> {
        this.$scope.config.dataElementsDetails.splice(addDataElements.index, 0, addDataElements.dataElement)
        this.$scope.config.dataElements.splice(addDataElements.index, 0, addDataElements.dataElement.id);
      })
    }
    var averagingOccurences = {};
    if (this.$scope.config.valueTypes) {
      this.$scope.config.dataElementsDetails.forEach((dataElement) =>{
        if (this.$scope.config.valueTypes[dataElement.id] == "int") {
          this.$scope.config.data.forEach((eventData) =>{
            var value = parseInt(eventData[dataElement.name]);
            if (isNaN(value)) {
              value = 0;
            }
            eventData[dataElement.name] = value + "";
          });
        }
      });
    }
    this.$scope.config.dataElements.forEach((dataElementId) =>{
      if (this.$scope.config.dataElementsDetails) {
        this.$scope.config.dataElementsDetails.forEach((dataElement, index) =>{
          if (dataElement.id == dataElementId) {
            this.$scope.data.dataElements.push(dataElement);
            if (dataElement.aggregationType == "AVERAGE") {
              this.$scope.config.data.forEach((eventData) =>{
                if (averagingOccurences[eventData[this.$scope.config.dataElementsDetails[0].name]]) {
                  averagingOccurences[eventData[this.$scope.config.dataElementsDetails[0].name]]++;
                } else {
                  averagingOccurences[eventData[this.$scope.config.dataElementsDetails[0].name]] = 1;
                }
              });
              this.$scope.config.data.forEach((eventData)=>{
                eventData[dataElement.name] = eval("(" + eventData[dataElement.name] + "/" + averagingOccurences[eventData[this.$scope.config.dataElementsDetails[0].name]] + ")");
              })
            }
          }
        });
      }

    });
    if (this.$scope.config.groupBy) {//If grouping is required
      //this.$scope.data.groupedEvents = [];
      this.$scope.foundDataValues = {};


      this.$scope.config.groupBy.forEach((group, index)=>{
        if (index == 0) {
          //if(this.$scope.config.data)
          {
            this.$scope.config.data.forEach((eventData)=>{
             this.$scope.data.events.push(eventData);
             })
          }
        }

      });
      if (this.$scope.config.fourthQuarter) {
        this.$scope.config.groupBy.forEach((group, index)=>{
          if (index == 0) {
            this.$scope.config.otherData.forEach((eventData)=>{
              this.$scope.data.events.push(eventData);
            })
          }

        });
      }
    } else {

      this.$scope.data.events = [];
      this.$scope.config.data.forEach((eventData)=>{

        if (this.$scope.config.cumulativeToDate) {
          var eventName = this.$scope.getDataElementName(this.$scope.config.dataElements[0]);
          this.$scope.config.otherData.forEach((otherEvent)=>{
            if (otherEvent[eventName] == eventData[eventName]) {
              this.$scope.config.cumulativeToDate.forEach((cDataElement)=>{
                this.$scope.config.dataElements.forEach((dataElementId, index)=>{
                  if (dataElementId.indexOf(cDataElement.dataElement) != -1 && cDataElement.dataElement.length < dataElementId.length) {
                    var otherDataEventName = this.$scope.getDataElementName(dataElementId);
                    var initialOtherDataEventName = this.$scope.getDataElementName(cDataElement.dataElement);
                    if (eventData[otherDataEventName]) {
                      eventData[otherDataEventName] = eval("(" + eventData[otherDataEventName] + "+" + otherEvent[initialOtherDataEventName] + ")").toFixed(1) + "";
                    } else {
                      eventData[otherDataEventName] = otherEvent[initialOtherDataEventName];
                    }
                  }
                })
              })
            }
          });
        }

        this.$scope.data.events.push(eventData);
      })
    }
    //Evaluate indicators if there calculations that need to be made
    if (this.$scope.config.indicators) {

      this.$scope.config.indicators.forEach((indicator, index)=>{
        this.$scope.data.dataElements.splice(indicator.position, 0, {name: "Inidicator" + index, valueType: "NUMBER"});
        //this.$scope.data.dataElements.push({name: "Inidicator" + index});
        this.$scope.data.events.forEach((event)=>{
          var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
          //Get indcator dataelements
          this.$scope.data.dataElements.forEach((dataElement)=>{
            if (eventIndicator.indexOf(dataElement.id) > -1) {
              //Replace formula with data value
              var value = "0";
              if (event[dataElement.name]) {
                value = event[dataElement.name];
              }
              eventIndicator = eventIndicator.replace("#{" + dataElement.id + "}", value);
            }
          });
          //Evaluate Indicator

          try {
            event["Inidicator" + index] = eval('(' + eventIndicator + ')');
          } catch (e) {

          }
        })
      });

    }
  }
  checkHide(index){
    if(this.$scope.config.hide){
      if(this.$scope.config.hide.indexOf(index) > -1){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  downloadExcel(){
    var date = new Date();
    var dateStr:any = date.getDate();
    if(dateStr < 10){
      dateStr = "0" + dateStr;
    }
    var monthStr:any = date.getMonth() + 1;
    if(monthStr < 10){
      monthStr = "0" + monthStr;
    }
    let fileName = this.autogrowing.analytics.metaData.names[this.$scope.config.programId] + " ";
    this.autogrowing.analytics.metaData.ou.forEach((ou,index)=>{
      if(index > 0){
        fileName += ","
      }
      fileName += this.autogrowing.analytics.metaData.names[ou];
    })

    this.autogrowing.analytics.metaData.pe.forEach((pe,index)=>{
      if(this.autogrowing.analytics.metaData.names[pe]){
        if(index > 0){
          fileName += ","
        }
        fileName += this.autogrowing.analytics.metaData.names[pe];
      }
    })
    fileName += " downloaded_on_" + dateStr + "-" + monthStr + "-" + date.getFullYear();
    this.excelDownloadService.download(fileName,this.autogrowingTable.nativeElement);
  }
}
