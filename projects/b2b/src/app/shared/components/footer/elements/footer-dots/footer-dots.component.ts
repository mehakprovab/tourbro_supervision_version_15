import { Component, OnInit } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer-dots',
  templateUrl: './footer-dots.component.html'
})
export class FooterDotsComponent implements OnInit {
faCog = FaConfig
  constructor() { }

  ngOnInit() {
  }

}
