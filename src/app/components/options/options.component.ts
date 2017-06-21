import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {OuterSubscriber} from "rxjs/OuterSubscriber";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  showLayout:boolean = false;
  @Input() options:any = {
    column_totals: false,
    row_totals: false,
    column_sub_total: false,
    row_sub_total: false,
    row_avg: false,
    column_avg: false,
    dimension_labels: false,
    hide_empty_row: false,
    show_hierarchy: false,
    table_title:""
  };

  @Output() onOptionUpdate : EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  updateOption(){
    this.onOptionUpdate.emit(this.options);
    this.showLayout = false;
  }

}
