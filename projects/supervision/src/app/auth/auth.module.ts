import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SupplierLoginComponent } from './components/supplier-login/supplier-login.component';
import { DmcLoginComponent } from './components/dmc-login/dmc-login.component';
import { SupplierRegisterComponent } from './components/supplier-register/supplier-register.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { SupplierTermComponent } from './components/supplier-term/supplier-term.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OtpInputComponent } from './components/otp-input/otp-input.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RecoveryPasswordComponent,
    SupplierLoginComponent,
    DmcLoginComponent,
    SupplierRegisterComponent,
    RegistrationFormComponent,
    ServiceFormComponent,
    SupplierTermComponent,
    OtpInputComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    // NgBootstrapFormValidationModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgxIntlTelInputModule,
    HttpClientModule
  ],
  exports: [
    LoginComponent,
    ForgotPasswordComponent,
    SupplierRegisterComponent,
    RegistrationFormComponent,
    ServiceFormComponent,
    
  ]
})
export class AuthModule { }
