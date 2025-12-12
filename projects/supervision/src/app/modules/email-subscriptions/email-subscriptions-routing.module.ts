import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { ViewEmailsComponent } from './components/view-emails/view-emails.component';

const routes: Routes = [
  {
    path: 'email-subscriptions',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'view-emails',
        component: ViewEmailsComponent,
        data: { extraParameter: 'emailSubscriptionsMenus' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSubscriptionsRoutingModule { }
