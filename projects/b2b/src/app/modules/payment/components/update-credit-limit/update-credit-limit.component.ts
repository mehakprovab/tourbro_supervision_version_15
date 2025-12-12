import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-credit-limit',
  templateUrl: './update-credit-limit.component.html',
  styleUrls: ['./update-credit-limit.component.scss']
})
export class UpdateCreditLimitComponent implements OnInit {

  navLinks = [
    {
        label: 'Update Credit Limit',
        icon: 'fa fa-edit',
        component: 'updateCreditLimit'
    },
    {
        label: 'Credit History',
        icon: 'fa fa-edit',
        component: 'creditHistory',
    }
]

  constructor() { }

  ngOnInit() {
  }

  onSelect() {}

}
