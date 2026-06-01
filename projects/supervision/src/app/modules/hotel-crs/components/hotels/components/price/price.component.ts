import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('Hotel/AddUpdateHotel');
import { formatDate } from '../../../../../../core/services/format-date';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
    roomPriceForm: FormGroup;
    showPriceList: boolean;
    showPriceForm: boolean;
    addedPriceDetail: any;
    seasonCopy:any =[];
    showInputOne = false;
    showInputTwo = false;
    noDataMessage: string;
    noData: boolean = true;
    isboard:boolean=false;
    isRoom:boolean=false;
    isHalf:boolean=false;
    roomId:object = {};
    boardData:string='';
    submittedRoomPrice: boolean = false;
    @Input() hotelOne;
    @Input() priceData:any;
    @Input() roomsEditData:any;
    @Output() showRoomDetail = new EventEmitter<any>();
    @Output() showPriceData = new EventEmitter<any>();
    @Input() addnewRate:any;
    seasonList: any = [];
    showInputThree = false;
    showChildInput = false;
    showVat = false;
    showServiceCharge = false;
    priceList: any;
    patchdData:any;
    roomPriceList:boolean=true;
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-green'
    };
    isNonRefundableData :boolean = false;
    selectedSeasonFrom: string = '';
    selectedSeasonTo: string = '';
    BoardList = [
        { id: 'RO', name: 'Room Only(RO)',isChecked:false},
        { id: 'BB', name: 'Bed and Breakfast',isChecked:false},
        { id: 'HB', name: 'Half Board(HB)',isChecked:false},
    ];
    initialValues = {};
    isDisabled: boolean = true;
    mealView = [];
  viewList = [];
  filteredMealView = []; // Options for the meal dropdown based on priceData
  filteredViewList = []; 
  dropdownSettingsForHotel = {
    singleSelection: false,
    textField: 'meals',
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    maxHeight: 197,
    itemsShowLimit: 2,
    allowSearchFilter: true,
    enableCheckAll: true, // Ensure this is set to true
  
  };
  dropdownSettingsForview = {
    singleSelection: false,
    textField: 'views',
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect All',
    maxHeight: 197,
    itemsShowLimit: 2,
    allowSearchFilter: true,
    enableCheckAll: true, // Ensure this is enabled
  };
  minDate = new Date();
  setMinDate: any;
  setMaxDate=new Date();
  earlyData:boolean =false;
  stayData:boolean =false;
  showCombination :any;
  patchedData:any;
  isRefundable: boolean = false;
  isRate:boolean= false;
  isPaidCancellation: boolean = false;
  isRateData:boolean =false;
  currencyValue:any;
  selectedCombinations: any[] = [];
  mealSelected: any; 
  roomViewSelected: any; 
  currentCombination: any = null; 
  weekdayPrice:boolean =false;
  mealTypeValueData:any;
  roomViewValueData:any;
  constructor(
    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private cdr:ChangeDetectorRef,
    private utility: UtilityService
  ) { }

  ngOnInit() {
    this.createRoomPriceForm();
    this.loadOptions();
    this.initializeDefaultCombination();
    this.getSeasonList();
    this.hotelCrsService.seasonList.subscribe(res => {
        this.seasonCopy = res;
    });
    this.hotelCrsService.roomId.subscribe(resp => {
        this.roomId=resp
       })
    this.getPriceList()
    if(this.addnewRate){
      this.onClickAddPrice();
    }
//  if(this.roomsEditData){
//   this.onEdit(this.roomsEditData)
//  }
console.log("hotelOne",this.hotelOne)
  }
  createRoomPriceForm() {
    this.roomPriceForm = this.fb.group({
        hotel_room_season_id: ['',],
        from_date: ['',Validators.required],
        to_date: ['',Validators.required],

        no_of_rooms:['', Validators.required],
        minimumStay:['',Validators.required],
        // gst:['', Validators.required],
        RO:[0, Validators.required],
        HB:[0, Validators.required],
        // block_rooms:['', Validators.required],
        // service: ['',Validators.required],
        status: new FormControl(0),
        supplement_type_weekend:[false],
        supplement_value_weekend:[{ value: '', disabled: true }],
        // supplement_type_weekday:[''],
        // supplement_value_weekday:[''],
        week_day:[''],
        weekDayValue:[''],
        isNonRefundable:[''],
        meal_type: new FormControl([],Validators.required), // Initialize as an empty array or appropriate default value
        room_view: new FormControl([],Validators.required), // Initialize as an empty array or a
        non_refundable_discount:[0],
        days:[''],
        discount_value:[''],
        early_cancellable:[''],
        days1:[''],
        discount_value1:[''],
        cancellable:[''],
        isEarlyRequired:[''],
        isStayRequired:[''],
        is_refundable:[false,Validators.required],
        rate_type:['night_rate',Validators.required],
        // date_from:['',Validators.required],
        // currency:[''],
        // charge:['',Validators.required],
        // charge_type:[''],
        // Cancellation_type:[''],
        // additional_info:[''],
        segments: this.fb.array([
          this.createSegment() // Initialize with one segment
        ]),
        roomPriceCombinations: this.fb.array([
            this.createRoomPriceCombination()
        ]),
    },)
}
createSegment(): FormGroup {
  return this.fb.group({
    currency: [''],
    charge: ['', Validators.required],
    charge_type: ['Percentage'],
    cancellation_type: ['Free'],
    additional_info: [''],
    date_from: ['', Validators.required],
    date_to: ['']
  });
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
      if (!this.patchedData ) {
        this.updateMealOptions();
        this.updateViewOptions();
        this.populateOccupancyFields();
      }else{
        this.updateMealOptions();
        this.updateViewOptions();
        this.patchMealAndViewOptions();
      }
    });
  }
  patchMealAndViewOptions() {
    const allMealPlans = new Set();
    const allRoomViews = new Set();
  
    for (let i = 0; i < this.patchedData.prices.length; i++) {
      const price = this.patchedData.prices[i];
      
      const mealPlans = price.meal_type.split(',').filter(Boolean);
      for (let j = 0; j < mealPlans.length; j++) {
        const matchedMeal = this.mealView.find(option => option.meals === mealPlans[j]);
        if (matchedMeal) {
          allMealPlans.add(matchedMeal);
        }
      }
      
      const roomViews = price.room_view.split(',').filter(Boolean);
      for (let k = 0; k < roomViews.length; k++) {
        const matchedView = this.viewList.find(option => option.views === roomViews[k]);
        if (matchedView) {
          allRoomViews.add(matchedView);
        }
      }
    }
  
    // Patch the form controls with arrays of selected objects
    this.roomPriceForm.get('meal_type').patchValue(Array.from(allMealPlans));
    this.roomPriceForm.get('room_view').patchValue(Array.from(allRoomViews));
  }
  

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
    // this.roomPriceForm.get('meal_type').setValue(mealPlans);
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
    });
  }

populateOccupancyFields() {
  // Get selected meal plans and room views from form controls
  const selectedMealPlans = this.roomPriceForm.get('meal_type').value;
  const selectedRoomViews = this.roomPriceForm.get('room_view').value;
  const combinations = this.generateCombinations(selectedMealPlans, selectedRoomViews);

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
    if(this.patchedData ){
      const mealType = combinationGroup.get('meal_type').value;
      const roomView = combinationGroup.get('room_view').value;
      const mealTypeText = mealType.id ? mealType.meals : mealType;  // Adjust the property name as needed
      const roomViewText = roomView.id ? roomView.views : roomView;  // Adjust the property name as needed
  
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
        price: [{value: '0', disabled: true}],
        checkbox: false
      }));
    }
    while (formArray.length > size) {
      formArray.removeAt(formArray.length - 1);
    }
  }

  initializeDefaultCombination() {
    const mealPlans = this.priceData.meal_type.split(',');
    const roomViews = this.priceData.room_view.split(',');

    const defaultMealType = mealPlans.length > 0 ? mealPlans[0] : '';
    const defaultRoomView = roomViews.length > 0 ? roomViews[0] : '';

    this.roomPriceForm.patchValue({
      meal_type: [defaultMealType], // Set as array since `ng-multiselect-dropdown` expects array
      room_view: [defaultRoomView] // Set as array since `ng-multiselect-dropdown` expects array
    });
  }

  buildPricesArray(): any[] {

    const roomPriceCombinations = this.roomPriceForm.get('roomPriceCombinations') as FormArray;
    return roomPriceCombinations.controls.map(combinationGroup => {
      const groupControl = combinationGroup as FormGroup;
      const mealTypeControl = groupControl.get('meal_type');
      const roomViewControl = groupControl.get('room_view');
      if(this.patchedData){
        this.mealTypeValueData = mealTypeControl.value.id ?  this.extractValue(mealTypeControl.value) : (mealTypeControl.value[0]);
        this.roomViewValueData = roomViewControl.value.id ? this.extractValue(roomViewControl.value): (roomViewControl.value[0])
      }
      const mealTypeValue = mealTypeControl ? this.extractValue(mealTypeControl.value) : '';
    const roomViewValue = roomViewControl ? this.extractValue(roomViewControl.value) : '';
      return {
        adult_extra_price: this.buildExtraPriceObject(groupControl, 'adults'),
        child_extra_price: this.buildExtraPriceObject(groupControl, 'children'),
        infant_extra_price: "1:0",
        meal_type : this.patchedData ? this.mealTypeValueData : mealTypeValue,
        room_view : this.patchedData ?  this.roomViewValueData: roomViewValue,
        minimum_stay:this.roomPriceForm.value.minimumStay || 1,
        no_of_rooms:this.roomPriceForm.value.no_of_rooms || 0
      };
    });
  }

  // buildExtraPriceObject(group: FormGroup, type: string): string {
  //   const formArray = group.get(type) as FormArray;

  //   return formArray.controls.map((control, index) => {
  //     const price = control.get('price');
  //     const key = index + 1;
  //     return `${key}:${price.value ? price.value : 0}`;
  //   }).join(',');
  // }
  buildExtraPriceObject(group: FormGroup, type: string): string {
    const formArray = group.get(type) as FormArray;
    if (type === 'children' && this.priceData.occupancy_child === 0 ) {
      return '0:0';
    }
    // For children, calculate dynamically based on occupancyChild
    if (type === 'children') {
      const occupancyChild = this.priceData.occupancy_child || 1; // Default to 1 if undefined
      const childControl = formArray.controls[0]; // Single child in the array
      const price = childControl.get('price');
      const basePrice = price.value ? parseFloat(price.value) : 0;
  
      // Generate the payload for children with multiplication
      return Array.from({ length: occupancyChild }, (_, i) => {
        const multiplier = i + 1;
        const calculatedPrice = basePrice * multiplier;
        return `${multiplier}:${calculatedPrice}`;
      }).join(',');
    }
  
    // Default behavior for other types
    return formArray.controls.map((control, index) => {
      const price = control.get('price');
      const key = index + 1; // 1-based index
      const calculatedPrice = price.value ? parseFloat(price.value) : 0;
      return `${key}:${calculatedPrice}`;
    }).join(',');
  }
  
  

  extractValue(value: any): string {
    if (Array.isArray(value)) {
      // If value is an array, join the array elements into a string
      return value.map(item => item.views || item.meals || '').join(', ');
    } else if (value && typeof value === 'object') {
      // If value is an object, return the string property
      return value.views || value.meals || '';
    } else {
      // Otherwise, return the value directly
      return value || '';
    }
  }
  getArrayOrDefault(value: any): string {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }


getAdultLabel(index: number): string {
    const labels = ['Single Adult', 'Double Adult', 'Triple Adult', 'Quadruple Adult', 'Five Adults', 'Six Adults', 'Seven Adults', 'Eight Adults', 'Nine Adults', 'Ten Adults'];
    return labels[index] || 'Adult';
  }
  
  
  // getInfantLabel(index: number): string {
  //   const labels = ['Single Infant', 'Double Infant', 'Triple Infant', 'Quadruple Infant', 'Five Infants', 'Six Infants'];
  //   return labels[index] || 'Infant';
  // }
  
  get infants(): FormArray {
    return this.roomPriceForm.get('infants') as FormArray;
  }
  onEdit(patchData: any) {
    this.patchedData = patchData;  
    this.dropdownSettingsForHotel = {
        singleSelection: false,
        textField: 'meals',
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
        maxHeight: 197,
        itemsShowLimit: 2,
        allowSearchFilter: true,
        enableCheckAll: true, // Ensure this is set to true
      
      };
     this.dropdownSettingsForview = {
        singleSelection: false,
        textField: 'views',
        selectAllText: 'Select All',
        unSelectAllText: 'Deselect All',
        maxHeight: 197,
        itemsShowLimit: 2,
        allowSearchFilter: true,
        enableCheckAll: true, // Ensure this is enabled
      };
    const formattedDate1 = moment(patchData.from_date).format("DD-MM-YYYY");
    const formattedDate2 = moment(patchData.to_date).format("DD-MM-YYYY");

    // Show form and hide list
    this.showPriceForm = true;
    this.roomPriceList = false;
    this.weekdayPrice = true;
    this.currencyValue =this.hotelOne.currency;
    // Patch basic fields
    this.roomPriceForm.patchValue({
      hotel_room_season_id: patchData['season_id'] || '',
      RO: patchData['RO'] || 0,
      HB: patchData['HB'] || 0,
      no_of_rooms: patchData['no_of_rooms'] || 0,
      from_date: formattedDate1 || '',
      to_date: formattedDate2 || '',
      // status: patchData['status'] ? true : false,
      is_refundable: patchData['is_refundable'] === 1 ? true : false,
      rate_type: patchData.rate_type,
      non_refundable_discount:patchData['non_refundable_discount'] || 0,
       minimumStay: 0,
    });
    if(this.roomPriceForm.value.rate_type == 'night_rate'){
      this.isRateData =true;
    }
    if(this.roomPriceForm.value.is_refundable == true){
      this.isPaidCancellation =true;
    }
    if(this.roomPriceForm.value.rate_type == 'night_rate' && this.roomPriceForm.value.is_refundable == true )
   {
     this.isRateData =true;
     this.isPaidCancellation =true;
  } 
  if (patchData.hotel_room_cancellation_policy && patchData.hotel_room_cancellation_policy.length) {
    // Clear existing segments
    this.segments.clear();

    // Populate the segments array with data from patchData
    patchData.hotel_room_cancellation_policy.forEach((policy: any) => {
      const segmentGroup = this.createSegment();
      segmentGroup.patchValue({
        date_from: policy.date_from || '',
        charge_type: policy.charge_type || '',
        charge: policy.charge || '',
        additional_info: policy.additional_info || ''
      });
      this.segments.push(segmentGroup);
    });
  }
if(patchData.non_refundable_discount)
  {
    this.isNonRefundableData = true;
    this.roomPriceForm.patchValue({
    isNonRefundable: true,
});
}
    const early_bird_discount = patchData.early_bird_discount;
    if(early_bird_discount.days != 0){
      this.earlyData =true;
      this.roomPriceForm.patchValue({
        isEarlyRequired: true,
      });
    }
        this.roomPriceForm.patchValue({
          days: early_bird_discount.days || '',
          discount_value: early_bird_discount.discount_value || '',
          early_cancellable: early_bird_discount.cancellable == true ? 1 : 0,
        });
    const duration_stay_discount = patchData.duration_stay_discount;
    if(duration_stay_discount.days != 0){
      this.stayData =true
      this.roomPriceForm.patchValue({
        isStayRequired: true,
      });
    }
        this.roomPriceForm.patchValue({
          days1: duration_stay_discount.days || '',
          discount_value1: duration_stay_discount.discount_value || '',
          cancellable: duration_stay_discount.cancellable == true ? 1 : 0 ,
        });
        const supplement_weekday = patchData.supplement_weekday;
        this.roomPriceForm.patchValue({
          supplement_type_weekday: supplement_weekday.supplement_type || '',
          supplement_value_weekday: supplement_weekday.supplement_value || '',
        });
        const supplement_weekend = patchData.supplement_weekend;
        if(supplement_weekend.supplement_value){
         
        this.roomPriceForm.patchValue({
          supplement_type_weekend: supplement_weekend.supplement_type || '',
          supplement_value_weekend: supplement_weekend.supplement_value || '',
        });
        this.roomPriceForm.get('supplement_value_weekend').enable();
      }else{
        this.roomPriceForm.get('supplement_value_weekend').disable();
      }
        // patchData.prices.forEach(priceData => {
        //   this.roomPriceForm.patchValue({
        //     meal_type:priceData['meal_type'] || '',
        //     room_view:priceData['room_view'] || '',
        //   });
        // })
    const roomPriceCombinations = this.roomPriceForm.get('roomPriceCombinations') as FormArray;
    roomPriceCombinations.clear(); 
    patchData.prices.forEach(priceData => {
      this.roomPriceForm.patchValue({
        minimumStay: priceData.minimum_stay || '',
        no_of_rooms: priceData.no_of_rooms || '',
      });
      const combinationGroup = this.createRoomPriceCombination();
      combinationGroup.patchValue({
        meal_type: priceData.meal_type.split(',').filter(Boolean),
        room_view: priceData.room_view.split(',').filter(Boolean)
      });
      this.loadOptions();
      const adults = this.createOccupancyFormArray(priceData.adult_extra_price);

      console.log("this.priceData.occupancy_child",this.priceData.occupancy_child)
      if(priceData.child_extra_price !== "0:0" || this.priceData.occupancy_child){
      const children = this.createOccupancyFormArray(priceData.child_extra_price,true);
      combinationGroup.setControl('children', children);
      children.controls.forEach((control: FormGroup, index: number) => {
        const isPriceZero = control.get('price').value === '0';
        const checkbox = document.getElementById(`Child ${index + 1}`) as HTMLInputElement;
  
        if (isPriceZero) {
            control.get('price').disable(); // Disable input if price is 0
           // checkbox.checked = false;       // Uncheck the checkbox
        } else {
            control.get('price').enable();  // Enable input if price is not 0
            //checkbox.checked = true;        // Check the checkbox
        }
    });
      }
      // const infants = this.createOccupancyFormArray(priceData.infant_extra_price);
    
      combinationGroup.setControl('adults', adults);
      // combinationGroup.setControl('children', children); 
      
      // combinationGroup.setControl('children', children);
      // combinationGroup.setControl('infants', infants);
   

      roomPriceCombinations.push(combinationGroup);
      adults.controls.forEach((control: FormGroup, index: number) => {
        const isPriceZero = control.get('price').value === '0';
        const checkbox = document.getElementById(this.getAdultLabel(index)) as HTMLInputElement;

        if (isPriceZero) {
            control.get('price').disable(); // Disable input if price is 0
           // checkbox.checked = false;       // Uncheck the checkbox
        } else {
            control.get('price').enable();  // Enable input if price is not 0
           // checkbox.checked = true;        // Check the checkbox
        }
    });
    

    // Similarly, iterate through children controls
  
});
    if(this.roomPriceForm.value.rate_type == 'package_rate'){
    // this.roomPriceForm.get('no_of_rooms').clearValidators();
    this.roomPriceForm.get('minimumStay').clearValidators();
    // this.roomPriceForm.get('no_of_rooms').updateValueAndValidity();
    this.roomPriceForm.get('minimumStay').updateValueAndValidity();
    }
    if(this.roomPriceForm.value.is_refundable == true){
      this.segments.controls.forEach((segment) => {
        segment.get('charge').setValidators([Validators.required]);
        segment.get('date_from').setValidators([Validators.required]);
        segment.get('charge').updateValueAndValidity();
        segment.get('date_from').updateValueAndValidity();
      });
    }else{
      this.segments.controls.forEach((segment) => {
      segment.get('charge').clearValidators();
      segment.get('date_from').clearValidators();
      segment.get('charge').updateValueAndValidity();
      segment.get('date_from').updateValueAndValidity();
      })
    }
  }
  // private createOccupancyFormArray(occupancyString: string): FormArray {
  //   const occupancyArray = occupancyString.split(',').map(item => {
  //     const [type, price] = item.split(':');
  //     return { type, price };
  //   });

  //   const formArray = this.fb.array([]);
  //   occupancyArray.forEach(occupancy => {
  //     formArray.push(this.fb.group({
  //       type: [occupancy.type || ''],
  //       price: [occupancy.price || '']
  //     }));
  //   });

  //   return formArray;
  // }
  private createOccupancyFormArray(occupancyString: string, isChild: boolean = false): FormArray {
    let occupancyArray = occupancyString.split(',').map(item => {
      const [type, price] = item.split(':');
      return { type, price };
    });
  
    // If it's for children, filter to only include the first item
    if (isChild) {
      occupancyArray = occupancyArray.slice(0, 1);
    }
  
    const formArray = this.fb.array<FormGroup>([]);
    occupancyArray.forEach(occupancy => {
      formArray.push(this.fb.group({
        type: [occupancy.type || ''],
        price: [occupancy.price || '']
      }));
    });
  
    return formArray;
  }

  
  
  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
}

  getAlreadySelectedAmenities(amenities) {
    const amenityIds = amenities.split(',');
    const selectedAmenities = this.filteredMealView.filter(amenity => amenityIds.includes(String(amenity.meals)));
    return selectedAmenities;
}
getAlreadySelectedView(amenities) {
  const amenityIds = amenities.split(',');
  const selectedAmenities = this.filteredViewList.filter(amenity => amenityIds.includes(String(amenity.views)));
  return selectedAmenities;
}

  onClickAddPrice() {

    this.roomPriceList =false;
    this.roomsEditData ='';
    this.roomPriceForm.reset();
    this.roomPriceForm.patchValue({
        RO:0, 
        HB:0,
        single_room:0
    })
      this.showPriceForm = true;
     
      this.roomsEditData ='';
      this.submittedRoomPrice = false;
      this.patchedData ='';
      this.isRateData = false;
      this.isPaidCancellation =false;
      this.weekdayPrice = false;
      this.earlyData =false;
      this.stayData =false;
      this.isNonRefundableData =false;
      this.roomPriceForm.patchValue({
        isEarlyRequired: false,
        isStayRequired: false,
        early_cancellable: false,
        cancellable:false,
        isNonRefundable:false
      });
      this.currencyValue =this.hotelOne.currency;
      this.createRoomPriceForm();
      if(this.addnewRate){
        const formattedDate1 = moment(this.addnewRate.from_date).format("YYYY-MM-DD");
        const formattedDate2 = moment(this.addnewRate.to_date).format("YYYY-MM-DD");
          // this.roomPriceForm.patchValue({
          //   from_date:  formattedDate1 || '',
          //   to_date:  formattedDate2 || '',
          // })
    

            // const seasonStartDate =  packageRateDates.length ? packageRateDates[0] : this.addnewRate[this.addnewRate.length - 1].season_date;;
            const seasonStartDate =  this.addnewRate;
            this.onCheckIn(seasonStartDate);
            this.roomPriceForm.patchValue({
              from_date: moment(seasonStartDate).add(1, 'day').format('DD-MM-YYYY')  || '',
            })
          
            // this.onCheckIn(this.roomPriceForm.value.from_date);
            // this.dateChanges =true
        }
      if(this.roomPriceForm.value.rate_type == 'package_rate'){
      // this.roomPriceForm.get('no_of_rooms').clearValidators();
      this.roomPriceForm.get('minimumStay').clearValidators();
      // this.roomPriceForm.get('no_of_rooms').updateValueAndValidity();
      this.roomPriceForm.get('minimumStay').updateValueAndValidity();
      }
      if(this.roomPriceForm.value.is_refundable == false){
        (this.roomPriceForm.get('segments') as FormArray).controls.forEach((segment: FormGroup) => {
          segment.get('charge').clearValidators();
          segment.get('date_from').clearValidators();
          segment.get('charge').updateValueAndValidity();
          segment.get('date_from').updateValueAndValidity();
        });
      }
}
toggleInputThree() {
    if (this.showInputThree) {
        this.showInputThree = false;
    } else if (!this.showInputThree) {
        this.showInputThree = true;
    }
}
createPriceObject(formArray: FormArray): string {
    const prices: number[] = [];
    for (let i = 0; i < formArray.length; i++) {
        const control = formArray.at(i);
        if (control && control.value && control.value.price !== undefined) {
            prices.push(control.value.price);
        } else {
            prices.push(0);  // Default to 0 if price is missing
        }
    }
    
    return prices.join(',');
}
onMealSelect(event: any) {
    this.populateOccupancyFields();
    this.weekdayPrice = true;
  }

  onMealDeselect(event: any) {
    this.removeFromMealOptions(event);
    this.populateOccupancyFields();
  }
  onMealSelectAll(event: any) {
    this.weekdayPrice = true;
    // Handle the logic for selecting all meals
    const allMeals = event.map((meal: any) => meal); // Assuming 'event' contains the array of all selected meal objects
  this.roomPriceForm.get('meal_type').setValue(allMeals); // Update the form control value with the selected meals
    this.populateOccupancyFields();
}

onMealDeselectAll(event: any) {
    // Handle the logic for deselecting all meals
    this.populateOccupancyFields();
}
  onViewSelect(event: any) {
    this.populateOccupancyFields();
  }

  onViewDeselect(event: any) {
    this.removeFromViewOptions(event);
    this.populateOccupancyFields();
  }
  onViewSelectAll(event: any) {
    // Handle logic for selecting all room views
    const allMeals = event.map((view: any) => view); // Assuming 'event' contains the array of all selected meal objects
  this.roomPriceForm.get('room_view').setValue(allMeals); // Update the form control value with the selec
    this.populateOccupancyFields();
}

onViewDeselectAll(event: any) {

    // Handle logic for deselecting all room views
    this.populateOccupancyFields();
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


  
onSubmitPrice() {
    this.submittedRoomPrice = true;
    if(this.roomPriceForm.invalid) {
  this.logInvalidControls(this.roomPriceForm);
  return;
}
    if (this.roomPriceForm.valid) {
      console.log("this.roomPriceForm.value.from_date",this.roomPriceForm.value.from_date)
        // const dt1 = new Date(this.roomPriceForm.value.from_date);
        this.roomPriceForm.value.from_date = moment(this.roomPriceForm.value.from_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        // console.log("  this.roomPriceForm.value.from_date",  this.roomPriceForm.value.from_date)
        // const dt2 = new Date(this.roomPriceForm.value.to_date);
        this.roomPriceForm.value.to_date =  moment(this.roomPriceForm.value.to_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

        if(this.roomPriceForm.value.refundable === 'false' || this.roomPriceForm.value.refundable == 0 )
        {
            const cancellationPolicy = []
            this.roomPriceForm.value.hotel_room_cancellation_policy = cancellationPolicy;  
        } else{
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
        } 
        let data = Object.assign({}, this.roomPriceForm.value);
        // if (data['status']) {
        //     data['status'] = true;
        // } else {
        //     data['status'] = false;
        // }
       
        if(data['is_refundable']){
          data['is_refundable'] = true;
        } else {
            data['is_refundable'] = false;
        }
        
        data['prices'] = this.buildPricesArray();
        // delete data['adults'];
        // delete data['children'];
        // delete data['infants'];
        delete data['roomPriceCombinations'];
        data['supplement_weekend'] = {
            supplement_type: 'absolute',
            supplement_value: parseInt(this.roomPriceForm.value.supplement_value_weekend) || 0
        };
        data['supplement_weekday'] = {
            supplement_type: 'absolute',
            supplement_value: 0
        };
        data['early_bird_discount'] = {
          days: this.roomPriceForm.value.days || 0,
          discount_value: this.roomPriceForm.value.discount_value || 0,
          cancellable: this.roomPriceForm.value.early_cancellable ? true :false,
      };
      data['duration_stay_discount'] = {
        days: this.roomPriceForm.value.days1 || 0,
        discount_value: this.roomPriceForm.value.discount_value1 || 0,
        cancellable: this.roomPriceForm.value.cancellable ?  true :false,
      };
      delete data['Cancellation_type']
        try {
            if (this.patchedData) {
                data['hotel_room_season_id'] = parseInt(this.priceData.season_id)
                data['price_id'] = this.patchedData['price_id'];
                data['room_id'] = this.priceData['id'];
                data['block_rooms']= 0;
                data['no_of_rooms']=0;
                data = [data];
                data['topic'] = 'updateRoomPrice';
            }
            else {
                data['hotel_room_season_id'] = parseInt(this.roomPriceForm.value.hotel_room_season_id)
                data['room_id'] = this.priceData['id'];
                data['board_type']="";
                data['block_rooms']= 0;
                data['no_of_rooms']=0;
                data = [data];
                data['topic'] = 'addPrice';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);
        this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedPriceDetail = resp['data']
                    this.roomPriceList =true;
                    this.showPriceForm =false;
                    this.addnewRate =''
                    this.getPriceList();
                    this.getSeasonList();
                    this.roomsEditData =''
                    this.submittedRoomPrice=false;
                    if(data['topic'] == 'addPrice'){
                        this.swalService.alert.success("Price detail added successfully!")
                    }else if(data['topic'] == 'updateRoomPrice'){
                        this.roomsEditData =''
                        this.addnewRate=''
                        this.swalService.alert.success("Price detail Updated successfully!")
                    }
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.Message)
            }
            else {
                this.swalService.alert.oops(resp.Message);
            }
        }, err => {
              this.swalService.alert.oops("The selected date range has been chosen in other rate type,kindly choose different date range");
          })
    }
    else {
        return;
    }

}

logInvalidControls(form: FormGroup | FormArray, parentKey: string = '') {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    const controlKey = parentKey ? `${parentKey}.${key}` : key;

    if (control instanceof FormGroup || control instanceof FormArray) {
      this.logInvalidControls(control, controlKey);
    } else {
      if (control && control.invalid) {
        console.log(`Invalid control: ${controlKey}`, control.errors);
      }
    }
  });
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
                this.seasonList = resp.data.filter(p => p.status == 1);
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
            }
        }
    )
}
getPriceList(){
    let room_id = this.priceData['id']
    const data = [{ room_id: room_id, offset: 0, limit: 10 }]
    data['topic'] = 'getPriceList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.noData = false;
                this.priceList = resp.data;
                // this.showRoomDetail.emit({data:this.priceList})
            }
            else if (resp.statusCode == 404) {
                this.noDataMessage = "No records found"
            }
        }
    ) 
}
    
goToRoomLists(){
  this.roomsEditData = '';
  this.showRoomDetail.emit({rooms:this.priceData,hoteltrigger:'goToRoomDetail',data:this.priceList})

}
// onDelete(pricedata){
//     const data = [{ price_id:pricedata['price_id']}]
//     data['topic'] = 'deleteRoomPrice';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             // this.hotelImage = resp.data;
//             this.getPriceList()
//             this.swalService.alert.success("Price detail deleted successfully!")
//         }

//     });
// }
onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{ price_id:pricedata['price_id']}]
            data['topic'] = 'deleteRoomPrice';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201 ) {
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
  this.roomPriceForm.patchValue({supplement_type_weekend :false,supplement_value_weekend : ''});
 
}
onEarlyCancellable(event: any) {
  const isChecked = event.target.checked;
  this.roomPriceForm.patchValue({ early_cancellable: isChecked ? 1 : 0 });
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
onCancellable(event: any) {
  const isChecked = event.target.checked;
  this.roomPriceForm.patchValue({ cancellable: isChecked ? 1 : 0 });
}
// onSeasonChange(event) {
//     console.log("event",event)
//     let seasonId = event;
//     const selectedSeason = this.seasonList.find(season => season.id == seasonId);
//     this.selectedSeasonFrom = selectedSeason ? selectedSeason.from_date : '';
//     this.selectedSeasonTo = selectedSeason ? selectedSeason.to_date : '';
//     console.log("this.selectedSeasonFrom",this.selectedSeasonFrom)
//     console.log("this.selectedSeasonTo",this.selectedSeasonTo)
//     const formattedDate1 = moment(this.selectedSeasonFrom).format("YYYY-MM-DD");
//     console.log("formattedDate1",formattedDate1)
//     const formattedDate2 = moment(this.selectedSeasonTo).format("YYYY-MM-DD");
//     this.roomPriceForm.patchValue({
//         from_date: formattedDate1 ||  '',
//         to_date:   formattedDate2|| '',
//     });
//   }
//   onStatusUpdate(val, index): void {
//     const formattedDate1 = moment(val.from_date).format("YYYY/MM/DD");
//     const formattedDate2 = moment(val.to_date).format("YYYY/MM/DD");
//     console.log("val",val)
//     let data = Object.assign({},);
//     data['id']=val['id']
//     data['hotel_room_season_id'] = parseInt(this.patchdData.season_id)
//     data['price_id'] = this.patchdData['price_id'];
//     data['room_id'] = this.priceData['id'];
//     data['form_date']=formattedDate1;
//     data['to_date']=formattedDate2;
//     data['single_room']=val['single_room']
//     data['double_room'] =val['double_room']
//     data['adult_extra_price']=val['adult_extra_price']
//     data['childwb']=val['childwb']
//     data['childb']=val['childb']
//     data['no_of_rooms']=val['no_of_rooms']
//     data['gst']=val['gst']
//     data['RO']=val['RO']
//     data['HB']=val['HB']
//     data['block_rooms']=val['block_rooms']
//     data['service']=val['service']
//     data['status']= val['status'] ? false : true;
//     data = [data];
//     data['topic'] = 'updateRoomPrice';
//             this.hotelCrsService.update(data).subscribe(resp => {
//                 if (resp.statusCode == 200) {
//                     this.getSeasonList();
//                     this.swalService.alert.update();
//                 }
//                 else
//                     this.swalService.alert.oops();
//             })
//   }
onCheckIn(event) {
  if (event) {
      //  const eventDate = new Date(event);
       const eventDate = moment(event, 'DD-MM-YYYY').toDate(); 
      console.log("eventDate",eventDate)
      eventDate.setDate(eventDate.getDate() + 1);
      this.setMinDate = eventDate;
      this.maxDate(event);
  }
}
maxDate(event) {
  const date = new Date(event);
  date.setDate(date.getDate() + 30);
  this.setMaxDate = date;
  this.cdr.detectChanges();
}
// onRefundableChange(event: any) {
//   this.isRefundable = event.target.value === 'true';
//   if (this.isRefundable) {
//     this.isPaidCancellation = true; // Reset paid cancellation visibility if not refundable
//     this.roomPriceForm.get('charge').setValidators([Validators.required]);;
//     this.roomPriceForm.get('date_from').setValidators([Validators.required]);
//   }else{
//       this.isPaidCancellation = false;
//       this.roomPriceForm.patchValue({
//         charge:'',
//         date_from:'',
//         is_refundable :false
//       });
//       this.roomPriceForm.get('charge').clearValidators();
//       this.roomPriceForm.get('date_from').clearValidators();
//   }
//   this.roomPriceForm.get('charge').updateValueAndValidity();
//   this.roomPriceForm.get('date_from').updateValueAndValidity();
// }
onRefundableChange(event: any) {
  this.isRefundable = event.target.value === 'true';

  // Access the segments form array
  const segmentsArray = this.roomPriceForm.get('segments') as FormArray;

  if (this.isRefundable) {
    this.isPaidCancellation = true; // Show paid cancellation fields when refundable
    segmentsArray.controls.forEach((segment: FormGroup) => {
      // Set required validators for charge and date_from in each segment
      segment.get('charge').setValidators([Validators.required]);
      segment.get('date_from').setValidators([Validators.required]);
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
      segment.get('charge').clearValidators();
      segment.get('date_from').clearValidators();
    });
  }

  // Update validation status for each control in all segments
  segmentsArray.controls.forEach((segment: FormGroup) => {
    segment.get('charge').updateValueAndValidity();
    segment.get('date_from').updateValueAndValidity();
  });
}

onRateChange(event: any) {
  this.isRate = event.target.value === 'night_rate';
  if (this.isRate) {
    this.isRateData = true;
    this.roomPriceForm.get('no_of_rooms').setValidators([Validators.required]);
    this.roomPriceForm.get('minimumStay').setValidators([Validators.required]);
  }else{
      this.isRateData = false;
      this.earlyData =false;
      this.stayData =false
      // this.roomPriceForm.get('no_of_rooms').clearValidators();
      this.roomPriceForm.get('minimumStay').clearValidators();
      this.roomPriceForm.patchValue({
        isEarlyRequired: false,
        isStayRequired: false,
        early_cancellable: false,
        cancellable:false,
        isNonRefundable:false,
        supplement_value_weekend:'', 
        no_of_rooms:'',
        minimumStay: ''
      });
  // this.roomPriceForm.get('no_of_rooms').updateValueAndValidity();
  this.roomPriceForm.get('minimumStay').updateValueAndValidity();
  }
}
onCancellationTypeChange(event: any) {
  this.isPaidCancellation = event.target.value === 'Paid';

}
getCommaSeparatedValues(type: string): string {
  return this.priceList.prices.map(item => item[type]).join(', ');
}

toggleField(controlGroup: FormGroup, event: Event) {
  const checkbox = (event.target as HTMLInputElement).checked;

  if (checkbox) {
    controlGroup.get('price').enable();  // Enable the input field
  } else {
    controlGroup.get('price').disable(); // Disable the input field
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


get hotelRoomSeasonPrice() { return this.roomPriceForm.controls; }

}
