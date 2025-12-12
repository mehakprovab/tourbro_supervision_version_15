import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesLayoutComponent } from '../layout/pages-layout/pages-layout.component';
import { LoginComponent, RegisterComponent, ForgotPasswordComponent, StaticContentComponent, ResetPasswordComponent } from './components';
import { ActivateComponent } from './components/activate/activate.component';
import { DirectorComponent } from './components/director/director.component';
import { FaqComponent } from './components/faq/faq.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { B2bRegisterComponent } from './components/b2b-register/b2b-register.component';
import { SupplierB2cComponent } from './components/supplier-b2c/supplier-b2c.component';

const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            { path: '', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'login', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'register', component: RegisterComponent, data: { extraParameter: '' } },
            { path: 'supplier', component: SupplierComponent, data: { extraParameter: '' } },
            { path: 'b2b', component: B2bRegisterComponent, data: { extraParameter: '' } },
            { path: 'supplier-b2b', component: SupplierB2cComponent, data: { extraParameter: '' } },
            { path: 'director/:id', component: DirectorComponent, data: { extraParameter: '' } },
            { path: 'forgotPassword', component: ForgotPasswordComponent, data: { extraParameter: '' } },
            { path: 'activate', component: ActivateComponent, data: { extraParameter: '' } },
            { path: 'cms', component: StaticContentComponent, data: { extraParameter: '' } },
            { path: 'faq', component: FaqComponent, data: { extraParameter: '' } },
            { path: 'reset-password', component: ResetPasswordComponent, data: { extraParameter: '' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}