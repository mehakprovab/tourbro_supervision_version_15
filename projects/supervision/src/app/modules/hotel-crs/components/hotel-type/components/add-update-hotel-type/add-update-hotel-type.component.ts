import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Logger } from '../../../../../../core/logger/logger.service';

const log = new Logger('hotel Type/AddUpdateHotelTypeComponent');

@Component({
    selector: 'app-add-update-hotel-type',
    templateUrl: './add-update-hotel-type.component.html',
    styleUrls: ['./add-update-hotel-type.component.scss']
})
export class AddUpdateHotelTypeComponent implements OnInit {

    checked: boolean;
    hotelTypeForm: FormGroup;
    submitted: boolean = false;
    noData: boolean;
    hotelType: any;

    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelTypeOne: object = {};

    constructor(
        private fb: FormBuilder,
        private api: ApiHandlerService,
        private swalService: SwalService,
        private hotelCrsService: HotelCrsService,
        private utilityService: UtilityService,
    ) { }

    ngOnInit(): void {
        this.createForm();
        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                const data = [
                    { id: this.hotelTypeOne['id'] }
                ];
                data['topic'] = 'editHotelType';
                this.hotelCrsService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200) {
                            this.noData = false;
                            this.hotelType = resp.data;
                            this.patchHotelType();
                        } else {
                            this.noData = true;
                            this.swalService.alert.oops();
                        }
                    });
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.hotelTypeForm = this.fb.group({
            hotel_type_name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(''),
        });
    }

    get f() { return this.hotelTypeForm.controls; }

    patchHotelType(): void {
        this.hotelTypeForm.patchValue({
            hotel_type_name: this.hotelType['hotel_type_name'] || '',
            status: Number(this.hotelType['status']) ? true : false,
        })
    }

    resetFrom() {
        this.hotelTypeOne = {};
        this.hotelTypeForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (this.hotelTypeForm.invalid) {
            return;
        }
        
        let data = Object.assign({}, this.hotelTypeForm.value);
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                data['id'] = this.hotelTypeOne['id'];
                data = [data];
                data['topic'] = 'updateHotelType';
            }
            else {
                data = [data];
                data['topic'] = 'addHotelType';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_hotel_types', hotel_type: '' })
                    this.hotelTypeForm.reset();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
    }

}
