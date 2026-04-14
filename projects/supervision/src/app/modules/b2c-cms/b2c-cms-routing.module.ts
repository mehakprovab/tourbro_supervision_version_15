import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AddOrModifyFlightWidgetComponent } from "../b2c-cms/components/add-or-modify-flight-widget/add-or-modify-flight-widget.component";
import { AddOrModifyHotelWidgetComponent } from "./components/add-or-modify-hotel-widget/add-or-modify-hotel-widget.component";
import { AddOrUpdateBannerImagesComponent } from "./components/add-or-update-banner-images/add-or-update-banner-images.component";
import { B2cStaticPageContentComponent } from "./components/b2c-static-page-content/b2c-static-page-content.component";
import { TestimonialComponent } from "./components/testimonial/testimonial.component";
import { DiscountsComponent } from "./components/discounts/discounts.component";
import { WhyChooseUsComponent } from "./components/why-choose-us/why-choose-us.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { AddOrModifyFaqWidgetComponent } from "./components/add-or-modify-faq-widget/add-or-modify-faq-widget.component";
import { AddOrModifyCustomerFaqComponent } from "./components/add-or-modify-customer-faq/add-or-modify-customer-faq.component";
import { AddOrModifyHolidayWidgetComponent } from "./components/add-or-modify-holiday-widget/add-or-modify-holiday-widget.component";
import { FlightAdvertisementComponent } from "./components/flight-advertisement/flight-advertisement.component";
import { AddOrModifyPartnerAirlinesComponent } from "./components/add-partner-airlines/add-partner-airlines/add-partner-airlines.component";
import { AddOrModifyAyurvedaComponent } from "./components/add-or-modify-ayurveda/add-or-modify-ayurveda.component";
import { AddOrModifyMeditationRetreatComponent } from "./components/add-or-modify-meditation-retreat/add-or-modify-meditation-retreat.component";
import { GuideMainSectionComponent } from "./components/guide-main-section/guide-main-section.component";
import { GuideProcessSectionComponent } from "./components/guide-process-section/guide-process-section.component";
import { GeneralModalImageComponent } from "./components/general-modal-image/general-modal-image.component";
import { GuideLastSectionComponent } from "./components/guide-last-section/guide-last-section.component";
import { AddOrModifyServiceFaqComponent } from "./components/add-or-modify-service-faq/add-or-modify-service-faq.component";
import { AddOrModifyAboutFaqComponent } from "./components/add-or-modify-about-faq/add-or-modify-about-faq.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "homepage-widgets/add-modify-flight",
        canActivate: [AuthGuard],
        component: AddOrModifyFlightWidgetComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-modify-hotel",
        canActivate: [AuthGuard],
        component: AddOrModifyHotelWidgetComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-modify-holiday",
        canActivate: [AuthGuard],
        component: AddOrModifyHolidayWidgetComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-banner/add-modify-image",
        canActivate: [AuthGuard],
        component: AddOrUpdateBannerImagesComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-footer/static-page-content",
        canActivate: [AuthGuard],
        component: B2cStaticPageContentComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-modify-faq",
        canActivate: [AuthGuard],
        component: AddOrModifyFaqWidgetComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-modify-customer-faq",
        canActivate: [AuthGuard],
        component: AddOrModifyCustomerFaqComponent,
        data: { extraParameter: "" },
      },
       {
        path: "homepage-widgets/add-modify-service-faq",
        canActivate: [AuthGuard],
        component: AddOrModifyServiceFaqComponent,
        data: { extraParameter: "" },
      },
       {
        path: "homepage-widgets/add-modify-about-faq",
        canActivate: [AuthGuard],
        component: AddOrModifyAboutFaqComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage/testimonial",
        canActivate: [AuthGuard],
        component: TestimonialComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage/discounts",
        canActivate: [AuthGuard],
        component: DiscountsComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage/flight-advertisement",
        canActivate: [AuthGuard],
        component: FlightAdvertisementComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage/why-choose-us",
        canActivate: [AuthGuard],
        component: WhyChooseUsComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage/contactUs",
        canActivate: [AuthGuard],
        component: ContactUsComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-partner-airlines",
        canActivate: [AuthGuard],
        component: AddOrModifyPartnerAirlinesComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-widgets/add-modify-ayurveda",
        canActivate: [AuthGuard],
        component: AddOrModifyAyurvedaComponent,
        data: { extraParameter: "" },
      },
          {
        path: "homepage-widgets/add-modify-meditation-retreat",
        canActivate: [AuthGuard],
        component: AddOrModifyMeditationRetreatComponent,
        data: { extraParameter: "" },
      },
        {
        path: "homepage-widgets/add-modify-meditation-retreat",
        canActivate: [AuthGuard],
        component: AddOrModifyMeditationRetreatComponent,
        data: { extraParameter: "" },
      },
        {
        path: "book-my-guide-cms/main-content",
        canActivate: [AuthGuard],
        component: GuideMainSectionComponent,
        data: { extraParameter: "" },
      },
      {
        path: "book-my-guide-cms/mid-section",
        canActivate: [AuthGuard],
        component: GuideProcessSectionComponent,
        data: { extraParameter: "" },
      },
       {
        path: "book-my-guide-cms/last-section",
        canActivate: [AuthGuard],
        component: GuideLastSectionComponent,
        data: { extraParameter: "" },
      },
      {
        path: "homepage-banner/general-modal-image",
        canActivate: [AuthGuard],
        component: GeneralModalImageComponent,
        data: { extraParameter: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class B2cCmsModuleRoutingModule {}
