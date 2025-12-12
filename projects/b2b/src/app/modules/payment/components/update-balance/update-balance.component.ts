import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-balance',
  templateUrl: './update-balance.component.html',
  styleUrls: ['./update-balance.component.scss']
})
export class UpdateBalanceComponent implements OnInit {
  navLinks = [
    {
        label: 'New Balance Request',
        icon: 'fa fa-edit',
        component: 'newBalanceRequest'
    },
    {
        label: 'Sent Balance Request',
        icon: 'fa fa-edit',
        component: 'setBalanceRequest',
    }
]

constructor() { }

ngOnInit() {
}
onSelect() {

}
}
