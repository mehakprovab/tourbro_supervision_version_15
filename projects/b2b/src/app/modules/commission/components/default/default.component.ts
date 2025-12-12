import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  tabLinks = [
    { 
      label: 'Update Default Commission',
      icon: 'fa fa-plane',
      customClass: '',
    },
   ];
  constructor() { }

  ngOnInit() {
  }

  onSelect() {

  }
}
