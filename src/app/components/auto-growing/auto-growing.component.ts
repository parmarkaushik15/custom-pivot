import {Component, OnInit, Input} from '@angular/core';
import {VisualizerService} from "../../services/visualizer.service";

@Component({
  selector: 'app-auto-growing',
  templateUrl: './auto-growing.component.html',
  styleUrls: ['./auto-growing.component.css']
})
export class AutoGrowingComponent implements OnInit {

  @Input() autogrowings:any = null;
  tableObject: any = null
  constructor(private visualization: VisualizerService) {

  }

  ngOnInit() {
    let table_structure = {
      showColumnTotal: false,
      showRowTotal: false,
      showRowSubtotal: false,
      showDimensionLabels: false,
      hideEmptyRows: false,
      showHierarchy: false,
      rows: ['pe'],
      columns: ['dx'],
      displayList: false
    };
    console.log(this.tableObject)
    if(this.autogrowings[0]){
      this.tableObject = this.visualization.drawTable(this.autogrowings[0].analytics, table_structure);
      console.log(this.tableObject)
    }

  }

}
