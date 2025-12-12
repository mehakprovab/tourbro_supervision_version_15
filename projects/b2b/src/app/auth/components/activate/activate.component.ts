import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';
import { User, AuthService } from '../../auth.service';

const loginPopup: NavigationExtras = {
    state: {
        status: true
    }
};


@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
    public bannerImage: any = "assets/images/login-images/banner1.png";
    public layerBg: any = "assets/images/login-images/layers.png";
    public signUpBg: any = "assets/images/login-images/dark-blue-polygonal.png"
    public signUpBgLayer: any = "assets/images/login-images/bglayer.png"
    slideConfig2 = {
        infinite: true,
        slidesToShow: 1,
        speed: 500,
        dots: true,
    };
    loading = false;
    submitted = false;
    activationForm: FormGroup;
    public currentUser: Observable<User>;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
    ) {
        if (sessionStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
        this.createForm();
    }
    createForm(): void {
        this.activationForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]]
        });

    }
    onActivate(t: any) {
        this.loading = true;
        this.authService.onActivate(t.email)
            .subscribe(res => {
                if ([200,201].includes(res.statusCode)) {
                    this.alertService.success(' Email is Activated!');
                    setTimeout(() =>{
                        this.router.navigate(['/auth/login'], loginPopup);
                    },1000)
                   
                } else {
                    
                    this.alertService.error('Invalid email id')
                }
                this.loading = false;
            },(err)=>{
                this.errorMessage =err.error.msg;
                
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

    hotelSBrandslideConfig = { 'slidesToShow': 5, 'slidesToScroll': 5 };

    //airline partners brands
    airlineSlides = [
        { img: 'assets/images/login-images/Airline 01.png' },
        { img: 'assets/images/login-images/Airline 02.png' },
        { img: 'assets/images/login-images/Airline 03.png' },
        { img: 'assets/images/login-images/Airline 04.png' },
        { img: 'assets/images/login-images/Airline 05.png' },
        { img: 'assets/images/login-images/Airline 03.png' },
    ]
    airlineSlideConfig = { 'slidesToShow': 5, 'slidesToScroll': 5 }

    //Presence brands
    PresenceSlides = [
        { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' },
        { img: 'assets/images/login-images/INDIA.png', title: 'India' },
        { img: 'assets/images/login-images/bangladesh.png', title: 'Bangladesh' },
        { img: 'assets/images/login-images/Dubai.png', title: 'Dubai' },
        { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' }
    ];

    PresenceSlideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
}
