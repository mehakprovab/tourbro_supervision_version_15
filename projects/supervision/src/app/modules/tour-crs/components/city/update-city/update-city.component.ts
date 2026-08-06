import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { cityLocationNameValidator } from 'projects/supervision/src/app/shared/validators/location-name.validator';


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
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

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
      city_name: ['', [Validators.required, cityLocationNameValidator(), this.inputValidator]],
      status: [1, Validators.required],
      CityImage: [''],
      discription: [''],
      hourly_rental: [false],
      hourly_durations: ['']
    });

    this.setHourlyDurationValidation(this.cityForm.get('hourly_rental').value);
    this.subSunk.sink = this.cityForm.get('hourly_rental').valueChanges.subscribe((enabled: boolean) => {
      this.setHourlyDurationValidation(enabled);
    });
  }

  setHourlyDurationValidation(enabled: boolean) {
    const durationControl = this.cityForm.get('hourly_durations');

    if (enabled) {
      durationControl.setValidators(Validators.required);
    } else {
      durationControl.clearValidators();
      durationControl.setValue('', { emitEvent: false });
    }

    durationControl.updateValueAndValidity({ emitEvent: false });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = (e.target as FileReader).result as string;
    };
    reader.readAsDataURL(file);
    this.cityForm.get('CityImage').setValue(file.name);
  }

  onHourlyRentalChange(event: any) {
    this.cityForm.get('hourly_rental').setValue(event.checked);
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
              status: Number(data.status),
              CityImage: data.CityImage || data.city_image || '',
              discription: data.discription || '',
              hourly_rental: data.hourly_rental === true || Number(data.hourly_rental) === 1,
              hourly_durations: data.hourly_durations || ''
            });
            this.imagePreviewUrl = data.CityImage || data.city_image || null;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Failed to load city');
        }
      );
  }
onStatusChange(event: any) {
  const isChecked = event.checked;
  this.cityForm.get('status').setValue(isChecked ? 1 : 0);
}
  // ✅ Update City
  onCityUpdate() {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      return;
    }

    const form = this.cityForm.value;

    const payload = new FormData();
    payload.append('id', String(this.cityId));
    payload.append('city_name', form.city_name);
    payload.append('state_id', String(form.state_id));
    payload.append('status', String(form.status));
    payload.append('discription', form.discription || '');
    payload.append('hourly_rental', form.hourly_rental ? '1' : '0');
    payload.append('hourly_durations', form.hourly_rental ? String(form.hourly_durations) : '');
    payload.append('type', 'City');

    if (this.selectedImageFile) {
      payload.append('CityImage', this.selectedImageFile, this.selectedImageFile.name);
    }

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
