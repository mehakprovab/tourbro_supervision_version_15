import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    StaticContentComponent,
    ResetPasswordComponent
} from './components';
import { AuthRoutingModule } from './auth-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { LayoutsModule } from '../layout/layout.module';
import { ActivateComponent } from './components/activate/activate.component';
import { CoreModule } from '../core/core.module';
import { HomePageHeaderComponent } from "./components/home-page-header/home-page-header.component";
import { HomePageFooterComponent } from './components/home-page-footer/home-page-footer.component';
import { DirectorComponent } from './components/director/director.component';
import { NgOtpInputModule } from 'ng-otp-input';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FaqComponent } from './components/faq/faq.component';
import { AgentFaqComponent } from './components/faq/components/agent-faq/agent-faq.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { SupplierB2cComponent } from './components/supplier-b2c/supplier-b2c.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { B2bRegisterComponent } from './components/b2b-register/b2b-register.component';
import { RegisterInfoComponent } from './components/register-info/register-info.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ActivateComponent,
    StaticContentComponent,
    HomePageHeaderComponent,
    HomePageFooterComponent,
    ResetPasswordComponent,
    DirectorComponent,
    FaqComponent,
    AgentFaqComponent,
    SupplierComponent,
    SupplierB2cComponent,
    B2bRegisterComponent,
    RegisterInfoComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    // NgBootstrapFormValidationModule,
    LayoutsModule,
    BsDropdownModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    NgMultiSelectDropDownModule
    // import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
  ],
   entryComponents: [
    RegisterInfoComponent   // ✅ required before Ivy
  ]
})
export class AuthModule { }
