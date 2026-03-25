import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss']
})
export class AddStateComponent implements OnInit {
  stateForm: FormGroup;
  countryList: any[] = [];
  subSunk = new SubSink();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCountries();
  }

  get f() {
    return this.stateForm.controls;
  }

  // Create Form
  createForm() {
    this.stateForm = this.fb.group({
      country_id: ['', Validators.required],
      name: ['', [Validators.required, this.inputValidator]],
      iso2: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,3}$/)]],
      latitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });

    this.autoUppercase();
  }

  // Auto uppercase ISO
  autoUppercase() {
    this.stateForm.get('iso2').valueChanges.subscribe(val => {
      if (val) {
        this.stateForm.get('iso2').setValue(val.toUpperCase(), { emitEvent: false });
      }
    });
  }

  // Submit
  onStateSave() {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }

    const form = this.stateForm.value;

    const payload = {
      name: form.name,
      country_id: form.country_id,
      iso2: form.iso2,
      latitude: form.latitude,
      longitude: form.longitude
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('addMasterState', 'post', {}, {}, payload)
      .subscribe(
        (response: any) => {
          if ((response.statusCode === 200 || response.statusCode === 201) && response.Status) {
            this.swalService.alert.success('State saved successfully');
            this.stateForm.reset();
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err.error.Message || 'Error occurred');
        }
      );
  }

  // Get Country List
  getCountries() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterCountryList', 'post', {}, {}, {})
      .subscribe((response: any) => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.countryList = response.data.data.countries;
        }
      });
  }

  // Custom Validator
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
}