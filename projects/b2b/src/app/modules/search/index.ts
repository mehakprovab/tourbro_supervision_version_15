/*import { FlightComponent, } from './flight/flight.component';
import { HotelComponent } from './hotel/hotel.component';
import { ResultComponent } from './flight/result/result.component';
import { BookingComponent } from './flight/booking/booking.component';
import { BookingConfirmComponent } from './flight/booking/booking-confirm/booking-confirm.component';

import * as DependsOnComponents from './flight/components';
import * as DependsOnComponentsForBookingComponent from './flight/booking/components';
import * as ModalComponents from './flight/modals';
import * as FlightFiltersComponents from './flight/result/filters';
import { AirlineCarouselComponent } from './flight/result/airline-carousel/airline-carousel.component';
import { AirlineFeaturesComponent } from './flight/result/airline-features/airline-features.component';
const allOther = [
    ...Object.values(DependsOnComponents),
    ...Object.values(ModalComponents),
    ...Object.values(DependsOnComponentsForBookingComponent),
    ...Object.values(FlightFiltersComponents),
    AirlineCarouselComponent,
    AirlineFeaturesComponent
];

export {
    FlightComponent,
    ResultComponent,
    BookingComponent,
    HotelComponent,
    BookingConfirmComponent,
    allOther,
}*/

export * from './flight';
export * from './hotel';
