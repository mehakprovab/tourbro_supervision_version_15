import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { Logger } from '../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../core/services/swal.service';

const log = new Logger('Hotel-CRS/HotelDetailComponent');

@Component({
    selector: 'app-hotel-detail',
    templateUrl: './hotel-detail.component.html',
    styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

    hotel_id: any;
    hotelDetail: any;
    hotelAmenities: any;
    hotelRooms: any;
    noData: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private hotelCrsService: HotelCrsService,
        private swalService: SwalService,
    ) { }

    ngOnInit(): void {
        this.hotel_id = this.route.snapshot.params["hotel_id"];
        const data = [{ id: this.hotel_id }];
        data['topic'] = 'getHotelDetail';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.hotelDetail = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        });
    }

    backToList() {
        history.back();
    }
}
