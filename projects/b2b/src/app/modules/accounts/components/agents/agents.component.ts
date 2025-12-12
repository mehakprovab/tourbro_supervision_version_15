import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  agents: any;
  accounts = [{id:0,name:'Please Select'},{id:1,name:'Credit'},{id:2,name:'Debit'}];
  towards = [{id:0,name:'Please Select'},{id:2,name:'Flight Booking'}];
  accountType = 'Credit';
  showDetails = false;
  agentName = '';
  balance = '';
  currency = 'USD';
  agentForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.agentForm = this.fb.group({
      agents: 0,
      accounts: 'Please Select',
      accountType: 'Please Select',
      referenceNumber: '',
      towards: 0,
      amount: '',
      comments: ''
    });

    this.agents = [
      {
        id:0,
        name:'Please Select',
        balance: 0
      },
      {
        id: 1,
        name: 'abc',
        balance: 100
      },
      {
        id: 2,
        name: 'def',
        balance: 230
      },
      {
        id: 3,
        name: 'ghi',
        balance: 750
      }
    ];
  }

  onChange(t) {
    this.showDetails = Boolean(t);
    if(this.showDetails){
      const result = this.agents.find(r => r.id == t);
      this.balance = result.balance;
      this.agentName = result.name;
    }
    
  }

  onChangeType(t) {
    this.accountType = t;
  }

  onSubmit(t){
  }

}

