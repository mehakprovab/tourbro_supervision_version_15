import { NgModule } from '@angular/core';
import { CmsRoutingModule } from './cms-routing.module';
import {
    AgentsBannerImageComponent,
    FlightTopDestinationsComponent,
    MainBannerImageComponent,
    StaticPageContentComponent
} from './components';
import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
  declarations: [
    AgentsBannerImageComponent,
    FlightTopDestinationsComponent,
    MainBannerImageComponent,
    StaticPageContentComponent
  ],
  imports: [
    LayoutsModule,
    CmsRoutingModule
  ]
})
export class CmsModule { }
