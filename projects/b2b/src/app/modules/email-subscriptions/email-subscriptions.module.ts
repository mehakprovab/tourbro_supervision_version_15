import { NgModule } from '@angular/core';
import { EmailSubscriptionsRoutingModule } from './email-subscriptions-routing.module';
import { ViewEmailsComponent } from './components';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
    declarations: [ViewEmailsComponent],
    imports: [
        LayoutsModule,
        EmailSubscriptionsRoutingModule
    ]
})
export class EmailSubscriptionsModule { }
