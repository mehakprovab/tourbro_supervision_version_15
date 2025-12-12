import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { AppearanceComponent } from "./components/appearance/appearance.component";
import { ConvenienceFeesComponent } from "./components/convenience-fees/convenience-fees.component";
import { CurrencyConversionComponent } from "./components/currency-conversion/currency-conversion.component";
import { EventLogsComponent } from "./components/event-logs/event-logs.component";
import { LiveEventsComponent } from "./components/live-events/live-events.component";
import { ManageApiComponent } from "./components/manage-api/manage-api.component";
import { ManageCmsComponent } from "./components/manage-sms/manage-cms.component";
import { ManageDomainsComponent } from "./components/manage-domains/manage-domains.component";
import { SocialLoginComponent } from "./components/social-login/social-login.component";
import { SocialNetworksComponent } from "./components/social-networks/social-networks.component";
import { TravelInsuranceComponent } from "./components/travel-insurance/travel-insurance.component";
import { ApiCurrencyRateListComponent } from "./components/api-currency-rate-list/api-currency-rate-list.component";
import { B2cPromoCodeComponent } from "./components/b2c-promo-code/b2c-promo-code.component";
import { B2cPaymentGatewayChargesComponent } from "./components/b2c-payment-gateway-charges/b2c-payment-gateway-charges.component";
import { PushNotificationsComponent } from "./components/push-notifications/push-notifications.component";
import { ManagePaymnetGatewayComponent } from "./components/manage-paymnet-gateway/manage-paymnet-gateway.component";
import { DomainLogoComponent } from "./components/domain-logo/domain-logo.component";
import { AddCurrencyComponent } from "./components/add-currency/add-currency.component";
import { UpdateLastTicketingDurationComponent } from "./components/social-login/update-last-ticketing-duration/update-last-ticketing-duration.component";
import { ManageB2bApiComponent } from "./components/manage-b2b-api/manage-b2b-api.component";
import { ManageAllApiComponent } from "./components/manage-all-api/manage-all-api.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "appearance",
        component: AppearanceComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "b2cPromocode",
        canActivate: [AuthGuard],
        component: B2cPromoCodeComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "b2cPaymentGatewayCharges",
        canActivate: [AuthGuard],
        component: B2cPaymentGatewayChargesComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "managepaymentgatway",
        canActivate: [AuthGuard],
        component: ManagePaymnetGatewayComponent,
        data: { extraParameter: "settingsMenus" },

      },
      // {
      //   path: "manageApi",
      //   canActivate: [AuthGuard],
      //   component: ManageApiComponent,
      //   data: { extraParameter: "settingsMenus" },
      // },
      {
        path: "manage-b2c-Api",
        canActivate: [AuthGuard],
        component: ManageApiComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "manage-b2b-Api",
        canActivate: [AuthGuard],
        component: ManageB2bApiComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "convenience-fees",
        canActivate: [AuthGuard],
        component: ConvenienceFeesComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "currencyConversion",
        canActivate: [AuthGuard],
        component: CurrencyConversionComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "add-currency",
        canActivate: [AuthGuard],
        component: AddCurrencyComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "error-event-logs",
        canActivate: [AuthGuard],
        component: EventLogsComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "live-events",
        canActivate: [AuthGuard],
        component: LiveEventsComponent,
        data: { extraParameter: "settingsMenus" },
      },

      {
        path: "manage-sms",
        canActivate: [AuthGuard],
        component: ManageCmsComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "social-login",
        canActivate: [AuthGuard],
        component: SocialLoginComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "domain-logo",
        canActivate: [AuthGuard],
        component: DomainLogoComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "manage-domains",
        canActivate: [AuthGuard],
        component: ManageDomainsComponent,
        data: { extraParameter: "settingsMenus" },
      },

      {
        path: "social-networks",
        component: SocialNetworksComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "travel-insurance",
        component: TravelInsuranceComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "api-currency-rate",
        component: ApiCurrencyRateListComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "push-notification",
        component: PushNotificationsComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "update-last-ticketing-duration",
        canActivate: [AuthGuard],
        component: UpdateLastTicketingDurationComponent,
        data: { extraParameter: "settingsMenus" },
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
