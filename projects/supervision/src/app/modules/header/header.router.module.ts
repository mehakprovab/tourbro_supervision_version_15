import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'search',
        component: SearchComponent,
        data: {extraParameter: 'markupMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeaderInfoRoutingModule { }
