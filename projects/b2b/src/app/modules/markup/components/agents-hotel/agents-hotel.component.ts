import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-agents-hotel',
  templateUrl: './agents-hotel.component.html',
  styleUrls: ['./agents-hotel.component.scss']
})
export class AgentsHotelComponent implements OnInit {

  hotelMarkupForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.hotelMarkupForm = this.fb.group({
      markupType: ['plus', Validators.required],
      markupValue: ['', Validators.required]
    });
  }

  onSubmit(t){
    // console.log(JSON.stringify(t));
  }

}
