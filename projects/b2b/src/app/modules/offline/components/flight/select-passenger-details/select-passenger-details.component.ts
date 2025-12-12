import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-passenger-details',
  templateUrl: './select-passenger-details.component.html',
  styleUrls: ['./select-passenger-details.component.scss']
})
export class SelectPassengerDetailsComponent implements OnInit {

  numOption = [
    1,2,3,4,5,6,7,8,9
  ]
  constructor() { }

  ngOnInit() {
  }

}
