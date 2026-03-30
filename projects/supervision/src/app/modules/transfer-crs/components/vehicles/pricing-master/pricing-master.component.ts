import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { MatSelect } from '@angular/material/select';
import { ViewChild, AfterViewInit } from '@angular/core';
interface Country {
  id?: number;
  name: string;
  sortname?: string;
}

interface City {
  id: number;
  city_name: string;
  country_id?: number;
}


@Component({
  selector: 'app-pricing-master',
  templateUrl: './pricing-master.component.html',
  styleUrls: ['./pricing-master.component.scss']
})
export class PricingMasterComponent implements OnInit {
addUpdateVendorForm: FormGroup;
 public pageSize = 20;
  public page = 1;
  public collectionSize: number = 0;
  enabledForm = true;
  isSubmitted = false;
  saveTextName = 'Save';
  editId: number = null;

  countryList: Country[] = [];
  cityList: City[] = [];
  currentCountry: Country = null;

  priceList: any[] = []; // List for table
  searchText = '';
vehicleMasterDataList:any
  searchSpin = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiHandlerServices: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCountryList();
    this.setupCountryChangeListener();
    this.getPriceList();
    this.getVehicleMasterList()
    this.searchSubject.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(search => {
  this.citySkip = 1;
  this.hasMoreCities = true;
  this.cityList = [];
  this.citySearchText = search;

  this.getCityListByCountry(this.currentCountry, search);
});
  }
onCityScroll(event: any) {
  const panel = event.target;

  const atBottom =
    panel.scrollHeight - panel.scrollTop <= panel.clientHeight + 10;

  if (atBottom && this.hasMoreCities && !this.loadingCities) {
    this.citySkip += 1;
    this.getCityListByCountry(this.currentCountry, this.citySearchText);
  }
}
onCityDropdownOpen(open: boolean) {
  if (open) {
    setTimeout(() => {
      const panel = this.citySelect.panel.nativeElement;

      if (panel) {
        panel.addEventListener('scroll', this.onCityScroll.bind(this));
      }
    });
  }
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

createForm() {
  this.addUpdateVendorForm = this.fb.group({
    type: ['Airport', Validators.required],
    trip_type: ['Pickup', Validators.required],
    commute_supplier_vehicle_id: [null, Validators.required],
    country: [null, Validators.required],
    city: ['', Validators.required],

    buffer_km: [0],
    extra_km_price: [0],

    buffer_minutes: [0],
    extra_hours_price: [0],

    buffer_hours: [0],
    extra_days_price: [0],
    day_bata: [0],
    night_bata: [0],

    price_details: this.fb.array([])
  });

  this.onTypeChange();
   if (this.addUpdateVendorForm.get('type').value === 'Airport') {
    this.addAirportPriceRow();
  }

  
}


onTypeChange() {
  const typeControl = this.addUpdateVendorForm.get('type');
  if (!typeControl) { return; }

  typeControl.valueChanges.subscribe((type: string) => {
    this.resetPriceDetails();
    this.disableAllOptionalFields();

    if (type === 'Airport') {
      this.enableFields(['buffer_km', 'extra_km_price']);
      this.addAirportPriceRow();
    }

    if (type === 'Local') {
      this.enableFields([
        'buffer_km',
        'extra_km_price',
        'buffer_minutes',
        'extra_hours_price'
      ]);
      this.addLocalPriceRow();
    }

    if (type === 'Outstation') {
      this.enableFields([
        'buffer_km',
        'extra_km_price',
        'buffer_hours',
        'extra_days_price',
        'day_bata',
        'night_bata'
      ]);
      this.addOutstationPriceRow();
    }
  });
}

resetPriceDetails() {
  this.addUpdateVendorForm.setControl('price_details', this.fb.array([]));
}
disableAllOptionalFields() {
  [
    'buffer_km',
    'extra_km_price',
    'buffer_minutes',
    'extra_hours_price',
    'buffer_hours',
    'extra_days_price',
    'day_bata',
    'night_bata'
  ].forEach(f => {
    const ctrl = this.addUpdateVendorForm.get(f);
    if (ctrl) {
      ctrl.disable();
    }
  });
}


enableFields(fields: string[]) {
  fields.forEach(f => this.addUpdateVendorForm.get(f).enable());
}

addAirportPriceRow() {
  this.priceDetailsArray.push(this.fb.group({
    start_km: [0, Validators.required],
    end_km: [0],
    base_price: [0, Validators.required]
  }));
}

addLocalPriceRow() {
  this.priceDetailsArray.push(this.fb.group({
    hours: [0, Validators.required],
    base_price: [0, Validators.required]
  }));
}

addOutstationPriceRow() {
  this.priceDetailsArray.push(this.fb.group({
    end_km: [0, Validators.required],
    base_price: [0, Validators.required]
  }));
}

  createPriceDetailGroup(): FormGroup {
    return this.fb.group({
      start_km: [0, [Validators.required, Validators.min(0)]],
      end_km: [0, [Validators.required, Validators.min(0)]],
      base_price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get priceDetailsArray(): FormArray {
    return this.addUpdateVendorForm.get('price_details') as FormArray;
  }

addPriceDetail() {
  const type = this.addUpdateVendorForm.get('type').value;

  if (type === 'Airport') {
    this.addAirportPriceRow();
  } 
  else if (type === 'Local') {
    this.addLocalPriceRow();
  } 
  else if (type === 'Outstation') {
    this.addOutstationPriceRow();
  }
}
  removePriceDetail(i: number) { if (this.priceDetailsArray.length > 1) this.priceDetailsArray.removeAt(i); }

setupCountryChangeListener() {
  this.addUpdateVendorForm.get('country').valueChanges
    .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
    .subscribe((country: Country) => {

      this.currentCountry = country;

      this.citySkip = 1;
      this.cityList = [];
      this.hasMoreCities = true;

      if (country) {
        this.getCityListByCountry(country);
      } else {
        this.cityList = [];
      }
    });
}

getCountryList() {
  this.apiHandlerServices
    .apiHandler('supervisionCountryLists', 'post', {}, {})
    .subscribe((resp: any) => {
      if (resp.Status && resp.data) {
        this.countryList = resp.data;

        // ✅ Find India
        const india = this.countryList.find(
          c => c.name.toLowerCase() === 'india'
        );

        if (india) {
          // ✅ Set default country
          this.addUpdateVendorForm.patchValue({
            country: india
          });

          // ✅ Setup city loading
          this.currentCountry = india;

          this.citySkip = 1;
          this.cityList = [];
          this.hasMoreCities = true;

          // 👉 If using advanced city dropdown
          this.getCityListByCountry(india);

          // 👉 If using simple dropdown (your current code)
          // this.getCityListByCountry(india);
        }
      }
    });
}

getCityListByCountry(
  country: Country,
  search: string = '',
  selectedCity?: any
) {
  if (!country) return;

  this.loadingCities = true;

  const countryParam = country.sortname || country.name;

  this.apiHandlerServices.apiHandler(
    'supervisionCityLists',
    'post',
    {},
    {},
    {
      country_code: countryParam,
      skipLimit: this.citySkip,
      search: search,
      cityId: selectedCity
    }
  ).subscribe((resp: any) => {

    this.loadingCities = false;

    if (resp.Status && resp.data) {

      if (this.citySkip === 1) {
        this.cityList = resp.data;
      } else {
        this.cityList = [...this.cityList, ...resp.data];
      }

      if (resp.data.length < this.cityLimit) {
        this.hasMoreCities = false;
      }

      // ✅ EDIT AUTO SELECT
      if (selectedCity) {
        setTimeout(() => {
          const found = this.cityList.find(c => c.id == selectedCity);

          if (found) {
            this.addUpdateVendorForm.get('city').setValue(found.id);
          }
        });
      }
    }
  });
}
onCitySearch(value: string) {
  this.searchSubject.next(value);
}
getVehicleMasterList() {
  this.apiHandlerServices.apiHandler('listVehicleMaster', 'POST', {}, {}, {})
    .subscribe(
      (res: any) => {
        if (res.Status && Array.isArray(res.data)) {
          this.vehicleMasterDataList = res.data.map(item => ({
            ...item
           
          }));
        } else {
          this.vehicleMasterDataList = [];
        }
      },
      () => {
        this.vehicleMasterDataList = [];
       
      }
    );
}
  markAllFieldsAsTouched() {
    Object.keys(this.addUpdateVendorForm.controls).forEach(key => {
      const control = this.addUpdateVendorForm.get(key);
      if (control) control.markAsTouched();
    });
  }

resetForm() {
  this.addUpdateVendorForm.reset({
    type: 'Airport',
    trip_type: 'Pickup',
    commute_supplier_vehicle_id: null,
    country: null,
    city: '',
    buffer_km: 0,
    extra_km_price: 0,
    buffer_minutes: 0,
    extra_hours_price: 0,
    buffer_hours: 0,
    extra_days_price: 0,
    day_bata: 0,
    night_bata: 0
  });

  this.addUpdateVendorForm.setControl(
    'price_details',
    this.fb.array([])
  );

  this.addAirportPriceRow(); // 👈 important

  this.isSubmitted = false;
  this.saveTextName = 'Save';
  this.editId = null;
}


onSubmit() {
  this.isSubmitted = true;
  this.markAllFieldsAsTouched();

  if (this.addUpdateVendorForm.invalid) {
    this.swalService.alert.oops('Please fill all required fields');
    return;
  }

  const v = this.addUpdateVendorForm.getRawValue();

  // ---------- COMMON PAYLOAD ----------
  const payload: any = {
    type: v.type,
    trip_type: v.trip_type,
    commute_supplier_vehicle_id: v.commute_supplier_vehicle_id,
    country: v.country.name,
    city: v.city,
    buffer_km: v.buffer_km,
    extra_km_price: v.extra_km_price,
    price_details: v.price_details
  };

  // ---------- LOCAL ----------
  if (v.type === 'Local') {
    payload.buffer_minutes = v.buffer_minutes;
    payload.extra_hours_price = v.extra_hours_price;
  }

  // ---------- OUTSTATION ----------
  if (v.type === 'Outstation') {
    payload.buffer_hours = v.buffer_hours;
    payload.extra_days_price = v.extra_days_price;
    payload.day_bata = v.day_bata;
    payload.night_bata = v.night_bata;
  }

  // ---------- EDIT ----------
  if (this.editId) {
    payload.id = this.editId;
  }

  const api = this.editId ? 'carEditPrice' : 'carAddPrice';

  this.apiHandlerServices.apiHandler(api, 'POST', {}, {}, payload)
    .subscribe({
      next: (res: any) => {
        if (res.Status) {
          this.swalService.alert.success(
            this.editId ? 'Updated successfully' : 'Added successfully'
          );
          this.resetForm();
          this.getPriceList();
        } else {
          this.swalService.alert.oops(res.Message);
        }
      },
      error: err =>
        this.swalService.alert.error(err.error.Message || 'Error occurred')
    });
}


  // ----------------- LIST ------------------
getPriceList() {
  this.searchSpin = true;

  this.apiHandlerServices.apiHandler('listPrice', 'POST', {}, {}, {})
    .subscribe(
      (res: any) => {
        if (res.Status && Array.isArray(res.data)) {
          this.priceList = res.data.map(item => ({
            ...item,
            price_details_obj: item.price_details
              ? JSON.parse(item.price_details)
              : { slabs: [] }
          }));
        } else {
          this.priceList = [];
        }

        this.collectionSize = this.priceList.length;
        this.searchSpin = false;
      },
      () => {
        this.priceList = [];
        this.collectionSize = 0;
        this.searchSpin = false;
      }
    );
}


onEdit(item: any) {
  this.editId = item.id;
  this.saveTextName = 'Update';
  this.enabledForm = true;

  // ---------- COUNTRY ----------
  const countryObj = this.countryList.find(c => c.name === item.country);

  // ---------- PARSE PRICE DETAILS ----------
  let priceDetails: any = null;
  if (item.price_details) {
    priceDetails = JSON.parse(item.price_details);
  }

  // ---------- PATCH BASIC FIELDS ----------
  this.addUpdateVendorForm.patchValue({
    type: item.type,
    trip_type: item.trip_type,
    commute_supplier_vehicle_id: item.commute_supplier_vehicle_id,
    country: countryObj,
    // city: item.city,

    buffer_km: priceDetails && priceDetails.buffer_km ? priceDetails.buffer_km : 0,
    extra_km_price: priceDetails && priceDetails.extra_km_price ? priceDetails.extra_km_price : 0,

    buffer_minutes: item.buffer_minutes ? item.buffer_minutes : 0,
    extra_hours_price: item.extra_hours_price ? item.extra_hours_price : 0,

    buffer_hours: item.buffer_hours ? item.buffer_hours : 0,
    extra_days_price: item.extra_days_price ? item.extra_days_price : 0,

    day_bata: item.day_bata ? item.day_bata : 0,
    night_bata: item.night_bata ? item.night_bata : 0
  });
// after setting country
if (countryObj) {
  this.currentCountry = countryObj;

  this.getCityListByCountry(
    countryObj,
    '',
    item.city_id   // ✅ IMPORTANT
  );
}
  // ---------- RESET PRICE DETAILS ARRAY ----------
  const formArray = this.fb.array([]);

  if (priceDetails && priceDetails.slabs && priceDetails.slabs.length) {

    priceDetails.slabs.forEach((s: any) => {

      // AIRPORT
      if (item.type === 'Airport') {
        formArray.push(this.fb.group({
          start_km: [s.start_km || 0, Validators.required],
          end_km: [s.end_km || 0, Validators.required],
          base_price: [s.base_price || 0, Validators.required]
        }));
      }

      // LOCAL
      if (item.type === 'Local') {
        formArray.push(this.fb.group({
          hours: [s.hours || 0, Validators.required],
          end_km: [s.end_km || 0, Validators.required],
          base_price: [s.base_price || 0, Validators.required]
        }));
      }

      // OUTSTATION
      if (item.type === 'Outstation') {
        formArray.push(this.fb.group({
          end_km: [s.end_km || 0, Validators.required],
          base_price: [s.base_price || 0, Validators.required]
        }));
      }
    });
  }

  // ---------- SET FORM ARRAY ----------
  this.addUpdateVendorForm.setControl('price_details', formArray);

  // ---------- ENABLE FIELDS BASED ON TYPE ----------
  this.disableAllOptionalFields();

  if (item.type === 'Airport') {
    this.enableFields(['buffer_km', 'extra_km_price']);
  }

  if (item.type === 'Local') {
    this.enableFields([
      'buffer_km',
      'extra_km_price',
      'buffer_minutes',
      'extra_hours_price'
    ]);
  }

  if (item.type === 'Outstation') {
    this.enableFields([
      'buffer_km',
      'extra_km_price',
      'buffer_hours',
      'extra_days_price',
      'day_bata',
      'night_bata'
    ]);
  }
}


  onDelete(id: number) {
    this.swalService.alert.delete((confirm: boolean) => {
      if (!confirm) return;
      this.apiHandlerServices.apiHandler('deletePrice', 'POST', {}, {}, { id }).subscribe((res: any) => {
        if (res.Status) {
          this.swalService.alert.success('Deleted successfully');
          this.getPriceList();
        } else this.swalService.alert.oops(res.Message);
      });
    });
  }
@ViewChild('citySelect', { static: false }) citySelect: MatSelect;

loadingCities = false;

private searchSubject = new Subject<string>();
citySearchText = '';

citySkip = 1;
cityLimit = 20;
hasMoreCities = true;
}