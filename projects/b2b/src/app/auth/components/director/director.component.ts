import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog } from '@angular/material';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { stringify } from 'querystring';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {

  public registerImage: any = "assets/images/register-banner.png";
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  slideConfig2 = {
      className: 'center',
      centerMode: true,
      infinite: true,
      centerPadding: '0',
      slidesToShow: 1,
      speed: 500,
      dots: false,
  };
  data = [];
  staticCountries = []
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  countries: any = [];
  errorMessage = '';
  hide: boolean = false;
  currencyList: any;
  get email() { return this.registerForm.get('email'); }
  userTitleList: Array<any> = [];
  protected subs = new SubSink();
  bankLogo: string;
  imageSrc;
  logoConfig: FormGroup;
  imgObj = {
      isLogoToUpdate: false,
      isUploaded: false,
    };

    showAffiliationNumber: boolean = false;
    id;
  constructor(
      private fb: FormBuilder,
      private apiHandlerService: ApiHandlerService,
      private authService: AuthService,
      private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertService,
      private dialog: MatDialog,
      private swalService: SwalService,
      private utility :UtilityService
  ) {
      if (sessionStorage.getItem('currentUser')) {
          this.router.navigate(['/dashboard']);
      }
  }

  ngOnInit() {
       this.createForm();
       this.getTitleList();
       this.setRegisterId();
     //  this.navigateToDirector();
  }

  numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
      }
      return true;

  }
  getTitleList() {
      
      this.apiHandlerService.apiHandler('userTitleList', 'POST', '', '', {})
        .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.userTitleList = resp.data.length ? resp.data : []
  
          } else {
            this.swalService.alert.oops();
          }
        }, (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
        })
    }


  omitSpecialCharacters(event) {
      let k = event.charCode;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
  }


  createForm() {
      this.registerForm = this.fb.group({
        dir_title:[''],
        dir_name: ['', [Validators.required,Validators.minLength(3)]],
        dir_contact: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(11)]],
        dir_email: ['', [Validators.required, Validators.email]],
          acc_title:[''],
          acc_name: ['', [Validators.required]],
          confirmCheckbox: [false, [Validators.requiredTrue]],

      },);

  }

  onTerms(){
      sessionStorage.setItem('static_title','Travel Agent Terms and conditions');
      const url = this.router.serializeUrl(
          this.router.createUrlTree(['auth/cms'])
      );
      window.open('#'+url, '_blank');
  }

   onRegister(t: any) {
    this.submitted =true;
      if (t.invalid) {
          return;
      } else {
          // const formData = await new FormData();
         this.authService.registerId.subscribe(res =>{
          this.id = res;
         })
          const formdata = {
              id:JSON.stringify(this.id),
              dir_title: this.registerForm.controls['dir_title'].value,
              dir_name: this.registerForm.controls['dir_name'].value,
              dir_contact: this.registerForm.controls['dir_contact'].value,
              dir_email: this.registerForm.controls['dir_email'].value,
              acc_title: this.registerForm.controls['acc_title'].value,
              acc_name: this.registerForm.controls['acc_name'].value,


          }
          // const formdata1 = JSON.stringify(formdata)
          
          this.subs.sink = this.apiHandlerService.apiHandler('directorFormSubmit', 'POST', '', '', formdata)
              .subscribe(res => {

                  if (res.Status == true) {

                      this.swalService.alert.success('Your registration has been successfully completed. The admin will activate your account once it has been verified.');
                      setTimeout(() => {
                          this.router.navigate(['/auth/login']);
                      }, 1000)

                  } else {
                      this.hide = true;
                      this.errorMessage = res.data.msg;
                      this.swalService.alert.oops(res.Message);
                  }
              }, (errorResponse) => {
                  this.hide = true;
                  if (errorResponse.error.Message == "403 Already exists") {
                      this.swalService.alert.oops("Email Already Exists.");
                  }else{
                      this.swalService.alert.oops(errorResponse.error.msg);
                  }
              });
      }
  }


  getCurrencyList() {
      this.apiHandlerService.apiHandler('hotelCurrencyConverison', 'POST', '', '', {}).subscribe(resp => {
              if (resp.Status && resp.data) {
                  this.currencyList = resp.data.filter(t => t.status == 1);
              }
          }, (err: HttpErrorResponse) => {
              console.log(err.error);
          })
  }

  onStaticContent(){
      sessionStorage.setItem('static_title', "Terms and conditions");
      this.router.createUrlTree(['auth/cms'])
  }
  numbersOnly(event): boolean {
      return this.utility.numberOnly(event);
  }
  onSelect(selectedValue: string): void {
      // Check the selected value and set `showAffiliationNumber` accordingly
      this.showAffiliationNumber = selectedValue !== 'Choose one';
    
      // Clear the `affiliation_number` field on every selection change
      this.registerForm.get('affiliation_number').reset();
    
      // Optionally remove validation if the field is hidden
      if (!this.showAffiliationNumber) {
        this.registerForm.get('affiliation_number').clearValidators();
      } else {
        this.registerForm.get('affiliation_number').setValidators(Validators.required);
      }
      this.registerForm.get('affiliation_number').updateValueAndValidity();
    }
    private matchPassword(AC: AbstractControl) {
      const password = AC.get('password').value
      const confirm_password = AC.get('confirm_password').value
      if (password != confirm_password) {
        AC.get('confirm_password').setErrors({ matchPassword: true })
      } else {
        AC.get('confirm_password').setErrors(null);
      }
    }

    setRegisterId() {
      const storedState = localStorage.getItem('registerId');
      if (storedState) {
          this.authService.registerId.next(JSON.parse(storedState));
      }
  }
  ngOnDestroy() {
      this.subs.unsubscribe();
  }


}
