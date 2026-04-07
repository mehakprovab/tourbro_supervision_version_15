import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LayoutsModule } from '../../layout/layout.module';
import { B2cCmsModuleRoutingModule } from './b2c-cms-routing.module';
import { B2cCmsComponent } from '../b2c-cms/b2c-cms.component';
import { AddOrModifyFlightWidgetComponent } from '../b2c-cms/components/add-or-modify-flight-widget/add-or-modify-flight-widget.component';
import { AddOrModifyHotelWidgetComponent } from './components/add-or-modify-hotel-widget/add-or-modify-hotel-widget.component';
import { AddOrModifyCarWidgetComponent } from '../b2c-cms/components/add-or-modify-car-widget/add-or-modify-car-widget.component';
import { AddOrUpdateBannerImagesComponent } from './components/add-or-update-banner-images/add-or-update-banner-images.component';
import { B2cStaticPageContentComponent } from './components/b2c-static-page-content/b2c-static-page-content.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { AddUpdateContentComponent } from './components/b2c-static-page-content/components/add-update-content/add-update-content.component';
import { ListContentComponent } from './components/b2c-static-page-content/components/list-content/list-content.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ListFaqContentComponent } from './components/add-or-modify-faq-widget/component/list-faq-content/list-faq-content.component';
import { AddOrModifyFaqWidgetComponent } from './components/add-or-modify-faq-widget/add-or-modify-faq-widget.component';
import { AddUpdateFaqContentComponent } from './components/add-or-modify-faq-widget/component/add-update-faq-content/add-update-faq-content.component';
import { AddOrModifyCustomerFaqComponent } from './components/add-or-modify-customer-faq/add-or-modify-customer-faq.component';
import { AddUpdateCustomerFaqComponent } from './components/add-or-modify-customer-faq/component/add-update-customer-faq/add-update-customer-faq.component';
import { ListCustomerComponent } from './components/add-or-modify-customer-faq/component/list-customer/list-customer.component';
import { AddOrModifyHolidayWidgetComponent } from './components/add-or-modify-holiday-widget/add-or-modify-holiday-widget.component';
import { FlightAdvertisementComponent } from './components/flight-advertisement/flight-advertisement.component';
import { AddOrModifyPartnerAirlinesComponent } from './components/add-partner-airlines/add-partner-airlines/add-partner-airlines.component';
import { AddOrModifyAyurvedaComponent } from './components/add-or-modify-ayurveda/add-or-modify-ayurveda.component';
import { AddOrModifyMeditationRetreatComponent } from './components/add-or-modify-meditation-retreat/add-or-modify-meditation-retreat.component';
import { GuideMainSectionComponent } from './components/guide-main-section/guide-main-section.component';
import { GuideProcessSectionComponent } from './components/guide-process-section/guide-process-section.component';
import { GeneralModalImageComponent } from './components/general-modal-image/general-modal-image.component';
import { GuideLastSectionComponent } from './components/guide-last-section/guide-last-section.component';

@NgModule({
  declarations: [
  B2cCmsComponent,
  AddOrModifyFlightWidgetComponent,
  AddOrModifyHotelWidgetComponent,
  AddOrModifyCarWidgetComponent,
  AddOrUpdateBannerImagesComponent,
  B2cStaticPageContentComponent,
  AddUpdateContentComponent,
  ListContentComponent,
  TestimonialComponent,
  DiscountsComponent,
  WhyChooseUsComponent,
  ContactUsComponent,
  ListFaqContentComponent,
  AddOrModifyFaqWidgetComponent,
  AddUpdateFaqContentComponent,
  AddOrModifyCustomerFaqComponent,
  AddUpdateCustomerFaqComponent,
  ListCustomerComponent,
  AddOrModifyHolidayWidgetComponent,
  FlightAdvertisementComponent,
  AddOrModifyPartnerAirlinesComponent,
  AddOrModifyAyurvedaComponent,
  AddOrModifyMeditationRetreatComponent,
  GuideMainSectionComponent,
  GuideProcessSectionComponent,
  GeneralModalImageComponent,
  GuideLastSectionComponent,
],
  imports: [
    CommonModule,
    SharedModule,
    LayoutsModule,
    CKEditorModule,
    B2cCmsModuleRoutingModule
  ]
})
export class B2cCmsModuleModule { }
