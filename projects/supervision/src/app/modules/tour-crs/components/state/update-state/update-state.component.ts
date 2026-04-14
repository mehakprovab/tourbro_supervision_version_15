import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,FormControl } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-update-state',
  templateUrl: './update-state.component.html',
  styleUrls: ['./update-state.component.scss']
})
export class UpdateStateComponent implements OnInit {
 stateForm: FormGroup;
  stateId: number;
  countryList: any[] = [];
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
    this.getCountries();

    this.route.params.subscribe(params => {
      this.stateId = params['id'];
      if (this.stateId) {
        this.getStateById();
      }
    });
  }

  get f() {
    return this.stateForm.controls;
  }

  // ✅ Create Form
  createForm() {
    this.stateForm = this.fb.group({
      country_id: ['', Validators.required],
      name: ['', [Validators.required, this.inputValidator]],
      iso2: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,3}$/)]],
      // latitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      // longitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });

    this.autoUppercase();
  }

  // ✅ Auto uppercase ISO
  autoUppercase() {
    this.stateForm.get('iso2').valueChanges.subscribe(val => {
      if (val) {
        this.stateForm.get('iso2').setValue(val.toUpperCase(), { emitEvent: false });
      }
    });
  }

  // ✅ Get State By ID
  getStateById() {
    let id=this.stateId
    this.subSunk.sink = this.apiHandlerService
      .apiHandler(`getMasterStateListbyid`, 'get', {id}, {}, {})
      .subscribe(
        (response: any) => {
          if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {

            const data = response.data.data;

            this.stateForm.patchValue({
              name: data.name,
              country_id: data.country_id,
              iso2: data.iso2,
              // latitude: data.latitude,
              // longitude: data.longitude
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Failed to load state');
        }
      );
  }

  // ✅ Update State
  onStateUpdate() {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }

    const form = this.stateForm.value;

    const payload = {
      id: this.stateId, // IMPORTANT
      name: form.name,
      country_id: form.country_id,
      iso2: form.iso2,
      // latitude: form.latitude,
      // longitude: form.longitude
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('updateMasterState', 'post', {}, {}, payload)
      .subscribe(
        (response: any) => {
          if ((response.statusCode === 200 || response.statusCode === 201) && response.Status) {
            this.swalService.alert.success('State updated successfully');
            this.router.navigate(['/tour-crs/state']);
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Update failed');
        }
      );
  }

  // ✅ Get Countries
  getCountries() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterCountryList', 'post', {}, {}, {})
      .subscribe((response: any) => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.countryList = response.data.data.countries;
        }
      });
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