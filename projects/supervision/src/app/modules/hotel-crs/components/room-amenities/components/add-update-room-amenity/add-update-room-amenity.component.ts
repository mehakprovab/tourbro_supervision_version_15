import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../../../../core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from '../../../../../../core/services/utility.service';

const log = new Logger('RoomAmenity/AddUpdateRoomAmenity');

@Component({
  selector: 'app-add-update-room-amenity',
  templateUrl: './add-update-room-amenity.component.html',
  styleUrls: ['./add-update-room-amenity.component.scss']
})
export class AddUpdateRoomAmenityComponent implements OnInit {

  checked: boolean;
    roomAmenityForm: FormGroup;
    submitted: boolean = false;
    noData: boolean;
    roomAmenity: any;

    @Output() someEvent = new EventEmitter<any>();
    @Input() roomAmenityOne: object = {};

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.roomAmenityOne)) {
                const data = [
                    { id: this.roomAmenityOne['id'] }
                ];
                data['topic'] = 'editRoomAmenity';
                this.hotelCrsService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200) {
                            this.noData = false;
                            this.roomAmenity = resp.data;
                            this.patchRoomAmenity();
                        } else {
                            this.noData = true;
                            this.swalService.alert.oops();
                        }
                    });
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.roomAmenityForm.controls[controlName].touched) && this.roomAmenityForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.roomAmenityForm = this.fb.group({
            room_amenity_name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(''),
        });
    }

    get f() { return this.roomAmenityForm.controls; }

    patchRoomAmenity(): void {
        this.roomAmenityForm.patchValue({
            room_amenity_name: this.roomAmenity['room_amenity_name'] || '',
            status: Number(this.roomAmenity['status']) ? true : false,
        })
    }

    resetFrom() {
        this.roomAmenityOne = {};
        this.roomAmenityForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (this.roomAmenityForm.invalid) {
            return;
        }

        let data = Object.assign({}, this.roomAmenityForm.value);
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (!this.utilityService.isEmpty(this.roomAmenityOne)) {
                data['id'] = this.roomAmenityOne['id'];
                data = [data];
                data['topic'] = 'updateRoomAmenity';
            }
            else {
                data = [data];
                data['topic'] = 'addRoomAmenity';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_room_amenity', room_amenity: '' })
                    this.roomAmenityForm.reset();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
    }

}
