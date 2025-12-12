import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../auth/auth.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Logger } from '../../../core/logger/logger.service';

const baseUrl = environment.SA_URL;
const log = new Logger('auth/HomePageHeaderComponent');
const loginPopup: NavigationExtras = {
    state: {
        status: true
    }
};
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
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
    private subSunk = new SubSink();
    public bannerImage: any = "assets/images/login-images/banner1.png";
    public layerBg: any = "assets/images/login-images/layers.png";
    public signUpBg: any = "assets/images/login-images/dark-blue-polygonal.png"
    public signUpBgLayer: any = "assets/images/login-images/bglayer.png"
    slideConfig2 = {
        infinite: false,
        slidesToShow: 1,
        speed: 500,
        dots: true,
    };

    loading = false;
    loaderb2b = true;
    submitted = false;
    returnUrl: string;
    loginForm: FormGroup;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    errorMessage = '';
    staticContentData: Array<any> = [];
    aboutUsData: any;
    imageData: Array<any> = [];
    textData: Array<any> = [];
    domainInfo: any;
    hotelPartners: any;
    airlinePartners: any;
    pageLoad = false;
    voucherUrl: any;
    VerifyOtpForm:FormGroup;
    showOtpComponent = false;
    loginId:any;
    loginComoponent:boolean =false;
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
    public showOtpVerify: boolean = true;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private location: Location,
    ) {
        let currentURL = window.location.href; 
        if (sessionStorage.getItem('currentUser') ) {
           this.router.navigate(['/dashboard']);
        } else {
            this.pageLoad = true;
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.AppReference && params.ReservationResultIndex) {
                this.returnUrl = '/search/flight/booking-confirm?AppReference=' + params.AppReference + '&ReservationResultIndex=' + params.ReservationResultIndex;
            } else {
                this.returnUrl = '/dashboard';
            }
        })
        // this.getAirlineHotelPartners();
        this.createForm();
        this.submitOtp();
        // this.getDomianInfo();
        // this.loadSliderImage();
        // this.loadSliderText();
        // this.getDomainInfo();
        this.authService.manageDomainRes$.subscribe((resp) => {
            if (resp) {
                this.domainInfo = resp;
            } else {
                const domainInfo = localStorage.getItem('manageDomainInfo');
                this.domainInfo = JSON.parse(domainInfo);
            }

        })

        setTimeout(() => {
            this.loaderb2b = false;
        }, 3000);
    }

    // getDomianInfo() {
    //     let title = { page_title: "" }
    //     this.subSunk.sink = this.authService.getDomainInfo(title)
    //         .subscribe(res => {
    //             if (res.statusCode == 200) {
    //                 this.domainInfo = res.data[0];
    //                 this.authService.manageDomainRes.next(this.domainInfo);
    //             }
    //         }, catchError(err => {
    //             if (err instanceof HttpErrorResponse) {

    //                 if (err.status == 401) {

    //                 }
    //             }
    //             return of(err);
    //         }));
    // }

        getDomainInfo() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.domainInfo = res.data[0];
                    this.authService.manageDomainRes.next(this.domainInfo);
                    localStorage.setItem('manageDomainInfo', JSON.stringify(this.domainInfo));
                }
            }, (err: HttpErrorResponse) => {
                log.debug(err);
                console.error(err);
            });
    }

    sliderUri = baseUrl + '/sa';
    loadSliderImage() {
        let data = { type: "ImageContent" }
        this.subSunk.sink = this.authService.getSliderList(data)
            .subscribe(res => {
                if (res.statusCode == 200) {
                    this.imageData = res.data;
                    this.cdr.detectChanges()
                }
            }, (err) => {
                this.errorMessage = err.error.Message;
            });

    }

    loadSliderText() {
        let data = { type: "TextContent" }
        this.subSunk.sink = this.authService.getSliderList(data)
            .subscribe(res => {
                if (res.statusCode == 200) {
                    this.textData = res.data;
                }
            }, (err) => {
                this.errorMessage = err.error.Message;
            });

    }

    

    getAirlineHotelPartners12() {
        let title = { page_title: "" }
        this.subSunk.sink = this.authService.getAirline(title)
            .subscribe(res => {
                if (res.statusCode == 200) {
                    alert('yes')

                }
            }, catchError(err => {
                if (err instanceof HttpErrorResponse) {

                    if (err.status == 401) {

                    }
                }
                return of(err);
            }));
    }

    getAirlineHotelPartners() {
        let title = { page_title: "" }
        this.subSunk.sink = this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', {})
            .pipe(
                catchError((error) => {
                    let errorMessage = '';

                    if (error.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${error.error.message}`;

                    } else {
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                    return throwError(error);
                })
            )
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.hotelPartners = resp.data.filter(el => (el.module_name).toLocaleLowerCase() == 'Hotel'.toLocaleLowerCase());
                    this.airlinePartners = resp.data.filter(el => (el.module_name).toLocaleLowerCase() == 'Flight'.toLocaleLowerCase());
                    this.cdr.detectChanges()
                }
            }, err => {
            });
    }
    
    getAirlineHotelPartners123() {
        let title = { page_title: "" }
        this.subSunk.sink = this.authService.airlineHotelPartnersList(title)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.hotelPartners = res.data.find(el => (el.module_name).toLocaleLowerCase() == 'Hotel'.toLocaleLowerCase());
                    this.airlinePartners = res.data.find(el => (el.module_name).toLocaleLowerCase() == 'Flight'.toLocaleLowerCase());
                    this.cdr.detectChanges()
                }
            }, (err) => {
                this.errorMessage = err.error.Message;
            });
    }

    createForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]], //agent@provab.com
            password: ['', [Validators.required]], //test@123
            uuid:  ['', [Validators.required]], //TLSA0000112
        });

    }
    navigateToRegister() {
        this.router.navigate(["auth/register"])
    }



    get password() { return this.loginForm.get('password'); }


    onLogin() {
        this.errorMessage =''
        this.submitted = true;
        if (this.loginForm.invalid) {
          return;
        }
        this.loading = true;
     
            this.subSunk.sink = this.authService.onLogin(this.loginForm.get('email').value, this.loginForm.get('password').value, this.loginForm.get('uuid').value)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        this.loginId = res['data']['id'];
                        // this.alertService.success('Login successfull!');
                        setTimeout(() => {
                            // this.router.navigateByUrl(this.returnUrl);
                            this.showOtpComponent =true;
                        }, 250)
                    } else {
                        this.errorMessage = res.error.Message;
                    }
                    this.loading = false;
                },(err) => {
                    this.loading = false;
                    if (err.error.statusCode == 403 || err.error.statusCode == 500 || err.error.statusCode == 400 ) {
                        this.errorMessage = "Invalid Password";
                    }
                    if (err.error.statusCode == 404 ) {
                        this.errorMessage = "Something Went Wrong";
                    }
                });   
        
    }

    //Hotel Partners brands
    hotelSBrandSlides = [
        { img: 'assets/images/login-images/hotel -01.png' },
        { img: 'assets/images/login-images/hotel -02.png' },
        { img: 'assets/images/login-images/hotel -03.png' },
        { img: 'assets/images/login-images/hotel -04.png' },
        { img: 'assets/images/login-images/hotel -06.png' },
        { img: 'assets/images/login-images/hotel -04.png' }

    ];

    hotelSBrandslideConfig = {
        'slidesToShow': 5, 'slidesToScroll': 5, responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1008,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }

        ]
    };

    //airline partners brands
    airlineSlides = [
        { img: 'assets/images/login-images/Airline 01.png' },
        { img: 'assets/images/login-images/Airline 02.png' },
        { img: 'assets/images/login-images/Airline 03.png' },
        { img: 'assets/images/login-images/Airline 04.png' },
        { img: 'assets/images/login-images/Airline 05.png' },
        { img: 'assets/images/login-images/Airline 03.png' },
    ]
    airlineSlideConfig = {
        'slidesToShow': 5, 'slidesToScroll': 5, responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1008,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }

        ]
    }

    //Presence brands
    PresenceSlides = [
        { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' },
        { img: 'assets/images/login-images/INDIA.png', title: 'India' },
        { img: 'assets/images/login-images/bangladesh.png', title: 'Bangladesh' },
        { img: 'assets/images/login-images/Dubai.png', title: 'Dubai' },
        { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' }
    ];

    PresenceSlideConfig = {
        'slidesToShow': 4, 'slidesToScroll': 4, responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1008,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }

        ]
    };

    public openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'dialog-container';
        dialogConfig.width = '500px';
        dialogConfig.height = '250px';
        dialogConfig.autoFocus = true;
        this.dialog
            .open(ForgotPasswordComponent, dialogConfig)
            .afterClosed()
    }
    submitOtp(): void {
        this.VerifyOtpForm = this.fb.group({
            otpinput: ['', [Validators.required]], //agent@provab.com
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
      let otp = value.otpinput;
      this.showOtpVerify = false;
        this.authService.validateOTP(this.loginId,otp)
        .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
               
                //    this.showOtpComponent = false;
                
                  setTimeout(() => {
                    this.router.navigateByUrl(this.returnUrl);
                  }, 250)
                  this.alertService.success('Login successfull!');
              } else {
                this.loading = false;
                this.showOtpVerify = true;
                  this.errorMessage = 'Invalid Crentials';
              }
              this.loading = false;
            }, (err) => {
                this.loading = false;
                this.showOtpVerify = true;
                if (err.error.statusCode == 403 || err.error.statusCode == 500 ) {
                    this.errorMessage = "Invalid OTP";
                }
                if (err.error.statusCode == 404 ) {
                    this.errorMessage = "Something Went Wrong";
                }
            });    
    }

    requestAgain() {
      this.ngOtpInput.setValue(''); // Assuming your component has a method like setValue to set its value
      this.onLogin()
    }
    back() {
      this.loginComoponent =true;
      this.showOtpComponent = false;
   
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    

}