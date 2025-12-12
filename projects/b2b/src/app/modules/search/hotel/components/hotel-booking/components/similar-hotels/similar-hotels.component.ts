import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../../hotel.service';

@Component({
    selector: 'app-similar-hotels',
    templateUrl: './similar-hotels.component.html',
    styleUrls: ['./similar-hotels.component.scss']
})
export class SimilarHotelsComponent implements OnInit {

    hotels: any = {};

    constructor(
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        this.setHotels();
         this.hotelService.hotels.subscribe(resp => {
         this.hotels = resp;
        })
    }

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
            starArr.length = Math.round(num);;
        return starArr;
    }

    setHotels(){
        const storedState = localStorage.getItem('b2bHotels');
        if (storedState) {
            this.hotelService.hotels.next(JSON.parse(storedState));
        }
    }
}
