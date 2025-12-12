import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { B2cSubscribedEmailsComponent } from './b2c-subscribed-emails.component';
import { B2cSubscribedEmailsRoutingModule } from './b2c-subscribed-emails.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { NewsletterSubscriptionComponent } from './components/newsletter-subscription/newsletter-subscription.component';
import { DealsSubscriptionComponent } from './components/deals-subscription/deals-subscription.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [B2cSubscribedEmailsComponent,
  NewsletterSubscriptionComponent,
  DealsSubscriptionComponent],
  imports: [
    CommonModule,
    B2cSubscribedEmailsRoutingModule,
    LayoutsModule,
    SharedModule
  ]
})
export class B2cSubscribedEmailsModule { }
