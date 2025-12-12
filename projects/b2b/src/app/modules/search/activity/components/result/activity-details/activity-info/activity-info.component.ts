import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrls: ['./activity-info.component.scss']
})
export class ActivityInfoComponent implements OnInit {
  @Input() activity: any;
  @Input() isActivityBooking:any;

  constructor() { }

  ngOnInit(): void {
  }

  getStarArray(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = Math.round(num);
    return starArr;
  }

  getStarArrayRemaining(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
      starArr.length = 5 - Math.round(num);
    return starArr;
  }
}
