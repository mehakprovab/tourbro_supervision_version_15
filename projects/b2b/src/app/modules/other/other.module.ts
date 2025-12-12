import { NgModule } from '@angular/core';
import { OtherRoutingModule } from './other-routing.module';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
  declarations: [AllNotificationComponent],
  imports: [
      LayoutsModule,
    OtherRoutingModule
  ]
})
export class OtherModule { }
