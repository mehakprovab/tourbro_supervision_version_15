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
public selectedPackageTypeList: any[] = [];
public selectedDurationList: any[] = [];
public priceId: any;

  constructor(
    private fb: FormBuilder,
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService
  ) { }

  ngOnInit() {
    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((data) => {
      console.log(data);
      if (data) {
        this.packageId = data.id;
        this.getWellnessPackageDetail(this.packageId);
      } else {
        this.packageId = '';
        this.resetSelectedPackageDropdowns();
      }
      this.getAllPriceList();
    });
    this.getAllPackageTypes();
    
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
      non_refundable_discount: this.packageRateForm.value.is_refundable === true ? this.packageRateForm.value.non_refundable_discount : 0,
      wellness_package_cancellation_policy: this.packageRateForm.value.is_refundable === true ? this.packageRateForm.value.wellness_package_cancellation_policy : [],
      inclusions: this.normalizeEditorArray(this.packageRateForm.value.inclusions),
      exclusions: this.normalizeEditorArray(this.packageRateForm.value.exclusions),
      ...(this.priceId && { price_id: this.priceId }),
      
    };
    console.log('Form Data to Submit:', formData);
    if(this.packageRateForm.invalid) {
      this.swalService.alert.oops('Please Fill Required Fields');
      return;
    }
    let data = Object.assign({}, formData);
    data = [data];
    data['topic'] = this.priceId ? "updatePackagePrice" : "addPackagePrice";
    this.wellnessCrsService.create(data).subscribe(resp => {
      if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
        console.log('Wellness Center created successfully:', resp);
        this.swalService.alert.success('Wellness Center created successfully.');
        this.getAllPriceList();
         this.resetPackageRateForm();
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
      is_refundable: [false],
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

  resetPackageRateForm() {
    this.priceId = '';
    this.packageRateForm.reset({
      from_date: '',
      to_date: '',
      status: true,
      is_refundable: false,
      non_refundable_discount: '',
      inclusions: '',
      exclusions: '',
      isStayRequired: '',
      duration_stay_discount: {
        days: 0,
        discount_value: 0,
        cancellable: false
      }
    });
    this.resetFormArray(this.cancellationPolicies, this.createCancellationPolicy());
    this.resetFormArray(this.prices, this.createPrice());
    this.resetFormArray(this.timeline, this.createTimeLine());
    this.patchPackagePriceDropdowns({
      package_types: this.selectedPackageTypeList.map((item) => item.name),
      duration_days: this.selectedDurationList
    });
  }

  resetFormArray(formArray: FormArray, defaultGroup: FormGroup) {
    while (formArray.length) {
      formArray.removeAt(0);
    }
    formArray.push(defaultGroup);
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
    if (!this.packageId) {
      this.packagePriceList = [];
      return;
    }

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

  getWellnessPackageDetail(packageId: any) {
    if (!packageId) {
      return;
    }

    const data = [{ id: packageId }];
    data['topic'] = 'editWellnessPackage';
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.patchPackagePriceDropdowns(this.getPackageDetailFromResponse(resp.data));
      }
    }, (err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  getPackageDetailFromResponse(data: any): any {
    if (Array.isArray(data)) {
      return data[0] || {};
    }

    if (data && Array.isArray(data.data)) {
      return data.data[0] || {};
    }

    if (data && Array.isArray(data.result)) {
      return data.result[0] || {};
    }

    if (data && Array.isArray(data.rows)) {
      return data.rows[0] || {};
    }

    return data || {};
  }

  patchPackagePriceDropdowns(packageData: any) {
    if (!packageData || !this.packageRateForm) {
      return;
    }

    if (!this.prices.length) {
      this.addPrice();
    }

    const packageTypes = this.normalizeToArray(packageData.package_types || packageData.package_type);
    const durations = this.normalizeToArray(packageData.duration_days || packageData.duration);
    this.selectedPackageTypeList = this.getUniqueOptionList(packageTypes).map((name) => ({ name }));
    this.selectedDurationList = this.getUniqueOptionList(durations);
    const firstPrice = this.prices.at(0) as FormGroup;

    firstPrice.patchValue({
      package_type: this.selectedPackageTypeList[0]?.name || '',
      duration_days: this.selectedDurationList[0] || ''
    });
  }

  resetSelectedPackageDropdowns() {
    this.selectedPackageTypeList = [];
    this.selectedDurationList = [];
  }

  getUniqueOptionList(data: any[]): any[] {
    return data
      .map((item: any) => this.getOptionName(item))
      .filter((item: any) => item !== null && item !== undefined && item !== '')
      .filter((item: any, index: number, list: any[]) => list.indexOf(item) === index);
  }

  getOptionName(item: any): any {
    if (item && typeof item === 'object') {
      return item.name || item.package_type || item.duration_days || item.duration || '';
    }

    return item;
  }

  normalizeToArray(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (data === null || data === undefined || data === '') {
      return [];
    }

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (error) {
        return data.split(',').map(item => item.trim()).filter(item => item);
      }
    }

    return [data];
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
    if (!wellnessData || !this.packageRateForm) {
      return;
    }

    this.priceId = wellnessData.price_id || wellnessData.id || '';
    this.activeIdString = 'add_package_rate';
    this.resetFormArray(this.cancellationPolicies, this.createCancellationPolicy());
    this.resetFormArray(this.prices, this.createPrice());
    this.resetFormArray(this.timeline, this.createTimeLine());

    this.patchFormArray(
      this.cancellationPolicies,
      this.normalizeToArray(wellnessData.wellness_package_cancellation_policy),
      (item: any) => this.fb.group({
        cancellation_type: [item.cancellation_type || 'Free'],
        date_from: [item.date_from || ''],
        date_to: [item.date_to || ''],
        charge: [item.charge || ''],
        currency: [item.currency || ''],
        charge_type: [item.charge_type || 'Percentage'],
        additional_info: [item.additional_info || '']
      }),
      this.createCancellationPolicy()
    );

    this.patchFormArray(
      this.prices,
      this.normalizeToArray(wellnessData.prices),
      (item: any) => this.fb.group({
        adult_price: [item.adult_price || ''],
        child_price: [item.child_price || ''],
        package_type: [item.package_type || ''],
        duration_days: [item.duration_days || ''],
        no_of_slots: [item.no_of_slots || '']
      }),
      this.createPrice()
    );

    this.patchFormArray(
      this.timeline,
      this.normalizeToArray(wellnessData.timeline),
      (item: any) => this.fb.group({
        time: [item.time || ''],
        title: [item.title || ''],
        description: [item.description || '']
      }),
      this.createTimeLine()
    );

    this.packageRateForm.patchValue({
      from_date: wellnessData.from_date ? new Date(wellnessData.from_date) : '',
      to_date: wellnessData.to_date ? new Date(wellnessData.to_date) : '',
      status: wellnessData.status === 1 || wellnessData.status === true,
      is_refundable: wellnessData.is_refundable === 1 || wellnessData.is_refundable === true,
      non_refundable_discount: wellnessData.non_refundable_discount || '',
      inclusions: this.normalizeEditorValue(wellnessData.inclusions),
      exclusions: this.normalizeEditorValue(wellnessData.exclusions),
      isStayRequired: wellnessData.isStayRequired === 1 || wellnessData.isStayRequired === true,
      duration_stay_discount: {
        days: wellnessData.duration_stay_discount?.days || 0,
        discount_value: wellnessData.duration_stay_discount?.discount_value || 0,
        cancellable: wellnessData.duration_stay_discount?.cancellable === 1 || wellnessData.duration_stay_discount?.cancellable === true
      }
    });

  }

  patchFormArray(formArray: FormArray, data: any[], createGroup: (item: any) => FormGroup, defaultGroup: FormGroup) {
    while (formArray.length) {
      formArray.removeAt(0);
    }

    const rows = data.length ? data : [];
    rows.forEach((item: any) => formArray.push(createGroup(item)));

    if (!formArray.length) {
      formArray.push(defaultGroup);
    }
  }

  normalizeEditorArray(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    return [data || ''];
  }

  normalizeEditorValue(data: any): any {
    if (Array.isArray(data)) {
      return data.join(', ');
    }

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          return parsedData.join(', ');
        }
      } catch (error) {
        return data;
      }
    }

    return data || '';
  }

  getPackageType(data) {
    if (data) {
      const id = data;
      const response = this.packageTypeList.filter((res) => res.id === id);
      return response[0].name;
    }
  }
}
