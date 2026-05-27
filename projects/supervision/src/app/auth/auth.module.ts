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
// import { NgOtpInputModule } from 'ng-otp-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SupplierLoginComponent } from './components/supplier-login/supplier-login.component';
import { DmcLoginComponent } from './components/dmc-login/dmc-login.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RecoveryPasswordComponent,
    SupplierLoginComponent,
    DmcLoginComponent
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
    NgxIntlTelInputModule,
    // NgOtpInputModule 
  ],
  exports: [
    LoginComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
