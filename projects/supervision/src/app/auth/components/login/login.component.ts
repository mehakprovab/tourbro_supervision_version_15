import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { SwalService } from '../../../core/services/swal.service';

export class User {
  user_id: string;
  user_name: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  country_code: string;
  status: string;
  user_profile_image: string;
  created_datetime: string;
  login_id: string;
  accessToken: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };

  loading = false;
  submitted = false;
  returnUrl: string;
  loginForm: FormGroup;
  VerifyOtpForm:FormGroup;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  errorMessage = '';
  isSupplierLogin = false;
  showOtpComponent = false;
  loginId:any;
  loginComoponent:boolean = false;
  otpVerifide:boolean = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  user_type:any;
  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService
  ) {
    let currentURL = window.location.href; 
    if (sessionStorage.getItem('currentSupervisionUser') && this.otpVerifide ) 
    {
         this.router.navigate(['/']);
    }
  }
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
        'width': '50px',
        'height': '50px'
    }
};
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.createForm()
    this.submitOtp();
  }
  createForm(){
    if (!this.isSupplierLogin) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', Validators.required]
    });
  } else {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      });
  }
  }
  get f() { return this.loginForm.controls; }

  showSupplierLogin() {
    this.isSupplierLogin = true;
    this.createForm();
}
// onSupplierLogin(t: any) {
//   this.errorMessage = '';
//   if (!this.loginForm.valid) {
//       return;
//   }
//   this.loading = true;
//   this.authService.onsupplierLogin(this.loginForm.get('email').value)
//   .subscribe(res => {
//           if (res.statusCode == 201) {
//               this.showOtpComponent = true;
//           } else {
//               this.alertService.error('Invalid Credentials');
//               this.errorMessage = 'Invalid Credentials';
//           }

//           this.loading = false;
//       }, (err) => {
//           this.errorMessage = err.error.Message;
//           this.loading = false;

//       });
// }
  onLogin() {
console.log("this.returnUrl",this.returnUrl)
    this.errorMessage =''
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
   
    if(this.returnUrl == '/' || this.returnUrl == '/supervision'){
      this.user_type = "supervision"
    }
    this.authService.onLogin(this.loginForm.get('email').value, this.loginForm.get('password').value,this.user_type)
      .subscribe(res => {
        if (res['statusCode'] == 200 && res['data']['access_token'] != undefined) {
         if(res['data']['auth_role_id'] == 6 || res['data']['auth_role_id'] == 7){
          this.loginId = res['data']['id'];
          this.showOtpComponent = true;
          // this.router.navigate(['hotels/hotel-crs-lists']);
         }else{
          this.router.navigate([this.returnUrl]);
          this.swalService.alert.success("Login Successful.")
         }
        } else {
          this.errorMessage = res.Message;
          this.swalService.alert.oops(this.errorMessage)
        }
        this.loading = false;
      }, (err) => {
        this.errorMessage = (err.status == 401) 
        ? 'Invalid Credentials' 
        : (err.status == 403) 
            ? 'Inactive User' 
            : err.error.Message;    
      });
  }
  onOtpChange(otp) {
    this.VerifyOtpForm.patchValue({ otpinput: otp });
}
otpverify(value) {
  // if (value.otpinput.length != 6) {
  //     return;
  // }
  this.loading = true;
  this.errorMessage = '';
  // let login_id = this.loginForm.get('employeeid').value;
  let otp = value.otpinput;
  // this.subSunk.sink = this.authService.validateDCBOTP(login_id, otp)
  //     .subscribe(res => {
    this.authService.validateOTP(this.loginId,otp)
    .subscribe(res => {
          if (res.statusCode == 200 || res.statusCode == 201) {
              // this.showOtpComponent = true;
            
              setTimeout(() => {
              this.router.navigate(['hotels/hotel-crs-lists'],{ queryParams: { tab: 'list_hotels' } });
              }, 250)
              this.alertService.success('Login successfull!');
              this.otpVerifide =true;
          } else {
              this.errorMessage = 'Invalid Crentials';
          }
          this.loading = false;
        }, (err) => {
          this.loading = false;
          if (err.error.statusCode == 403 || err.error.statusCode == 500 ) {
              this.errorMessage = "Invalid OTP";
          }
          if (err.error.statusCode == 404 ) {
              this.errorMessage = "Something Went Wrong";
          }
      });    
}
submitOtp(): void {
  this.VerifyOtpForm = this.fb.group({
      otpinput: ['', [Validators.required]], //agent@provab.com
  });

}
requestAgain() {
  //  this.loginComoponent=true;
  this.ngOtpInput.setValue(''); // Assuming your component has a method like setValue to set its value
 this.onLogin()
}
back() {
  // this.isDCBLogin = true;
  this.loginComoponent =true;
  this.showOtpComponent = false;
}
}
