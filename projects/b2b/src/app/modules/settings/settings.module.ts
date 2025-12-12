import { NgModule } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
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
    ListPromocodeComponent,
    UpdatePromocodeComponent,
} from './components';

import { LayoutsModule } from '../../layout/layout.module';

@NgModule({
    declarations: [
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
        ListPromocodeComponent,
        UpdatePromocodeComponent,
    ],
    imports: [
        SettingsRoutingModule,
        LayoutsModule
    ]
})
export class SettingsModule { }
