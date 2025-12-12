import { NgModule } from '@angular/core';
import { OfflineRoutingModule } from './offline-routing.module';
import {
    HotelComponent,
    FlightComponent,
    AdminMarkupComponent,
    AdultInfoComponent,
    OnwardFlightDetailsComponent,
    PassengerContactInfoComponent,
    PassengerFareBreakupComponent,
    SelectPassengerDetailsComponent,
} from './components';
import { LayoutsModule } from '../../layout/layout.module';


@NgModule({
    imports: [
        LayoutsModule,
        OfflineRoutingModule
    ],
    declarations: [
        HotelComponent,
        FlightComponent,
        AdminMarkupComponent,
        AdultInfoComponent,
        OnwardFlightDetailsComponent,
        PassengerContactInfoComponent,
        PassengerFareBreakupComponent,
        SelectPassengerDetailsComponent,
    ],
})
export class OfflineModule { }
