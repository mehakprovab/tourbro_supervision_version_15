import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { of, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../auth.service';
import { Logger } from '../../../core/logger/logger.service';
const log = new Logger('auth/HomePageHeaderComponent');
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

//  declare const Buffer;
const baseUrl = environment.SA_URL;
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    domainInfo: any;
    errorMessage = '';
    id;
    imageData: Array<any> = [];
    textData: Array<any> = [];
    matcher = new MyErrorStateMatcher();
    slideConfig2 = {
        infinite: false,
        slidesToShow: 1,
        speed: 500,
        dots: true,
    };
    sliderUri = baseUrl + '/sa';
    airlinePartners: any;
    hotelPartners: any;
    public bannerImage: any = "assets/images/login-images/banner1.png";
    public layerBg: any = "assets/images/login-images/layers.png";
    public signUpBg: any = "assets/images/login-images/dark-blue-polygonal.png"
    public signUpBgLayer: any = "assets/images/login-images/bglayer.png"
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params && params.token) {
                this.id = JSON.parse((atob(params.token)));
            } else {
                this.alertService.error("Something went wrong.. Pls try again later");
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 1000)
            }
        });
        this.getAirlineHotelPartners();
        this.loadSliderImage();
        this.loadSliderText();
        this.createForm();
        // this.getDomianInfo();
        this.getDomainInfo();
    }

    createForm(): void {
        this.loginForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.checkPasswords });

    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;
        return pass === confirmPass ? null : { notSame: true }
    }

    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ notEquivalent: true })
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }

    getDomainInfo() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.domainInfo = res.data[0];
                }
            }, (err: HttpErrorResponse) => {
                log.debug(err);
                console.error(err);
            });
    }

    // getDomianInfo() {
    //     let title = { page_title: "" }
    //     this.subSunk.sink = this.authService.getDomainInfo(title)
    //         .subscribe(res => {
    //             if (res.statusCode == 200) {
    //                 this.domainInfo = res.data[0];

    //             }
    //         }, catchError(err => {
    //             if (err instanceof HttpErrorResponse) {

    //                 if (err.status == 401) {

    //                 }
    //             }
    //             return of(err);
    //         }));
    // }

    public hasError = (controlName: string, errorName: string) => {
        return this.loginForm.controls[controlName].hasError(errorName);
    }

    submit(form: any) {
        if (form.invalid) {
            return;
        }
        let req = {
            id: this.id,
            new_password: this.loginForm.value.password
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('updatePassword', 'POST', '', '', req)
            .subscribe(res => {
                if (res.Status) {
                    this.alertService.success("Your password has been reset successfull!");
                    setTimeout(() => {
                        this.router.navigateByUrl('/auth/login');
                    }, 1000)
                } else {
                    this.alertService.error("Failed to reset password, Please try again")
                }
            });
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

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
