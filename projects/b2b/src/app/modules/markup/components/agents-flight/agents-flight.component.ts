import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-agents-flight',
  templateUrl: './agents-flight.component.html',
  styleUrls: ['./agents-flight.component.scss']
})
export class AgentsFlightComponent implements OnInit {
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
    // console.log(JSON.stringify(t));
  }

  onAddGeneralMarkup(t){
    // console.log(JSON.stringify(t));
  }

  onAddSpecificAirlineMarkup(t){
    // console.log(JSON.stringify(t));
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