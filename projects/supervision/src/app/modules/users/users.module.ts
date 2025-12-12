import { NgModule } from "@angular/core";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { UsersRoutingModule } from './users-rounting.module';
import { UsersComponent } from './users.component';
import { UsersPrivilegeComponent } from './components/users-privilege/users-privilege.component';
import { LoggedInUsersComponent } from './components/logged-in-users/logged-in-users.component';
import { SharedModule } from '../../shared/shared.module';
import { UsersAddComponent } from './components/users-add/users-add.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { InactiveUserComponent } from './inactive-user/inactive-user.component';
import { InactiveUserListComponent, InactiveAddEditComponent } from './inactive-user/components';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { B2cUsersComponent } from './components/b2c-users/b2c-users.component';
import { B2cuserAddEditComponent } from './components/b2c-users/components/b2cuser-add-edit/b2cuser-add-edit.component';
import { ActiveB2cUserListComponent } from './components/b2c-users/components/active-b2c-user-list/active-b2c-user-list.component';
import { InactiveB2cUserListComponent } from './components/b2c-users/components/inactive-b2c-user-list/inactive-b2c-user-list.component';
import { LoggedinB2cUserListComponent } from './components/b2c-users/components/loggedin-b2c-user-list/loggedin-b2c-user-list.component';
import { DatePipe } from "@angular/common";

@NgModule({
    imports: [
        UsersRoutingModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        UsersComponent,
        UsersPrivilegeComponent,
        LoggedInUsersComponent,
        UsersAddComponent,
        UsersListComponent,
        UsersPrivilegeComponent,
        InactiveUserComponent,
        InactiveUserListComponent,
        InactiveAddEditComponent,
        ProfileComponent,
        ChangePasswordComponent,
        B2cUsersComponent,
        B2cuserAddEditComponent,
        ActiveB2cUserListComponent,
        InactiveB2cUserListComponent,
        LoggedinB2cUserListComponent
    ],
    providers: [
        DatePipe
      ]
})
export class UsersModule { }