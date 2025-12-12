import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class UpdatePriceComponent implements OnInit {

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
    this.tourId=Number(localStorage.getItem('tourId'));
    this.timingList = this.times.map(t => ({ key: t, value: t }));
    this.createPriceManagementForm();
    const currentUser = sessionStorage.getItem('currentSupervisionUser');
    this.currentUser = JSON.parse(currentUser);
    this.tourCrs.getTourManagementData.subscribe(data => {
      if (data) {
        this.priceIndividualId=Number(data['id']);
        this.updatePriceManagementForm.get('fromDate').patchValue(new Date(data['from_date']));
        this.updatePriceManagementForm.get('toDate').patchValue(new Date(data['to_date']));
        this.updatePriceManagementForm.get('adultPrice').patchValue(data['adult_airliner_price']);
        this.updatePriceManagementForm.get('is_refundable').patchValue(data['refundable'] === 'Refundable' ? true : false)
        // this.updatePriceManagementForm.get('childPrice').patchValue(data['child_airliner_price']);
        const childPrice = JSON.parse(data.child_airliner_price);
        this.setChildPrices(childPrice);
        const cancPolicy = JSON.parse(data.canc_policy);
        this.setCancPolicies(cancPolicy);
        }
    });
    if (this.updatePriceManagementData) {
      this.priceIndividualId=Number(this.updatePriceManagementData['id']);
      this.updatePriceManagementForm.get('fromDate').patchValue(new Date(this.updatePriceManagementData['from_date']));
      this.updatePriceManagementForm.get('toDate').patchValue(new Date(this.updatePriceManagementData['to_date']));
      this.updatePriceManagementForm.get('adultPrice').patchValue(this.updatePriceManagementData['adult_airliner_price']);
      // this.updatePriceManagementForm.get('childPrice').patchValue(data['child_airliner_price']);
      const childPrice = JSON.parse(this.updatePriceManagementData.child_airliner_price);
        this.setChildPrices(childPrice);
    }
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

  onUpdatePriceManagementFormSubmit(){
    // make api call to get updated data
    let priceUpdateData={
      "Id": this. priceIndividualId, 
      "tour_id": this.tourId,
      "fromDate":this.updatePriceManagementForm.get('fromDate').value,
      "toDate":this.updatePriceManagementForm.get('toDate').value,
      "adultAirlinerPrice":Number(this.updatePriceManagementForm.get('adultPrice').value),
      "childAirlinerPrice": (this.updatePriceManagementForm.get('childPrice').value),
      "CancPolicy": this.updatePriceManagementForm.get('is_refundable').value ? this.updatePriceManagementForm.get('cancellation_policies').value : [],
      "isRefundable": this.updatePriceManagementForm.get('is_refundable').value,
      created_by_id: this.currentUser['id']
    }
    if(this.updatePriceManagementForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateToursPriceManagement', 'post', {}, {},
        priceUpdateData   
      ).subscribe(response => {
                if ((response.statusCode == 200 || response.statusCode == 201) && response.Status) {
                  this.updated.emit(true);
                      this.swalService.alert.success("Price has been updated successfully");
                      this.tourCrs.updatedPriceManagement.next(true);
                      this.router.navigate(['/tour-crs/tour-list/add-tour/price-management'])
                    }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
    }
  }
    onToAgeSelect(event) {
    console.log(event.target.value);
  }
  handleCheckboxClick(event) {
    console.log(event.target.checked)
  }
}
