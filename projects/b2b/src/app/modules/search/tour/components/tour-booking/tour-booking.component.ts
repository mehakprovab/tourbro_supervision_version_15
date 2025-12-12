import { Component, OnInit } from '@angular/core';
import { TourService } from '../../tour.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-tour-booking',
  templateUrl: './tour-booking.component.html',
  styleUrls: ['./tour-booking.component.scss']
})
export class TourBookingComponent implements OnInit {

  loadingTemplate: any;
  loading:boolean;
  primaryColour: any;
  secondaryColour: any;
  isEmailBroucher:boolean=false;
  emailForm:FormGroup;

  constructor( private tourServe:TourService,
               private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    //this.getTourDetailsData()
    this.createEnquiryForm();
  }

  createEnquiryForm(){
    this.emailForm=this.fb.group({
      email: new FormControl('',[Validators.required,this.validateEmail]),
    })
  }

  getTourDetailsData(){
    this.tourServe.bookingTourData.subscribe((result=>{
    }))
  }

  validateEmail(control:FormControl){
    const value = control.value;
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value && !regex.test(value)) {
      return { invalidEmail: true };
    }
  }
  
  validateEmailInput() {
    this.emailForm.get('email').markAsTouched();
  }

  sendBrochure(){
    if(this.emailForm.valid){
      console.log('Sending brochure')
      this.emailForm.reset();
    }
  }
  
}

// String regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
