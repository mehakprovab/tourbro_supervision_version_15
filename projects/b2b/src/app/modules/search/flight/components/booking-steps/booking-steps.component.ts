import { Component, OnInit, Input } from "@angular/core";
@Component({
    selector: 'app-booking-steps',
    templateUrl: './booking-steps.component.html',
    styleUrls: ['./booking-steps.component.scss']
})

export class BookingStepsComponent implements OnInit {

    @Input() review: any = false;
    @Input() travellers: any = true;
    @Input() extras: any = false;
    @Input() payment: any = false;
    @Input() ticket: any = false;

    constructor() { }

    ngOnInit() {
    }
}