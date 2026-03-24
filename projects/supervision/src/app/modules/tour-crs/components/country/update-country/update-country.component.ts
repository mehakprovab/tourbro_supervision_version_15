import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,FormControl } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-country',
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.scss']
})
export class UpdateCountryComponent implements OnInit {
 countryForm: FormGroup;
  subSunk = new SubSink();

  countryId: number;
  continentDataList: any[] = [];
  selectedContinentId: any;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createCountryForm();


    // ✅ Get ID from route
    this.route.params.subscribe(params => {
      this.countryId = params['id'];
      console.log(this.countryId,"this.countryId")
      if (this.countryId) {
            this.getContinentData();
        this.getCountryById();
      }
    });
  }

  // ✅ Getter for easy access
  get f() {
    return this.countryForm.controls;
  }

  // ✅ Form Creation
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

      latitude: ['', [ Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [ Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    });

    this.autoUppercase();
  }

  // ✅ Auto uppercase fields
  autoUppercase() {
    ['iso2', 'iso3', 'currency'].forEach(field => {
      this.countryForm.get(field).valueChanges.subscribe(val => {
        if (val) {
          this.countryForm.get(field).setValue(val.toUpperCase(), { emitEvent: false });
        }
      });
    });
  }

  // ✅ Get country by ID
  getCountryById() {
    this.isLoading = true;

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterCountryById', 'post', {}, {id: this.countryId}, {})
      .subscribe(response => {

        this.isLoading = false;

        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {

          const data = response.data;

          this.countryForm.patchValue({
            countryName: data.name,
            continentName: data.region_id,
            iso2: data.iso2,
            iso3: data.iso3,
            phonecode: data.phonecode,
            currency_name: data.currency_name,
            currency: data.currency,
            currency_symbol: data.currency_symbol,
            latitude: data.latitude,
            longitude: data.longitude
          });

          this.selectedContinentId = data.region_id;

        }

      }, (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.swalService.alert.error(err.error.Message || 'Failed to load country');
      });
  }

  // ✅ Continent selection
  selectedContinent(id: string) {
    this.selectedContinentId = id;
  }

  // ✅ Save (Update API)
  onCountySave() {

    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }

    const form = this.countryForm.value;

    const payload = {
      id: this.countryId,   // ✅ important
      name: form.countryName,
      iso2: form.iso2,
      iso3: form.iso3,
      phonecode: form.phonecode,
      currency_name: form.currency_name,
      currency: form.currency,
      currency_symbol: form.currency_symbol,
      region_id: this.selectedContinentId,
      latitude: form.latitude,
      longitude: form.longitude
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('updateMasterCountry', 'post', {}, {}, payload)
      .subscribe(response => {

        if ((response.statusCode === 200 || response.statusCode === 201) && response.Status) {
          this.swalService.alert.success("Country updated successfully");
          this.router.navigate(["/tour-crs/country"]);
        }

      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err.error.Message || "Update failed");
      });
  }

  // ✅ Get continent list
  getContinentData() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler('getMasterContinet', 'post', {}, {}, {})
      .subscribe(response => {
        if ((response.statusCode === 200 || response.statusCode === 201) && response.data) {
          this.continentDataList = response.data;
        }
      });
  }

  // ✅ Custom validation
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

  // ✅ Cleanup
  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}