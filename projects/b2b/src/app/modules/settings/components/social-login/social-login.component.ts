import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {

  socialLoginData: any;
  displayColumn: any;
  constructor() { }

  ngOnInit() {
    this.socialLoginData = getData();
    this.displayColumn = Object.keys(this.socialLoginData[0]);
  }

}


function getData() {
  return [
    {
      '#': 1,
      'Social Network': 'facebook',
      Status: false,
      'Config Id': '123456',
      Action: 'Update',
    },
    {
      '#': 2,
      'Social Network': 'twitter',
      Status: true,
      'Config Id': '9451387',
      Action: 'Update',
    },
    {
      '#': 3,
      'Social Network': 'googleplus',
      Status: false,
      'Config Id': '8671539',
      Action: 'Update',
    },
    {
      '#': 4,
      'Social Network': 'linkedin',
      Status: true,
      'Config Id': '421576',
      Action: 'Update',
    },
  ]
}