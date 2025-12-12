import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SwalService } from '../../../../../../core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from '../../../../../../core/services/utility.service';

const log = new Logger('RoomType/AddUpdateRoomTypeComponent');

@Component({
    selector: 'app-add-update-room-type',
    templateUrl: './add-update-room-type.component.html',
    styleUrls: ['./add-update-room-type.component.scss']
})
export class AddUpdateRoomTypeComponent implements OnInit {

    checked: boolean;
    roomTypeForm: FormGroup;
    submitted: boolean = false;
    noData: boolean;
    roomType: any;

    @Output() someEvent = new EventEmitter<any>();
    @Input() roomTypeOne: object = {};

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.roomTypeOne)) {
                const data = [
                    { id: this.roomTypeOne['id'] }
                ];
                data['topic'] = 'editRoomType';
                this.hotelCrsService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200) {
                            this.noData = false;
                            this.roomType = resp.data;
                            this.patchRoomType();
                        } else {
                            this.noData = true;
                            this.swalService.alert.oops();
                        }
                    });
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.roomTypeForm.controls[controlName].touched) && this.roomTypeForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.roomTypeForm = this.fb.group({
            room_type_name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(''),
        });
    }

    get f() { return this.roomTypeForm.controls; }

    patchRoomType(): void {
        this.roomTypeForm.patchValue({
            room_type_name: this.roomType['room_type_name'] || '',
            status: Number(this.roomType['status']) ? true : false,
        })
    }

    resetFrom() {
        this.roomTypeOne = {};
        this.roomTypeForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (this.roomTypeForm.invalid) {
            return;
        }

        let data = Object.assign({}, this.roomTypeForm.value);
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (!this.utilityService.isEmpty(this.roomTypeOne)) {
                data['id'] = this.roomTypeOne['id'];
                data = [data];
                data['topic'] = 'updateRoomType';
            }
            else {
                data = [data];
                data['topic'] = 'addRoomType';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_room_types', room_type: '' })
                    this.roomTypeForm.reset();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
    }


}
