import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit {
  socialNetworkData: any;
  displayColumn: any;
  constructor() { }

  ngOnInit() {
    this.socialNetworkData = getData();
    this.displayColumn = Object.keys(this.socialNetworkData[0]);
  }

}


function getData() {
  return [
    {
      '#': 1,
      'Social Network': 'facebook',
      Url: 'https//www.facebook.com/',
      Action: true,
    },
    {
      '#': 2,
      'Social Network': 'twitter',
      Url: 'https://plus.google.com/travelomatix',
      Action: false,
    },
    {
      '#': 3,
      'Social Network': 'googleplus',
      Url: 'https://twitter.com/',
      Action: true,
    },
    {
      '#': 4,
      'Social Network': 'linkedin',
      Url: 'https://www.youtube.com/',
      Action: true,
    },
  ]
}
