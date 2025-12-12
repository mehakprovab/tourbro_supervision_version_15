import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddUpdateHotelAmenityComponent } from './components/hotel-amenities/components/add-update-hotel-amenity/add-update-hotel-amenity.component';
import { HotelAmenityListComponent } from './components/hotel-amenities/components/hotel-amenity-list/hotel-amenity-list.component';
import { HotelAmenitiesComponent } from './components/hotel-amenities/hotel-amenities.component';
import { AddUpdateHotelTypeComponent } from './components/hotel-type/components/add-update-hotel-type/add-update-hotel-type.component';
import { HotelTypeListComponent } from './components/hotel-type/components/hotel-type-list/hotel-type-list.component';
import { HotelTypeComponent } from './components/hotel-type/hotel-type.component';
import { HotelListComponent } from './components/hotels/components/hotel-list/hotel-list.component';
import { AddUpdateRoomAmenityComponent } from './components/room-amenities/components/add-update-room-amenity/add-update-room-amenity.component';
import { RoomAmenityListComponent } from './components/room-amenities/components/room-amenity-list/room-amenity-list.component';
import { RoomAmenitiesComponent } from './components/room-amenities/room-amenities.component';
import { AddUpdateRoomTypeComponent } from './components/room-type/components/add-update-room-type/add-update-room-type.component';
import { RoomTypeListComponent } from './components/room-type/components/room-type-list/room-type-list.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { HotelCrsRoutingModule } from './hotel-crs.routing.module';
import { HotelDetailComponent } from './components/hotels/components/hotel-detail/hotel-detail.component';
import { AddUpdateHotelComponent } from './components/hotels/components/add-update-hotel/add-update-hotel.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RoomComponent } from './components/hotels/components/room/room.component';
import { HotelImageComponent } from './components/hotels/components/hotel-image/hotel-image.component';
import { RoomDetailComponent } from './components/hotels/components/room-detail/room-detail.component';
import { RoomImageComponent } from './components/hotels/components/room-image/room-image.component';
import { SeasonComponent } from './components/season/season.component';
import { PriceComponent } from './components/hotels/components/price/price.component';
import { CancellationComponent } from './components/hotels/components/cancellation/cancellation.component';
import { HotelCrsDetailComponent } from './components/hotels/components/hotel-crs-detail/hotel-crs-detail.component';
import { AddUpdateSeasonComponent } from './components/season/component/add-update-season/add-update-season.component';
import { SeasonListComponent } from './components/season/component/season-list/season-list.component';
import { MatSlideToggle } from '@angular/material';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SeasonsComponent } from './components/hotels/components/seasons/seasons.component';
import { PriceManagementComponent } from './components/hotels/components/price-management/price-management.component';
import { MealsComponent } from './components/meals/meals.component';
import { AddUpdateMealsComponent } from './components/meals/components/add-update-meals/add-update-meals.component';
import { MealListComponent } from './components/meals/components/meal-list/meal-list.component';
import { TaxComponent } from './components/tax/tax.component';
import { RoomViewComponent } from './components/room-view/room-view.component';
import { TaxListComponent } from './components/tax/components/tax-list/tax-list.component';
import { AddUpdateTaxComponent } from './components/tax/components/add-update-tax/add-update-tax.component';
import { ListRoomViewComponent } from './components/room-view/components/list-room-view/list-room-view.component';
import { AddUpdateRoomViewComponent } from './components/room-view/components/add-update-room-view/add-update-room-view.component';
import { ChildrenPollicyComponent } from './components/children-pollicy/children-pollicy.component';
import { AddUpdateChildrenPollicyComponent } from './components/children-pollicy/component/add-update-children-pollicy/add-update-children-pollicy.component';
import { ChildrenPollicyListComponent } from './components/children-pollicy/component/children-pollicy-list/children-pollicy-list.component';
import { CKEditorModule } from 'ckeditor4-angular';



@NgModule({
  imports: [
    CommonModule,
    HotelCrsRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
    CKEditorModule,
  ],
  declarations: [
    HotelTypeComponent, 
    RoomTypeComponent, 
    HotelAmenitiesComponent, 
    RoomAmenitiesComponent, 
    HotelListComponent, 
    HotelTypeListComponent, 
    AddUpdateHotelTypeComponent,
    HotelAmenityListComponent,
    AddUpdateHotelAmenityComponent,
    RoomTypeListComponent,
    AddUpdateRoomTypeComponent,
    RoomAmenityListComponent,
    AddUpdateRoomAmenityComponent,
    HotelDetailComponent,
    AddUpdateHotelComponent,
    HotelsComponent,
    RoomComponent,
    HotelImageComponent,
    RoomDetailComponent,
    RoomImageComponent,
    // SeasonComponent,
    SeasonsComponent,
    PriceComponent,
    PriceManagementComponent,
    CancellationComponent,
    HotelCrsDetailComponent,
    AddUpdateSeasonComponent,
    SeasonListComponent,
    SeasonComponent,
    MealsComponent,
    AddUpdateMealsComponent,
    MealListComponent,
    TaxComponent,
    TaxListComponent,
    AddUpdateTaxComponent,
    RoomViewComponent,
    ListRoomViewComponent,
    AddUpdateRoomViewComponent,
    ChildrenPollicyComponent,
    AddUpdateChildrenPollicyComponent,
    ChildrenPollicyListComponent
    

  ],
  exports: [
    HotelTypeComponent, 
    RoomTypeComponent, 
    HotelAmenitiesComponent, 
    RoomAmenitiesComponent, 
    HotelListComponent,
    MealsComponent,
    TaxComponent,
    RoomViewComponent,
    SeasonComponent,
  ]
})
export class HotelCrsModule { }
