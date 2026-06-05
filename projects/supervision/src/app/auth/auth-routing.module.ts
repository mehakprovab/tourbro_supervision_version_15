import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesLayoutComponent } from '../layout/pages-layout/pages-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';
import { DmcLoginComponent } from './components/dmc-login/dmc-login.component';
import { SupplierLoginComponent } from './components/supplier-login/supplier-login.component';
import { SupplierRegisterComponent } from './components/supplier-register/supplier-register.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';

import { SupplierTermComponent } from './components/supplier-term/supplier-term.component';
const routes: Routes = [
    {
        path: 'auth',
        component: PagesLayoutComponent,
        children: [
            //    { path: 'login', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'supplier', component: SupplierRegisterComponent, data: { extraParameter: '' } },
            { path: 'registration-form', component: RegistrationFormComponent, data: { extraParameter: '' } },
              { path: 'login', component:  SupplierLoginComponent, data: { extraParameter: '' } },
            { path: 'forgot-password', component: ForgotPasswordComponent, data: { extraParameter: '' } },
            { path: 'recovery-password', component: RecoveryPasswordComponent, data: { extraParameter: '' } },
             { path: 'service-form', component: ServiceFormComponent, data: { extraParameter: '' } },
                       { path: 'static-content', component: SupplierTermComponent, data: { extraParameter: '' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}