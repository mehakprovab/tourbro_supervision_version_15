import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import * as moment from 'moment';

const log = new Logger('season');
@Component({
  selector: 'app-add-update-season',
  templateUrl: './add-update-season.component.html',
  styleUrls: ['./add-update-season.component.scss']
})
export class AddUpdateSeasonComponent implements OnInit {
    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelOne: object = {};
    @Input() editData:object = {};
    roomSeasonForm: FormGroup;
    submittedRoomSeason: boolean = false;
    submittedRoom: boolean = false;
    addedSeasonDetail: any;
    noData: boolean;
    patchdData:any;
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-green'
    };
  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
private hotelcrs:HotelCrsService) { }

  ngOnInit() {
    console.log("editData",this.editData)
    this.createRoomSeasonForm();
    // try {
    //         if (!this.utilityService.isEmpty(this.hotelOne)) {
    //             const data = [
    //                 { id: this.hotelOne['id'] }
    //             ];
    //             data['topic'] = 'editHotel';
    //             this.hotelcrs.fetch(data).subscribe(resp => {
    //                 if (resp.statusCode == 200) {
    //                     this.noData = false;
    //                     //this.hotelData = resp.data;
    //                     //this.patchHotel();
    //                 } else {
    //                     this.noData = true;
    //                     this.swalService.alert.oops();
    //                 }
    //             });
    //         }
    //     } catch (e) { console.log(e); }
    this.patchData()
  }
  createRoomSeasonForm(): void {
    this.roomSeasonForm = this.fb.group({
        season_name: ['', Validators.required],
        from_date: [''],
        to_date: [''],
        status: new FormControl('')
    })
}
patchData() {
    this.patchdData = this.editData;
    const formattedDate1 = moment(this.patchdData.from_date).format("YYYY/MM/DD");
    const formattedDate2 = moment(this.patchdData.to_date).format("YYYY/MM/DD");
    this.roomSeasonForm.patchValue({
        season_name: this.editData['season_name'] || '',
        from_date: formattedDate1 ||  '',
        to_date: formattedDate2|| '',
        status: this.editData['status'] ? true : false
    });
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
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (this.patchdData) {
                 data['id'] = this.patchdData['id'];
                data = [data];
                data['topic'] = 'updateSeason';
            }
            else {
                data = [data];
                data['topic'] = 'addSeason';
            }
        } catch (error) {
          
        }

        this.hotelcrs.update(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_hotel_amenity', hotel_amenity: '' })
                this.addedSeasonDetail = resp['data']
                this.hotelcrs.seasonList.next(this.addedSeasonDetail);
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.Message)
            }
            else {
                this.swalService.alert.oops(resp.Message);
            }
        })
    }
    else {
        return;
    }

}
get hotelRoomSeason() { return this.roomSeasonForm.controls; }
}
