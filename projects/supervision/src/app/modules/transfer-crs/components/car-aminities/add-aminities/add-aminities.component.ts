import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs/hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

@Component({
  selector: 'app-add-aminities',
  templateUrl: './add-aminities.component.html',
  styleUrls: ['./add-aminities.component.scss']
})
export class AddAminitiesComponent implements OnInit {

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
                    { id: this.roomAmenityOne['id'] ,status: this.roomAmenityOne['status'] }
                ];
                data['topic'] = 'editCarAmenitiesStatus';
                this.hotelCrsService.fetch(data)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
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
            amenties: new FormControl('', [Validators.required]),
            status: new FormControl(''),
        });
    }

    get f() { return this.roomAmenityForm.controls; }

    patchRoomAmenity(): void {
        this.roomAmenityForm.patchValue({
            amenties: this.roomAmenity['amenties'] || '',
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
                data['topic'] = 'updateCarAmenities';
            }
            else {
                data = [data];
                data['topic'] = 'addCarAmenities';
            }
        } catch (error) {
            // log.debug(error)
        }
        // log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_room_amenity', room_amenity: '' })
                    this.roomAmenityForm.reset();
                } else  {
                    this.swalService.alert.oops("Duplicate Entry exist.")
                }
                
            }, (error) => {
           this.swalService.alert.oops("Duplicate Entry Exist.");
        })
    }

}

