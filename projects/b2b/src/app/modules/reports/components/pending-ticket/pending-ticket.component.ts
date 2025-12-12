import { Component, OnInit } from '@angular/core';
import * as mockData from './reportMockData';

@Component({
  selector: 'app-pending-ticket',
  templateUrl: './pending-ticket.component.html',
  styleUrls: ['./pending-ticket.component.scss']
})
export class PendingTicketComponent implements OnInit {

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
  }

  get whichReport() {
    return this.report || 'Flight';
  }

}

function getSearchOption() {
  return [
    {
      
    }
  ]
} 

function getLinks() {
  return [
    {
      icon: 'fa fa-plane',
      label: 'Flight Report',
      class: '',
      report: 'Flight',
    },
  ]
}