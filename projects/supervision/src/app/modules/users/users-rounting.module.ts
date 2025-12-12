import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from './users.component';
import { UsersPrivilegeComponent } from './components/users-privilege/users-privilege.component';
import { LoggedInUsersComponent } from './components/logged-in-users/logged-in-users.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { InactiveUserComponent } from './inactive-user/inactive-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { B2cUsersComponent } from './components/b2c-users/b2c-users.component';

const routes: Routes = [
    {
        path: 'users',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'active',
                component: UsersComponent,
                data: {extraParameter: 'usersMenus'}
            },
            {
                path: 'privilege/:id',
                component: UsersPrivilegeComponent,
                data: {extraParameter: 'usersMenus'}
            },
            {
                path: 'logged-in',
                component: LoggedInUsersComponent,
                data: {extraParameter: 'usersMenus'}
            },
            {
                path: 'inactive',
                component: InactiveUserComponent,
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
            },
            {
                path: 'b2c-users',
                component: B2cUsersComponent,
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
