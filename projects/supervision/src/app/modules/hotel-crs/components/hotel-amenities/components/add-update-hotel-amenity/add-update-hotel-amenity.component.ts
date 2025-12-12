import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Logger } from '../../../../../../core/logger/logger.service';

const log = new Logger('hotelAmenity/AddUpdateHotelAmenity');

@Component({
    selector: 'app-add-update-hotel-amenity',
    templateUrl: './add-update-hotel-amenity.component.html',
    styleUrls: ['./add-update-hotel-amenity.component.scss']
})
export class AddUpdateHotelAmenityComponent implements OnInit {

    checked: boolean;
    hotelAmenityForm: FormGroup;
    submitted: boolean = false;
    noData: boolean;
    hotelAmenity: any;

    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelAmenityOne: object = {};

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.hotelAmenityOne)) {
                const data = [
                    { id: this.hotelAmenityOne['id'] }
                ];
                data['topic'] = 'editHotelAmenity';
                this.hotelCrsService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200) {
                            this.noData = false;
                            this.hotelAmenity = resp.data;
                            this.patchHotelAmenity();
                        } else {
                            this.noData = true;
                            this.swalService.alert.oops();
                        }
                    });
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelAmenityForm.controls[controlName].touched) && this.hotelAmenityForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.hotelAmenityForm = this.fb.group({
            hotel_amenity_name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(''),
        });
    }

    get f() { return this.hotelAmenityForm.controls; }

    patchHotelAmenity(): void {
        this.hotelAmenityForm.patchValue({
            hotel_amenity_name: this.hotelAmenity['hotel_amenity_name'] || '',
            status: Number(this.hotelAmenity['status']) ? true : false,
        })
    }

    resetFrom() {
        this.hotelAmenityOne = {};
        this.hotelAmenityForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (this.hotelAmenityForm.invalid) {
            return;
        }

        let data = Object.assign({}, this.hotelAmenityForm.value);
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (!this.utilityService.isEmpty(this.hotelAmenityOne)) {
                data['id'] = this.hotelAmenityOne['id'];
                data = [data];
                data['topic'] = 'updateHotelAmenity';
            }
            else {
                data = [data];
                data['topic'] = 'addHotelAmenity';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_hotel_amenity', hotel_amenity: '' })
                    this.hotelAmenityForm.reset();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
    }

}
