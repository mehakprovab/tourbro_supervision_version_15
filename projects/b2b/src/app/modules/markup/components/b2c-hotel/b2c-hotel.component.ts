import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-b2c-hotel',
  templateUrl: './b2c-hotel.component.html',
  styleUrls: ['./b2c-hotel.component.scss']
})
export class B2cHotelComponent implements OnInit {

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
  }

}
