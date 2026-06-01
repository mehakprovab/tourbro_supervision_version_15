import { Component, OnInit } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-footer-dots',
  templateUrl: './footer-dots.component.html'
})
export class FooterDotsComponent implements OnInit {
faCog = FaConfig
activeTab = 'messages';
  constructor() { }

  ngOnInit() {
  }

}
