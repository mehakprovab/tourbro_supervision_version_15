import { Component, OnInit } from '@angular/core';
import * as mockData from './fakeData';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  tabsData: any;
  navLinks = [];
  report: string = '';
  isCollapsed = true;

  constructor() { }

  ngOnInit() {
    this.navLinks = getLinks();
    this.tabsData = mockData;
  }

  onSelect(tab, i) {
    this.report = tab.report;
  }

  beforeChange(e){
    // console.log("tabchage", e);
  }

  get whichReport() {
    return this.report || 'Flight';
  }

}

function getLinks() {
  return [
    {
      icon: 'fa fa-plane',
      label: 'Credit Limit Request',
      class: '',
      report: 'Flight',
    },
    {
      icon: 'fa fa-bed',
      label: 'Balance Request',
      class: '',
      report: 'Hotel',
    }
  ]
}
