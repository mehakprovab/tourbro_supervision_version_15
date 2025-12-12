import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { OfflineRoutingModule } from './offline-routing.module';
import { FlightComponent } from './components/flight/flight.component';
import { AdminMarkupComponent } from './components/flight/admin-markup/admin-markup.component';
import { AdultInfoComponent } from './components/flight/adult-info/adult-info.component';
import { OnwardFlightDetailsComponent } from './components/flight/onward-flight-details/onward-flight-details.component';
import { PassengerContactInfoComponent } from './components/flight/passenger-contact-info/passenger-contact-info.component';
import { PassengerFareBreakupComponent } from './components/flight/passenger-fare-breakup/passenger-fare-breakup.component';
import { SelectPassengerDetailsComponent } from './components/flight/select-passenger-details/select-passenger-details.component';
import { HotelComponent } from './components/hotel/hotel.component';

@NgModule({
  imports: [
    SharedModule,
    OfflineRoutingModule
  ],
  declarations: [
      FlightComponent,
      AdminMarkupComponent,
      AdultInfoComponent,
      OnwardFlightDetailsComponent,
      PassengerContactInfoComponent,
      PassengerFareBreakupComponent,
      SelectPassengerDetailsComponent,
      HotelComponent
  ],
})
export class OfflineModule { }
