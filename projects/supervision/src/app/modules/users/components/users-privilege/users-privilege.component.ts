import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-privilege',
  templateUrl: './users-privilege.component.html',
  styleUrls: ['./users-privilege.component.scss']
})
export class UsersPrivilegeComponent implements OnInit {

  privileges = [
    {
      id: 1,
      description: 'Dashboard view',
      enabled: true
    },
    {
      id: 2,
      description: 'Users',
      enabled: false
    },
    {
      id: 3,
      description: 'B2C Users',
      enabled: true
    }
  ];

  privilegesCopy = Object.values(JSON.parse(JSON.stringify(this.privileges)));

  allSelected = false;

  constructor() { }

  ngOnInit() {
   
  }

  updatePrivileges(){
  }

  selectAll(t){
    this.allSelected = Boolean(t);
    if(this.allSelected){
      this.privileges = this.privileges.map(t => ({...t, enabled: true}));
    } else {
      this.privileges = Object.values(JSON.parse(JSON.stringify(this.privilegesCopy)));
    }
  }

}
