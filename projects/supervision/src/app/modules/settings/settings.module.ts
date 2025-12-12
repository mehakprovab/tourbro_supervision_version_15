import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { AppearanceComponent } from "./components/appearance/appearance.component";
import { ConvenienceFeesComponent } from "./components/convenience-fees/convenience-fees.component";
import { CurrencyConversionComponent } from "./components/currency-conversion/currency-conversion.component";
import { EventLogsComponent } from "./components/event-logs/event-logs.component";
import { LiveEventsComponent } from "./components/live-events/live-events.component";
import { ManageApiComponent } from "./components/manage-api/manage-api.component";
import { ManageCmsComponent } from "./components/manage-sms/manage-cms.component";
import { ManageDomainsComponent } from "./components/manage-domains/manage-domains.component";
import { PromocodeComponent } from "./components/promocode/promocode.component";
import { ListPromocodeComponent } from "./components/promocode/list-promocode/list-promocode.component";
import { UpdatePromocodeComponent } from "./components/promocode/update-promocode/update-promocode.component";
import { SocialLoginComponent } from "./components/social-login/social-login.component";
import { SocialNetworksComponent } from "./components/social-networks/social-networks.component";
import { TravelInsuranceComponent } from "./components/travel-insurance/travel-insurance.component";
import { ApiCurrencyRateListComponent } from "./components/api-currency-rate-list/api-currency-rate-list.component";
import { B2cPromoCodeComponent } from "./components/b2c-promo-code/b2c-promo-code.component";
import { B2cPaymentGatewayChargesComponent } from "./components/b2c-payment-gateway-charges/b2c-payment-gateway-charges.component";
import { ManagePromocodeComponent } from "./components/b2c-promo-code/components/manage-promocode/manage-promocode.component";
import { PromocodeListComponent } from "./components/b2c-promo-code/components/promocode-list/promocode-list.component";
import { LayoutsModule } from "../../layout/layout.module";
import { PushNotificationsComponent } from "./components/push-notifications/push-notifications.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ManagePaymnetGatewayComponent } from './components/manage-paymnet-gateway/manage-paymnet-gateway.component';
import { DomainLogoComponent } from "./components/domain-logo/domain-logo.component";
import { AddCurrencyComponent } from './components/add-currency/add-currency.component';
import { UpdateLastTicketingDurationComponent } from "./components/social-login/update-last-ticketing-duration/update-last-ticketing-duration.component";
import { UpdateTicketingDurationComponent } from "./components/social-login/update-last-ticketing-duration/update-ticketing-duration/update-ticketing-duration.component";
import { UpdatedListingComponent } from "./components/social-login/update-last-ticketing-duration/updated-listing/updated-listing.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { HotelApiComponent } from "./components/manage-api/components/hotel-api/hotel-api.component";
import { FlightApiComponent } from "./components/manage-api/components/flight-api/flight-api.component";
import { CarApiComponent } from "./components/manage-api/components/car-api/car-api.component";
import { ActivityApiComponent } from "./components/manage-api/components/activity-api/activity-api.component";
import { ManageB2bApiComponent } from './components/manage-b2b-api/manage-b2b-api.component';
import { ManageAllApiComponent } from './components/manage-all-api/manage-all-api.component';
import { B2bFlightApiComponent } from './components/manage-b2b-api/component/b2b-flight-api/b2b-flight-api.component';
import { B2bHotelApiComponent } from './components/manage-b2b-api/component/b2b-hotel-api/b2b-hotel-api.component';
import { B2bActivityApiComponent } from "./components/manage-b2b-api/component/b2b-activity-api/b2b-activity-api.component";
import { B2bTourApiComponent } from "./components/manage-b2b-api/component/b2b-tour-api/b2b-tour-api.component";
import { B2bTransferApiComponent } from "./components/manage-b2b-api/component/b2b-transfer-api/b2b-transfer-api.component";
import { TransferApiComponent } from './components/manage-api/components/transfer-api/transfer-api.component';
import { TourApiComponent } from './components/manage-api/components/tour-api/tour-api.component';


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
    B2cPromoCodeComponent,
    PromocodeListComponent,
    ManagePromocodeComponent,
    B2cPaymentGatewayChargesComponent,
    ListPromocodeComponent,
    UpdatePromocodeComponent,
    SocialLoginComponent,
    SocialNetworksComponent,
    TravelInsuranceComponent,
    ApiCurrencyRateListComponent,
    PushNotificationsComponent,
    DomainLogoComponent,
    ManagePaymnetGatewayComponent,
    AddCurrencyComponent,
    UpdateLastTicketingDurationComponent,
    UpdateTicketingDurationComponent,
    UpdatedListingComponent,
    HotelApiComponent,
    FlightApiComponent,
    CarApiComponent,
    ActivityApiComponent,
    ManageB2bApiComponent,
    ManageAllApiComponent,
    B2bFlightApiComponent,
    B2bHotelApiComponent,
    B2bActivityApiComponent,
    B2bTourApiComponent,
    B2bTransferApiComponent,
    TransferApiComponent,
    TourApiComponent

  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    LayoutsModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports:[
    
  ]
})
export class SettingsModule {}
