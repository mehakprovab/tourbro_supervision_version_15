import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AgentsBannerImageComponent,
  FlightTopDestinationsComponent,
  MainBannerImageComponent,
  StaticPageContentComponent
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: 'agents-banner-image',
        component: AgentsBannerImageComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'flight-top-destinations',
        component: FlightTopDestinationsComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'main-banner-image',
        component: MainBannerImageComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'static-page-content',
        component: StaticPageContentComponent,
        data: {extraParameter: 'cmsMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
