import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { MatSelect } from '@angular/material/select';
import { ViewChild, AfterViewInit } from '@angular/core';

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
    this.getPriceList();
    this.getVehicleMasterList()

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
   

    buffer_km: [0, [Validators.min(0)]],
    extra_km_price: [0, [Validators.min(0)]],

    buffer_minutes: [0, [Validators.min(0), Validators.max(59)]],
    extra_hours_price: [0, [Validators.min(0)]],

    buffer_hours: [0, [Validators.min(0)]],
    extra_days_price: [0, [Validators.min(0)]],
    day_bata: [0, [Validators.min(0)]],
    night_bata: [0, [Validators.min(0)]],

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
    start_km: [0, [Validators.required, Validators.min(0)]],
    end_km: [0, [Validators.required, Validators.min(0)]],
    base_price: [0, [Validators.required, Validators.min(0)]]
  }));
}

addLocalPriceRow() {
  this.priceDetailsArray.push(this.fb.group({
    hours: [0, [Validators.required, Validators.min(0)]],
    base_price: [0, [Validators.required, Validators.min(0)]]
  }));
}

addOutstationPriceRow() {
  this.priceDetailsArray.push(this.fb.group({
    end_km: [0, [Validators.required, Validators.min(0)]],
    base_price: [0, [Validators.required, Validators.min(0)]]
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
get f() {
  return this.addUpdateVendorForm.controls;
}

onSubmit() {
  this.isSubmitted = true;
  this.markAllFieldsAsTouched();

  if (this.addUpdateVendorForm.invalid) {
    this.swalService.alert.oops('Please fill all required fields');
    return;
  }

  const v = this.addUpdateVendorForm.getRawValue(); // ok to keep

  const payload: any = {
    type: v.type,
    trip_type: v.trip_type,
    commute_supplier_vehicle_id: v.commute_supplier_vehicle_id,
    country: "",
    city:"",
    buffer_km: v.buffer_km,
    extra_km_price: v.extra_km_price,
    price_details: v.price_details
  };

  if (v.type === 'Local') {
    payload.buffer_minutes = v.buffer_minutes;
    payload.extra_hours_price = v.extra_hours_price;
  }

  if (v.type === 'Outstation') {
    payload.buffer_hours = v.buffer_hours;
    payload.extra_days_price = v.extra_days_price;
    payload.day_bata = v.day_bata;
    payload.night_bata = v.night_bata;
  }

  if (this.editId) payload.id = this.editId;

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
    country: "",
    city: "",

    buffer_km: priceDetails && priceDetails.buffer_km ? priceDetails.buffer_km : 0,
    extra_km_price: priceDetails && priceDetails.extra_km_price ? priceDetails.extra_km_price : 0,

    buffer_minutes: item.buffer_minutes ? item.buffer_minutes : 0,
    extra_hours_price: item.extra_hours_price ? item.extra_hours_price : 0,

    buffer_hours: item.buffer_hours ? item.buffer_hours : 0,
    extra_days_price: item.extra_days_price ? item.extra_days_price : 0,

    day_bata: item.day_bata ? item.day_bata : 0,
    night_bata: item.night_bata ? item.night_bata : 0
  });

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

}