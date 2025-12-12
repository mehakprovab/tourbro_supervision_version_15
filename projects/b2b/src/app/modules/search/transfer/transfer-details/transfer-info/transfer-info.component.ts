import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-info',
  templateUrl: './transfer-info.component.html',
  styleUrls: ['./transfer-info.component.scss']
})
export class TransferInfoComponent implements OnInit {
  @Input() transfers: any;
  @Input() isTransferBooking:any;

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
