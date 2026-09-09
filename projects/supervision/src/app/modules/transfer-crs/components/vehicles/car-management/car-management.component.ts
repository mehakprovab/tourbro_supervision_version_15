import { Component, Inject, LOCALE_ID, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-car-management',
  templateUrl: './car-management.component.html',
  styleUrls: ['./car-management.component.scss']
})
export class CarManagementComponent implements OnInit, OnDestroy {
primaryColour=''
secondaryColour=''
 statusMap: any = {
  BOOKING_PENDING: '2',
  BOOKING_CONFIRMED: '1',
  BOOKING_REJECTED: '0'
};
  searchText = '';
  carTypeList: any[] = [];
  loading = false;
  searchSpin = false;

  private destroy$ = new Subject<void>();

  constructor(
    private apiHandler: ApiHandlerService,
    private swal: SwalService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  get filteredCars(): any[] {
    const terms = this.searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      return this.carTypeList;
    }
    return this.carTypeList.filter((item, index) => {
      const status = item.bookinStatus === 'BOOKING_CANCELLED'
        ? 'Booking Cancelled'
        : ({ '2': 'Pending', '1': 'Accepted', '0': 'Rejected' }[String(item.status ?? item.booking_status)] || '');
      const values = [
        index + 1, status, item.car_name, item.car_model, item.capacity, item.fuel,
        item.booked_on, this.formatSearchDate(item.booked_on),
        item.travel_date, this.formatSearchDate(item.travel_date),
        item.car_number, item.supplierName, item.driver_name || '-', item.driver_phone,
        // item.reassigned_by, item.pickup, item.drop, item.total, `₹ ${item.total ?? ''}`
      ];
      const text = values.filter(value => value != null).join(' ').toLowerCase().replace(/\s+/g, ' ');
      return terms.every(term => text.includes(term));
    });
  }

  private formatSearchDate(value: any): string {
    if (!value) {
      return '';
    }
    try {
      return formatDate(value, 'short', this.locale);
    } catch {
      return '';
    }
  }

  ngOnInit(): void {
    this.getCarList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ GET LIST
  getCarList() {
    this.searchSpin = true;

    this.apiHandler.apiHandler('carManagementList', 'POST', {}, {}, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.searchSpin = false;

          this.carTypeList = (res.data || []).map((item: any) => {

            let parsedAttr: any = {};
            let innerAttr: any = {};
            let dataAttr: any = {};
            let mainData:any={}

            try {
              parsedAttr = JSON.parse(item.attributes || '{}');
              innerAttr = JSON.parse(parsedAttr.attributes || '{}');
              dataAttr = innerAttr.data || {};
              mainData=res.data
              console.log(innerAttr,"parsedAttr")
            } catch (e) {
              console.error('JSON parse error', e);
            }
const apiStatus =
  item.booking_status ||
  parsedAttr.booking_status ||
  'BOOKING_PENDING';
            return {
              ...item,

              // BASIC
              car_name: parsedAttr.car_name,
              car_model: parsedAttr.car_model,
              capacity: innerAttr.max_capacity,
              type: innerAttr.type,
              fuel: parsedAttr.FuelType,
              total: parsedAttr.total_fare,
              pickup: parsedAttr.car_pickup_address,
              drop: parsedAttr.car_drop_address,
  supplierName: (item.first_name || '') + ' ' + (item.last_name || ''),
              // NEW FIELDS
              booked_on: item.created_at,
              travel_date: parsedAttr.car_from_date,
              car_number: innerAttr.vehicle_reg_no || '-',
              driver_name: innerAttr.driver_name || '-',
              // reassigned_by: item.carassigned_by || '-',
              driver_phone: innerAttr.driver_mobile || '-',
Maintype:innerAttr.searchRequest?.type,
              // IMPORTANT
              vehicle_id: dataAttr.vehicle_id,
bookinStatus: item.booking_status,
              // ✅ DEFAULT STATUS
status: this.normalizeCarStatus(item.status ?? apiStatus),
booking_status: this.normalizeCarStatus(item.status ?? apiStatus)
            }
          });
        },
        error: () => {
          this.searchSpin = false;
          this.swal.alert.oops('Failed to load data');
        }
      });
  }

  private normalizeCarStatus(value: any): string {
    const status = String(value);
    return ['0', '1', '2'].includes(status) ? status : (this.statusMap[status] ?? '2');
  }

  onStatusChange(item: any, selectedStatus: string) {
    if (item.statusUpdating || item.bookinStatus === 'BOOKING_CANCELLED') {
      return;
    }
    const previousStatus = item.status;
    const status = this.normalizeCarStatus(selectedStatus);
    item.status = status;
    item.statusUpdating = true;

    this.apiHandler.apiHandler('carStatusChange', 'POST', {}, {}, { id: item.id, status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          item.statusUpdating = false;
          if (res.Status) {
            item.booking_status = status;
            this.swal.alert.success('Status updated');
          } else {
            item.status = previousStatus;
            this.swal.alert.oops(res.Message || 'Failed to update status');
          }
        },
        error: () => {
          item.statusUpdating = false;
          item.status = previousStatus;
          this.swal.alert.oops('Failed to update status');
        }
      });
  }


  showReassignForm = false;
selectedItem: any = null;
driverList: any[] = [];
vendorList: any[] = [];
selectedDriver: any = null;
driversLoading = false;
driverLoadError = '';

getDriverList() {
  this.driversLoading = true;
  this.driverLoadError = '';
  this.driverList = [];
  this.vendorList = [];
  forkJoin({
    drivers: this.apiHandler.apiHandler('driverMasterDetails', 'POST', {}, {}, {}),
    vendors: this.apiHandler.apiHandler('vendorList', 'POST', {}, {}, {})
  }).pipe(takeUntil(this.destroy$)).subscribe({
    next: ({ drivers, vendors }: any) => {
      this.driversLoading = false;
      if (!drivers.Status || !vendors.Status) {
        this.driverLoadError = 'Failed to load drivers and suppliers. Please retry.';
        return;
      }
      this.driverList = drivers.data || [];
      this.vendorList = vendors.data || [];
    },
    error: () => {
      this.driversLoading = false;
      this.driverLoadError = 'Failed to load drivers and suppliers. Please retry.';
    }
  });
}

getDriverSupplierName(driver: any): string {
  const vendor = this.vendorList.find(item => String(item.id) === String(driver.vendor_id));
  return driver.first_name + ' ' + driver.last_name || driver.supplierName || vendor?.name || '';
}

onDriverChange(driver: any) {
  this.selectedDriver = driver;
  this.reassignForm = {
    driver_name: driver?.name || '',
    driver_phone: String(driver?.mobile ?? ''),
    car_name: driver?.car_name || driver?.vehicle_name || '',
    car_number: driver?.car_number || driver?.vehicle_reg_no || ''
    // reassigned_by: driver?.reassigned_by || '
  };
}

reassignForm = {
  car_name: '',
  car_number: '',
  driver_name: '',
  // reassigned_by:'',
  driver_phone: ''
};

submitted = false;

onReassign(item: any) {
  this.selectedItem = item;
  this.showReassignForm = true;
  this.submitted = false;

  this.onDriverChange(null);
  this.getDriverList();

  window.scroll({ top: 0, behavior: 'smooth' });
}

// SUBMIT (⚠️ NOT BLOCKING)
submitReassign() {
  this.submitted = true;

  
  // Require a driver from the list and complete API-provided details.
  if (
    this.loading || this.driversLoading || !this.selectedDriver ||
    !this.reassignForm.car_name ||
    !this.reassignForm.car_number ||
    !this.reassignForm.driver_name ||
    //  !this.reassignForm.reassigned_by ||
    !this.reassignForm.driver_phone ||
    this.reassignForm.driver_phone.length !== 10
  ) {
    return; // 🚫 STOP API CALL
  }
this.loading = true;
  const payload = {
    id: this.selectedItem.id,
    AppReference: this.selectedItem.app_reference,
    // vehicle_id: this.selectedItem.vehicle_id,

    vehicle_name: this.reassignForm.car_name,
    vehicle_reg_no: this.reassignForm.car_number,
    driver_name: this.reassignForm.driver_name,
    // reassigned_by:this.reassignForm.reassigned_by,
    driver_mobile: this.reassignForm.driver_phone
  };

  this.apiHandler.apiHandler('carReassign', 'POST', {}, {}, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res.Status) {
          this.swal.alert.success('Reassigned successfully');
          this.showReassignForm = false;
          this.getCarList();
        } else {
          this.swal.alert.oops(res.Message || 'Reassign failed');
        }
      },
      error: () => {
        this.loading = false;
        this.swal.alert.oops('Something went wrong');
      }
    });
}

// CANCEL
cancelReassign() {
  this.showReassignForm = false;
  this.selectedItem = null;
  this.onDriverChange(null);
}
}