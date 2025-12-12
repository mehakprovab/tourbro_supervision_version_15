import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TourCRSRoutingModule } from "./tour-crs-routing.module"; 
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module"
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown"
import { ActivitiesComponent } from "../tour-crs/components/activities/activities.component"
import { CityComponent } from "./components/city/city.component";
import { ContinentComponent } from "./components/continent/continent.component";
import { CountryComponent } from "./components/country/country.component";
import { ThemeTypeComponent } from "./components/theme-type/theme-type.component";
import { TourListComponent } from "./components/tour-list/tour-list.component";
import { AddContinentComponent } from './components/continent/add-continent/add-continent.component';
import { UpdateContinentComponent } from './components/continent/update-continent/update-continent.component';
import { AddCountryComponent } from './components/country/add-country/add-country.component';
import { UpdateCountryComponent } from './components/country/update-country/update-country.component';
import { AddCityComponent } from './components/city/add-city/add-city.component';
import { UpdateCityComponent } from './components/city/update-city/update-city.component';
import { AddActivitiesComponent } from './components/activities/add-activities/add-activities.component';
import { UpdateActivitiesComponent } from './components/activities/update-activities/update-activities.component';
import { AddThemeTypeComponent } from './components/theme-type/add-theme-type/add-theme-type.component';
import { UpdateThemeTypeComponent } from './components/theme-type/update-theme-type/update-theme-type.component';
import { AddTourListComponent } from './components/tour-list/add-tour-list/add-tour-list.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { DepartureDateListComponent } from './components/tour-list/add-tour-list/departure-date-list/departure-date-list.component';
import { VisitedCityListComponent } from './components/tour-list/add-tour-list/visited-city-list/visited-city-list.component';
import { AddDepartureDateComponent } from './components/tour-list/add-tour-list/departure-date-list/add-departure-date/add-departure-date.component';
import { AddVisitedCityListComponent } from './components/tour-list/add-tour-list/visited-city-list/add-visited-city-list/add-visited-city-list.component';
import { TourItineraryComponent } from './components/tour-list/add-tour-list/tour-itinerary/tour-itinerary.component';
import { TourDescriptionsComponent } from './components/tour-list/add-tour-list/tour-descriptions/tour-descriptions.component';
import { PriceManagementComponent } from './components/tour-list/add-tour-list/price-management/price-management.component';
import { AddPriceComponent } from './components/tour-list/add-tour-list/price-management/add-price/add-price.component';
import { UpdatePriceComponent } from './components/tour-list/add-tour-list/price-management/update-price/update-price.component';
import { DatePipe } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UpdateTourPackageComponent } from './components/tour-list/update-tour-package/update-tour-package.component';
import { BrochureComponent } from './components/tour-list/brochure/brochure.component';
import { TourCrsComponent } from "./tour-crs.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { BestTimeToTravelComponent } from './components/best-time-to-travel/best-time-to-travel.component';
import { AddBestTimeToTravelComponent } from './components/best-time-to-travel/add-best-time-to-travel/add-best-time-to-travel.component';
import { UpdateBestTimeToTravelComponent } from './components/best-time-to-travel/update-best-time-to-travel/update-best-time-to-travel.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AddGalleryComponent } from './components/gallery/add-gallery/add-gallery.component';
import { UpdateGalleryComponent } from './components/gallery/update-gallery/update-gallery.component';
import { IncludesMasterComponent } from './components/includes-master/includes-master.component';
import { AddUpdateIncludeMasterComponent } from './components/includes-master/components/add-update-include-master/add-update-include-master.component';
import { IncludeMasterListComponent } from './components/includes-master/components/include-master-list/include-master-list.component';
import { CityPackageMasterComponent } from './components/city-package-master/city-package-master.component';
import { AddUpdateCityPackageMasterComponent } from './components/city-package-master/components/add-update-city-package-master/add-update-city-package-master.component';
import { CityPackageMasterListComponent } from './components/city-package-master/components/city-package-master-list/city-package-master-list.component';


@NgModule({
  declarations: [
    ActivitiesComponent,
    CityComponent,
    ContinentComponent,
    CountryComponent,
    ThemeTypeComponent,
    TourListComponent,
    AddContinentComponent,
    UpdateContinentComponent,
    AddCountryComponent,
    UpdateCountryComponent,
    AddCityComponent,
    UpdateCityComponent,
    AddActivitiesComponent,
    UpdateActivitiesComponent,
    AddThemeTypeComponent,
    UpdateThemeTypeComponent,
    AddTourListComponent,
    DepartureDateListComponent,
    VisitedCityListComponent,
    AddDepartureDateComponent,
    AddVisitedCityListComponent,
    TourItineraryComponent,
    TourDescriptionsComponent,
    PriceManagementComponent,
    AddPriceComponent,
    UpdatePriceComponent,
    UpdateTourPackageComponent,
    BrochureComponent,
    TourCrsComponent,
    BestTimeToTravelComponent,
    AddBestTimeToTravelComponent,
    UpdateBestTimeToTravelComponent,
    GalleryComponent,
    AddGalleryComponent,
    UpdateGalleryComponent,
    IncludesMasterComponent,
    AddUpdateIncludeMasterComponent,
    IncludeMasterListComponent,
    CityPackageMasterComponent,
    AddUpdateCityPackageMasterComponent,
    CityPackageMasterListComponent,
  ],
  imports: [
    CommonModule,
    TourCRSRoutingModule,
    SharedModule,
    LayoutsModule,
    CKEditorModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers:[
    DatePipe,
  ]
})
export class TourCRSModule {}
