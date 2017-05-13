import {Component, OnInit, Input} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";
import {AnalyticscreatorService} from "../../services/analyticscreator.service";

@Component({
  selector: 'data-area',
  templateUrl: './data-area.component.html',
  styleUrls: ['./data-area.component.css']
})
export class DataAreaComponent implements OnInit {

  @Input() dataItems:any = null;
  @Input() analyticsWithoutData:any = null;
  @Input() analyticsWithData:any = null;
  constructor( private store: Store<ApplicationState>, private analyticsService: AnalyticscreatorService ) { }

  ngOnInit() {
    console.log(this.dataItems)
  }

}
