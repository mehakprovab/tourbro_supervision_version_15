import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-b2c-flight',
  templateUrl: './b2c-flight.component.html',
  styleUrls: ['./b2c-flight.component.scss']
})
export class B2cFlightComponent implements OnInit {
  airlineForm: FormGroup;
  generalMarkupForm: FormGroup;
  specificAirlineMarkupForm: FormGroup;
  items: FormArray;

  airlines = [
    {
      id: 1,
      name: 'Air Arabia',
      logo: 'image',
      markupValue: 10
    },
    {
      id: 2,
      name: 'AIR ASIA',
      logo: 'image',
      markupValue: 34
    }
  ];

  submitted = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.airlineForm = this.fb.group({
      airlines: 1,
      markupType: 'plus',
      markupValue: ''
    });
    this.generalMarkupForm = this.fb.group({
      markupType: 'plus',
      markupValue: ''
    });
    this.specificAirlineMarkupForm = this.fb.group({
      numberOfItems: ['', Validators.required],
      items: new FormArray([])
  });
  this.onChangeTickets(2);
  }
  

  onFlightAdd(t){
  }

  onAddGeneralMarkup(t){
  }

  onAddSpecificAirlineMarkup(t){
  }

  // convenience getters for easy access to form fields
  get f() { return this.specificAirlineMarkupForm.controls; }
  get t() { return this.f.items as FormArray; }

  onChangeTickets(e) {
      const numberOfItems = e;
      if (this.t.length < numberOfItems) {
          for (let i = this.t.length; i < numberOfItems; i++) {
              this.t.push(this.fb.group({
                  markupType: ['plus', Validators.required],
                  markupValue: ['', [Validators.required]]
              }));
          }
      } else {
          for (let i = this.t.length; i >= numberOfItems; i--) {
              this.t.removeAt(i);
          }
      }
  }

  onSubmit() {
      this.submitted = true;
      if (this.specificAirlineMarkupForm.invalid) {
          return;
      }
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.specificAirlineMarkupForm.value, null, 4));
  }

  onReset() {
      // reset whole form back to initial state
      this.submitted = false;
      this.specificAirlineMarkupForm.reset();
      this.t.clear();
  }

  onClear() {
      // clear errors and reset ticket fields
      this.submitted = false;
      this.t.reset();
  }
}