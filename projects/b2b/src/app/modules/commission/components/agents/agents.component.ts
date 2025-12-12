import { Component, OnInit } from '@angular/core';
import { AGENTS } from './demo/agents';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  pageSize = 2;
  page=1;
  collectionSize = AGENTS.length; 
  agentsData = [];
  displayColumn: string[];
  tabLinks = [
    { 
      label: 'Agent List',
      icon: 'fa fa-users',
      customClass: '',
    },
   ];

  ngOnInit() {
    this.agentsData = AGENTS;
    this.displayColumn = Object.keys(this.agentsData[0]);
  }

  onSelect(tab, i) {
  }
}
