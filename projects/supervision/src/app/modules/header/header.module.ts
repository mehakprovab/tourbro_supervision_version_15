import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderInfoRoutingModule } from './header.router.module';
import { LayoutsModule } from '../../layout/layout.module';

const COMPONENTS = [
    HeaderComponent,ChangePasswordComponent,LogoutComponent,ProfileComponent,SearchComponent
]

const MODULES = [
    CommonModule,HeaderInfoRoutingModule,LayoutsModule
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES]
})
export class HeaderModule { }
