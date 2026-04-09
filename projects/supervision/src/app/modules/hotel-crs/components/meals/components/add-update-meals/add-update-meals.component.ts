import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel Type/AddUpdateHotelTypeComponent');
@Component({
  selector: 'app-add-update-meals',
  templateUrl: './add-update-meals.component.html',
  styleUrls: ['./add-update-meals.component.scss']
})
export class AddUpdateMealsComponent implements OnInit {

  checked: boolean;
  mealTypeForm: FormGroup;
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
        return ((this.submitted || this.mealTypeForm.controls[controlName].touched) && this.mealTypeForm.controls[controlName].hasError(errorName));
    }

    createForm(): void {
        this.mealTypeForm = this.fb.group({
          meals: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            status: new FormControl(1),
        });
    }

    get f() { return this.mealTypeForm.controls; }

    patchHotelType(): void {
        console.log("hotelType",this.hotelTypeOne)
        this.mealTypeForm.patchValue({
            meals: this.hotelTypeOne['meals'] || '',
           // status: Number(this.hotelType['status']) ? 1 : 0,
        })
    }

    resetFrom() {
        this.hotelTypeOne = {};
        this.mealTypeForm.reset();
    }

    handleValidSubmit() {
        this.submitted = true;
        if (this.mealTypeForm.invalid) {
            return;
        }
        
        let data = Object.assign({}, this.mealTypeForm.value);
              if (data['meals']) {
        data['meals'] = data['meals']
            .trim()
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase());
    }
        if (data['status']) {
            data['status'] = 1;
        } else {
            data['status'] = 0;
        }
        try {
            if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
                data['id'] = this.hotelTypeOne['id'];
                data = [data];
                data['topic'] = 'updateMeal';
            }
            else {
                data = [data];
                data['topic'] = 'addMeal';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data)
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.swalService.alert.success('Your data updated successfully ..!');
                    this.someEvent.next({ tabId: 'list_hotel_types', hotel_type: '' })
                    this.mealTypeForm.reset();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            },(error)=>{
             this.swalService.alert.oops(error.error.Message);
           

        })
    }

}
