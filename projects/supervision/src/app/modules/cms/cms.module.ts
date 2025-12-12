import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { CmsRoutingModule } from './cms-routing.module';
import { AgentLoginAlertComponent } from './components/agent-login-alert/agent-login-alert.component';
import { AirlineHotelPartnersComponent } from './components/airline-hotel-partners/airline-hotel-partners.component';
import { AddUpdateAirlinePartnerComponent } from './components/airline-hotel-partners/components/add-update-airline-partner/add-update-airline-partner.component';
import { HotelPartersListComponent } from './components/airline-hotel-partners/components/hotel-parters-list/hotel-parters-list.component';
import { ListAirlinePartnerComponent } from './components/airline-hotel-partners/components/list-airline-partner/list-airline-partner.component';
import { FlightTopDestinationsComponent } from './components/flight-top-destinations/flight-top-destinations.component';
import { AddUpdateSliderTextComponent } from './components/main-banner-image/components/add-update-slider-text/add-update-slider-text.component';
import { AddUpdateSliderComponent } from './components/main-banner-image/components/add-update-slider/add-update-slider.component';
import { SliderImageListComponent } from './components/main-banner-image/components/slider-image-list/slider-image-list.component';
import { SliderTextListComponent } from './components/main-banner-image/components/slider-text-list/slider-text-list.component';
import { MainBannerImageComponent } from './components/main-banner-image/main-banner-image.component';
import { AddUpdateContentComponent } from './components/static-page-content/components/add-update-content/add-update-content.component';
import { ListContentComponent } from './components/static-page-content/components/list-content/list-content.component';
import { StaticPageContentComponent } from './components/static-page-content/static-page-content.component';
import { AddOrModifyAgentFaqComponent } from './components/add-or-modify-agent-faq/add-or-modify-agent-faq.component';

import { ListFaqContentComponent } from './components/add-or-modify-agent-faq/components/list-faq-content/list-faq-content.component';
import { AddUpdateFaqWidgetComponent } from './components/add-or-modify-agent-faq/components/add-update-faq-widget/add-update-faq-widget.component';

@NgModule({
    declarations: [
        FlightTopDestinationsComponent,
        MainBannerImageComponent,
        StaticPageContentComponent,
        SliderImageListComponent,
        AddUpdateSliderComponent,
        AddUpdateContentComponent,
        AddUpdateSliderTextComponent,
        SliderTextListComponent,
        ListContentComponent,
        AgentLoginAlertComponent,
        AirlineHotelPartnersComponent,
        AddUpdateAirlinePartnerComponent,
        ListAirlinePartnerComponent,
        HotelPartersListComponent,
        AddOrModifyAgentFaqComponent,
        AddUpdateFaqWidgetComponent,
        ListFaqContentComponent,
       
    ],
    imports: [
        CommonModule,
        CmsRoutingModule,
        CKEditorModule,
        SharedModule,
        LayoutsModule,
    ]
})
export class CmsModule { }
