import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EmailSubscriptionsRoutingModule } from './email-subscriptions-routing.module';
import { ViewEmailsComponent } from './components/view-emails/view-emails.component';

@NgModule({
  declarations: [ViewEmailsComponent],
  imports: [
    SharedModule,
    EmailSubscriptionsRoutingModule
  ]
})
export class EmailSubscriptionsModule { }
