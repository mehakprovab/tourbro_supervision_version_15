import { NgModule } from '@angular/core';
import { LogoRoutingModule } from './logo-routing.module';
import { LogoComponent } from './logo/logo.component';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
  declarations: [LogoComponent],
  imports: [
    LayoutsModule,
    LogoRoutingModule
  ]
})
export class LogoModule { }
