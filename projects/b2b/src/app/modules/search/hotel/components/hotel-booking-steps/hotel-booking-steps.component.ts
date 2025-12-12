import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: 'app-hotel-booking-steps',
    templateUrl: './hotel-booking-steps.component.html',
    styleUrls: ['./hotel-booking-steps.component.scss']
})

export class HotelBookingStepsComponent implements OnInit {

    @Input() guests: any = false;
    @Input() rooms: any = true;
    @Input() payment: any = false;
    @Input() confirmation: any = false;


    constructor() { }

    ngOnInit() {
    }
}
