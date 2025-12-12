import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2cSubscribedEmailsComponent } from './b2c-subscribed-emails.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'email',
        canActivate: [AuthGuard],
        component: B2cSubscribedEmailsComponent,
        data: {extraParameter: 'b2c-subscribedemails-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2cSubscribedEmailsRoutingModule { }
