import { Routes, RouterModule } from "@angular/router";
import { UsersComponent, ChangePasswordComponent } from './components';
import { NgModule } from '@angular/core';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: UsersComponent,
                data: {extraParameter: 'usersMenus'}
            },
            {
                path: 'profile',
                component: ProfileComponent,
                data: {extraParameter: 'usersMenus'}
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
                data: {extraParameter: 'usersMenus'}
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
