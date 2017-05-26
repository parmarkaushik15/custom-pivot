import {Component, OnInit, Input} from '@angular/core';
import {Angular2Csv} from "angular2-csv";
import * as _ from "lodash"

@Component({
  selector: 'data-area',
  templateUrl: './data-area.component.html',
  styleUrls: ['./data-area.component.css']
})
export class DataAreaComponent implements OnInit {

  @Input() showTable:boolean = false;
  @Input() showAutoGrowingTable:boolean = false;
  @Input() loadingAutogrowing:boolean = false;
  @Input() needForUpdate:boolean = false;
  @Input() tableObject:any = null;
  @Input() dataItems:any = null;
  @Input() autoGrowingData:any = null;
  @Input() uiState:any = null;
  @Input() layoutItems:any = {
    rows: ['pe'],
    columns: ['dx'],
    filters: ['ou'],
    excluded:['co']
  };
  constructor(  ) { }

  ngOnInit() {
    console.log("data-area",this.autoGrowingData)
  }

  getTitle(){
    let title = [];
    let prefix = "";
    this.layoutItems.filters.forEach((val) => {
      if(val == 'ou'){
        if(this.dataItems.ou){
          prefix = this.dataItems.ou.starting_name;
          this.dataItems.ou.items.forEach((ous) => {
            title.push(ous.name);
          });
        }
      }
      if(val == 'pe'){
        if(this.dataItems.period){
          this.dataItems.period.items.forEach((ous) => {
            title.push(ous.name);
          });
        }
      }
    });
    return prefix + " " + title.join(", ");
  }

  sort_direction:string[] =[];
  current_sorting:boolean[]= [];
  sortData(tableObject, n,isLastItem){
    if(tableObject.columns.length == 1 && isLastItem){
      this.current_sorting = [];
      this.current_sorting[n] = true;
      let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById("myPivotTable");
      switching = true;
      //Set the sorting direction to ascending:
      dir = "asc";
      /*Make a loop that will continue until
       no switching has been done:*/
      while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 0; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
           one from current row and one from the next:*/
          x = rows[i].getElementsByTagName("TD")[n];
          y = rows[i + 1].getElementsByTagName("TD")[n];
          /*check if the two rows should switch place,
           based on the direction, asc or desc:*/
          if (dir == "asc") {
            if(parseFloat(x.innerHTML)){
              if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            }else{
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            }
            this.sort_direction[n] = "asc";
          } else if (dir == "desc") {
            if(parseFloat(x.innerHTML)){
              if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            }else{
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
              }
            }
            this.sort_direction[n] = "desc";
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
           and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          //Each time a switch is done, increase this count by 1:
          switchcount ++;
        } else {
          /*If no switching has been done AND the direction is "asc",
           set the direction to "desc" and run the while loop again.*/
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            this.sort_direction[n] = "desc";
            switching = true;
          }
        }
      }
    }

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

}
