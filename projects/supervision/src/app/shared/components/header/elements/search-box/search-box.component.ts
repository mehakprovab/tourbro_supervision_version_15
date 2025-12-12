import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent implements OnInit {

  public isActive: any;
  loggedInUser:any;
  showUser:boolean =true;
  constructor() { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    if (this.loggedInUser['auth_role_id'] == 6 ){
     this.showUser = false;
    }
  }

}
