import { Component, Input, OnInit } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-wellness-price',
  templateUrl: './wellness-price.component.html',
  styleUrls: ['./wellness-price.component.scss']
})
export class WellnessPriceComponent implements OnInit {

  submittedPrice = false;

  public activeIdString = 'list_package_rate';
  public packageRateForm!: FormGroup;
  isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-green'
    };
    minDate = new Date();
    setMinDate: any;
    isRefundable: boolean = false;
    isPaidCancellation: boolean = false;
    submittedRoomPrice: boolean = false;
packageTypeList: any;
public durationList = Array.from({ length: 30 }, (_, i) => (
  `${i + 1} Day${i > 0 ? 's' : ''}`
));
packagePriceList: any;
@Input() packageData: any;
public shownonRefundDiscount: boolean = false;
public packageId: any;

  constructor(
    private fb: FormBuilder,
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService
  ) { 
    this.wellnessCrsService.getEditData.subscribe((data) => {
      console.log(data);
      if(data) {
        this.packageId = data.id;
      } else {
        this.packageId = '';
      }
      
    })
  }

  ngOnInit() {
    this.createForm();
    this.getAllPackageTypes();
    this.getAllPriceList();
    
  }

  onSubmit() {

    console.log(this.packageRateForm.value)
    this.submittedRoomPrice = true;
    const formData = {
      ...this.packageRateForm.value,
      from_date: moment(this.packageRateForm.value.from_date).format('YYYY-MM-DD'),
      to_date: moment(this.packageRateForm.value.to_date).format('YYYY-MM-DD'),
      isStayRequired: this.packageRateForm.value.isStayRequired === true ? 1 : 0,
      package_id: this.packageId,
      // duration_stay_discount: this.packageRateForm.value.isStayRequired === true ? this.packageRateForm.value.duration_stay_discount : {},
      wellness_package_cancellation_policy: this.packageRateForm.value.is_refundable === true ? this.packageRateForm.value.wellness_package_cancellation_policy : [],
      
    };
    console.log('Form Data to Submit:', formData);
    if(this.packageRateForm.invalid) {
      this.swalService.alert.oops('Please Fill Required Fields');
      return;
    }
    let data = Object.assign({}, formData);
    data = [data];
    data['topic'] = "addPackagePrice";
    this.wellnessCrsService.create(data).subscribe(resp => {
      if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
        console.log('Wellness Center created successfully:', resp);
        this.swalService.alert.success('Wellness Center created successfully.');
        this.getAllPriceList();
         this.packageRateForm.reset();
       this.activeIdString = 'list_package_rate';
      }
    }, (err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  onCheckIn(event) {
    if (event) {
      //  const eventDate = new Date(event);
      const eventDate = moment(event, 'DD-MM-YYYY').toDate();
      console.log("eventDate", eventDate)
      eventDate.setDate(eventDate.getDate() + 1);
      this.setMinDate = eventDate;
      // this.maxDate(event);
    }
  }
  // maxDate(event) {
  //   const date = new Date(event);
  //   date.setDate(date.getDate() + 30);
  //   this.setMaxDate = date;
  //   this.cdr.detectChanges();
  // }


  onRefundableChange(event: any) {

  this.isPaidCancellation =
  event.target.value === 'true';
    const nonRefundableDiscount = this.packageRateForm.get('non_refundable_discount');

    this.cancellationPolicies.controls.forEach(
      (segment: FormGroup) => {

        const charge =
          segment.get('charge');

        const dateFrom =
          segment.get('date_from');


        if (this.isPaidCancellation) {

          charge.setValidators([
            Validators.required
          ]);

        dateFrom.setValidators([
          Validators.required
        ]);
        nonRefundableDiscount.setValidators([
          Validators.required
        ]);;
        this.createCancellationPolicy();
        this.shownonRefundDiscount = false;
      } else {
        this.shownonRefundDiscount = true;
        charge.clearValidators();

        dateFrom.clearValidators();
        nonRefundableDiscount.clearValidators()

          segment.patchValue({
            charge: '',
            date_from: ''
          });
          this.packageRateForm.patchValue({non_refundable_discount: ''})

        }


        charge.updateValueAndValidity();

        dateFrom.updateValueAndValidity();
        nonRefundableDiscount.updateValueAndValidity();

      }
    );

  }

  createForm() {
    this.packageRateForm = this.fb.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
      status: [true, [Validators.required]],
      is_refundable: [],
      non_refundable_discount: [''],
      wellness_package_cancellation_policy: this.fb.array([
        this.createCancellationPolicy()
      ]),
      prices: this.fb.array([
      this.createPrice()
    ]),
    timeline: this.fb.array([this.createTimeLine()]),
    inclusions:[''],
    exclusions:[''],
      isStayRequired: [''],
      duration_stay_discount: this.fb.group({
        days: [0],
        discount_value: [0],
        cancellable: [false]
      })

    });
    this.onStayRequiredChange();
  }

  onStayRequiredChange() {

    this.packageRateForm
      .get('isStayRequired')
      .valueChanges
      .subscribe((value: boolean) => {

        const stayForm =
          this.packageRateForm.get(
            'duration_stay_discount'
          ) as FormGroup;


        if (value) {

          stayForm.get('days')
            .setValidators([
              Validators.required
            ]);

          stayForm.get('discount_value')
            .setValidators([
              Validators.required
            ]);

        } else {

          stayForm.reset({
            days: '',
            discount_value: '',
            cancellable: false
          });


          stayForm.get('days')
            .clearValidators();

          stayForm.get('discount_value')
            .clearValidators();

        }


        stayForm.get('days')
          .updateValueAndValidity();

        stayForm.get('discount_value')
          .updateValueAndValidity();

      });

  }

  createCancellationPolicy(): FormGroup {

    return this.fb.group({
      cancellation_type: ['Free'],
      date_from: [''],
      date_to: [''],
      charge: [''],
      currency: [''],
      charge_type: ['Percentage'],
      additional_info: ['']
    });

  }


  onChargeInput(event: any, segment: FormGroup) {
    let value = event.target.value;
    const type = segment.get('charge_type').value;

    if (type === 'Percentage') {
      if (value > 100) {
        value = 100;
      }
    }

    if (value < 0) {
      value = 0;
    }

    segment.get('charge').setValue(value, { emitEvent: false });
  }

  createTimeLine(): FormGroup {
    return this.fb.group({
      time:[''],
      title: [''],
      description:['']
    })
  }

  createPrice(): FormGroup {

    return this.fb.group({
      adult_price: [''],
      child_price: [''],
      package_type: [''],
      duration_days: [''],
      no_of_slots: ['']
    });

  }

  get cancellationPolicies(): FormArray {
    return this.packageRateForm.get(
      'wellness_package_cancellation_policy'
    ) as FormArray;
  }


  get prices(): FormArray {
    return this.packageRateForm.get(
      'prices'
    ) as FormArray;
  }

  get timeline(): FormArray {
    return this.packageRateForm.get('timeline') as FormArray;
  }

  addTimeLine() {
    this.timeline.push(this.createTimeLine());
  }

  removeTimeLine(index: number) {
    this.timeline.removeAt(index);
  }
  addCancellationPolicy() {
    this.cancellationPolicies.push(
      this.createCancellationPolicy()
    );
  }


  removeCancellationPolicy(index: number) {
    this.cancellationPolicies.removeAt(index);
  }


  addPrice() {
    this.prices.push(
      this.createPrice()
    );
  }


  removePrice(index: number) {
    this.prices.removeAt(index);
  }

  onTabSelected(event: any) {
    this.activeIdString = event.nextId;
    console.log(this.activeIdString);
    if(this.activeIdString === 'list_package_rate') {
      this.getAllPriceList();
    }
  }


  triggerTab(data: any) {
    console.log("data", data)
    this.activeIdString = 'add_package_rate';
  }


  getAllPackageTypes() {
    const data = {
      topic: "packageTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.packageTypeList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.packageTypeList = [];
      }
    });
  }

  getAllPriceList() {
    const data = [{
      "package_id": this.packageId,
      "offset": 0,
      "limit": 10
    }];
    data["topic"] = "packagePriceList";
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.packagePriceList = resp.data || [];

      } else if (resp.statusCode === 404) {
        this.packagePriceList = [];
      }
    });
  }

  deletePriceList(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ price_id: id }];
        data["topic"] = "deletePackagePrice";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Package Rate has been deleted successfully`,
              );
              this.getAllPriceList();
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },
        );
      }
    });
  }

  updatePackageList(wellnessData) {

  }

  getPackageType(data) {
    if (data) {
      const id = data;
      const response = this.packageTypeList.filter((res) => res.id === id);
      return response[0].name;
    }
  }
}
