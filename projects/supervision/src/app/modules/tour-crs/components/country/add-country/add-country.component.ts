import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent implements OnInit {
 countryForm: FormGroup;
  selectedContinentId: string;
  subSunk = new SubSink();
  continentDataList: any[] = [];

  @Output() insertedRecord = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService
  ) { }

  ngOnInit() {
    this.createCountryForm();
    this.getContinentData();
  }

  get f() {
    return this.countryForm.controls;
  }

  createCountryForm() {
    this.countryForm = this.fb.group({
      continentName: ['', Validators.required],
      countryName: ['', [Validators.required, this.inputValidator]],

      iso2: ['', [ Validators.pattern(/^[A-Z]{2}$/)]],
      iso3: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      phonecode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],

      currency_name: ['', Validators.required],
      currency: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      currency_symbol: [''],
status: [1, Validators.required],
      // latitude: ['', [ Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      // longitude: ['', [ Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });

    this.autoUppercase();
  }

  autoUppercase() {
    ['iso2', 'iso3', 'currency'].forEach(field => {
      this.countryForm.get(field).valueChanges.subscribe(val => {
        if (val) {
          this.countryForm.get(field).setValue(val.toUpperCase(), { emitEvent: false });
        }
      });
    });
  }

  selectedContinent(id: string) {
    this.selectedContinentId = id;
  }

  oncountrySave() {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }

    const form = this.countryForm.value;

    const payload = {
      name: form.countryName,
      iso2: form.iso2,
      iso3: form.iso3,
      phonecode: form.phonecode,
      currency_name: form.currency_name,
      currency: form.currency,
      currency_symbol: form.currency_symbol,
      region_id: this.selectedContinentId,
      // latitude: form.latitude,
      // longitude: form.longitude,
      status:form.status
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('addMasterCountry', 'post', {}, {}, payload)
      .subscribe(response => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.Status) {
          this.swalService.alert.success(response.Message);
          this.insertedRecord.emit(payload);
          this.countryForm.reset();
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err.error.Message || "Error occurred");
      });
  }
onStatusChange(event: any) {
  const isChecked = event.target.checked;
  this.countryForm.get('status').setValue(isChecked ? 1 : 0);
}
  getContinentData() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getTourContinet', 'post', {}, {}, {})
      .subscribe(response => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.continentDataList = response.data;
          this.continentDataList.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
  }

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
    this.countryForm.get('countryName').markAsTouched();
  }
}