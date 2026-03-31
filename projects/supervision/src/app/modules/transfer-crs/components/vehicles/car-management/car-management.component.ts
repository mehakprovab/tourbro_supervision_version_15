import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Subject } from 'rxjs';
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
    private swal: SwalService
  ) {}

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

            try {
              parsedAttr = JSON.parse(item.attributes || '{}');
              innerAttr = JSON.parse(parsedAttr.attributes || '{}');
              dataAttr = innerAttr.data || {};
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

              // NEW FIELDS
              booked_on: item.created_at,
              travel_date: parsedAttr.car_from_date,
              car_number: innerAttr.vehicle_reg_no || '-',
              driver_name: innerAttr.driver_name || '-',
              driver_phone: innerAttr.driver_mobile || '-',

              // IMPORTANT
              vehicle_id: dataAttr.vehicle_id,

              // ✅ DEFAULT STATUS
booking_status: this.statusMap[apiStatus] ?this.statusMap[apiStatus]: '2'
            }
          });
        },
        error: () => {
          this.searchSpin = false;
          this.swal.alert.oops('Failed to load data');
        }
      });
  }

  onStatusChange(item: any) {
  const payload = {
    id: item.id,
    status: item.booking_status   // ✅ correct field
  };

  this.apiHandler.apiHandler('carStatusChange', 'POST', {}, {}, payload)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.swal.alert.success('Status updated');
    });
}


  showReassignForm = false;
selectedItem: any = null;

reassignForm = {
  car_name: '',
  car_number: '',
  driver_name: '',
  driver_phone: ''
};

submitted = false;

// OPEN FORM
onReassign(item: any) {
  this.selectedItem = item;
  this.showReassignForm = true;
  this.submitted = false;

  this.reassignForm = {
    car_name: item.car_name || '',
    car_number: item.car_number || '',
    driver_name: item.driver_name || '',
    driver_phone: item.driver_phone || ''
  };

  window.scroll({ top: 0, behavior: 'smooth' });
}

// SUBMIT (⚠️ NOT BLOCKING)
submitReassign() {
  this.submitted = true;

  
  // ✅ VALIDATION CHECK
  if (
    !this.reassignForm.car_name ||
    !this.reassignForm.car_number ||
    !this.reassignForm.driver_name ||
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
}
}