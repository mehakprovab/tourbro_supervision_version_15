import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-percentage-commission',
  templateUrl: './percentage-commission.component.html',
  styleUrls: ['./percentage-commission.component.scss']
})
export class PercentageCommissionComponent implements OnInit {

    items: Array<{}> = [
        {
            icon: 'fa fa-plane',
            moduleName: 'FLIGHT',
            percentage: '12.1%'
        },
        {
            icon: 'fa fa-bed',
            moduleName: 'HOTEL',
            percentage: '0.91%'
        },
        {
            icon: 'fa fa-umbrella',
            moduleName: 'INSURANCE',
            percentage: '10.09%'
        }
    ]

  constructor() { }

  ngOnInit() {
  }

}
