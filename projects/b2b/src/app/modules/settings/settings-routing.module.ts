import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import {
  AppearanceComponent,
  ConvenienceFeesComponent,
  CurrencyConversionComponent,
  EventLogsComponent,
  LiveEventsComponent,
  ManageApiComponent,
  ManageCmsComponent,
  ManageDomainsComponent,
  PromocodeComponent,
  SocialLoginComponent,
  SocialNetworksComponent,
  TravelInsuranceComponent,
} from './components'

const routes: Routes = [

  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'appearance',
        component: AppearanceComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'convenience-fees',
        component: ConvenienceFeesComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'currencyConversion',
        component: CurrencyConversionComponent,
        data: { extraParameter: 'settingsMenus' }
      },
        {
        path: 'event-logs',
        component: EventLogsComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'live-events',
        component: LiveEventsComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'manage-api',
        component: ManageApiComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'manage-sms',
        component: ManageCmsComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'social-login',
        component: SocialLoginComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'manage-domains',
        component: ManageDomainsComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'promocode',
        component: PromocodeComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'social-networks',
        component: SocialNetworksComponent,
        data: { extraParameter: 'settingsMenus' }
      },
      {
        path: 'travel-insurance',
        component: TravelInsuranceComponent,
        data: { extraParameter: 'settingsMenus' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
