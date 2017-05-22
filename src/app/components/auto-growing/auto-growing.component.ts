import {Component, OnInit, Input, ViewChild,ElementRef} from '@angular/core';
import {VisualizerService} from "../../services/visualizer.service";
declare var $:any, HTMLCollection:any, Element:any, NodeList:any;

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
  tableObject:any = null

  constructor(private visualization:VisualizerService) {

  }

  @ViewChild('tbody') private tbody:ElementRef;

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
      this.tableObject = this.visualization.drawAutogrowingTable(this.autogrowing.analytics, table_structure);
      setTimeout(this.mergingCallBack())
    }
  }

  dynamicSort(property) {
    return function (obj1, obj2) {
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

  mergingCallBack() {
    let scope:any = this.autogrowing.analytics.merge;
    this.controller(scope)
    return ()=> {
      let elem = this.tbody.nativeElement;
      let dataElementIndexes = [];
      scope.config.groupBy.forEach(function (group, index) {
        scope.data.dataElements.forEach(function (dataElement, cindex) {
          if (scope.config.groupBy[index] == dataElement.id) {
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
              if (trElement.children[dataElementIndex + 1]) {
                let el = trElement.children[dataElementIndex + 1];
                {
                  if (row == index) {
                    adjacentString += $(el).html().trim().toLowerCase();
                  }
                }
              }
            })
            /*elem.find("td:nth-child(" + (dataElementIndex + 1) + ")").each(function (index, el) {

             })*/
          }
        });
        return adjacentString;
      }

      for (var i = 0; i <= scope.data.dataElements.length; i++) {
        var dataIndex = i;
        if(dataIndex > 0){
          dataIndex = i - 1;
        }
        var previous = null, previousFromFirst = null, cellToExtend = null, rowspan = 1;
        if (scope.config.groupBy.indexOf(scope.data.dataElements[dataIndex].id) > -1) {
          elem.children.forEach((trElement, index)=> {
            if (trElement.children[i]) {
              let el = trElement.children[i];
              {
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
              }
            }
          })
        } else //if(scope.config.continuous)
        {
          elem.children.forEach((trElement, index)=> {
            if (trElement.children[i]) {
              let el = trElement.children[i];
              {
                console.log("Here")
                if (previous == adjacentToGroup(index, i)) {
                  $(el).addClass('hidden');
                  if (scope.config.valueTypes) {
                    if (scope.config.valueTypes[scope.config.dataElements[i - 1]] == 'min' ||
                      scope.config.valueTypes[scope.config.dataElements[i - 1]] == 'max') {
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
                    if (scope.config.valueTypes) {
                      if (scope.config.valueTypes[scope.config.dataElements[i - 1]] == 'int') {
                        cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")"));
                      } else if (scope.config.valueTypes[scope.config.dataElements[i - 1]] == 'min' ||
                        scope.config.valueTypes[scope.config.dataElements[i - 1]] == 'max') {

                      } else {
                        cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")").toFixed(1));
                      }
                    } else {
                      if (scope.config.list) {
                        if (scope.config.list == scope.config.dataElements[i - 1]) {
                          if (firstValue.indexOf(secondValue) == -1) {
                            cellToExtend.html(firstValue + "<br /> " + secondValue);
                          }
                        } else {
                          cellToExtend.html(eval("(" + firstValue + " + " + secondValue + ")").toFixed(1));
                        }
                      } else {
                        if (scope.config.dataElementsDetails[i - 1].aggregationType == "AVERAGE") {
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
      if (scope.config.valueTypes) {
        for (var i = 1; i <= scope.data.dataElements.length; i++) {
          elem.find("td:nth-child(" + i + ")").each(function (index, el) {

            if ((scope.config.valueTypes[scope.config.dataElements[i]] == 'min' || scope.config.valueTypes[scope.config.dataElements[i]] == 'max') && $(el).attr('rowspan') != null) {
              for (var counter = index + 1; counter <= (index + ($(el).attr('rowspan') - 1)); counter++) {
                var topHtml = parseFloat($(elem.children[index].children[i]).html());
                var current = parseFloat($(elem.children[counter].children[i]).html());

                if (scope.config.valueTypes[scope.config.dataElements[i]] == 'min') {
                  if (topHtml > current) {
                    $(elem.children[index].children[i]).html(current.toFixed(1));
                  }
                }
                if (scope.config.valueTypes[scope.config.dataElements[i]] == 'max') {
                  if (topHtml < current) {
                    $(elem.children[index].children[i]).html(current.toFixed(1));
                  }
                }
              }
            }
          })
        }
      }
      if (scope.config.dec) {
        for (var i = 1; i <= scope.data.dataElements.length; i++) {
          elem.find("td:nth-child(" + i + ")").each(function (index, el) {
            if (scope.config.dec == scope.config.dataElements[i]) {
              $(elem.children[index].children[i]).html(parseFloat($(elem.children[index].children[i]).html()).toFixed(1));
            }
          })
        }
      }

      if (scope.config.groupAdd) {
        firstColumnBrakes = [];
        scope.config.groupAdd.forEach(function (dataElementId) {
          scope.data.dataElements.forEach(function (dataElement, i) {
            if (dataElementId == dataElement.id) {
              elem.find("td:nth-child(" + i + ")").each(function (index, el) {
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
      if (scope.config.indicators) {
        scope.config.indicators.forEach(function (indicator) {
          if (indicator.position) {
            scope.config.dataElements.splice(indicator.position, 0, indicator.position);
          }
        });
        elem.find("tr").each(function (trIndex, trElement) {
          scope.config.indicators.forEach(function (indicator) {
            var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
            scope.data.dataElements.forEach(function (dataElement) {
              if (eventIndicator.indexOf(dataElement.id) > -1) {
                var dataElementIndex = scope.config.dataElements.indexOf(dataElement.id);
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
      toFixed.forEach(function (child) {
        child.html(parseFloat(child.html()).toFixed(1));
      })
      this.show = true;
    }
  }

  controller($scope:any) {
    $scope.data = {
      dataElements: [],
      events: []
    };
    $scope.getDataElementName = function (id) {
      var name = "";
      $scope.config.dataElementsDetails.forEach(function (dataElement) {
        if (dataElement.id == id) {
          name = dataElement.name;
        }
      });
      return name;
    };

    if ($scope.config.cumulativeToDate) {
      var addDataElements = [];
      var addedIndexes = 0;
      $scope.config.cumulativeToDate.forEach(function (cumulativeDataElement) {
        $scope.config.dataElementsDetails.forEach(function (dataElement, index) {
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
      addDataElements.forEach(function (addDataElements) {
        $scope.config.dataElementsDetails.splice(addDataElements.index, 0, addDataElements.dataElement)
        $scope.config.dataElements.splice(addDataElements.index, 0, addDataElements.dataElement.id);
      })
    }
    var averagingOccurences = {};
    if ($scope.config.valueTypes) {
      $scope.config.dataElementsDetails.forEach(function (dataElement) {
        if ($scope.config.valueTypes[dataElement.id] == "int") {
          $scope.config.data.forEach(function (eventData) {
            var value = parseInt(eventData[dataElement.name]);
            if (isNaN(value)) {
              value = 0;
            }
            eventData[dataElement.name] = value + "";
          });
        }
      });
    }
    $scope.config.dataElements.forEach(function (dataElementId) {
      if ($scope.config.dataElementsDetails) {
        $scope.config.dataElementsDetails.forEach(function (dataElement, index) {
          if (dataElement.id == dataElementId) {
            $scope.data.dataElements.push(dataElement);
            if (dataElement.aggregationType == "AVERAGE") {
              $scope.config.data.forEach(function (eventData) {
                if (averagingOccurences[eventData[$scope.config.dataElementsDetails[0].name]]) {
                  averagingOccurences[eventData[$scope.config.dataElementsDetails[0].name]]++;
                } else {
                  averagingOccurences[eventData[$scope.config.dataElementsDetails[0].name]] = 1;
                }
              });
              $scope.config.data.forEach(function (eventData) {
                eventData[dataElement.name] = eval("(" + eventData[dataElement.name] + "/" + averagingOccurences[eventData[$scope.config.dataElementsDetails[0].name]] + ")");
              })
            }
          }
        });
      }

    });
    if ($scope.config.groupBy) {//If grouping is required
      //$scope.data.groupedEvents = [];
      $scope.foundDataValues = {};


      $scope.config.groupBy.forEach(function (group, index) {
        if (index == 0) {
          //if($scope.config.data)
          {
            /*$scope.config.data.forEach(function (eventData) {
             //$scope.data.events.push(eventData);
             })*/
          }
        }

      });
      if ($scope.config.fourthQuarter) {
        $scope.config.groupBy.forEach(function (group, index) {
          if (index == 0) {
            $scope.config.otherData.forEach(function (eventData) {
              //$scope.data.events.push(eventData);
            })
          }

        });
      }
    } else {

      $scope.data.events = [];
      $scope.config.data.forEach(function (eventData) {

        if ($scope.config.cumulativeToDate) {
          var eventName = $scope.getDataElementName($scope.config.dataElements[0]);
          $scope.config.otherData.forEach(function (otherEvent) {
            if (otherEvent[eventName] == eventData[eventName]) {
              $scope.config.cumulativeToDate.forEach(function (cDataElement) {
                $scope.config.dataElements.forEach(function (dataElementId, index) {
                  if (dataElementId.indexOf(cDataElement.dataElement) != -1 && cDataElement.dataElement.length < dataElementId.length) {
                    var otherDataEventName = $scope.getDataElementName(dataElementId);
                    var initialOtherDataEventName = $scope.getDataElementName(cDataElement.dataElement);
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

        $scope.data.events.push(eventData);
      })
    }
    //Evaluate indicators if there calculations that need to be made
    if ($scope.config.indicators) {

      $scope.config.indicators.forEach(function (indicator, index) {
        $scope.data.dataElements.splice(indicator.position, 0, {name: "Inidicator" + index, valueType: "NUMBER"});
        //$scope.data.dataElements.push({name: "Inidicator" + index});
        $scope.data.events.forEach(function (event) {
          var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
          //Get indcator dataelements
          $scope.data.dataElements.forEach(function (dataElement) {
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
}
