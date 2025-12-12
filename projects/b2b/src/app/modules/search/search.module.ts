import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimepickerModule } from "ngx-bootstrap/timepicker";
// import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from "ngx-bootstrap/popover";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LayoutsModule } from '../../layout/layout.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BookingComponent } from './flight/booking/booking.component';
import { FormExtensionComponent } from './flight/components/form-extension/form-extension.component';
import { PreferredAirlineComponent } from './flight/components/preferred-airline/preferred-airline.component';
import { TripInfoComponent } from './flight/result/flight-details/trip-info/trip-info.component';
import { SearchFromComponent } from './flight/search-from/search-from.component';
import { HotelPaymentConfirmationComponent } from './hotel/components/hotel-booking/components/hotel-payment-confirmation/hotel-payment-confirmation.component';
import { HotelProceedPaymentComponent } from './hotel/components/hotel-booking/components/hotel-proceed-payment/hotel-proceed-payment.component';
import { AmenitiesFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/amenities-filter/amenities-filter.component';
import { FilterHotelsComponent } from './hotel/components/hotel-result/components/filter-hotels/filter-hotels.component';
import { HotelAccomodationFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-accomodation-filter/hotel-accomodation-filter.component';
import { HotelNamesearchFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-namesearch-filter/hotel-namesearch-filter.component';
import { HotelPriceFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-price-filter/hotel-price-filter.component';
import { RatingFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/rating-filter/rating-filter.component';
import { HotelSearchLoaderComponent } from './hotel/components/hotel-result/components/hotel-search-loader/hotel-search-loader.component';
import { SortingHotelsComponent } from './hotel/components/hotel-result/components/sorting-hotels/sorting-hotels.component';
import {
  AirlineCarouselComponent, AirlineFeaturesComponent, AirlinesFilterComponent,
  AirportsNearbyFilterComponent, ArrivalTimeFilterComponent, BookingConfirmComponent, BookingFareSummaryComponent, BookingFlightDetailComponent, BookingStepsComponent, CancelInfoComponent, ConfirmPassengerComponent, DepartureTimeFilterComponent, FiltersComponent, FlightCityListComponent, FlightComponent, FlightDetailsBaggageComponent, FlightDetailsComponent, FlightDetailsFareComponent,
  FlightDetailsItineraryComponent, FareRulesComponent, HotelBookingComponent, HotelBookingStepsComponent, HotelCityListComponent, HotelComponent, HotelConfirmationComponent, HotelDetailComponent,
  HotelDetailImagesComponent, HotelGuestDetailsComponent,
  HotelPaymentDetailComponent, HotelResultComponent, HotelRoomDetailComponent, HotelVoucherComponent, LowBalanceAlertComponent, MulticityComponent,
  OnewayComponent, PreferencesFilterComponent, PriceFilterComponent, ResultComponent, RoundtripComponent, SendItineraryComponent, ServiceRequestsComponent, SimilarHotelsComponent, SortingComponent, StopoverCityFilterComponent, StopsFilterComponent
} from './index';
import { SafePipe } from './pipes/safe.pipe';
import { TypeofPipe } from './pipes/typeof.pipe';
import { SearchRoutingModule } from './search-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RoundTripComponent } from './flight/result/round-trip/round-trip.component';
import { SortingRoundComponent } from './flight/result/sorting-round/sorting-round.component';
import { ActivityVoucherComponent } from './activity/components/voucher/activity-voucher.component';
import { ActivitySearchFormComponent } from './activity/components/activity-search-form/activity-search-form.component';
// import { ActivityBookingComponent } from './activity/components/activity-booking/activity-booking.component';
// import { ActivityConfirmComponent } from './activity/components/activity-confirm/activity-confirm.component';
import { ActivityResultComponent } from './activity/components/result/activity-result.component';
import { ActivityFiltersComponent } from './activity/components/filters/activity-filters.component';
//import { ActivityDetailsComponent } from './activity/components/result/activity-details/activity-details.component';
import { ActivitySortingComponent } from './activity/components/result/activity-sorting/activity-sorting.component';
import { ActivitySearchNameComponent } from './activity/components/filters/activity-search-name/activity-search-name.component';
import { ActivityInfoComponent } from './activity/components/result/activity-details/activity-info/activity-info.component';
import { ActivityDetailImagesComponent } from './activity/components/result/activity-details/activity-detail-images/activity-detail-images.component';
import { ActivityPriceSliderComponent } from './activity/components/filters/price-slider/activity-price-slider.component';
import { StarRatingComponent } from './activity/components/filters/star-rating/star-rating.component';
import { TransferResultComponent } from './transfer/transfer-result/transfer-result.component';
import { TransferSearchComponent } from './transfer/transfer-search/transfer-search.component';
import { TransferLoaderComponent } from './transfer/transfer-result/components/transfer-loader/transfer-loader.component';
import { TransferFiltersComponent } from './transfer/transfer-result/components/transfer-filters/transfer-filters.component';
import { TransferSortingComponent } from './transfer/transfer-result/components/transfer-sorting/transfer-sorting.component';
import { TransferNameComponent } from './transfer/transfer-result/components/transfer-filters/transfer-name/transfer-name.component';
import { PriceSliderComponent } from './transfer/transfer-result/components/transfer-filters/price-slider/price-slider.component';
import { TransferDetailsComponent } from './transfer/transfer-details/transfer-details.component';
import { TransferDetailImagesComponent } from './transfer/transfer-details/transfer-detail-images/transfer-detail-images.component';
import { TransferInfoComponent } from './transfer/transfer-details/transfer-info/transfer-info.component';
import { TransferFaresummaryComponent } from './transfer/transfer-details/transfer-faresummary/transfer-faresummary.component';
import { TransfersConfirmComponent } from './transfer/transfers-confirm/transfers-confirm.component';
import { TransfersBookingComponent } from './transfer/transfers-booking/transfers-booking.component';
import { VoucherComponent } from './transfer/voucher/voucher.component';
import { TransferPaymentComponent } from './transfer/transfer-payment/transfer-payment.component';
import { FareDetailchartComponent } from './flight/result/fare-detailchart/fare-detailchart.component';
import { TourSearchFormComponent } from './tour/components/tour-search-form/tour-search-form.component';
import { TourSortingComponent } from './tour/components/result/tour-sorting/tour-sorting.component';
import { TourFiltersComponent } from './tour/components/filters/tour-filters/tour-filters.component';
import { TourSearchNameComponent } from './tour/components/filters/tour-search-name/tour-search-name.component';
import { TourBookingComponent } from './tour/components/tour-booking/tour-booking.component';
import { TourItineraryComponent } from './tour/components/tour-booking/tour-itinerary/tour-itinerary.component';
import { TourPriceSliderComponent } from './tour/components/filters/price-slider/tour-price-slider.component';
import { TourPriceFilterComponent } from './tour/components/filters/tour-price-filter/tour-price-filter.component';
import { TourFinalBookingComponent } from './tour/components/tour-booking/tour-final-booking/tour-final-booking.component';
import { TourVoucherComponent } from './tour/components/tour-booking/tour-voucher/tour-voucher.component';
import { TourGalleryComponent } from './tour/components/tour-booking/tour-gallery/tour-gallery.component';
import { B2bTourDetailsComponent } from './tour';
import { TourResultComponent } from './tour/components/result/tour-result/tour-result.component';
import { TourConfirmComponent } from './tour/components/tour-booking/tour-confirm/tour-confirm.component';
import { ContinentFilterComponent } from './tour/components/filters/continent-filter/continent-filter.component';
import { CountryFilterComponent } from './tour/components/filters/country-filter/country-filter.component';
import { DurationFilterComponent } from './tour/components/filters/duration-filter/duration-filter.component';
import { PackageTypeFilterComponent } from './tour/components/filters/package-type-filter/package-type-filter.component';
import { ThemeFilterComponent } from './tour/components/filters/theme-filter/theme-filter.component';
import { TourDetailsComponent } from 'projects/supervision/src/app/modules/report/B2C/b2c/b2c-tour-enquiry/tour-details/tour-details.component';
import { DatePipe } from '@angular/common';
import { ActivityDetailsComponent } from './activity/components/result/activity-details/activity-details.component';
import { ActivityBookingComponent } from './activity/components/activity-booking/activity-booking.component';
import { ActivityConfirmComponent } from './activity/components/activity-confirm/activity-confirm.component';
import { TourSearchLoaderComponent } from './tour/components/tour-search-loader/tour-search-loader.component';
import { TransferPrefferedAirlineComponent } from './transfer/transfer-preffered-airline/transfer-preffered-airline.component';
import { TransferFlightListComponent } from './transfer/transfer-flight-list/transfer-flight-list.component';
import { CarCategoryComponent } from './transfer/transfer-result/components/transfer-filters/car-category/car-category.component';
import { SupplierCategoryComponent } from './transfer/transfer-result/components/transfer-filters/supplier-category/supplier-category.component';
import { RatingsComponent } from './transfer/transfer-result/components/transfer-filters/ratings/ratings.component';
//import { ActivitiesLoaderComponent } from './activity/components/activity-loader/activities-loader.component';
import { ActivityFaresummaryComponent } from './activity/components/activity-faresummary/activity-faresummary.component';
import { ActivitiesLoaderComponent } from './activity/components/activity-loader/activities-loader.component';
import { ActivityTypesComponent } from './activity/components/filters/activity-types/activity-types.component';
import { CategoriesComponent } from './activity/components/filters/categories/categories.component';
import { RecomendedActivityComponent } from './activity/components/filters/recomended-activity/recomended-activity.component';
import { HotelPaymentStatusComponent } from './hotel/components/hotel-booking/components/hotel-payment-status/hotel-payment-status.component';
import { ActivityPaymentStatusComponent } from './activity/components/activity-payment-status/activity-payment-status.component';
import { TransfersPaymentStatusComponent } from './transfer/transfers-confirm/transfers-payment-status/transfers-payment-status.component';
import { RefundableComponent } from './hotel/components/hotel-result/components/filter-hotels/refundable/refundable.component';
import { CartModule } from '../cart-booking/cart.module';
import { PackagingFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/packaging-filter/packaging-filter.component';
import { BrandFareModalComponent } from './flight/result/brandfare-modal/brandfare-modal.component';
export const allComponents = [
  FlightComponent,
  MulticityComponent,
  OnewayComponent,
  RoundtripComponent,
  FlightCityListComponent,
  BookingConfirmComponent,
  ConfirmPassengerComponent,
  ServiceRequestsComponent,
  BookingFlightDetailComponent,
  BookingFareSummaryComponent,
  FareRulesComponent,
  AirlineFeaturesComponent,
  SortingComponent,
  AirlineCarouselComponent,
  ResultComponent,
  FiltersComponent,
  PriceFilterComponent,
  StopsFilterComponent,
  DepartureTimeFilterComponent,
  ArrivalTimeFilterComponent,
  AirlinesFilterComponent,
  AirportsNearbyFilterComponent,
  StopoverCityFilterComponent,
  PreferencesFilterComponent,
  FlightDetailsBaggageComponent,
  FlightDetailsFareComponent,
  FlightDetailsItineraryComponent,
  FlightDetailsComponent,
  FormExtensionComponent,
  BookingStepsComponent,
  SendItineraryComponent,
  TripInfoComponent,
  BrandFareModalComponent,
  HotelResultComponent,
  HotelBookingComponent,
  HotelComponent,
  HotelCityListComponent,
  HotelBookingStepsComponent,
  HotelDetailComponent,
  HotelDetailImagesComponent,
  HotelDetailImagesComponent,
  HotelRoomDetailComponent,
  SimilarHotelsComponent,
  HotelGuestDetailsComponent,
  HotelPaymentDetailComponent,
  HotelConfirmationComponent,
  HotelVoucherComponent,
  CancelInfoComponent,
  LowBalanceAlertComponent,
  FareDetailchartComponent,
  TourSearchFormComponent,
  TourResultComponent,
  TourSortingComponent,
  TourFiltersComponent,
  TourSearchNameComponent,
  TourBookingComponent,
  B2bTourDetailsComponent,
  TourGalleryComponent,
  TourItineraryComponent,
  TourPriceSliderComponent,
  TourPriceFilterComponent,
  TourFinalBookingComponent,
  TourVoucherComponent,
  TourConfirmComponent,
  ContinentFilterComponent,
  CountryFilterComponent, DurationFilterComponent, PackageTypeFilterComponent, ThemeFilterComponent, TourConfirmComponent, TourDetailsComponent, TourSearchLoaderComponent
]

@NgModule({
  declarations: [
    BookingComponent,
    ...allComponents,
    SearchFromComponent,
    SortingHotelsComponent,
    FilterHotelsComponent,
    PriceFilterComponent,
    AmenitiesFilterComponent,
    RatingFilterComponent,
    HotelPriceFilterComponent,
    HotelAccomodationFilterComponent,
    HotelNamesearchFilterComponent,
    SafePipe,
    TypeofPipe,
    HotelPaymentConfirmationComponent,
    HotelProceedPaymentComponent,
    PreferredAirlineComponent,
    HotelSearchLoaderComponent,
    ActivitiesLoaderComponent,
    RoundTripComponent,
    SortingRoundComponent,
    ActivityVoucherComponent,
    ActivitySearchFormComponent,
    TourVoucherComponent,
    StarRatingComponent,
    ActivityFaresummaryComponent,
    ActivityResultComponent,
    ActivityFiltersComponent,
    ActivityDetailsComponent,
    ActivityConfirmComponent,
    ActivityBookingComponent,
    ActivitySortingComponent,
    ActivitySearchNameComponent,
    ActivityInfoComponent,
    ActivityDetailImagesComponent,
    ActivityPriceSliderComponent,
    ActivityTypesComponent,
    CategoriesComponent,
    RecomendedActivityComponent,
    TransferResultComponent,
    TransferSearchComponent,
    TransferLoaderComponent,
    TransferFiltersComponent,
    TransferSortingComponent,
    TransferNameComponent,
    PriceSliderComponent,
    TransferDetailsComponent,
    TransferDetailImagesComponent,
    TransferInfoComponent,
    TransferFaresummaryComponent,
    TransfersBookingComponent,
    TransfersConfirmComponent,
    VoucherComponent,
    TransferPaymentComponent,
    TourSearchLoaderComponent,
    TransferPrefferedAirlineComponent,
    CarCategoryComponent,
    TransferFlightListComponent,
    SupplierCategoryComponent,
    RatingsComponent,
    HotelPaymentStatusComponent,
    ActivityPaymentStatusComponent,
    TransfersPaymentStatusComponent,
    RefundableComponent,
    PackagingFilterComponent
  ],
  imports: [
    LayoutsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),

    SearchRoutingModule,
    CarouselModule,
    TabsModule.forRoot(),
    InfiniteScrollModule,
    NgxSliderModule,
    MatInputModule,
    //ModalModule,
    MatAutocompleteModule,
    CartModule
  ],
  exports: [...allComponents],
  providers: [DatePipe],
  entryComponents: [
    TripInfoComponent,
    BrandFareModalComponent,
    CancelInfoComponent,
    LowBalanceAlertComponent,
    HotelResultComponent,
    HotelPaymentConfirmationComponent,
    HotelSearchLoaderComponent,
    ActivitiesLoaderComponent,
    TransferLoaderComponent,
    TransferSearchComponent,
    TourSearchLoaderComponent
  ]
 
})
export class SearchModule {
  constructor() {
  }
}
