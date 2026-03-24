import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { ActivitiesComponent } from "../tour-crs/components/activities/activities.component"
import { CityComponent } from "./components/city/city.component";
import { ContinentComponent } from "./components/continent/continent.component";
import { CountryComponent } from "./components/country/country.component";
import { ThemeTypeComponent } from "./components/theme-type/theme-type.component";
import { TourListComponent } from "./components/tour-list/tour-list.component";
import { UpdateContinentComponent } from "./components/continent/update-continent/update-continent.component";
import { UpdateCountryComponent } from "./components/country/update-country/update-country.component";
import { UpdateCityComponent } from "./components/city/update-city/update-city.component";
import { UpdateActivitiesComponent } from "./components/activities/update-activities/update-activities.component";
import { UpdateThemeTypeComponent } from "./components/theme-type/update-theme-type/update-theme-type.component";
import { AddTourListComponent } from "./components/tour-list/add-tour-list/add-tour-list.component";
import { DepartureDateListComponent } from "./components/tour-list/add-tour-list/departure-date-list/departure-date-list.component";
import { VisitedCityListComponent } from "./components/tour-list/add-tour-list/visited-city-list/visited-city-list.component";
import { TourItineraryComponent } from "./components/tour-list/add-tour-list/tour-itinerary/tour-itinerary.component";
import { TourDescriptionsComponent } from "./components/tour-list/add-tour-list/tour-descriptions/tour-descriptions.component";
import { PriceManagementComponent } from "./components/tour-list/add-tour-list/price-management/price-management.component";
import { UpdatePriceComponent } from "./components/tour-list/add-tour-list/price-management/update-price/update-price.component";
import { UpdateTourPackageComponent } from "./components/tour-list/update-tour-package/update-tour-package.component";
import { BrochureComponent } from "./components/tour-list/brochure/brochure.component";
import { GalleryComponent } from "./components/gallery/gallery.component";
import { BestTimeToTravelComponent } from "./components/best-time-to-travel/best-time-to-travel.component";
import { AddBestTimeToTravelComponent } from "./components/best-time-to-travel/add-best-time-to-travel/add-best-time-to-travel.component";
import { UpdateBestTimeToTravelComponent } from "./components/best-time-to-travel/update-best-time-to-travel/update-best-time-to-travel.component";
import { UpdateGalleryComponent } from "./components/gallery/update-gallery/update-gallery.component";
import { IncludesMasterComponent } from "./components/includes-master/includes-master.component";
import { CityPackageMasterComponent } from "./components/city-package-master/city-package-master.component";
import { StateComponent } from "./components/state/state.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "activities",
        // canActivate: [AuthGuard],
        component: ActivitiesComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "city",
        // canActivate: [AuthGuard],
        component: CityComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "continent",
        // canActivate: [AuthGuard],
        component: ContinentComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "country",
        // canActivate: [AuthGuard],
        component: CountryComponent,
        data: { extraParameter: "tourCRS" },
      },
        {
        path: "state",
        // canActivate: [AuthGuard],
        component: StateComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "theme-type",
        // canActivate: [AuthGuard],
        component: ThemeTypeComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "tour-list",
        // canActivate: [AuthGuard],
        component: TourListComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "continent/update",
        // canActivate: [AuthGuard],
        component: UpdateContinentComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "country/update/:id",
        // canActivate: [AuthGuard],
        component: UpdateCountryComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "city/update",
        // canActivate: [AuthGuard],
        component: UpdateCityComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "activities/update",
        // canActivate: [AuthGuard],
        component: UpdateActivitiesComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "theme-type/update",
        // canActivate: [AuthGuard],
        component: UpdateThemeTypeComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "tour-list/add-tour",
        // canActivate: [AuthGuard],
        component: AddTourListComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "tour-list/add-tour/departure-date",
        // canActivate: [AuthGuard],
        component: DepartureDateListComponent,
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "tour-list/add-tour/visited-city",
        // canActivate: [AuthGuard],
        component: VisitedCityListComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/add-tour/tour-itinerary",
        // canActivate: [AuthGuard],
        component: TourItineraryComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/add-tour/tour-descriptions",
        // canActivate: [AuthGuard],
        component: TourDescriptionsComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/add-tour/price-management",
        // canActivate: [AuthGuard],
        component: PriceManagementComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/add-tour/price-management/update",
        // canActivate: [AuthGuard],
        component: UpdatePriceComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/update-tour-package",
        // canActivate: [AuthGuard],
        component: UpdateTourPackageComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "tour-list/brochure",
        // canActivate: [AuthGuard],
        component: BrochureComponent, 
        data: { extraParameter: "tourCRS" },
      }, 
      {
        path: "gallery/update",
        // canActivate: [AuthGuard],
        component: UpdateGalleryComponent, 
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "best-time-to-travel/update",
        // canActivate: [AuthGuard],
        component: UpdateBestTimeToTravelComponent, 
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "best-time-to-travel",
        // canActivate: [AuthGuard],
        component: BestTimeToTravelComponent, 
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "include-master",
        // canActivate: [AuthGuard],
        component: IncludesMasterComponent, 
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "city-package-master",
        // canActivate: [AuthGuard],
        component: CityPackageMasterComponent, 
        data: { extraParameter: "tourCRS" },
      },
      {
        path: "gallery",
        // canActivate: [AuthGuard],
        component: GalleryComponent, 
        data: { extraParameter: "tourCRS" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourCRSRoutingModule { }
