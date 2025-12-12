import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Input() searchtype;
    @Output() searchValuesEvent = new EventEmitter<string>();
    activeIdString: any = "left";
    module: string;

    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public tourIcon: string = "assets/images/login-images/assets/holiday-ic.svg";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    constructor(
        private router: Router
    ) {

    }


    ngOnInit() {
        if (this.searchtype == 'flight') {
            this.module = 'flight';
            this.activeIdString = "left"
        } else if (this.searchtype == 'hotel') {
            this.module = 'hotel';
            this.activeIdString = "middle"
        } else if (this.searchtype == 'car') {
            this.activeIdString = "right"
        } else if (this.searchtype == 'activity') {
            this.module = 'activity';
            this.activeIdString = "activity"
        } if (this.searchtype == 'transfer') {
            this.module = 'transfer';
            this.activeIdString = "transfer"
        }else if (this.searchtype == 'tour') {
            this.module = 'tour';
            this.activeIdString = "tour"
        }
        // this.onSearchTypeChange(this.searchType);
    }

    receiveSearchForm($event) {
        this.searchValuesEvent.emit($event);
    }


    onSearchTypeChange(value) {
        this.searchtype = value;
        console.log(this.searchtype);
        this.router.navigate(["reports/" + value + "-booking-details"])
    }


}
