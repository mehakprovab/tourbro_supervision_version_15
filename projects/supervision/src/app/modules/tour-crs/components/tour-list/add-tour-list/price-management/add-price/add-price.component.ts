import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TourCrsService } from '../../../../../tour-crs.service';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss']
})
export class AddPriceComponent implements OnInit {
  priceManagementDataList: Array<any> = [];
  priceManagementForm: FormGroup;
  subSunk = new SubSink();
  tourId: number;
  toMinDate: Date = new Date(); // Minimum date for "To Date"

  @Output() insertedRecord = new EventEmitter<any>();
  @Input() tourPriceData: any;
  public tourPriceId: number;
  public submittedVehicle: boolean = false;
  
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };

  minDate = new Date(); // Minimum date for "From Date"
  maxDate = new Date();
  public fromAgeRange = Array.from({ length: 18 }, (_, index) => index );
  public currentUser: any;
  public submittedPrice: boolean = false;

  public times: string[] = [
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
    '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
    '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
    '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
  ];
  public timingList: { key: string, value: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private tourCrsService: TourCrsService
  ) {}

  ngOnInit() {
    this.tourId = Number(sessionStorage.getItem('tourId'));
    this.timingList = this.times.map(t => ({ key: t, value: t }));
    this.createPriceManagementForm();
    this.getTourDates();
    const currentUser = sessionStorage.getItem('currentSupervisionUser');
    this.currentUser = JSON.parse(currentUser);
  }


  setChildPrices(data: any[]) {
    this.childPrices.clear(); // clear existing

    data.forEach(d => {
      this.childPrices.push(
        this.fb.group({
          from_age: [d.from_age, Validators.required],
          to_age: [d.to_age, Validators.required],
          price: [d.price, Validators.required]
        })
      );
    });
  }

  getTourDates() {
    let priceData = {
      Id: this.tourId
    };
    this.apiHandlerService.apiHandler('getToursById','POST',{},{},priceData).subscribe({
      next: (res) => {
        console.log(res);
        if(res.Status === true && (res.statusCode === 201|| res.statusCode === 200)) {
          const response = res.data[0];
          this.minDate = new Date(response.start_date);
          this.maxDate = new Date(response.expire_date);
          this.toMinDate = new Date(response.start_date);
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  createPriceManagementForm() {
    this.priceManagementForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      adultPrice: ['', [Validators.required, Validators.min(0)]],
      is_refundable: [false],
      childPrice: this.fb.array([]),
      cancellation_policies: this.fb.array([]),
    });
    this.addChildPrice();
    this.addCancellationPolicies();

    // Update "To Date" minDate when "From Date" changes
    this.priceManagementForm.get('fromDate').valueChanges.subscribe((selectedDate) => {
      if (selectedDate) {
        this.toMinDate = new Date(selectedDate); // Update the minimum "To Date"
        // this.priceManagementForm.get('toDate').setValue(null); // Reset "To Date" if already selected
      }
    });
  }

  get cancellationPolicies() :FormArray {
        return this.priceManagementForm.get('cancellation_policies') as FormArray;
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
    return this.priceManagementForm.get('childPrice') as FormArray;
  }

  addChildPrice(){
    let minAge = 0;

    // If there are already price blocks, take last one's to_age
    if (this.childPrices.length > 0) {
      const lastGroup = this.childPrices.at(this.childPrices.length - 1);
      const lastToAge = lastGroup.get('to_age').value;

      if (lastToAge !== null && lastToAge !== undefined && lastToAge !== '') {
        minAge = +lastToAge + 1;   // next block should start after last to_age
      }
    }

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

  onToAgeSelect(event, index) {
    console.log(event.target.value);
    const childPrices = this.priceManagementForm.get('childPrice') as FormArray;
    const selectedValue = event.target.value;

    if (selectedValue !== null && selectedValue !== '') {
    for (let i = index + 1; i < childPrices.length; i++) {
      const group = childPrices.at(i) as FormGroup;

      const currentFrom = group.get('from_age').value;
      const currentTo = group.get('to_age').value;

      if (currentFrom !== null || currentTo !== null) {
        group.patchValue({
          from_age: '',
          to_age: ''
        });
      } else {
        group.patchValue({
          from_age: '',
          to_age: ''
        });
      }
    }
  }

  }

  onPriceManagementFormSubmit() {
    this.submittedPrice = true;
    if (this.priceManagementForm.invalid) {
      this.swalService.alert.error("Please fill all required fields correctly.");
      return;
    }

    let priceData = {
      toursId: this.tourId,
      adultAirlinerPrice: this.priceManagementForm.get('adultPrice').value,
      childAirlinerPrice: this.priceManagementForm.get('childPrice').value,
      fromDate: this.priceManagementForm.get('fromDate').value,
      toDate: this.priceManagementForm.get('toDate').value,
      CancPolicy: this.priceManagementForm.get('is_refundable').value ? this.priceManagementForm.get('cancellation_policies').value : [],
      isRefundable: this.priceManagementForm.get('is_refundable').value,
      created_by_id: this.currentUser['id'],
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('addToursPriceManagement', 'post', {}, {}, priceData)
      .subscribe(
        (response) => {
          if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
            this.swalService.alert.success("Price has been added successfully");
            this.submittedPrice = false;
            this.insertedRecord.emit(response.data);
            this.childPrices.clear();
            this.cancellationPolicies.clear();
            this.addCancellationPolicies();
            this.addChildPrice();
            this.priceManagementForm.reset();
          } else {
            this.submittedPrice = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.submittedPrice = false;
          this.swalService.alert.error(err.error.Message || "An error occurred");
        }
      );
  }
}
