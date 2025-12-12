import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
})
export class MegamenuComponent implements OnInit {
  public value:boolean=false;
  loggedInUser:any;
  showUser:boolean =true;
  constructor() { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    if (this.loggedInUser['auth_role_id'] == 6 ){
     this.showUser = false;
    }
  }

  hideMegamenu(){
    this.value=!this.value;
  }
}
