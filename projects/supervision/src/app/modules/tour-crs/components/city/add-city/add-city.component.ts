import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
 cityForm: FormGroup;
  stateDataList: Array<any> = [];
  subSunk = new SubSink();

  @Output() insertedRecord = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit() {
    this.createCityForm();
    this.getStateList();
  }

  // ✅ Create Form
  createCityForm() {
    this.cityForm = this.fb.group({
      stateId: ['', Validators.required],
      cityName: ['', [Validators.required, this.inputValidator]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      status: [1, Validators.required]
    });
  }
onStatusChange(event: any) {
  const isChecked = event.target.checked;
  this.cityForm.get('status').setValue(isChecked ? 1 : 0);
}
  // ✅ Get State List (Update API if needed)
  getStateList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterState', 'post', {}, {}, {})
      .subscribe((response: any) => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.stateDataList = response.data.data;
          this.sortState();
        }
      });
  }

  // ✅ Sort State
  sortState() {
    this.stateDataList.sort((a, b) => a.name.localeCompare(b.name));
  }

  // ✅ Save City
  onCitySave() {
    if (this.cityForm.valid) {

      const cityNames = this.cityForm.get('cityName').value.split(',');
      const stateId = this.cityForm.get('stateId').value;
      const latitude = this.cityForm.get('latitude').value;
      const longitude = this.cityForm.get('longitude').value;
      const status = this.cityForm.get('status').value;

      cityNames.forEach(city => {

        const payload = {
          city_name: city.trim(),
          state_id: stateId,
          latitude: latitude,
          longitude: longitude,
          status:status,
          type: "City"
        };

        this.subSunk.sink = this.apiHandlerService.apiHandler(
          'addMasterCity',
          'post',
          {},
          {},
          payload
        ).subscribe(
          (response: any) => {
            if (response.statusCode === 200 || response.statusCode === 201) {
              this.swalService.alert.success(`City "${city.trim()}" saved successfully`);
              this.insertedRecord.emit(payload);
              this.cityForm.reset();
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err.error.Message || 'Error occurred');
          }
        );

      });
    }
  }

  // ✅ Custom Validator
  inputValidator(control: FormControl) {
    const value = control.value;

    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      return { startOrEndSpace: true };
    }

    if (value && /\d+/.test(value)) {
      return { invalidString: true };
    }

    return null;
  }

  validateInput() {
    this.cityForm.get('cityName').markAsTouched();
  }
}