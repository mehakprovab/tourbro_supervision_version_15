import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightService } from '../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-airline-carousel',
    templateUrl: './airline-carousel.component.html',
    styleUrls: ['./airline-carousel.component.scss']
})
export class AirlineCarouselComponent implements OnInit, OnDestroy {

    slideConfig4 = {
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
    };
    airlinesCarousel: any = {
        name: 'Indigo',
        isChecked: true,
        price: 0
    };

    airline_logo = this.flightService.airline_logo;
    currency: string = '';

    protected subs = new SubSink();
    constructor(
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.airlinesCarousel.subscribe(res => {
            this.airlinesCarousel = res;
            if (res.length) {
                this.currency =res[0]['currency']
            }
        });
    }

    filterByAirline(airline: string) {
        const carousel = this.flightService.airlineCarouselClick;
        let result = [];
        if (this.airlinesCarousel[carousel.value] && this.airlinesCarousel[carousel.value]['name'] == airline) {
            carousel.next(undefined);
            result = this.flightService.airlines.value.map((t, i) => {
                this.airlinesCarousel[i]['isChecked'] = false;
                return { ...t, isChecked: true };
            });
        } else {
            this.airlinesCarousel.forEach((e, i) => {
                this.airlinesCarousel[i]['isChecked'] = false;
                if (airline === e.name) {
                    this.airlinesCarousel[i]['isChecked'] = true;
                    carousel.next(i);
                }
                result.push({ name: e.name, isChecked: airline === e.name });
            });
        }
        this.flightService.airlines.next(result);
        this.flightService.filterByAirlines();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
