import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TourCrsService } from '../../../../../tour-crs.service';

@Component({
  selector: 'app-update-price',
  templateUrl: './update-price.component.html',
  styleUrls: ['./update-price.component.scss']
})
export class UpdatePriceComponent implements OnInit, OnChanges, OnDestroy {

  tourId:number;
  priceIndividualId:number;
  priceManagementDataList:Array<any>=[];
  updatePriceManagementForm:FormGroup;
  subSunk=new SubSink();
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  @Input() updatePriceManagementData: any;
  @Output() updated = new EventEmitter<any>();
  minDate: Date = new Date(); // Minimum selectable date for From Date
  minToDate: Date = new Date();  // Dynamic minDate for To Date
public fromAgeRange = Array.from({ length: 18 }, (_, index) => index );
public currentUser: any;
 public times: string[] = [
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
    '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
    '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
    '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
  ];
  public timingList: { key: string, value: string }[] = [];
  constructor(private fb:FormBuilder, private route:ActivatedRoute,private datePipe:DatePipe,
              private apiHandlerService:ApiHandlerService,private  swalService:SwalService,private router:Router,
            private tourCrs: TourCrsService) { }

  ngOnInit() {
    this.tourId=Number(sessionStorage.getItem('tourId'));
    this.timingList = this.times.map(t => ({ key: t, value: t }));
    this.createPriceManagementForm();
    const currentUser = sessionStorage.getItem('currentSupervisionUser');
    this.currentUser = JSON.parse(currentUser);
    this.subSunk.sink = this.tourCrs.getTourManagementData.subscribe(data => {
      if (!this.updatePriceManagementData && data && data.id) {
        this.loadPrice(data);
      }
    });
    if (this.updatePriceManagementData) {
      this.loadPrice(this.updatePriceManagementData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.updatePriceManagementData && this.updatePriceManagementForm) {
      this.loadPrice(changes.updatePriceManagementData.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

  private loadPrice(data: any): void {
    this.priceIndividualId = null;
    if (!data || !data.id) {
      return;
    }
    try {
      const childPrices = this.parseArray(data.child_airliner_price);
      const policies = this.parseArray(data.canc_policy);
      const fromDate = new Date(data.from_date);
      const toDate = new Date(data.to_date);
      const refundable = data.refundable ?? data.is_refundable;
      // Keep an existing past start date editable.
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.minDate = fromDate < today ? new Date(fromDate) : today;
      this.minToDate = new Date(fromDate);
      this.updatePriceManagementForm.patchValue({
        fromDate,
        toDate,
        adultPrice: data.adult_airliner_price,
        is_refundable: refundable === 'Refundable' || refundable === true
          || refundable === 1 || refundable === '1'
      });
      this.setChildPrices(childPrices);
      this.setCancPolicies(policies);
      this.priceIndividualId = Number(data.id);
    } catch {
      this.swalService.alert.error('Unable to load child prices or cancellation policies for this record.');
    }
  }

  private parseArray(value: any): any[] {
    const parsed = typeof value === 'string' && value.trim() ? JSON.parse(value) : value;
    if (parsed == null || parsed === '') {
      return [];
    }
    if (!Array.isArray(parsed)) {
      throw new Error('Expected a list');
    }
    return parsed;
  }

  setCancPolicies(data: any[]) {
    this.cancellationPolicies.clear();
    if (data.length) {
      data.forEach(d => {
        this.cancellationPolicies.push(this.fb.group({
          charge_type: d.charge_type,
          charge: d.charge,
          additional_info: d.additional_info,
          date_from: d.date_from,
          time: d.time
        }))
      })
    } else {
      this.addCancellationPolicies();
    }
  }

  setChildPrices(data: any[]) {
    this.childPrices.clear(); // clear existing
    if (data.length) {
      data.forEach(d => {
        this.childPrices.push(
          this.fb.group({
            from_age: [d.from_age, Validators.required],
            to_age: [d.to_age, Validators.required],
            price: [d.price, Validators.required]
          })
        );
      });
    } else {
      this.addChildPrice();
    }
    
  }
  createPriceManagementForm(){
    this.updatePriceManagementForm=this.fb.group({
      fromDate:['',[Validators.required]],
      toDate:['',Validators.required],
      adultPrice:['',Validators.required],
      is_refundable: [false],
      childPrice: this.fb.array([]),
      cancellation_policies: this.fb.array([])
    })
  }

  get cancellationPolicies() :FormArray {
      return this.updatePriceManagementForm.get('cancellation_policies') as FormArray;
  }

  addCancellationPolicies() {
      const policies = this.fb.group({
          charge_type: ['Percentage'],
          charge: [''],
          additional_info: [''],
          date_from: [''],
          time: ['']
      })
      this.cancellationPolicies.push(policies);
  }

  removeCancellationPolicies(index) {
      this.cancellationPolicies.removeAt(index);
  }

   get childPrices(): FormArray {
      return this.updatePriceManagementForm.get('childPrice') as FormArray;
    }

    addChildPrice () {
      const childPrices = this.fb.group({
        from_age: ['', Validators.required],
        to_age: ['', Validators.required],
        price: ['', Validators.required]
      })
      this.childPrices.push(childPrices);
    }
    removePricing(index: number) {
      this.childPrices.removeAt(index);
    }
  onFromDateChange() {
    const fromDate = this.updatePriceManagementForm.get('fromDate').value;
    if (fromDate) {
      this.minToDate = new Date(fromDate); // Set minDate for To Date
      const toDate = this.updatePriceManagementForm.get('toDate').value;

      // If To Date is before From Date, reset it
      if (toDate && new Date(toDate) < this.minToDate) {
        this.updatePriceManagementForm.patchValue({ toDate: null });
      }
    }
  }

onUpdatePriceManagementFormSubmit() {
  if (this.updatePriceManagementForm.invalid) {
    this.updatePriceManagementForm.markAllAsTouched();
    this.swalService.alert.error('Please fill all required fields.');
    return;
  }

  // Validate child age ranges
  const childPrices = this.updatePriceManagementForm.get('childPrice').value;

  const invalidAgeRange = childPrices.some((item: any) => {
    return Number(item.to_age) <= Number(item.from_age);
  });

  if (invalidAgeRange) {
    this.swalService.alert.error(
      'Before Age must be greater than From Age.'
    );
    return;
  }

  if (!this.priceIndividualId) {
    this.swalService.alert.error('Price ID is missing.');
    return;
  }

  if (!this.tourId) {
    this.swalService.alert.error('Tour ID is missing.');
    return;
  }

  const formValue = this.updatePriceManagementForm.getRawValue();

  const priceUpdateData = {
    Id: this.priceIndividualId,
    tour_id: this.tourId,

    fromDate: formValue.fromDate,
    toDate: formValue.toDate,

    adultAirlinerPrice: Number(formValue.adultPrice),

    childAirlinerPrice: formValue.childPrice.map((item: any) => ({
      from_age: Number(item.from_age),
      to_age: Number(item.to_age),
      price: Number(item.price)
    })),

    CancPolicy: formValue.is_refundable
      ? formValue.cancellation_policies.map((item: any) => ({
          charge_type: item.charge_type,
          charge: Number(item.charge),
          additional_info: item.additional_info || '',
          date_from: Number(item.date_from),
          time: item.time
        }))
      : [],

    isRefundable: formValue.is_refundable,

    created_by_id: this.currentUser?.id
  };

  this.subSunk.sink = this.apiHandlerService
    .apiHandler(
      'updateToursPriceManagement',
      'post',
      {},
      {},
      priceUpdateData
    )
    .subscribe(
      (response: any) => {

        if (response.statusCode === 200 || response.statusCode === 201) {

          this.updated.emit(true);

          this.swalService.alert.success(
            'Price has been updated successfully'
          );

          this.tourCrs.updatedPriceManagement.next(true);

          this.router.navigate([
            '/tour-crs/tour-list/add-tour/price-management'
          ]);

        } else {


          this.swalService.alert.error(
            response?.Message || 'Unable to update price.'
          );
        }
      },
      (err: HttpErrorResponse) => {


        this.swalService.alert.error(
          err?.error?.Message ||
          err?.error?.message ||
          'Something went wrong.'
        );
      }
    );
}
}
