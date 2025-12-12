import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('Hotel/AddUpdateHotel');
@Component({
  selector: 'app-season',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {
    showSeasonList: boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    showSeasonForm: boolean;
    submittedRoomSeason: boolean = false;
    addedSeasonDetail: any;
    @Output()isPrice=new EventEmitter<boolean>(false);
    roomList: any;
    @Input() hotelOne: object = {};
    @Input() addedRoomDetail:object = {};
    noDataMessage: string;
    roomSeasonForm: FormGroup;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
  constructor(private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,) { }

  ngOnInit() {
    this.createRoomSeasonForm();
    let hotel_id = this.hotelOne['id']
    const data = [{ id: hotel_id, offset: 0, limit: 10 }]
    data['topic'] = 'getRoomsByHotelId';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.roomList = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noDataMessage = "No records found"
            }
        }
    )
  }
  createRoomSeasonForm(): void {
    this.roomSeasonForm = this.fb.group({
        season_name: ['', Validators.required],
        from_date: [''],
        to_date: [''],
        hotel_room_ids: [''],
        status: [true]
    })
}
  onClickAddSeason(): void {
    this.showSeasonList = false;
    this.showSeasonForm = true;
}
onSubmitSeason() {
    this.submittedRoomSeason = true;
    if (this.roomSeasonForm.valid) {
       // this.roomSeasonForm.value.hotel_room_ids = this.addedRoomDetail['id'];
        this.roomSeasonForm.value.hotel_room_ids = this.hotelOne['id'];
        const dt1 = new Date(this.roomSeasonForm.value.from_date);
        this.roomSeasonForm.value.from_date = formatDate(dt1, '');
        const dt2 = new Date(this.roomSeasonForm.value.to_date);
        this.roomSeasonForm.value.to_date = formatDate(dt2, '');
        let data = Object.assign({}, this.roomSeasonForm.value);
        try {
            if (!this.utilityService.isEmpty(this.hotelOne)) {
                data['hotel_id'] = this.hotelOne['id'];
                data = [data];
                data['topic'] = 'addSeason';
            }
            else {
                data = [data];
                data['topic'] = '';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedSeasonDetail = resp['data']
                this.hotelCrsService.seasonList.next(this.addedSeasonDetail);

                this.isPrice.emit(true);
                // this.isPriceActive = true;
                // this.roomSeasonForm.reset();
                // this.showPriceList = true;
                // this.showPriceForm = false;
                // this.createRoomPriceForm();
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.msg)
            }
            else {
                this.swalService.alert.oops(resp.msg);
            }
        })
    }
    else {
        return;
    }

}
get hotelRoomSeason() { return this.roomSeasonForm.controls; }
}
