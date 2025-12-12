import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel Type/AddUpdateHotelTypeComponent');
@Component({
  selector: 'app-add-update-room-view',
  templateUrl: './add-update-room-view.component.html',
  styleUrls: ['./add-update-room-view.component.scss']
})
export class AddUpdateRoomViewComponent implements OnInit {

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
               this.patchHotelType();
            }
        } catch (e) { console.log(e); }
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.hotelTypeForm = this.fb.group({
            views: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(''),
        });
    }

    get f() { return this.hotelTypeForm.controls; }

    patchHotelType(): void {
        this.hotelTypeForm.patchValue({
            views: this.hotelTypeOne['views'] || '',
            status: Number(this.hotelTypeOne['status']) ? 1 : 0,
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
            data['status'] = 1;
        } else {
            data['status'] = 0;
        }
        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                data['id'] = this.hotelTypeOne['id'];
                data = [data];
                data['topic'] = 'updateView';
            }
            else {
                data = [data];
                data['topic'] = 'addView';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.swalService.alert.success('Your data added successfully ..!');
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
