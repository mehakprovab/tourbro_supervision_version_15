import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2cSubscribedEmailsComponent } from './b2c-subscribed-emails.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { TalkToExpertComponent } from './components/talk-to-expert/talk-to-expert.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'email',
        canActivate: [AuthGuard],
        component: B2cSubscribedEmailsComponent,
        data: {extraParameter: 'support-Menus'}
      },
      {
        path: 'talk-to-expert',
        canActivate: [AuthGuard],
        component: TalkToExpertComponent,
        data: {extraParameter: 'support-Menus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2cSubscribedEmailsRoutingModule { }
