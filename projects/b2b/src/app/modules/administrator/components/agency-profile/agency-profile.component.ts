import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency-profile',
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.scss']
})
export class AgencyProfileComponent implements OnInit {

  constructor(private router: Router) { }

  registerForm: FormGroup;
  title = [];

  ngOnInit() {
  }
 
}
