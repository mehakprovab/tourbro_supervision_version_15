import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HotelService } from '../../../../../hotel.service';

@Component({
  selector: 'app-hotel-namesearch-filter',
  templateUrl: './hotel-namesearch-filter.component.html',
  styleUrls: ['./hotel-namesearch-filter.component.scss']
})
export class HotelNamesearchFilterComponent implements OnInit {
    public searchIcon : string = "assets/images/awesome-search.png";
    @ViewChild('searchInputRef',{ static: true }) searchInputRef: ElementRef;

    constructor(
        private hotelService: HotelService
    ) { }

  ngOnInit() {
    this.hotelService.clearHotelName.subscribe(flag => {
        if(flag) {
            this.clearHotelName();
        }
    });
  }

  searchHotels(searchText: string) { 
       this.hotelService.filterByHotelName(searchText);
  }

  clearHotelName(){
    this.searchInputRef.nativeElement.value = ''; // Clear the value of the input field
    this.hotelService.filterByHotelName(undefined);
  }

}
