import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adult-info',
  templateUrl: './adult-info.component.html',
  styleUrls: ['./adult-info.component.scss']
})
export class AdultInfoComponent implements OnInit {
  titleOption = [
    'Mr.',
    'Ms.',
    'Miss',
    'Master',
  ]
  constructor() { }

  ngOnInit() {
  }

}
