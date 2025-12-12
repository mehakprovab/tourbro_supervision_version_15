import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { UsersRoutingModule } from './users-rounting.module';
import {
    UsersComponent,
    UsersAddComponent,
    UsersListComponent,
    ProfileComponent,
    ChangePasswordComponent,
} from './components';
import { LayoutsModule } from '../../layout/layout.module';
import { DatePipe } from "@angular/common";


@NgModule({
    imports: [
        UsersRoutingModule,
        LayoutsModule
    ],
    declarations: [
        UsersComponent,
        UsersAddComponent,
        UsersListComponent,
        ProfileComponent,
        ChangePasswordComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        DatePipe
      ]
})
export class UsersModule { }