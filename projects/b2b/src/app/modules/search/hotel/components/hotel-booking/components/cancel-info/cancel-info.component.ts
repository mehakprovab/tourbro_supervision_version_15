import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelRoomDetailComponent } from '../hotel-room-detail/hotel-room-detail.component';

@Component({
    selector: 'app-cancel-info',
    templateUrl: './cancel-info.component.html',
    styleUrls: ['./cancel-info.component.scss']
})
export class CancelInfoComponent implements OnInit {

    constructor(
        public diloagRef: MatDialogRef<HotelRoomDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit() {
        console.log(this.data);
    }

    onClose() {
        this.diloagRef.close();
    }
}
