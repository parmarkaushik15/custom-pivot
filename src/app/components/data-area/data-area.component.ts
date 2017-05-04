import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'data-area',
  templateUrl: './data-area.component.html',
  styleUrls: ['./data-area.component.css']
})
export class DataAreaComponent implements OnInit {

  @Input() dataItems;
  constructor() { }

  ngOnInit() {
    console.log(this.dataItems)
  }

}
