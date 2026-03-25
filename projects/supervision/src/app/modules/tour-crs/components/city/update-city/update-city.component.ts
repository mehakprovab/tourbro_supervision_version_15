import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-update-city',
  templateUrl: './update-city.component.html',
  styleUrls: ['./update-city.component.scss']
})
export class UpdateCityComponent implements OnInit, OnDestroy {

  cityForm: FormGroup;
  cityId: number;
  stateList: any[] = [];
  subSunk = new SubSink();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.getStates();

     
  this.route.queryParams.subscribe(params => {
    this.cityId = params['cityId'];
      console.log(this.cityId,"this.cityId")
      if (this.cityId) {
        this.getCityById();
      }
    });
  }

  get f() {
    return this.cityForm.controls;
  }

  // ✅ Create Form
  createForm() {
    this.cityForm = this.fb.group({
      state_id: ['', Validators.required],
      city_name: ['', [Validators.required, this.inputValidator]],
      latitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      status: [1, Validators.required],
    });
  }

  // ✅ Get State List
  getStates() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterState', 'post', {}, {}, {})
      .subscribe((response: any) => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.stateList =  response.data.data;
        }
      });
  }

  // ✅ Get City By ID
  getCityById() {
    let id = this.cityId;

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterCityById', 'get', { id }, {}, {})
      .subscribe(
        (response: any) => {
          if ((response.statusCode === 200 || response.statusCode === 201)) {

            const data = response.data.data;

            this.cityForm.patchValue({
              city_name: data.city_name,
              state_id: data.state_id,
              latitude: data.latitude,
              longitude: data.longitude,
              status:data.status
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Failed to load city');
        }
      );
  }
onStatusChange(event: any) {
  const isChecked = event.target.checked;
  this.cityForm.get('status').setValue(isChecked ? 1 : 0);
}
  // ✅ Update City
  onCityUpdate() {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      return;
    }

    const form = this.cityForm.value;

    const payload = {
      id: this.cityId,   // ✅ REQUIRED
      city_name: form.city_name,
      state_id: form.state_id,
      latitude: form.latitude,
      longitude: form.longitude,
      status:form.status,
      type: "City"
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('editMasterCity', 'post', {}, {}, payload)
      .subscribe(
        (response: any) => {
          if ((response.statusCode === 200 || response.statusCode === 201) && response.Status) {
            this.swalService.alert.success('City updated successfully');
            this.router.navigate(['/tour-crs/city']);
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Update failed');
        }
      );
  }

  // ✅ Validator
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

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}