import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
const log = new Logger('Hotel/AddUpdateHotel');
import { formatDate } from '../../../../../../core/services/format-date';
import * as moment from 'moment';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss']
})
export class PriceManagementComponent implements OnInit {
    roomPriceForm: FormGroup;
    stopSaleForm:FormGroup;
    rooListForm:FormGroup;
    showPriceList: boolean;
    showPriceForm: boolean;
    addedPriceDetail: any;
    seasonCopy:any =[];
    showInputOne = false;
    showInputTwo = false;
    noDataMessage: string;
    noData: boolean = true;
    roomId:object = {};
    submittedRoomPrice: boolean = false;
    @Input() hotelOne: any;
    @Input() priceData: any;
    @Input() priceDataList:any;
    @Output() showRoomDetail = new EventEmitter<any>();
    seasonList: any = [];
    showInputThree = false;
    showChildInput = false;
    showVat = false;
    showRoom = false;
    showServiceCharge = false;
    priceList: any;
    patchdData:any;
    roomPriceList:boolean=true;
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    isOpenFromDate1 = false as boolean;
    isOpenToDate1 = false as boolean;
    isOpenFromDate2 = false as boolean;
    isOpenToDate2 = false as boolean;
    isOpenFromDate3 = false as boolean;
    isOpenToDate3 = false as boolean;
    isOpenFromDate4 = false as boolean;
    isOpenToDate4 = false as boolean;
    isStopSaleFromDate = false as boolean;
    isStopSaleToDate = false as boolean;
    isOpenSaleFromDate = false as boolean;
    isOpenSaleToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-green',
    };
    selectedSeasonFrom: string = '';
    selectedSeasonTo: string = '';
    initialValues = {};
    otherFieldsChanged:boolean=false;
    dateChanged:boolean=false;
    dropdownSettingsForHotel = {
        singleSelection: true,
        textField: 'meals',
        maxHeight: 197,
        itemsShowLimit: 2,
      };
      dropdownSettingsForview = {
        singleSelection: true,
        textField: 'views',
        maxHeight: 197,
        itemsShowLimit: 2,
      };
      mealView = [];
      viewList = [];
      filteredMealView = []; // Options for the meal dropdown based on priceData
      filteredViewList = [];
      patcheddata:any;
      maxAdults = 6; // Example maximum
      maxChildren = 6; // Example maximum
      // maxInfants = 6; // Example maximum
      dynamicAdultHeaders = [];
      dynamicChildHeaders = [];
      // dynamicInfantHeaders = [];
      mealType:any;
      roomView:any;
       minDate : any;
      setMinDate: any;
      setStoSaleMinDate: any;
      setMaxDate=new Date();
      editPriceList:any;
      showStopSale: boolean = false;
      showTopUp: boolean = false;
      showDiscount: boolean = false;
      showCancellation: boolean = false;
      isRate:boolean= false;
      isRateData:boolean =false;
      isRefundable: boolean = false;
      earlyData:boolean =false;
      stayData:boolean =false;
      isPaidCancellation: boolean = false;
      isNonRefundableData :boolean = false;
      updatedChildPriceString:any;
      maxSetDate:any; // Define maxDate
      currencyValue:any;
      stopSale: boolean = false;
      priceListData: any = [];
      setSaleMaxDate: any = new Date();
      setSaleMinDate: any = new Date();
      openSaleForm: FormGroup;
      showOpenSale: boolean = false;
      stopSaleDates: any;
      priceDataPayLoad: any;
      submitFrom: any;
  constructor(
    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private cdr:ChangeDetectorRef,
    private utility: UtilityService
  ) {
    this.minDate = new Date();
   }
  

  ngOnInit() {
    this.createRoomPriceForm();
    this.createStopForm();
    // this.patchPriceData(this.priceDataList);
    this.loadOptions();
    // this.initializeDefaultCombination();
    this.hotelCrsService.seasonList.subscribe(res => {
        this.seasonCopy = res;
    });
    this.getSeasonList();
    this.hotelCrsService.roomId.subscribe(resp => {
        this.roomId=resp
       })
      //  setTimeout(() => {
      //   this.getPriceList()
      //  }, 1000);
   
    // this.onEdit();
    this.addStopSaleFields();
    this.createOpenSaleForm()
    this.addOpenSaleFields();
    this.currencyValue = this.hotelOne['currency'];
  }
  createOpenSaleForm() {
    this.openSaleForm = this.fb.group({
      status: [false],
      fieldGroup: this.fb.array([]),
    });
  }
  get fieldGroup(): FormArray {
    return this.openSaleForm.get('fieldGroup') as FormArray;
  }

  addOpenSaleFields() {
    const group = this.fb.group({
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      inventory: ['', Validators.required]
    })
    this.fieldGroup.push(group);
    this.isOpenFromDate1 = false;
    this.isStopSaleFromDate = false;
    this.isStopSaleToDate = false;
    this.isOpenSaleFromDate = false;
    this.isOpenSaleToDate = false;
    this.isOpenToDate1 = false;
  }

  removeOpenSale(index: number) {
    this.fieldGroup.removeAt(index);
    this.isOpenFromDate1 = false;
    this.isStopSaleToDate = false;
    this.isStopSaleFromDate = false;
    this.isOpenSaleFromDate = false;
    this.isOpenSaleToDate = false;
    this.isOpenToDate1= false;
  }

  createStopForm() {
    this.stopSaleForm = this.fb.group({
      status: [false],
      fieldGroups: this.fb.array([]),
    });
}

get fieldGroups(): FormArray {
  return this.stopSaleForm.get('fieldGroups') as FormArray;
}

addStopSaleFields() {
  const group = this.fb.group({
    from_date: ['', Validators.required],
    to_date: ['', Validators.required],
  })
  this.fieldGroups.push(group);
  this.isOpenFromDate1 = false;
  this.isStopSaleFromDate = false;
  this.isStopSaleToDate = false;
  this.isOpenSaleFromDate = false;
  this.isOpenSaleToDate = false;
  this.isOpenToDate1 = false;
}

removeStopSales(index: number) {
  this.fieldGroups.removeAt(index);
  this.isOpenFromDate1 = false;
  this.isStopSaleToDate = false;
  this.isStopSaleFromDate = false;
  this.isOpenSaleFromDate = false;
  this.isOpenSaleToDate = false;
  this.isOpenToDate1= false;
}
  createRoomPriceForm() {
    this.roomPriceForm = this.fb.group({
        from_date: [''],
        to_date: ['',],
        // single_room: [],
        // double_room: [],
        // adult_extra_price: [],
        // child_extra_price:[],
        // infant_extra_pric:[],
        // childwb: [],
        // childb: [],
        no_of_rooms:[''],
        // gst:[],
        stop_sale:[],
        // RO:[],
        // HB:[],
        is_refundable:[true],
        rate_type:['night_rate'],
        minimum_stay:[],
        block_rooms:[0],
        date_range_discount:[0],
        supplement_type_weekend:[false],
        supplement_value_weekend:[{ value: '', disabled: true }],
        non_refundable_discount:[0],
        days:[''],
        discount_value:[''],
        early_cancellable:[''],
        days1:[''],
        discount_value1:[''],
        cancellable:[''],
        isEarlyRequired:[''],
        isStayRequired:[''],
        booked_rooms:[],
        service: [],
        supplement_type:[''],
        supplement_value:[],
        segments: this.fb.array([
          this.createSegment() // Initialize with one segment
        ]),
        hotel_room_cancellation_policy:[],
        status: new FormControl(false),
        meal_type: new FormControl([],Validators.required), // Initialize as an empty array or appropriate default value
        room_view: new FormControl([],Validators.required), // Initialize as an empty array or a
        roomPriceCombinations: this.fb.array([
            this.createRoomPriceCombination()
        ]),

    })
    Object.keys(this.roomPriceForm.controls).forEach(key => {
    const control = this.roomPriceForm.get(key);
    this.initialValues[key] = control.value;
});
}
createAdultGroup(type: string): FormGroup {
    return this.fb.group({
        type: [type],
        price: ['']
    });
}
createSegment(): FormGroup {
  return this.fb.group({
    currency: [''],
    charge: ['', ],
    charge_type: ['Percentage'],
    cancellation_type: ['Free'],
    additional_info: [''],
    date_from: ['', ],
    date_to: ['']
  });
}
// patchPriceData(priceDataList: any) {
//   const combinations = this.roomPriceForm.get('roomPriceCombinations') as FormArray;

//   // Iterate through the price[] array inside priceDataList
//   priceDataList.prices.forEach((priceData: any, index: number) => {
//     // Ensure there's a corresponding combination group in the FormArray
//     if (index >= combinations.length) {
//       combinations.push(this.createRoomPriceCombination());
//     }

//     const combinationGroup = combinations.at(index) as FormGroup;

//     // Patch the combination group with the provided price data
//     combinationGroup.patchValue({
//       meal_type: priceData.meal_type,
//       room_view: priceData.room_view,
//     });
//     this.loadOptions();
//     // Patch extra prices for adults, children, and infants
//     this.parseAndPatchExtraPrices(priceData.adult_extra_price, combinationGroup.get('adults') as FormArray);
//     this.parseAndPatchExtraPrices(priceData.child_extra_price, combinationGroup.get('children') as FormArray);
//     this.parseAndPatchExtraPrices(priceData.infant_extra_price, combinationGroup.get('infants') as FormArray);
//   //   const infantsFormArray = combinationGroup.get('infants') as FormArray;
//   //   infantsFormArray.controls.forEach(control => {
//   //     control.patchValue({
//   //         type: control.get('type').value || '',  // Keep existing type or set default
//   //         price: 0  // Set default price to 0
//   //     });
//   // });
//   });
// }
// // Helper method to parse and patch the extra prices
// parseAndPatchExtraPrices(extraPriceString: string, formArray: FormArray) {
//   // Clear existing controls if any
//   formArray.clear();

//   if (extraPriceString) {
//     const pricePairs = extraPriceString.split(',');
//     pricePairs.forEach(pair => {
//       const [index, price] = pair.split(':').map(item => item.trim());
//       formArray.push(this.fb.group({
//         index: index,
//         price: price
//       }));
//     });
//   }
// }


toggleDatepickerFrom(event: Event) {
  event.stopPropagation();  // Prevents the click event from bubbling
  this.isOpenFromDate = true;
}


toggleDatepickerTo(event: Event) {
  event.stopPropagation();  // Prevents the click event from bubbling
  this.isOpenFromDate = true;
}

loadOptions() {
    forkJoin({
      mealOptions: this.getMealList(),
      viewOptions: this.getViewList()
    }).subscribe(results => {
      this.mealView = results.mealOptions;
      this.viewList = results.viewOptions;

      // Populate dropdowns based on the fetched data
      this.updateDropdownOptions();
      // Populate form controls if `priceData` is available
        this.updateMealOptions();
        this.updateViewOptions();
        this.populateOccupancyFields();
      
    });
  }
  // patchMealAndViewOptions() {
  //   // Initialize Sets to store unique meal plans and room views
  //  const allMealPlans = new Set();
  //  const allRoomViews = new Set();
   
  //  // Use a for loop to iterate over the prices array
  //  for (let i = 0; i < this.priceDataList.prices.length; i++) {
  //    const price = this.priceDataList.prices[i];
   
  //    // Split meal_type by commas, filter out empty strings, and add to the set if valid
  //    const mealPlans = price.meal_type.split(',').filter(Boolean);
  //    for (let j = 0; j < mealPlans.length; j++) {
  //      if (this.mealView.some(option => option.meals === mealPlans[j])) {
  //        allMealPlans.add(mealPlans[j]);
  //      }
  //    }
   
  //    // Split room_view by commas, filter out empty strings, and add to the set
  //    const roomViews = price.room_view.split(',').filter(Boolean);
  //    for (let k = 0; k < roomViews.length; k++) {
  //      allRoomViews.add(roomViews[k]);
  //    }
  //  }
   
  //  // Convert Sets back to arrays and patch the form controls
  //  this.roomPriceForm.get('meal_type').patchValue(Array.from(allMealPlans));
  //  this.roomPriceForm.get('room_view').patchValue(Array.from(allRoomViews));
   
   
  //  }

  getMealList(): Observable<any[]> {
    const data = [{ offset: 0, limit: 10 }];
    data['topic'] = 'mealList';
    return this.hotelCrsService.fetch(data).pipe(
      map(resp => resp.statusCode === 200 ? resp.data :[])
    );
  }

  getViewList(): Observable<any[]> {
    const data = [{ offset: 0, limit: 10 }];
    data['topic'] = 'viewList';
    return this.hotelCrsService.fetch(data).pipe(
      map(resp => resp.statusCode === 200 ? resp.data : [])
    );
  }

  updateDropdownOptions() {
    // Filter meal and view options based on `priceData`
//     if(this.patchedData){
//      // Initialize empty arrays to store the filtered meal plans and room views
// let filteredMealView = [];
// let filteredViewList = [];

// // Use a for loop to iterate over the prices array
// for (let i = 0; i < this.patchedData.prices.length; i++) {
//   const price = this.patchedData.prices[i];

//   // Split meal_type and room_view by commas, filter out empty strings
//   const mealPlans = price.meal_type.split(',').filter(Boolean);
//   const roomViews = price.room_view.split(',').filter(Boolean);

//   // Filter mealView and viewList based on the current price's mealPlans and roomViews
//   filteredMealView.push(...this.mealView.filter(option => mealPlans.includes(option.meals)));
//   filteredViewList.push(...this.viewList.filter(option => roomViews.includes(option.views)));
// }

// // Remove duplicates by converting to a Set and then back to an array
// this.filteredMealView = Array.from(new Set(filteredMealView));
// this.filteredViewList = Array.from(new Set(filteredViewList));

//     }else{
      const mealPlans = this.priceData.meal_type.split(',').filter(Boolean);
      const roomViews = this.priceData.room_view.split(',').filter(Boolean);
      this.filteredMealView = this.mealView.filter(option => mealPlans.includes(option.meals));
      this.filteredViewList = this.viewList.filter(option => roomViews.includes(option.views));
    // }
  }

  updateMealOptions() {
    // Update the meal_type form control with filtered options
    const mealPlans = this.priceData.meal_type.split(',').filter(Boolean);
}

  updateViewOptions() {
    // Update the room_view form control with filtered options
    const roomViews = this.priceData.room_view.split(',').filter(Boolean);
    // this.roomPriceForm.get('room_view').setValue(roomViews);
  }
createRoomPriceCombination(): FormGroup {
    return this.fb.group({
      combination: [''],
      meal_type: [''],
      room_view: [''],
      adults: this.fb.array([]),
      children: this.fb.array([]),
      // infants: this.fb.array([]),
    });
  }
populateOccupancyFields() {
  // Get selected meal plans and room views from form controls
  const selectedMealPlans = this.roomPriceForm.get('meal_type').value;
  const selectedRoomViews = this.roomPriceForm.get('room_view').value;



  // Generate combinations based on selected values
  const combinations = this.generateCombinations(selectedMealPlans, selectedRoomViews);

  // Get the FormArray for room price combinations
  const roomPriceCombinations = this.roomPriceForm.get('roomPriceCombinations') as FormArray;

  // Adjust FormArray size to match the number of combinations
  this.setFormArraySize(roomPriceCombinations, combinations.length);

  // Populate each combination group
  combinations.forEach((combination, index) => {
    const combinationGroup = roomPriceCombinations.at(index) as FormGroup;
    this.populateCombinationForm(combinationGroup, combination);
  });
}
get roomPriceCombinations(): FormArray {
    return this.roomPriceForm.get('roomPriceCombinations') as FormArray;
  }

  generateCombinations(mealPlans: string[], roomViews: string[]): string[][] {
    const combinations = [];
    for (const mealPlan of mealPlans) {
      for (const roomView of roomViews) {
        combinations.push([mealPlan, roomView]);
      }
    }
    return combinations;
  }

  setFormArraySize(formArray: FormArray, size: number) {
    while (formArray.length < size) {
      formArray.push(this.createRoomPriceCombination());
    }
    while (formArray.length > size) {
      formArray.removeAt(formArray.length - 1);
    }
  }

  populateCombinationForm(combinationGroup: FormGroup, combination: string[]) {
    const mealTypeValue = combination[0];
    const roomViewValue = combination[1];

    combinationGroup.get('meal_type').setValue(mealTypeValue);
    combinationGroup.get('room_view').setValue(roomViewValue);
    const combinationString = `${mealTypeValue} - ${roomViewValue}`;
    combinationGroup.get('combination').setValue(combinationString);
    this.setFormArraySizeForGroup(combinationGroup.get('adults') as FormArray, this.priceData.occupancy_adult);
    if(this.priceData.occupancy_child){
    this.setFormArraySizeForGroup(combinationGroup.get('children') as FormArray, 1);
    }
  }
  getCombinationDisplayText(combinationGroup: FormGroup): string {
    if(this.priceDataList){
      const mealType = combinationGroup.get('meal_type').value;
      const roomView = combinationGroup.get('room_view').value;
  
      const mealTypeText = mealType ? mealType : '';  // Adjust the property name as needed
      const roomViewText = roomView ? roomView : '';  // Adjust the property name as needed
  
      return `${mealTypeText} - ${roomViewText}`;
    } else {
    const mealType = combinationGroup.get('meal_type').value;
    const roomView = combinationGroup.get('room_view').value;

    const mealTypeText = mealType ? mealType.meals : '';  // Adjust the property name as needed
    const roomViewText = roomView ? roomView.views : '';  // Adjust the property name as needed

    return `${mealTypeText} - ${roomViewText}`;
    }
  
}
  setFormArraySizeForGroup(formArray: FormArray, size: number) {
    while (formArray.length < size) {
      formArray.push(this.fb.group({
        type: [''],
        price: ['']
      }));
    }
    while (formArray.length > size) {
      formArray.removeAt(formArray.length - 1);
    }
  }

  // initializeDefaultCombination() {
  //   const mealPlans = this.priceData.meal_type.split(',');
  //   const roomViews = this.priceData.room_view.split(',');

  //   const defaultMealType = mealPlans.length > 0 ? mealPlans[0] : '';
  //   const defaultRoomView = roomViews.length > 0 ? roomViews[0] : '';

  //   this.roomPriceForm.patchValue({
  //     meal_type: [defaultMealType], // Set as array since `ng-multiselect-dropdown` expects array
  //     room_view: [defaultRoomView] // Set as array since `ng-multiselect-dropdown` expects array
  //   });
  // }
  onMealSelect(event: any) {
    this.priceDataList ='';
    this.populateOccupancyFields();
    this.getPriceList();
  }

  onMealDeselect(event: any) {
    this.removeFromMealOptions(event);
    this.populateOccupancyFields();
    this.getPriceList();
  }

  onViewSelect(event: any) {
    this.priceDataList = '';
    this.populateOccupancyFields();
    this.getPriceList();
  }

  onViewDeselect(event: any) {
    this.removeFromViewOptions(event);
    this.populateOccupancyFields();
    this.getPriceList();
  }
  removeFromMealOptions(item: any) {
    const currentValues = this.roomPriceForm.get('meal_type').value || [];
    const updatedValues = currentValues.filter((value: any) => value.item_id == item.item_id);
    this.roomPriceForm.get('meal_type').setValue(updatedValues);
  }

  removeFromViewOptions(item: any) {
    const currentValues = this.roomPriceForm.get('room_view').value || [];
    const updatedValues = currentValues.filter((value: any) => value.item_id == item.item_id);
    this.roomPriceForm.get('room_view').setValue(updatedValues);
  }

  formatDates(data, onSubmitPrice) {
    data.forEach((items: any) => {
      items.from_date = moment(items.from_date, ['DD/MM/YYYY', moment.ISO_8601]).format('YYYY-MM-DD');
      items.to_date = onSubmitPrice === 'stopSale' ? moment(items.to_date, ['DD/MM/YYYY', moment.ISO_8601]).subtract(1, 'days').format('YYYY-MM-DD') :moment(items.to_date, ['DD/MM/YYYY', moment.ISO_8601]).format('YYYY-MM-DD');
    });
    return data;
  }
onSubmitPrice(onSubmitPrice?) {
    this.submittedRoomPrice = true;
    if(onSubmitPrice == 'topUpRate'){
    this.roomPriceForm.get('no_of_rooms').setValidators([Validators.required]);
    this.roomPriceForm.get('no_of_rooms').updateValueAndValidity();
    }
    if (this.roomPriceForm.valid) {
        const dt1 = new Date(this.roomPriceForm.value.from_date);
        this.roomPriceForm.value.from_date =  moment(this.roomPriceForm.value.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const dt2 = new Date(this.roomPriceForm.value.to_date);
        this.roomPriceForm.value.to_date =  moment(this.roomPriceForm.value.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const changedValues = {};
        const statusChanged = this.roomPriceForm.value.status !== this.initialValues['status'];
        changedValues['status'] = this.roomPriceForm.value.status !== null ? this.roomPriceForm.value.status : false;
     
        // changedValues['is_refundable'] = this.roomPriceForm.value.is_refundable ? true : false;
        this.roomPriceForm.value.meal_type = this.roomPriceForm.value.meal_type.map(v => v.meals).join(",");  
        this.roomPriceForm.value.room_view = this.roomPriceForm.value.room_view.map(v => v.views).join(",");
        Object.keys(this.roomPriceForm.controls).forEach(key => {
            const control = this.roomPriceForm.get(key);
            if (control.value !== this.initialValues[key]) {
                if ((key === 'from_date' || key === 'to_date') ) {
                    this.dateChanged = true;
                    this.otherFieldsChanged=false;
                  } else if(control.value != null ) {
                    this.otherFieldsChanged = true;
                    //this.dateChanged=false;
                  }
                changedValues[key] = parseInt(control.value);
                // Update the initial value to the current value
                //this.initialValues[key] = control.value;
                // Optionally reset the dirty state
                control.markAsPristine();
            }
        });
        if (this.dateChanged && !this.otherFieldsChanged && statusChanged == true ) {
            this.getPriceList();
          }else if (this.dateChanged && this.otherFieldsChanged || statusChanged == false  ) {
        let data = { ...changedValues };
        try {
                data['from_date']=this.roomPriceForm.value.from_date;
                data['to_date']=this.roomPriceForm.value.to_date;
                data['room_id'] = this.priceData['id'];
                data['meal_type'] = this.roomPriceForm.value.meal_type;
                data['room_view'] = this.roomPriceForm.value.room_view;
                const adultPrice = this.buildExtraPriceObject('adults');
                const childPrice = this.buildExtraPriceObject('children');
                const infantPrice = "0:0";
                if (adultPrice !== "0:0") {
                    data['adult_extra_price'] = adultPrice;
                }
                if (childPrice !== "0:0") {
                    data['child_extra_price'] = childPrice;
                }

                if (infantPrice !== "0:0") {
                    data['infant_extra_price'] = infantPrice;
                }
               
                delete data['adults'];
                delete data['children'];
                delete data['infants'];
                delete data['segments'];
                
                delete data['supplement_type_weekend'];
                delete data['supplement_value_weekend'];

                data['board_type']="";
                if (onSubmitPrice === 'update') {
                  data['non_refundable_discount'] = this.roomPriceForm.value.is_refundable ? this.roomPriceForm.value.non_refundable_discount : 0;
                  data['no_of_rooms'] = this.roomPriceForm.value.no_of_rooms || null;
                  data['minimum_stay'] = this.roomPriceForm.value.minimum_stay || null;
                  data['block_rooms'] = this.roomPriceForm.value.block_rooms || null;
                  data['update_type'] = "editCurrentPrice";
              
                  // Remove keys with null values
                  Object.keys(data).forEach(key => {
                      if (data[key] === null) {
                          delete data[key];
                      }
                  });
              }       
            
                if(onSubmitPrice == 'discount' || onSubmitPrice == 'cancel'){
                  data['date_range_discount'] = this.roomPriceForm.value.date_range_discount || 0;
                  delete data['no_of_rooms']
                }
        
                if(onSubmitPrice == 'cancel' || onSubmitPrice == 'topUpRate' || onSubmitPrice == 'update' || onSubmitPrice == 'discount'){
                  delete data['status'];
                }else{
                  data['status']=this.roomPriceForm.value.status ? true : false
                }
                 if(onSubmitPrice == 'stopSale' || onSubmitPrice == 'topUpRate' || onSubmitPrice == 'cancel' || onSubmitPrice == 'discount' || this.roomPriceForm.value.is_refundable == null){
                  delete data['is_refundable'];
                 } else{
                  data['is_refundable']=this.roomPriceForm.value.is_refundable ? true : false
                 }

                  if( onSubmitPrice == 'stopSale' || onSubmitPrice == 'topUpRate' || onSubmitPrice == 'cancel' || onSubmitPrice == 'discount' ||  this.roomPriceForm.value.rate_type == ''){
                   delete data['rate_type'];
                 } else{
                   data['rate_type']=this.roomPriceForm.value.rate_type == 'package_rate'? 'package_rate' : 'night_rate';
                 }

                 
                 data['supplement_weekend'] = {
                  supplement_type:'absolute',
                  supplement_value: parseInt(this.roomPriceForm.value.supplement_value_weekend) || 0

            }  
              data['early_bird_discount'] = {
                days: this.roomPriceForm.value.days || 0,
                discount_value: this.roomPriceForm.value.discount_value || 0,
                cancellable: this.roomPriceForm.value.early_cancellable ? true :false,
        
          }
        
            data['duration_stay_discount'] = {
              days: this.roomPriceForm.value.days1 || 0,
              discount_value: this.roomPriceForm.value.discount_value1 || 0,
              cancellable: this.roomPriceForm.value.cancellable ?  true :false,
            };
       
          const cancellationPolicy = (this.roomPriceForm.get('segments') as FormArray).controls.map((segment: FormGroup) => ({
            cancellation_type: segment.value.cancellation_type || 'Free',
            date_from: segment.value.date_from || '',
            date_to: segment.value.date_to || '',
            charge: segment.value.charge || 0,
            currency: "",  // Fixed value for currency
            charge_type: segment.value.charge_type || "N/A",
            additional_info: segment.value.additional_info || ''
          }));
            this.roomPriceForm.value.hotel_room_cancellation_policy = cancellationPolicy;  
            //  if(cancellationPolicy[0].charge != 0) {
              if(onSubmitPrice !== 'discount'){
                data['hotel_room_cancellation_policy'] = this.roomPriceForm.value.hotel_room_cancellation_policy
              } 
        //  }
        if (onSubmitPrice === 'openSale' || onSubmitPrice === 'stopSale') {
          delete data['board_type']
          delete data['duration_stay_discount']
          delete data['early_bird_discount']
          delete data['from_date']
          delete data['hotel_room_cancellation_policy']
          delete data['roomPriceCombinations']
          delete data['supplement_weekend']
          delete data['to_date']
          data['room_id'] = this.priceData['id'];
          data['meal_type'] = this.roomPriceForm.value.meal_type;
          data['room_view'] = this.roomPriceForm.value.room_view;
          data['dateRanges'] = onSubmitPrice === 'openSale' ? this.formatDates(this.openSaleForm.value.fieldGroup, onSubmitPrice) : this.formatDates(this.stopSaleForm.value.fieldGroups, onSubmitPrice);
          data['status'] = onSubmitPrice === 'openSale' ?  this.openSaleForm.value.status : this.stopSaleForm.value.status;
          data['saleType'] = onSubmitPrice;
          data['inventory'] = this.roomPriceForm.value.inventory;
        }
        if (onSubmitPrice === 'topUpRate') {
          delete data['board_type']
          delete data['duration_stay_discount']
          delete data['early_bird_discount']
          delete data['hotel_room_cancellation_policy']
          delete data['roomPriceCombinations']
          delete data['supplement_weekend']
        }
        if (onSubmitPrice === 'cancel') {
          delete data['board_type']
          delete data['duration_stay_discount']
          delete data['early_bird_discount']
          delete data['roomPriceCombinations']
          delete data['supplement_weekend']
          delete data['date_range_discount']
        }

        if (onSubmitPrice === 'discount') {
          delete data['board_type']
          delete data['duration_stay_discount']
          delete data['early_bird_discount']
          delete data['roomPriceCombinations']
          delete data['supplement_weekend']
        }
                data = [data];
          
                data['topic'] = 'updatePriceManagement';
            
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);
       this.submitFrom = onSubmitPrice;
this.priceDataPayLoad = data;

let apiCall;

if (onSubmitPrice === 'topUpRate') {
  console.log(data,"data")
  apiCall = this.hotelCrsService.topUpRate(data);
} else {
  apiCall = this.hotelCrsService.update(data);
}

apiCall.subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedPriceDetail = resp['data']
                    this.roomPriceList =true;
                    this.showPriceForm =false;
                    this.getPriceList(onSubmitPrice);
                    this.showStopSale =false;
                    this.showOpenSale = false;
                    this.showTopUp = false;
                    this.showDiscount =false;
                    this.showRoom =false;
                    this.showCancellation =false;
                    this.getSeasonList();
                    this.roomPriceForm.get('no_of_rooms').reset('');
                    this.roomPriceForm.get('no_of_rooms').clearValidators();
                    this.roomPriceForm.get('no_of_rooms').updateValueAndValidity();
                    this.roomPriceForm.get('charge_type').reset('');
                    this.roomPriceForm.get('date_from').reset('');
                    if(resp.data == "No Data Found! Please add the price in Add price management"){
                      this.swalService.alert.oops(resp.data)
                    }else{
                      this.swalService.alert.success("Kindly review your selected range price datas")
                    }
                    
                  

            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.Message);
                this.showOpenSale = false;
                this.showStopSale =false;
            }
            else {
                this.swalService.alert.oops(resp.Message);
                this.showOpenSale = false;
                this.showStopSale =false;
            }
        },err => {
              this.swalService.alert.oops(err.error.Message);
              this.showOpenSale = false;
              this.showStopSale =false;
          })
    }
    }else {
      return;
  }
}
updateAdultExtraPrice(price: any) {
  price.adult_extra_price = this.buildPriceObject('adults', price);
}
buildPriceObject(type: 'adults' | 'children', priceObj: any): string {
  const data = priceObj[type];

  if (typeof data === 'string') {
    // If data is already in the correct string format, return it directly
    return data;
  } else if (Array.isArray(data)) {
    // If data is an array, convert it to the required string format
    return data.map(item => `${item.key}:${item.value}`).join(',');
  } else if (typeof data === 'number') {
    // If data is a number, handle it (though this case might not be relevant for the given fields)
    console.warn(`Expected a string or array, but received a number: ${data}`);
    return `${data}:0`;
  } else {
    console.error(`Unexpected data type: ${typeof data}`);
    return '0:0'; // Default value or error handling
  }
}


// buildExtraPriceObject(fieldName: string): string {
//   // Access the combinationGroup from the form
//   const combinationGroupArray = this.roomPriceForm.get('roomPriceCombinations') as FormArray;

//   // Prepare an array to hold the price strings
//   const priceArray: string[] = [];

//   // Loop through each combinationGroup
//   combinationGroupArray.controls.forEach((combinationGroup: FormGroup, index: number) => {
//       // Access the FormArray for the specific field (e.g., 'adults', 'children', 'infants')
//       const formArray = combinationGroup.get(fieldName) as FormArray;

//       // Check if the formArray is valid
//       if (formArray) {
//           formArray.controls.forEach((control: FormGroup, i: number) => {
//               const price = control.get('price').value || 0;
//               // Push formatted string to priceArray
//               if (price > 0) {
//                   priceArray.push(`${i + 1}:${price}`);
//               }
//           });
//       }
//   });

//   // If no price values were greater than 0, return default value
//   if (priceArray.length === 0) {
//       return "0:0";
//   }

//   // Join array elements with a comma
//   return priceArray.join(',');
// }
buildExtraPriceObject(fieldName: string): string {
  // Access the combinationGroup from the form
  const combinationGroupArray = this.roomPriceForm.get('roomPriceCombinations') as FormArray;

  // Prepare an array to hold the price strings
  const priceArray: string[] = [];

  // Loop through each combinationGroup
  combinationGroupArray.controls.forEach((combinationGroup: FormGroup, index: number) => {
      // Access the FormArray for the specific field (e.g., 'adults', 'children', 'infants')
      const formArray = combinationGroup.get(fieldName) as FormArray;

      // Check if the formArray is valid
      if (formArray) {
          formArray.controls.forEach((control: FormGroup, i: number) => {
              const price = control.get('price').value || 0;

              // If the field is for 'children', handle the dynamic multiplication
              if (fieldName === 'children') {
                if(price > 0){
                  const occupancyChild = this.priceData.occupancy_child || 1; // Default to 1 if undefined

                  // Loop to create the multiplied prices for each child
                  for (let j = 1; j <= occupancyChild; j++) {
                      const multipliedPrice = price * j;
                      priceArray.push(`${j}:${multipliedPrice}`);
                  }
                }
              } else {
                  // For other fields like adults, push price without multiplication
                  if (price > 0) {
                      priceArray.push(`${i + 1}:${price}`);
                  }
              }
          });
      }
  });

  // If no price values were greater than 0, return default value
  if (priceArray.length === 0) {
      return "0:0";
  }

  // Join array elements with a comma
  return priceArray.join(',');
}

toggleInputOne() {
    if (this.showInputOne) {
        this.showInputOne = false;
    } else if (!this.showInputOne) {
        this.showInputOne = true;
    }
}
toggleInputTwo() {
    if (this.showInputTwo) {
        this.showInputTwo = false;
    } else if (!this.showInputTwo) {
        this.showInputTwo = true;
    }
}

toggleChildInput() {
    if (this.showChildInput) {
        this.showChildInput = false;
    } else if (!this.showChildInput) {
        this.showChildInput = true;
    }
}
toggleVAT() {
    if (this.showVat) {
        this.showVat = false;
    } else if (!this.showVat) {
        this.showVat = true;
    }
}
toggleServiceCharge() {
    if (this.showServiceCharge) {
        this.showServiceCharge = false;
    } else if (!this.showServiceCharge) {
        this.showServiceCharge = true;
    }
}
getSeasonList(){
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelSeasonList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.noData = false;
                this.seasonList = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
            }
        }
    )
}

showroom(){
  if (this.roomPriceForm.valid) {
    this.showRoom =true;
  }
}
updateroom(update){
  if (this.roomPriceForm.valid) {
    
    this.onSubmitPrice(update)
  }
}

getPriceList(onSubmitPrice?) {
  let room_id = this.priceData['id'];
if(onSubmitPrice == 'stopSale' || onSubmitPrice == 'topUpRate' ||  onSubmitPrice == 'cancel' || onSubmitPrice == 'discount' || onSubmitPrice == 'openSale'){
  this.roomPriceForm.value.meal_type = this.roomPriceForm.value.meal_type;  
    this.roomPriceForm.value.room_view = this.roomPriceForm.value.room_view;
}else{
  this.roomPriceForm.value.meal_type = this.roomPriceForm.value.meal_type.map(v => v.meals).join(",");  
  this.roomPriceForm.value.room_view = this.roomPriceForm.value.room_view.map(v => v.views).join(",");
}

    
  const data = [{
      room_id: room_id,
      // available_from:  moment(this.roomPriceForm.value.from_date).format("YYYY-MM-DD"),
      // available_to: moment(this.roomPriceForm.value.to_date).format("YYYY-MM-DD"),
      meal_type: this.roomPriceForm.value.meal_type,
      room_view: this.roomPriceForm.value.room_view
  }];
    
  // Add topic to the data object
  data['topic'] = 'priceManagementList';

  // Call the service to fetch data
  this.hotelCrsService.fetch(data).subscribe(
      resp => {
          if (resp.statusCode == 200) {
            let original = resp.data.map(item => ({ ...item }));

            for (let i = 0; i < original.length - 1; i++) {
              if (original[i].status === 1 && original[i + 1].status !== 1) {
                resp.data[i + 1].status = 1;
              }
            }
            this.priceList = resp.data;
            this.priceListData = data;
            const lastPriceList = this.priceList[this.priceList.length - 1] || [];
            const packageRateDates = lastPriceList.rate_type === "package_rate"  ? [lastPriceList.available_to] // Wrap it in an array to maintain consistency
            : '';
              const seasonStartDate =  this.priceList[0].season_date;
              console.log("packageRateDates",packageRateDates)
              let seasonEndDate = packageRateDates  ? packageRateDates[0] : this.priceList[this.priceList.length - 1].season_date;          
              this.roomPriceForm.patchValue({
                from_date:  seasonStartDate ? moment(seasonStartDate).format('DD/MM/YYYY') : '',
                to_date: seasonEndDate ? moment(seasonEndDate).format('DD/MM/YYYY') : '',
              })
              this.setStopSaleDate(seasonStartDate, seasonEndDate);
              this.seOpenSaleDate(seasonStartDate, seasonEndDate);
              this.maxSetDate = seasonEndDate;
              this.maxDate(this.maxSetDate)
              this.initializeDynamicHeaders();
          } else if (resp.statusCode == 404) {
              this.noDataMessage = "No records found";
          }
      },
      error => {
          console.error("Error fetching price list", error);
          this.noDataMessage = "Error fetching price list";
      }
  );

}

seOpenSaleDate(seasonStartDate, seasonEndDate) {
  const fieldArray = this.openSaleForm.get('fieldGroup') as FormArray;
  fieldArray.clear();
    const group = this.fb.group({
      from_date: [seasonStartDate ? moment(seasonStartDate).format('DD/MM/YY') : '', Validators.required  ],
      to_date: [seasonEndDate ? moment(seasonEndDate).format('DD/MM/YYYY') : '', Validators.required  ],
      inventory: [ Validators.required]
    })
    fieldArray.push(group);
 }

setStopSaleDate(seasonStartDate, seasonEndDate) {
  const fieldArray = this.stopSaleForm.get('fieldGroups') as FormArray;
  fieldArray.clear();
    const group = this.fb.group({
      from_date: [seasonStartDate ? moment(seasonStartDate).format('DD/MM/YYYY') : '', Validators.required],
      to_date: [seasonEndDate ? moment(seasonEndDate).format('DD/MM/YYYY') : '', Validators.required],
    })
    fieldArray.push(group);

}
getStatusPriceList(data1,data2) {
  let room_id = this.priceData['id'];   
  const data = [{
      room_id: room_id,
      // available_from:  moment(this.roomPriceForm.value.from_date).format("YYYY-MM-DD"),
      // available_to: moment(this.roomPriceForm.value.to_date).format("YYYY-MM-DD"),
      meal_type: data1,
      room_view: data2
  }];
    
  // Add topic to the data object
  data['topic'] = 'priceManagementList';

  // Call the service to fetch data
  this.hotelCrsService.fetch(data).subscribe(
      resp => {
          if (resp.statusCode == 200) {
              this.priceList = resp.data;
              this.initializeDynamicHeaders();
          } else if (resp.statusCode == 404) {
              this.noDataMessage = "No records found";
          }
      },
      error => {
          console.error("Error fetching price list", error);
          this.noDataMessage = "Error fetching price list";
      }
  );

}
    
goToRoomLists(){
    this.showRoomDetail.emit({rooms:this.priceData,hoteltrigger:'goToRoomDetail'})

}
// goToRoomListss(){
//   this.showRoomDetail.emit({addNewRate:this.editPriceList,hoteltrigger:'goToPrice'})
  

// }
getPriceListEdit(addEdit:string) {
// Get the room_id from priceData
  let room_id = this.priceData['id'];
    this.roomPriceForm.value.meal_type = this.roomPriceForm.value.meal_type.map(v => v.meals).join(",");  
    this.roomPriceForm.value.room_view = this.roomPriceForm.value.room_view.map(v => v.views).join(",");
    
  const data = [{
      room_id: room_id,
      // from_date:  moment(this.roomPriceForm.value.from_date).format("YYYY-MM-DD"),
      // to_date: moment(this.roomPriceForm.value.to_date).format("YYYY-MM-DD"),
      meal_type: this.roomPriceForm.value.meal_type,
      room_view: this.roomPriceForm.value.room_view
  }];
    
  // Add topic to the data object
  data['topic'] = 'priceManagementList';

  // Call the service to fetch data
  this.hotelCrsService.fetch(data).subscribe(
      resp => {
          if (resp.statusCode == 200) {
              this.editPriceList = resp.data;
              const lastPriceList = this.editPriceList[this.editPriceList.length - 1] || [];
              const packageRateDates = lastPriceList.rate_type === "package_rate"  ? [lastPriceList.available_to] // Wrap it in an array to maintain consistency
              : '';
              let seasonEndDate = packageRateDates  ? packageRateDates[0] : this.editPriceList[this.editPriceList.length - 1].season_date;
              if(addEdit == 'add'){
                this.showRoomDetail.emit({addNewRate:seasonEndDate,hoteltrigger:'goToPrice'})
              }else{
                this.showRoomDetail.emit({editData:this.editPriceList,hoteltrigger:'goToPrice'})
              }
          } else if (resp.statusCode == 404) {
              this.noDataMessage = "No records found";
          }
      },
      error => {
          console.error("Error fetching price list", error);
          this.noDataMessage = "Error fetching price list";
      }
  );

}

onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{ id:pricedata['id']}]
            data['topic'] = 'delRoomPrice';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Price has been deleted successfully`);
                        this.getPriceList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
onBackRoom(){
    this.roomPriceList =true;
    this.showPriceForm =false;
}
onSeasonChange(event) {
    let seasonId = event;
    const selectedSeason = this.seasonList.find(season => season.id == seasonId);
    this.selectedSeasonFrom = selectedSeason ? selectedSeason.from_date : '';
    this.selectedSeasonTo = selectedSeason ? selectedSeason.to_date : '';
    const formattedDate1 = moment(this.selectedSeasonFrom).format("MM/DD/YYYY");
    const formattedDate2 = moment(this.selectedSeasonTo).format("MM/DD/YYYY");
    this.roomPriceForm.patchValue({
        from_date: formattedDate1 ||  '',
        to_date:   formattedDate2|| '',
    });
  }

  onPrice(price:any ,stop?:any){
    const formattedDate1 = moment(price.season_date).format("YYYY-MM-DD");
    const formattedDate2 = price.rate_type == 'package_rate' ? moment(price.available_to).format("YYYY-MM-DD") :formattedDate1 ;
    // const updatedChildPriceArray = this.parseExtraPriceStrings(price.child_price);
    // this.updatedChildPriceString = this.buildPriceString(updatedChildPriceArray);
    // const updatedChildPriceArray = this.parseExtraPriceStrings(price.child_price);
    // const childPrices = this.parseExtraPriceStrings(price.child_price);
   
    // const childPrices = this.parseExtraPriceStrings(price.child_price);
   
    const childPrices = this.parseExtraPriceStrings(price.child_price);
    
    // Ensure baseChildPrice is a valid number
    const baseChildPrice = childPrices.length > 0 ? +childPrices[0].value : 0;  // Using `+` to force conversion to number

    if (baseChildPrice === 0) {
        console.warn("No valid child price found, defaulting to 0.");
    }

    // Generate dynamic child prices based on occupancy_child count
    const childCount = this.priceData.occupancy_child || 0; // Get count from occupancy_child
    this.updatedChildPriceString = Array.from({ length: childCount }, (_, index) => {
        const childNumber = index + 1; // Start from 1
        const multipliedValue = baseChildPrice * childNumber; // Calculate the actual multiplied value
        return `${childNumber}:${multipliedValue}`;
    }).join(',');
    let data = {};
    data['from_date']=formattedDate1;
    data['to_date']=formattedDate2;
    data['room_id'] = this.priceData['id'];
    data['no_of_rooms']=price.no_of_rooms;
    data['meal_type']= price.meal_type;
    data['room_view']= price.room_view;
    data['block_rooms']=price.block_rooms ? price.block_rooms : 0;
    data['single_room']=price.single_room;
    data['double_room']=price.double_room;
    data['RO']=price.RO;
    data['HB']=price.HB;
    // data['adult_extra_price']= this.formatExtraPrice(price.adult_extra_price),
    // data['child_extra_price'] =this.formatExtraPrice(price.child_extra_price),
    // data['infant_extra_price'] = this.formatExtraPrice(price.infant_extra_price),
    data['adult_extra_price'] = price.adult_extra_price;;
    data['child_extra_price'] = this.updatedChildPriceString;
    // data['infant_extra_price'] = this.buildExtraPriceObject('infants');
    data['childb']=price.childb;
    data['childwb']=price.childwb;
    data['gst']=price.gst;
    data['service']=price.service;
    data['board_type']="";
    if(stop == 'stopSale'){
      data['status']= price.status ? 0 : 1; 
    }else{
      data['status']= price.status ? 1 : 0;
    }
    data = [data];
    data['topic'] = 'updatePriceManagement'
this.hotelCrsService.update(data).subscribe(resp => {
if (resp.statusCode == 201) {
    this.addedPriceDetail = resp['data']
        this.roomPriceList =true;
        this.showPriceForm =false;
        this.getStatusPriceList(price.meal_type,price.room_view)
        this.getSeasonList();
        if(stop == 'stopSale' ){
            this.swalService.alert.success("Stop Sale updated successfully!")  
        }else{
            this.swalService.alert.success("Price detail updated successfully!")
        }
} else if (resp.statusCode == 400) {
    this.swalService.alert.oops(resp.msg)
}
else {
    this.swalService.alert.oops(resp.msg);
}
})
}
// updatePriceString(price: any, type: 'adult_extra_price' | 'child_extra_price', index: number, newValue: string) {
//   console.log("price",price)
//   // Parse the existing price string to an array of objects
//   let priceObj = this.parseExtraPriceStrings(price[type]);
//   // Update the specific price value
//   priceObj[index].value = newValue;

//   // Rebuild the comma-separated string
//   price[type] = this.buildPriceString(priceObj);
// }

// Utility to parse the price string into an array of objects
// parseExtraPriceStrings(extraPrice: string): Array<{ key: number, value: string }> {
//   if (!extraPrice) return [];
  
//   return extraPrice.split(',').map(item => {
//       let [key, value] = item.split(':');
//       return { key: parseInt(key, 10), value };
//   });
// }
updatePriceString(price: any, type: 'adult_extra_price' | 'child_extra_price', index: number, newValue: string) {
  let priceObj = this.parseExtraPriceStrings(price[type]);

  if (priceObj[index]) {
    priceObj[index].value = newValue;  // Update the specific price value
  }

  price[type] = this.buildPriceString(priceObj);  // Rebuild the price string
}
parseExtraPriceStrings(priceString: string): { key: string, value: string }[] {
  if (!priceString || priceString.trim() === '') {
    return [];  // Return an empty array for invalid or empty input
  }

  return priceString.split(',').map(pair => {
    const [key, value] = pair.split(':');
    return { key: key.trim() || '', value: value.trim() || '0' };  // Default value to '0' if empty
  });
}


// Utility to build the price string from the array of objects
// buildPriceString(priceObj: Array<{ key: number, value: string }>): string {
//   return priceObj.map(item => `${item.key}:${item.value}`).join(',');
// }
// buildchildPriceString(priceObj: Array<{ key: number, value: string }>): string {
//   return priceObj.map(item => `${item.key}:${item.value}`).join(',');
// }
buildPriceString(priceArray: { key: string, value: string }[]): string {
  if (!priceArray || priceArray.length === 0) return '';  // Return empty if no valid prices
  return priceArray.map(pair => `${pair.key}:${pair.value}`).join(',');
}

getAdultLabel(index: number): string {
  const labels = ['Single Adult', 'Double Adult', 'Triple Adult', 'Quadruple Adult', 'Five Adults', 'Six Adults'];
  return labels[index] || 'Adult';
}

numberOnly(event): boolean {
  return this.utility.numberOnly(event);
}

parseExtraPriceString(priceString: string): { [key: string]: number } {

  // if (!priceString || typeof priceString !== 'string' || priceString.trim() === '') {
  //   const count = this.priceData.occupancy_adult || 1; // Default to 1 if undefined
  //   return Object.fromEntries(Array.from({ length: count }, (_, i) => [`${i + 1}`, 0]));
  // }
  const count = parseInt(this.priceData.occupancy_adult, 10) || 1; // Ensure it's a number
  if (!priceString || typeof priceString !== 'string' || priceString.trim() === '') {
    let result: { [key: string]: number } = {};
    for (let i = 1; i <= count; i++) {
      result[i.toString()] = 0;
    }
    return result; // Return { "1": 0, "2": 0, ..., "count": 0 }
  }
  return priceString.split(',').reduce((acc, item) => {
    const [key, value] = item.split(':');
    if (key && value !== undefined) { // Ensure both key and value exist
      acc[key] = +value; // Assign the numeric value or 0 if it's not a valid number
    }
    return acc;
  }, {});
}





getEarlyBirdDiscountValue(price: any, field: string): string {
  return price.early_bird_discount && price.early_bird_discount[field] !== undefined
    ? price.early_bird_discount[field]
    : '0';
}

getDurationStayDiscountValue(price: any, field: string): string {
  if (!price || !price.duration_stay_discount) {
    return '0'; // Default value if duration_stay_discount is undefined or null
  }
  return price.duration_stay_discount[field] || '0';
}


// getFirstChildPrice(childPrice: string): string {
//   if (!childPrice || childPrice.trim() === '') return '0';  // Ensure default '0' for empty or invalid string
//   const firstPrice = childPrice.split(',')[0];  // Get the first price
//   return firstPrice.split(':')[1] || '0';  // Extract and return the value, default to '0'
  
// }
getFirstChildPrice(childPrice: string): string {
  if (!childPrice || childPrice.trim() === '') return '0';  // Return '0' for empty or invalid string
  const firstPrice = childPrice.split(',')[0];  // Get the first price
  const priceValue = firstPrice.split(':')[1];  // Extract the value
  return priceValue || '0';  // Default to '0' if no value found
}

// updateFirstChildPrice(price: any, type: 'child_extra_price', newValue: string) {
//   // Parse the existing price string into an array of key-value pairs
//   let priceArray = this.parseExtraPriceStrings(price.child_price);

//   // Update the first price value
//   if (priceArray.length > 0) {
//     priceArray[0].value = newValue; // Update only the first price
//   }

//   // Rebuild the price string and assign it back
//   price.child_price = this.buildPriceString(priceArray);
// }


// initializeDynamicHeaders() {
//   const maxAdults = this.calculateMaxOccupants('adult_extra_price');
//   const maxChildren = this.calculateMaxOccupants('child_extra_price');
//   // const maxInfants = this.calculateMaxOccupants('infant_extra_price');

//   this.dynamicAdultHeaders = Array.from({ length: maxAdults }, (_, i) => `Adult ${i + 1}`);
//   this.dynamicChildHeaders = Array.from({ length: maxChildren }, (_, i) => `Child ${i + 1}`);
//   // this.dynamicInfantHeaders = Array.from({ length: maxInfants }, (_, i) => `Infant ${i + 1}`);
// }
updateFirstChildPrice(price: any, type: 'child_extra_price', newValue: string) {
  let priceArray = this.parseExtraPriceStrings(price.child_price);

  if (priceArray.length > 0) {
    priceArray[0].value = newValue;  // Update the first price value
  }

  price.child_price = this.buildPriceString(priceArray);  // Rebuild the price string
}

initializeDynamicHeaders(): void {
  this.dynamicAdultHeaders = this.generateHeaders('Adult', 'adult_extra_price');
  this.dynamicChildHeaders = this.generateHeaders('Child', 'child_extra_price');
  // Uncomment if infant headers are required
  // this.dynamicInfantHeaders = this.generateHeaders('Infant', 'infant_extra_price');
}

generateHeaders(label: string, priceType: string): string[] {
  const maxOccupants = this.calculateMaxOccupants(priceType);
  return Array.from({ length: maxOccupants }, (_, i) => `${label} ${i + 1}`);
}


// calculateMaxOccupants(priceType: string): number {
//   if (this.priceList.length === 0) {
//     return 0;
//   }

//   return Math.max(
//     ...this.priceList.map(price => {
//       const prices = price[priceType].split(',');
//       return prices.length;
//     }),
//     0 // Default to 0 if no data
//   );
// }

calculateMaxOccupants(priceType: string): number {
  if (this.priceList.length === 0) {
    return 0;
  }

  return Math.max(
    ...this.priceList.map(price => {
      const priceValue = price[priceType];

      if (!priceValue || typeof priceValue !== 'string') {
        console.warn(`Invalid value for ${priceType}:`, priceValue);
        return 0; 
      }

      return priceValue.split(',').length;
    }),
    0 
  );
}

// onCheckIn(event) {
//   if (event) {
//       const eventDate = new Date(event);
//       eventDate.setDate(eventDate.getDate());
//       this.setMinDate = eventDate;
//       this.maxDate(event);
//   }
// }
// maxDate(event) {
//   const date = new Date(event);
//   date.setDate(date.getDate() + 30);
//   this.setMaxDate = date;
//   this.cdr.detectChanges();
// }
// onCheckIn(event: string) {
//   if (event) {
//     const eventDate = moment(event, 'DD/MM/YYYY').toDate();
//     this.minDate = eventDate;
//     // Set check-out min date as the next day
//     eventDate.setDate(eventDate.getDate() + 1);
//     this.setMinDate = eventDate;
//   }
// }
onCheckIn(event: string) {
  if (event) {
    const today = moment().startOf('day').toDate();
    let eventDate = moment(event, 'DD/MM/YYYY').toDate();

    let eveDate = moment(event, 'DD/MM/YYYY').toDate();
    if (eventDate < today) {
      eventDate = today;
      this.roomPriceForm.get('from_date').setValue(moment(today).format('DD/MM/YYYY'));
    }

    this.minDate = eventDate;
    // Set check-out min date as the next day
    eventDate.setDate(eventDate.getDate() + 1);
    this.setMinDate = eventDate;
    eveDate.setDate(eveDate.getDate());
    this.setStoSaleMinDate = eveDate;
  }
}


maxDate(event: string | Date) {
  const date = moment(event).utcOffset(0, true); // Keep the original date without timezone shift
  this.setMaxDate = date.toDate();
  this.cdr.detectChanges();
}


onStopSale() {
  const dt1 = new Date(this.roomPriceForm.value.from_date);

  const dt2 = new Date(this.roomPriceForm.value.to_date);

  this.stopSaleForm.patchValue({
    from_date: this.roomPriceForm.value.from_date,
    to_date:  this.roomPriceForm.value.to_date,
  });
  this.showStopSale = true;
}

onOpenSale() {
  const dt1 = new Date(this.roomPriceForm.value.from_date);

  const dt2 = new Date(this.roomPriceForm.value.to_date);

  this.openSaleForm.patchValue({
    from_date: this.roomPriceForm.value.from_date,
    to_date:  this.roomPriceForm.value.to_date,
    inventory: this.roomPriceForm.value.inventory
  });
  this.showOpenSale = true;
}

onCancellation() {
  // const dt1 = new Date(this.roomPriceForm.value.from_date);
  // this.roomPriceForm.value.from_date = formatDate(dt1, '');
  // const dt2 = new Date(this.roomPriceForm.value.to_date);
  // this.roomPriceForm.value.to_date = formatDate(dt2, '');
  this.roomPriceForm.patchValue({
    from_date:  this.roomPriceForm.value.from_date  || null,
    to_date:  this.roomPriceForm.value.to_date || null,
  });
  this.showCancellation = true;
}
onTopUp() {
  // const dt1 = new Date(this.roomPriceForm.value.from_date);
  // this.roomPriceForm.value.from_date = formatDate(dt1, '');
  // const dt2 = new Date(this.roomPriceForm.value.to_date);
  // this.roomPriceForm.value.to_date = formatDate(dt2, '');
  this.roomPriceForm.patchValue({
    from_date:  this.roomPriceForm.value.from_date  || '',
    to_date:  this.roomPriceForm.value.to_date || '',
  });
  this.showTopUp = true;
}
onShowDiscount() {
  // const dt1 = new Date(this.roomPriceForm.value.from_date);
  // this.roomPriceForm.value.from_date = formatDate(dt1, '');
  // const dt2 = new Date(this.roomPriceForm.value.to_date);
  // this.roomPriceForm.value.to_date = formatDate(dt2, '');
  this.roomPriceForm.patchValue({
    from_date:  this.roomPriceForm.value.from_date  || '',
    to_date:  this.roomPriceForm.value.to_date || '',
  });
  this.showDiscount = true;
}
onStopSaleClick(){

  // const formattedDate1 = moment(patchData.from_date).format("YYYY-MM-DD");
  // const formattedDate2 = moment(patchData.to_date).format("YYYY-MM-DD");
}
onRefundableChange(event: any) {
  this.isRefundable = event.target.value === 'true';

  // Access the segments form array
  const segmentsArray = this.roomPriceForm.get('segments') as FormArray;

  if (this.isRefundable) {
    this.isPaidCancellation = true; // Show paid cancellation fields when refundable
    segmentsArray.controls.forEach((segment: FormGroup) => {
      // Set required validators for charge and date_from in each segment
   
    });
  } else {
    this.isPaidCancellation = false;
    this.roomPriceForm.patchValue({
      is_refundable: false
    });

    // Clear values and validators for charge and date_from in each segment
    segmentsArray.controls.forEach((segment: FormGroup) => {
      segment.patchValue({
        charge: '',
        date_from: ''
      });
    
    });
  }

  // Update validation status for each control in all segments

}
onRateChange(event: any) {
  this.isRate = event.target.value === 'night_rate';
  if (this.isRate) {
    this.isRateData = true;
   
  }else{
      this.isRateData = false;
      this.earlyData =false;
      this.stayData =false
   
      this.roomPriceForm.patchValue({
        isEarlyRequired: false,
        isStayRequired: false,
        early_cancellable: false,
        cancellable:false,
        isNonRefundable:false,
        supplement_value_weekend:'', 
        no_of_rooms:'',
        minimum_stay:'',
        block_rooms:''
      });
 
  }
}
isStaydata(event: any) {
  const isChecked = event.target.checked;
  if(isChecked){
  this.roomPriceForm.patchValue({ isStayRequired: isChecked ? 1 : 0 });
  this.stayData= true;
  }else{
    this.roomPriceForm.patchValue({ isStayRequired: isChecked ? 1 : 0 ,
      days1: 0,
      discount_value1: 0,
      cancellable:  0,
    });
    this.stayData= false;
  }
}
onEarlyCancellable(event: any) {
  const isChecked = event.target.checked;
  this.roomPriceForm.patchValue({ early_cancellable: isChecked ? 1 : 0 });
}
onCancellable(event: any) {
  const isChecked = event.target.checked;
  this.roomPriceForm.patchValue({ cancellable: isChecked ? 1 : 0 });
}
isNonRefundable(event: any) {
  const isChecked = event.target.checked;
  if(isChecked){
  this.roomPriceForm.patchValue({ isNonRefundable: isChecked ? 1 : 0 });
  this.isNonRefundableData= true;
  }else{
     this.roomPriceForm.patchValue({ isNonRefundable: isChecked ? 1 : 0 ,
      non_refundable_discount:0
});
    this.isNonRefundableData= false;
  }
}
isEarlyBird(event: any) {
  const isChecked = event.target.checked;
  if(isChecked){
  this.roomPriceForm.patchValue({ isEarlyRequired: isChecked ? 1 : 0 });
  this.earlyData= true;
  }else{
    this.roomPriceForm.patchValue({
       isEarlyRequired: isChecked ? 1 : 0 ,
       days: 0,
       discount_value: 0,
       early_cancellable:  0,
    });
 
    this.earlyData= false;
  }
}
get segments(): FormArray {
  return this.roomPriceForm.get('segments') as FormArray;
}
  // Add a new segment to the segments FormArray
  addMoreSegments() {
    this.segments.push(this.createSegment());
  }

  // Remove a segment from the segments FormArray
  removeSegment(index: number) {
    if (this.segments.length > 1) {
      this.segments.removeAt(index);
    }
  }
  isSuppliment(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.roomPriceForm.get('supplement_value_weekend');
  
    if (checked) {
      control.enable();  // Enable input field
    } else {
      control.disable(); // Disable input field
      control.setValue(''); // Optionally clear value when disabled
    }
  
     this.roomPriceForm.patchValue({ supplement_type_weekend: checked });
  }
  delRoomPrice
get hotelRoomSeasonPrice() { return this.roomPriceForm.controls; }
stopSaleFilter() {
  this.stopSale = !this.stopSale;
  const filterData = this.stopSale === true ? this.priceList.filter(data => data.status !== 0) : this.priceListData;
  this.priceList = filterData;
}

fromatDate(date) {
  return moment(date).format('DD/MM/YYYY');
}

}
