"use strict";
var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var subsink_1 = require("subsink");
var RegisterComponent = /** @class */ (function() {
    function RegisterComponent(fb, apiHandlerService, authService, route, router) {
        this.fb = fb;
        this.apiHandlerService = apiHandlerService;
        this.authService = authService;
        this.route = route;
        this.router = router;
        this.registerImage = "assets/images/register-banner.png";
        this.slideConfig2 = {
            className: 'center',
            centerMode: true,
            infinite: true,
            centerPadding: '0',
            slidesToShow: 1,
            speed: 500,
            dots: false
        };
        this.loading = false;
        this.submitted = false;
        this.countries = [];
        this.errorMessage = '';
        this.subs = new subsink_1.SubSink();
        if (sessionStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }
    Object.defineProperty(RegisterComponent.prototype, "email", {
        get: function() { return this.registerForm.get('email'); },
        enumerable: false,
        configurable: true
    });
    RegisterComponent.prototype.ngOnInit = function() {
        var _this = this;
        this.createForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(function(res) {
            if (res.Status) {
                _this.countries = _this.countries = res.Data.popular_countries.concat(res.Data.countries);
            }
        });
    };
    RegisterComponent.prototype.navigationToLogin = function() {
        this.router.navigate(['auth/login']);
    };
    RegisterComponent.prototype.createForm = function() {
        this.registerForm = this.fb.group({
            first_name: ['', [forms_1.Validators.required]],
            last_name: ['', [forms_1.Validators.required]],
            business_name: ['', [forms_1.Validators.required]],
            business_number: ['', [forms_1.Validators.required]],
            country_code: ['', [forms_1.Validators.required]],
            phone: ['', [forms_1.Validators.required]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', [forms_1.Validators.required]]
        });
    };
    /*onRegister(t: any) {
      this.authService.register(t.email, t.password).pipe(first())
      .subscribe(
          data => {
              this.router.navigate([this.returnUrl]);
          },
          error => {
              //this.alertService.error(error);
              this.loading = false;
          })
          // console.log(JSON.stringify(t));
    }*/
    RegisterComponent.prototype.onRegister = function(t) {
        var _this = this;
        this.subs.sink = this.apiHandlerService.apiHandler('registration', 'POST', '', '', __assign({}, t))
            .subscribe(function(res) {
                if (res.Status) {
                    _this.router.navigate(['/auth/login']);
                } else {
                    _this.errorMessage = res.Message;
                    _this.registerForm.get('email').setErrors(res.Message);
                }
            });
    };
    RegisterComponent.prototype.ngOnDestroy = function() {
        this.subs.unsubscribe();
    };
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-register',
            templateUrl: './register.component.html',
            styles: []
        })
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;