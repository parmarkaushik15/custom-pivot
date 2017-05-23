import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'data-area',
  templateUrl: './data-area.component.html',
  styleUrls: ['./data-area.component.css']
})
export class DataAreaComponent implements OnInit {

  @Input() showTable:boolean = false;
  @Input() showAutoGrowingTable:boolean = false;
  @Input() tableObjects:any[] = [];
  @Input() dataItems:any = null;
  @Input() autoGrowingData:any = null;
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

}
