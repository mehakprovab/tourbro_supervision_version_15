import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel Type/AddUpdateHotelTypeComponent');
@Component({
  selector: 'app-add-update-children-pollicy',
  templateUrl: './add-update-children-pollicy.component.html',
  styleUrls: ['./add-update-children-pollicy.component.scss']
})
export class AddUpdateChildrenPollicyComponent implements OnInit {

  @Input() hotelTypeOne: object = {};
  @Input() hotelOneData;
  checked: boolean;
  hotelTypeForm: FormGroup;
  submitted: boolean = false;
  noData: boolean;
  hotelType: any;
  accomdationData: boolean = false;
  mealData: boolean = false;
  @Output() someEvent = new EventEmitter<any>();
  respData: any;
  fromAgeArray: number[] = [];
  toAgeArray: number[] = [];
  finalAgeArray: number[] = [];
  mealFromAgeArray: number[] = [];
  mealToAgeArray: number[] = [];
  mealFinalAgeArray: number[] = [];
  constructor(
    private fb: FormBuilder,
    private api: ApiHandlerService,
    private swalService: SwalService,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.fromAgeArray = Array.from({ length: 18 }, (_, i) => i);
    this.mealFromAgeArray = Array.from({ length: 18 }, (_, i) => i);
    this.getMealList();
    setTimeout(() => {  // Ensure form controls are available before calling updates
      this.updatePaidFromAgeOptions();
      this.updateMealPaidFromAgeOptions();
      try {
        if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
          this.patchHotelType();
        }
      } catch (e) { console.log(e); }
    });
  }

  /** Update accommodation dropdowns **/
  updatePaidFromAgeOptions() {
    let selectedFreeAge = Number(this.hotelTypeForm.get('children_free_accom').value) || 0;

    this.toAgeArray = selectedFreeAge >= 17
      ? [17]
      : Array.from({ length: 18 - (selectedFreeAge + 1) }, (_, i) => i + selectedFreeAge + 1);

    this.hotelTypeForm.get('accom_children_from_age').setValue(this.toAgeArray[0]);
    this.updatePaidToAgeOptions();
  }

  updatePaidToAgeOptions() {
    let selectedPaidFromAge = Number(this.hotelTypeForm.get('accom_children_from_age').value) || 0;

    this.finalAgeArray = selectedPaidFromAge >= 17
      ? [17]
      : Array.from({ length: 18 - selectedPaidFromAge }, (_, i) => i + selectedPaidFromAge);

    this.hotelTypeForm.get('accom_children_to_age').setValue(this.finalAgeArray[0]);
  }

  /** Update meal dropdowns **/
  updateMealPaidFromAgeOptions() {
    let selectedFreeAge = Number(this.hotelTypeForm.get('children_free_meals').value) || 0;

    this.mealToAgeArray = selectedFreeAge >= 17
      ? [17]
      : Array.from({ length: 18 - (selectedFreeAge + 1) }, (_, i) => i + selectedFreeAge + 1);

    this.hotelTypeForm.get('meal_children_from_age').setValue(this.mealToAgeArray[0]);
    this.updateMealPaidToAgeOptions();
  }

  updateMealPaidToAgeOptions() {
    let selectedPaidFromAge = Number(this.hotelTypeForm.get('meal_children_from_age').value) || 0;

    this.mealFinalAgeArray = selectedPaidFromAge >= 17
      ? [17]
      : Array.from({ length: 18 - selectedPaidFromAge }, (_, i) => i + selectedPaidFromAge);

    this.hotelTypeForm.get('meal_children_to_age').setValue(this.mealFinalAgeArray[0]);
  }



  hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.hotelTypeForm.controls[controlName].touched) && this.hotelTypeForm.controls[controlName].hasError(errorName));
  }

  numberOnly(event): boolean {
    return this.utilityService.numberOnly(event);
  }

  createForm(): void {
    this.hotelTypeForm = this.fb.group({
      is_accommodation: [false],
      is_meals: [false],
      children_free_accom: [0],
      accom_children_from_age: [0],
      accom_children_to_age: [0],
      accommodation_charge: [0],
      children_free_meals: [0],
      meal_children_from_age: [0],
      meal_children_to_age: [0],
      description: [`<ol>
        <li>To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.</li>
        <li>Minimum check-in age is 18 years old. Children under 18 years can't be accommodated without being accompanied by an adult.</li>
        <li>Some hotels may require extra documents like children's date of birth certificates upon check-in.</li>
        <li>Baby cots and extra beds are based on the hotel policy and availability at the time of arrival and might be extra charged. You need to check with the hotel before.</li>
      </ol>`],
      // breakfast:  [0],
      // lunch:  [0],
      // dinner:  [0],
      // iftar:  [0],
      // sahour:  [0],
      meals: this.fb.array([]),
      discount_type: new FormControl(''),
      discount_value: new FormControl(0),
      status: new FormControl(''),
    });
  }

  get f() { return this.hotelTypeForm.controls; }

  patchHotelType(): void {
    this.hotelTypeForm.patchValue({

      children_free_accom: this.hotelTypeOne['children_free_accom'] || 0,
      accom_children_from_age: this.hotelTypeOne['accom_children_from_age'] || 0,
      accom_children_to_age: this.hotelTypeOne['accom_children_to_age'] || 0,
      accommodation_charge: this.hotelTypeOne['accommodation_charge'] || 0,
      children_free_meals: this.hotelTypeOne['children_free_meals'] || 0,
      meal_children_from_age: this.hotelTypeOne['meal_children_from_age'] || 0,
      meal_children_to_age: this.hotelTypeOne['meal_children_to_age'] || 0,
      // breakfast: this.hotelTypeOne['breakfast'] || 0,
      // lunch:this.hotelTypeOne['lunch'] || 0,
      // dinner:  this.hotelTypeOne['dinner'] || 0,
      // iftar: this.hotelTypeOne['iftar'] || 0,
      // sahour: this.hotelTypeOne['sahour'] || 0,
      description: this.hotelTypeOne['description'] || 0,
      discount_type: this.hotelTypeOne['discount_type'] || 0,
      discount_value: this.hotelTypeOne['discount_value'] || 0,
      status: Number(this.hotelTypeOne['status']) ? 1 : 0,
    })
    if (this.hotelTypeOne['meal_prices'] && this.hotelTypeOne['meal_prices'].length) {
      const mealPrices = this.hotelTypeOne['meal_prices'][0];
      const mealControls = Object.keys(mealPrices).map((mealName) => this.fb.control(mealPrices[mealName] || 0));

      // Clear and set new form controls in FormArray
      this.hotelTypeForm.setControl('meals', this.fb.array(mealControls));
      this.respData = Object.keys(mealPrices).map((mealName) => ({
        meals: mealName,
        value: mealPrices[mealName] || 0,
      }));
    }
    if (this.hotelTypeOne['is_accommodation'] == 1) {
      this.accomdationData = true;
      this.hotelTypeForm.patchValue({
        is_accommodation: true
      })
    } else {
      this.accomdationData = false;
      this.hotelTypeForm.patchValue({
        is_accommodation: false,
      })
    }
    if (this.hotelTypeOne['is_meals'] == 1) {
      this.mealData = true;
      this.hotelTypeForm.patchValue({
        is_meals: true
      })
    } else {
      this.mealData = false;
      this.hotelTypeForm.patchValue({
        is_meals: false,

      })
    }

  }

  resetFrom() {
    this.hotelTypeOne = {};
    this.hotelTypeForm.reset();
  }
  handleValidSubmit() {
    this.submitted = true;
    if (this.hotelTypeForm.invalid) {
      return;
    }
    let data = Object.assign({}, this.hotelTypeForm.value);
    const mealsArray = this.hotelTypeForm.get('meals') as FormArray;

    // Convert respData from a string to an array
    const mealsList = this.hotelOneData.meal_plans.split(',');

    // Initialize an empty object for the meals
    let formattedMeals: { [key: string]: number } = {};

    // Loop through each meal and add it to the formattedMeals object
    mealsList.forEach((meal, index) => {
      formattedMeals[meal.trim()] = mealsArray.at(index).value || 0;
    });

    // Add formatted meals to the data
    data['meal_prices'] = [formattedMeals];

    delete data['meals']
    // let data = Object.assign({}, this.hotelTypeForm.value);
    if (data['status']) {
      data['status'] = 1;
    } else {
      data['status'] = 0;
    }
    try {
      if (!this.utilityService.isEmpty(this.hotelTypeOne)) {
        data['id'] = this.hotelTypeOne['id'];
        data['hotel_code'] = this.hotelOneData.hotel_code;

        data = [data];

        data['topic'] = 'hotelChildrenPolicy';
      }
      else {
        data['hotel_code'] = this.hotelOneData.hotel_code;
        data = [data];
        data['topic'] = 'hotelChildrenPolicy';
      }
    } catch (error) {
      log.debug(error)
    }
    log.debug('data', data);

    this.hotelCrsService.update(data)
      .subscribe(resp => {
        if (resp.statusCode == 201) {
          this.swalService.alert.success('Your data added successfully ..!');
          this.someEvent.next({ tabId: 'list_hotel_types', hotel_type: '' })
          this.hotelTypeForm.reset();
        } else if (resp.statusCode == 400) {
          this.swalService.alert.oops(resp.msg)
        }
        else {
          this.swalService.alert.oops(resp.msg);
        }
      })
  }
  isAccomdationdata(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.hotelTypeForm.patchValue({ is_accommodation: isChecked ? 1 : 0 });
      this.accomdationData = true;
    } else {
      this.hotelTypeForm.patchValue({ is_accommodation: isChecked ? 1 : 0, });
      this.accomdationData = false;
      this.hotelTypeForm.patchValue({
        children_free_accom: 0,
        accom_children_from_age: 0,
        accom_children_to_age: 0,
        accommodation_charge: 0
      });

    }
  }
  isMealdata(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.hotelTypeForm.patchValue({ is_meals: isChecked ? 1 : 0 });
      this.mealData = true;
    } else {
      this.hotelTypeForm.patchValue({ is_meals: isChecked ? 1 : 0 });
      this.mealData = false;
      this.hotelTypeForm.patchValue({
        children_free_meals: 0,
        meal_children_from_age: 0,
        meal_children_to_age: 0,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        iftar: 0,
        sahour: 0
      });

    }
  }
  getMealList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'mealList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
      log.debug(resp);
      if (resp.statusCode == 200) {
        this.noData = false;
        this.respData = resp.data.filter(p => p.status == 1);
        this.addMealControls();
      }
      else if (resp.statusCode == 404) {
        this.noData = true;
        this.swalService.alert.error();
      }
    });
  }
  addMealControls(): void {
    const mealArray = this.hotelTypeForm.get('meals') as FormArray;

    this.respData.forEach(() => {
      mealArray.push(this.fb.control('',));
    });
  }


}
