import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivityCrsService } from '../../../activity-crs.service';
import { Router } from '@angular/router';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment.prod';

const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-add-activity-crs',
  templateUrl: './add-activity-crs.component.html',
  styleUrls: ['./add-activity-crs.component.scss']
})
export class AddActivityCRSComponent implements OnInit {

  @Output() someEvent = new EventEmitter<any>();
  public countryList: any[] = [];
  public cityList: any[] = [];
  public currencyList: any[] = [];
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;

  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-green'
  };
  public isOpen = false as boolean;
  public minDate = new Date();
  public submittedVehicle: boolean = false;
  public submitted: boolean = false;
  public imageFile: any;
  public submitBasicInfo: boolean = false;

  public basicInfoForm: FormGroup;
  public childPolicyForm: FormGroup;
  public seasonPricingForm: FormGroup;
  public inclusionExclusionForm: FormGroup;
  public termsConditionForm: FormGroup;

  public activityTypeListData: any;
  public dropdownSettingsForview = {};
  public dropdownSettingsForviewTiming = {};
  public times: string[] = [
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
    '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
    '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
    '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
  ];
  public timingList: { key: string, value: string }[] = [];
  public fromAgeRange = Array.from({ length: 15 }, (_, index) => index + 3);
  public fromChildAgeRange = Array.from({ length: 18 }, (_, index) => index);
  public bannerImage: any;
  public activityLangListData: any;
  public dropdownSettingsForviewLang = {};
  public insertedActivityId: any;
  submittedHotel: boolean;
  public languageMasterDataList: any[] = [];
  public loggedInUser: any;
  public updateBasicInformationForm: FormGroup;
  public showUpdateForm: boolean = false;
  public bannerImagename: any;
  public galleryImages: any;
  public updatedActivityCountryId: any;
  public updatedActivityCityId: any;
  public endMinDate = new Date();
  public galleryImage: any;
  public submitIncludesExcludes: boolean = false;
  public submitTermsCondition: boolean = false;
  public activity_id: any;
  public activityDurationType: any[] = [
    {type: 'Hours'},
    {type: 'Days'}
  ]

  public basicInfoSaved: boolean = false;
  public priceSectionSaved: boolean = false;
  public includesExcludesSaved: boolean = false;
  public termsConditionsSave: boolean = false;
  public bannerImageSaved: boolean = false;
  public gallaryImageSaved: boolean = false;
  public editList: any;

  constructor(
    private apiHandlerServices: ApiHandlerService,
    private fb: FormBuilder,
    private activityCrsService: ActivityCrsService,
    private router: Router,
    private swalService: SwalService
  ) { }
syncChildInclusionAcrossSeasons(seasonIndex: number) {
  const currentSeason = this.seasonsPricingForm.at(seasonIndex);
  const isChildIncluded = currentSeason.get('is_child_included').value;
  
  // Only sync from the first season (index 0)
  if (seasonIndex === 0) {
    for (let i = 1; i < this.seasonsPricingForm.length; i++) {
      const otherSeason = this.seasonsPricingForm.at(i);
      const otherIsChildIncluded = otherSeason.get('is_child_included');
      
      // Update all other seasons to match the first season
      if (otherIsChildIncluded.value !== isChildIncluded) {
        otherIsChildIncluded.setValue(isChildIncluded, { emitEvent: false });
        
        // If enabling child inclusion, set up validators and form arrays
        if (isChildIncluded === true) {
          this.onCheckboxChange({ target: { value: true } }, true, i);
        } else {
          // If disabling child inclusion, clear validators and values
          this.onCheckboxChange({ target: { value: false } }, false, i);
        }
      }
    }
  }
}
  ngOnInit(): void {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.loggedInUser = JSON.parse(currentDomainUser);
    this.timingList = this.times.map(t => ({ key: t, value: t }));
    this.dropdownSettingsForviewTiming = {
      singleSelection: false,
      idField: 'key',
      textField: 'value',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.dropdownSettingsForview = {
            singleSelection: false,
            idField: 'id',
            textField: 'activity_type_name',
            maxHeight: 197,
            itemsShowLimit: 2,
          };
          
    this.dropdownSettingsForviewLang = {
      singleSelection: false,
      idField: 'id',
      textField: 'activity_language_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };
    this.createBasicInfoForm();
    this.createIncluExcluForm();
    this.createSeasonPriceForm();
    this.createTermConditionForm();
    this.getTypeList();
    this.getActivityCountryList();
    this.getLanguageList();
    this.getUpdateData();
  }


getUpdateData() {
  this.activityCrsService.getActivityUpdateData.subscribe((data) => {
    console.log(data);
    this.editList = data;
    if (Object.keys(data).length) {
      this.showUpdateForm = true;
      this.insertedActivityId = data.activity_id;
      this.updateBasicInfoForm();
      this.updatedActivityCountryId = data.Activity_country_id;
      this.updatedActivityCityId = data.Activity_city_id;
      this.updateBasicInformationForm.patchValue({
        activity_name: data.activity_name,
        activity_duration: data.activity_duration,
        activity_duration_type: data.activity_duration_type,
        timing: data.timing.split(','),
        country: data.Activity_country_id,
        city: data.Activity_city_id,
        pick_up_location: data.pickup_location,
        drop_off_location: data.dropoff_location,
        terms_conditions: (data.terms_conditions),
        excludes:(data.excludes),
        includes: (data.includes),
        activity_id: data.activity_id
      })

      this.bannerImagename = data.banner_image? JSON.parse(data.banner_image)[0] : '';
      this.galleryImages = data.gallery ? data.gallery : '';

      if(data.seasons.length) {
        const seasonArray = this.seasonPricingForm.get('seasonPricing') as FormArray;
        seasonArray.clear(); // Clear existing form array before patching
        this.seasonMinDates = [];
        this.endMinDates = [];

        data.seasons.forEach((season, idx) => {
          console.log(season,"season")
          const seasonGroup = this.fb.group({
            season_id: season.season_id,
            StartDate: [new Date(season.start_date), Validators.required],
            EndDate: [new Date(season.end_date), Validators.required],
            Adultprice: [season.adult_price, Validators.required],
            is_child_included: [{ 
      value: season.is_child_included == 1, 
      disabled: idx !== 0  // Disable for all except first season
    }],
            pricing: this.fb.array([]),
            cancellationPolicies: this.fb.array([]),
          });

          // ✅ Patch Child Policies
          const childArray = seasonGroup.get('pricing') as FormArray;
          
          // CRITICAL FIX: Always add at least one child policy if is_child_included is true
          if (season.is_child_included == 1) {
            if (season.childPolicies && season.childPolicies.length > 0) {
              season.childPolicies.forEach((child) => {
                childArray.push(
                  this.fb.group({
                    id: [child.id],
                    ChildPrice: [child.child_price, Validators.required],
                    childFromAge: [Number(child.child_charge_from), Validators.required],
                    ChildbeforeAge: [Number(child.child_charge_till), Validators.required],
                  })
                );
              });
            } else {
              // Add an empty child policy form if none exist
              childArray.push(this.createChildPolicy());
              // Set validators for the empty form
              const emptyGroup = childArray.at(0);
              emptyGroup.get('childFromAge').setValidators([Validators.required]);
              emptyGroup.get('ChildbeforeAge').setValidators([Validators.required]);
              emptyGroup.get('ChildPrice').setValidators([Validators.required]);
              emptyGroup.updateValueAndValidity();
            }
          }

          // ✅ Patch Cancellation Policies
          const cancelArray = seasonGroup.get('cancellationPolicies') as FormArray;
          if(season.cancellationPolicies && season.cancellationPolicies.length)  {
            season.cancellationPolicies.forEach((policy) => {
              cancelArray.push(
                this.fb.group({
                  id: [policy.id],
                  chargeType: [policy.charge_type, Validators.required],
                  is_refundable: [policy.refund_type === 'Refundable' ? true : false, Validators.required],
                  chargeAmount: [policy.refund_amount, Validators.required],
                  refundablebeforedays: [policy.cancellation_days, Validators.required],
                })
              );
            });
          } else {
            // Add default refund policy if none exist
            cancelArray.push(this.createRefundPolicy());
          }

          // Set min dates
          if (idx === 0) {
            this.seasonMinDates.push(this.minDate);
          } else {
            const prevEnd = seasonArray.at(idx - 1).get('EndDate').value;
            this.seasonMinDates.push(prevEnd ? new Date(prevEnd) : this.minDate);
          }
          this.endMinDates.push(this.minDate);

          seasonArray.push(seasonGroup);
        });
      } else {
        this.addSeasonPricing();
      }
    }
  })
}

  updateBasicInfoForm() {
    this.updateBasicInformationForm = this.fb.group({
      activity_name: ['', Validators.required],
      activity_type: ['', Validators.required],
      activity_duration: ['', Validators.required],
      activity_duration_type: ['', Validators.required],
      languages: ['', Validators.required],
      timing: ['', Validators.required],
      country: ['101', Validators.required],
      city: ['', Validators.required],
      pick_up_location: ['', Validators.required],
      drop_off_location: ['', Validators.required],
      excludes: ['', Validators.required],
      includes: ['', Validators.required],
      terms_conditions: ['', Validators.required],
      activity_id: ['']
    })
  }
  getLanguageList() {
    this.apiHandlerServices.apiHandler('activityLanguageList', 'POST', {}, {}, {}).subscribe({
      next: (res) => {
        console.log(res);
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
          this.languageMasterDataList = res.data.filter((lang) => lang.status === 1);
          console.log(this.languageMasterDataList);
          if (this.editList && this.editList.languages_name && Array.isArray(this.editList.languages_name)) {
            
          const selectedLanguages = this.editList.languages_name
        .map((name: string) =>
          this.languageMasterDataList.find(item => item.activity_language_name === name)
        )
        .filter(x => x);
         this.updateBasicInformationForm.patchValue({
          languages: selectedLanguages,
         })
          }
        } else {
          this.languageMasterDataList = [];
        }
      }, error: (err) => {
        this.languageMasterDataList = [];
      }
    })
  }


  createBasicInfoForm() {
    this.basicInfoForm = this.fb.group({
      activity_name: ['', Validators.required],
      type: ['', Validators.required],
      activity_duration_type: ['', Validators.required],
      activity_duration: ['', Validators.required],
      operated_lang: ['', Validators.required],
      timing: ['', Validators.required],
      country: ["101", Validators.required],
      city: ['', Validators.required],
      pick_up_location: ['', Validators.required],
      drop_off_location: ['', Validators.required]
    })
  }

  onSubmitBasicInfo() {
    // const req = this.basicInfoForm.value;
    if (!this.basicInfoForm.valid) {
      this.basicInfoForm.markAllAsTouched();
      return;
    }
    this.submitBasicInfo = true;
    this.loading = true;
    const bodyReq = {
      "activity_name": this.basicInfoForm.value.activity_name,
      "activity_type": this.basicInfoForm.value.type.map(data => data.id),
      "activity_duration": this.basicInfoForm.value.activity_duration,
      "languages": this.basicInfoForm.value.operated_lang.map(data => data.id),
      "timing": this.basicInfoForm.value.timing.map(data => data.value),
      "activity_country": Number(this.basicInfoForm.value.country),
      "activity_city": Number(this.basicInfoForm.value.city),
      "pickup_location": this.basicInfoForm.value.pick_up_location,
      "dropoff_location": this.basicInfoForm.value.drop_off_location,
      "activity_duration_type": this.basicInfoForm.value.activity_duration_type
    }
    this.apiHandlerServices.apiHandler('addActivityCRS', 'POST', {}, {}, bodyReq).subscribe({
      next: (res) => {

        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.loading = false;
          this.submitBasicInfo = false;
          this.insertedActivityId = res.data.insertedId;
          this.basicInfoSaved = true;
          this.swalService.alert.success(res.Message);
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
        console.log(res)
      }, error: (err) => {
        this.loading = false;
        console.log(err);
        this.swalService.alert.error();
      }
    })
  }

  resetBasicInfoForm() {
    this.basicInfoForm.reset();
    this.router.navigate(['/activity/activity-crs'], {
      state: { tab: 'list_activitycrs_list' }
    });
  }

  createSeasonPriceForm() {
    this.seasonPricingForm = this.fb.group({
      activity_id: [''],
      seasonPricing: this.fb.array([])
    });

    this.addSeasonPricing();
  }

  get seasonsPricingForm(): FormArray {
    return this.seasonPricingForm.get('seasonPricing') as FormArray;
  }
  seasonMinDates: Date[] = [];
  endMinDates: Date[] = [];

 addSeasonPricing() {
  let isFirstSeasonChildIncluded = false;
  if (this.seasonsPricingForm.length > 0) {
    const firstSeason = this.seasonsPricingForm.at(0);
    isFirstSeasonChildIncluded = firstSeason.get('is_child_included').value;
  }
  
  const seasonGroup = this.fb.group({
    season_id: [''],
    StartDate: ['', Validators.required],
    EndDate: ['', Validators.required],
    Adultprice: ['', Validators.required],
    is_child_included: [{ value: isFirstSeasonChildIncluded, disabled: this.seasonsPricingForm.length > 0 }],
    pricing: this.fb.array([]),
    cancellationPolicies: this.fb.array([])
  });

  // Add child policy only if is_child_included is true
  if (isFirstSeasonChildIncluded) {
    const childArray = seasonGroup.get('pricing') as FormArray;
    childArray.push(this.createChildPolicy());
    
    // Set validators for the child policy
    const childGroup = childArray.at(0);
    childGroup.get('childFromAge').setValidators([Validators.required]);
    childGroup.get('ChildbeforeAge').setValidators([Validators.required]);
    childGroup.get('ChildPrice').setValidators([Validators.required]);
  }
  
  (seasonGroup.get('cancellationPolicies') as FormArray).push(this.createRefundPolicy());

  const lastIndex = this.seasonsPricingForm.length - 1;
  if (lastIndex >= 0) {
    const prevEnd = this.seasonsPricingForm.at(lastIndex).get('EndDate').value;
    const nextDay = prevEnd ? new Date(new Date(prevEnd).getTime() + 24 * 60 * 60 * 1000) : this.minDate;
    this.seasonMinDates.push(nextDay);
  } else {
    this.seasonMinDates.push(this.minDate);
  }

  this.endMinDates.push(this.minDate);
  this.seasonsPricingForm.push(seasonGroup);
}

  onStartDateChange(event: Date, seasonIndex: number) {
    this.endMinDates[seasonIndex] = new Date(event);
    const season = this.seasonsPricingForm.at(seasonIndex);
    const endDateCtrl = season.get('EndDate');
    if (endDateCtrl.value && new Date(endDateCtrl.value) < event) {
      endDateCtrl.setValue('');
    }
  }

  onEndDateChange(event: Date, seasonIndex: number) {
    const nextIndex = seasonIndex + 1;
    if (nextIndex < this.seasonsPricingForm.length) {
      this.seasonMinDates[nextIndex] = new Date(event);
    }
  }

  createRefundPolicy(): FormGroup {
    return this.fb.group({
      id:[''],
      is_refundable: [false],
      refundablebeforedays: [''],
      chargeAmount: [''],
      chargeType: ['Percent']
    });
  }

  createChildPolicy(): FormGroup {
    return this.fb.group({
      id:[''],
      childFromAge: [''],
      ChildbeforeAge: [''],
      ChildPrice: ['']
    });
  }

  removeSeasonPricing(index) {
    this.seasonsPricingForm.removeAt(index);
  }

  resetseasonPricingForm() {
    this.seasonPricingForm.reset();
  }


  getRefundPolicies(seasonIndex: number): FormArray {
    return (this.seasonsPricingForm.at(seasonIndex).get('cancellationPolicies') as FormArray);
  }

  // ✅ Get child pricing per season
  getChildPolicies(seasonIndex: number): FormArray {
    return (this.seasonsPricingForm.at(seasonIndex).get('pricing') as FormArray);
  }

  addChildPolicies(seasonIndex: number) {
    const pricingArray = this.getChildPolicies(seasonIndex);
    pricingArray.push(this.createChildPolicy());
  }

  removeChildPolicies(seasonIndex: number, policyIndex: number) {
    const pricingArray = this.getChildPolicies(seasonIndex);
    pricingArray.removeAt(policyIndex);
  }

  // ✅ Add/remove refund policies
  addRefundPolicies(seasonIndex: number) {
    const refundArray = this.getRefundPolicies(seasonIndex);
    refundArray.push(this.createRefundPolicy());
  }

  removeRefundPolicies(seasonIndex: number, policyIndex: number) {
    const refundArray = this.getRefundPolicies(seasonIndex);
    refundArray.removeAt(policyIndex);
  }


onCheckboxChange(event, check, seasonIndex) {
  // Check if the control is disabled
  const season = this.seasonsPricingForm.at(seasonIndex);
  const isChildIncludedControl = season.get('is_child_included');
  
  // If the control is disabled, don't allow changes
  if (isChildIncludedControl.disabled) {
    console.log('Child inclusion cannot be changed for this season');
    return;
  }
  
  const isChildIncluded = check === 'true' || check === true;
  const pricingArray = this.getChildPolicies(seasonIndex);
  
  console.log('Checkbox changed:', { isChildIncluded, seasonIndex, currentPricingLength: pricingArray.length });

  if (isChildIncluded) {
    // If switching to Yes, ensure we have at least one child policy form group
    if (pricingArray.length === 0) {
      console.log('Adding child policy form array');
      this.addChildPolicies(seasonIndex);
    }
    
    // Set validators for all existing child policies
    pricingArray.controls.forEach((group: FormGroup, index) => {
      const childFromAge = group.get('childFromAge');
      const childbeforeAge = group.get('ChildbeforeAge');
      const childPrice = group.get('ChildPrice');
      
      childFromAge.setValidators([Validators.required]);
      childbeforeAge.setValidators([Validators.required]);
      childPrice.setValidators([Validators.required]);
      
      childFromAge.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      childbeforeAge.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      childPrice.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      
      console.log(`Set validators for child policy ${index}`);
    });
  } else {
    // If switching to No, clear validators and values
    pricingArray.controls.forEach((group: FormGroup, index) => {
      const childFromAge = group.get('childFromAge');
      const childbeforeAge = group.get('ChildbeforeAge');
      const childPrice = group.get('ChildPrice');
      
      childFromAge.clearValidators();
      childbeforeAge.clearValidators();
      childPrice.clearValidators();
      childFromAge.setValue('');
      childbeforeAge.setValue('');
      childPrice.setValue('');
      childFromAge.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      childbeforeAge.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      childPrice.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      
      console.log(`Cleared validators for child policy ${index}`);
    });
  }

  // Force update the form validity
  this.seasonPricingForm.updateValueAndValidity();
  
  // Trigger change detection for the view
  setTimeout(() => {
    this.seasonPricingForm.updateValueAndValidity();
  }, 0);
  
  // Call the sync method only if it's the first season
  if (seasonIndex === 0) {
    this.syncChildInclusionAcrossSeasons(seasonIndex);
  }
}

  onRefundableChange(event: any, isRefundable: boolean, seasonIndex: number, policyIndex: number) {
    const refundArray = this.getRefundPolicies(seasonIndex);
    const policyGroup = refundArray.at(policyIndex) as FormGroup;

    const beforeDaysControl = policyGroup.get('refundablebeforedays');
    const chargeAmountControl = policyGroup.get('chargeAmount');

    if (isRefundable) {
      beforeDaysControl.setValidators([Validators.required, Validators.min(1)]);
      chargeAmountControl.setValidators([Validators.required, Validators.min(1)]);
    } else {
      beforeDaysControl.clearValidators();
      chargeAmountControl.clearValidators();
      beforeDaysControl.setValue('');
      chargeAmountControl.setValue('');
    }

    beforeDaysControl.updateValueAndValidity();
    chargeAmountControl.updateValueAndValidity();
  }

  onSubmitSeasonPricing() {
    this.seasonPricingForm.patchValue({
      activity_id: this.insertedActivityId
    })
    const req = this.seasonPricingForm.value;
    if (!this.seasonPricingForm.valid) {
      return;
    }
    this.loading = true;
    this.apiHandlerServices.apiHandler('addSeasonPricing', 'POST', {}, {}, req).subscribe({
      next: (res) => {
        console.log(res)
        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.loading = false;
          this.priceSectionSaved = true;
          this.swalService.alert.success('Season Pricing Added Successfully');
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
      }, error: (err) => {
        this.loading = false;
        this.swalService.alert.error(err.Message);
        console.log(err);
      }
    })
  }
// Add this method to check if child inclusion radio should be disabled for a season
isChildInclusionDisabled(seasonIndex: number): boolean {
  // Disable for all seasons except the first one (index 0)
  return seasonIndex !== 0;
}
  createIncluExcluForm() {
    this.inclusionExclusionForm = this.fb.group({
      activity_id: [''],
      includes: ['', Validators.required],
      excludes: ['', Validators.required]
    })
  }

  onSubmitIncluExclu() {
    this.inclusionExclusionForm.patchValue({
      activity_id: this.insertedActivityId
    })
    const req = this.inclusionExclusionForm.value;
    this.submitIncludesExcludes = true;
    if (!this.inclusionExclusionForm.valid) {
      return;
    }
    this.loading = true;
    this.apiHandlerServices.apiHandler('addIncludesExcludes', 'POST', {}, {}, req).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.loading = false;
          this.submitIncludesExcludes = false;
          this.includesExcludesSaved = true;
          this.swalService.alert.success('Includes and Excludes Added Successfully');
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
        console.log(res)
      }, error: (err) => {
        this.loading = false;
        this.swalService.alert.oops(err.Message);
        console.log(err);
      }
    })
  }
  resetExcludeIncludeForm() {
    this.inclusionExclusionForm.reset();
  }

  createTermConditionForm() {
    this.termsConditionForm = this.fb.group({
      activity_id: [''],
      terms_conditions: ['', Validators.required]
    })
  }

  onSubmitTremCondition() {
    this.termsConditionForm.patchValue({
      activity_id: this.insertedActivityId
    })
    const req = this.termsConditionForm.value;
    this.submitTermsCondition = true;
    if (!this.termsConditionForm.valid) {
      return;
    }
    this.loading = true;
    this.apiHandlerServices.apiHandler('addTermsandConditions', 'POST', {}, {}, req).subscribe({
      next: (res) => {

        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.loading = false;
          this.submitTermsCondition = false;
          this.termsConditionsSave = true;
          this.swalService.alert.success('Terms & Conditions Added Successfully');
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
        console.log(res)
      }, error: (err) => {
        this.loading = false;
        this.swalService.alert.error(err.Message);
        console.log(err);
      }
    })
  }

  resetTermsConditionForm() {
    this.termsConditionForm.reset();
  }

  getTypeList() {
    this.loading = true;
    this.apiHandlerServices.apiHandler('activityTypeList', 'POST', {}, {}, {}).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
          this.loading = false;
          this.activityTypeListData = res.data.filter(data => data.status === 1);

          console.log(this.languageMasterDataList)
          if(this.editList && this.editList.activity_types_name && Array.isArray(this.editList.activity_types_name)) {
            const selectedTypes = this.editList.activity_types_name
            .map((name: string) =>
              this.activityTypeListData.find(item => item.activity_type_name === name)
            )
            .filter(x => x);

            this.updateBasicInformationForm.patchValue({
              activity_type: selectedTypes,
            })
          }
        } else {
          this.loading = false;
          this.swalService.alert.oops(res.Message);
        }
      }, error: (err) => {
        this.loading = false;
        this.swalService.alert.error(err.Message);
        this.activityTypeListData = [];
      }
    })
  }

  get f() {
    return {}
  }

  onImageSelect(event: any) {
    const file: File = event.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    if (file && allowedTypes.includes(file.type)) {
      this.bannerImage = file;
      this.uploadBannerImage();

    } else {
      event.target.value = ''; // Reset file input
    }
  }

  uploadBannerImage() {
    const req = new FormData();
    req.append('BannerImage', this.bannerImage);
    req.append('activity_id', this.insertedActivityId);
    this.loading = true;
    this.apiHandlerServices.apiHandler('addBannerImage', 'POST', {}, {}, req).subscribe({
      next: (res) => {
        console.log(res);
        this.swalService.alert.success(res.Message);
        this.bannerImageSaved = true;
        this.loading = false;
      }, error: (err) => {
        this.swalService.alert.error(err.Message);
        console.log(err);
        this.loading = false;
      }
    })
  }

  onGallerySelect(event: any) {
    const files: FileList = event.target.files;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    if (files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (allowedTypes.includes(files[i].type)) {
          validFiles.push(files[i]);
        }
      }

      if (validFiles.length === 0) {
        this.swalService.alert.oops("Only JPG, JPEG and PNG formats are allowed.");
        event.target.value = ''; // Reset file input
        return;
      }
      // this.bannerImage = file;
      // const req = new FormData();
      // req.append('Gallery', validFiles);
      this.galleryImage = validFiles;
      this.uploadGalleryImages();

    } else {
      event.target.value = ''; // Reset file input
    }
  }

  uploadGalleryImages() {
    const formData = new FormData();
    for (let i = 0; i < this.galleryImage.length; i++) {
      formData.append('Gallery', this.galleryImage[i]);
    }
    formData.append('activity_id', this.insertedActivityId);
    this.loading = true;
    this.apiHandlerServices.apiHandler('addGalleryImage', 'POST', {}, {}, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.gallaryImageSaved = true;
        this.swalService.alert.success(res.Message);
        this.loading = false;
      }, error: (err) => {
        console.log(err);
        this.swalService.alert.error(err.Message);
        this.loading = false;
      }
    })
  }

  getActivityCountryList() {
    this.apiHandlerServices.apiHandler('getMasterCountryList', 'POST', {}, {}, {}).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
             this.countryList = res.data.data.countries;
          console.log(this.countryList,"this.countryList")
          this.getActivityCityList(101);
          if (this.showUpdateForm) {
            const event = {
              target: {
                value: String(this.updatedActivityCountryId)
              }
            }


            this.getActivityCityList(101);
          }

        } else {
          this.countryList = [];
        }
      }, error: (err) => {
        this.countryList = [];
      }
    })
  }

getActivityCityList(country: any) {
  console.log(country,"country")
  let selectedCountry;
  if (typeof country === 'number' || typeof country === 'string') {
    selectedCountry = this.countryList.find(c => c.id == country);
  } else if (country && country.id) {
    selectedCountry = country;
  }

  if (!selectedCountry) return;

  const req = { id: selectedCountry.id };

  this.apiHandlerServices.apiHandler('getMasterCityList', 'POST', {}, {}, req).subscribe({
    next: (res) => {
      if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
        this.cityList = res.data.data;
        console.log('City List:', this.cityList);
      } else {
        this.cityList = [];
      }
    },
    error: (err) => {
      this.cityList = [];
    }
  });
}
backToListPage() {
  this.showUpdateForm = false;
  this.activityCrsService.getActivityUpdateData.next({});
  this.router.navigate(['/activity/activity-crs'])
  this.router.navigate(['/activity/activity-crs'], { queryParams: { tab: 'list_activitycrs_list' }});
}

  backToList() {
    if(this.bannerImageSaved && this.gallaryImageSaved && this.basicInfoSaved && this.termsConditionsSave && this.priceSectionSaved && this.includesExcludesSaved) {
      this.router.navigate(['/activity/activity-crs'])
          this.router.navigate(['/activity/activity-crs'], { queryParams: { tab: 'list_activitycrs_list' }});
    } else {
      let errorSection;
      if (!this.bannerImageSaved) {
        errorSection = 'Please add Banner Image';
      }
      if (!this.gallaryImageSaved) {
        errorSection = 'Please add Gallary Image';
      }
      if (!this.basicInfoSaved) {
        errorSection = 'Please add Basic Information';
      }
      if (!this.termsConditionsSave) {
        errorSection = 'Please add Terms & Conditions';
      }
      if (!this.priceSectionSaved) {
        errorSection = 'Please add Season Pricing';
      }
      if (!this.includesExcludesSaved) {
        errorSection = 'Please add Inclusions and Exclusions';
      }

      this.swalService.alert.oops(`${errorSection}`)
    }
  }

  resetChildPolicyForm() {

  }

  onSubmitUpdateBasicInfo() {
    this.loading = true;
    this.updateBasicInformationForm.patchValue({
      city: Number(this.updateBasicInformationForm.value.city),
      languages: this.updateBasicInformationForm.value.languages.map(data =>
        typeof data === 'object' ? data.id : data ),
      activity_type: this.updateBasicInformationForm.value.activity_type.map(data => 
        typeof data === 'object' ? data.id : data),
      timing: this.updateBasicInformationForm.value.timing.map(data => typeof data === 'object' ? data.value : data
        )
    })
     const formValue = this.updateBasicInformationForm.value;

  const payLoad = {
    ...formValue,
    activity_city: formValue.city,
    activity_country: formValue.country,
    pickup_location:formValue.pick_up_location,
    dropoff_location:formValue.drop_off_location,
  };

  // Optional: remove old keys
  delete payLoad.city;
  delete payLoad.country;
   delete payLoad.pick_up_location;
  delete payLoad.drop_off_location;

    this.apiHandlerServices.apiHandler('updateActivity', 'POST', {}, {}, payLoad).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.loading = false;
          this.router.navigate(['/activity/activity-crs'], {
            state: { tab: 'list_activitycrs_list' }
          });
        } else {
          this.swalService.alert.oops(res.Message)
          this.loading = false;
        }

      }, error: (err) => {
        this.swalService.alert.oops(err.error.Message)
        this.loading = false;
      }
    })
  }

  getImage() {
    return `${baseUrl + '/tour/tours/getBannerImage/' + this.bannerImagename}`;
  }
  getGalleryImage(imageName: string) {
    return `${baseUrl + '/tour/tours/getGalleryImages/' + imageName}`;
  }

  onStartDateSelect(event) {
    this.endMinDate = new Date(event);
  }


  onUpdateSeasonPricing() {
    this.loading = true;
    this.seasonPricingForm.patchValue({
      activity_id: this.insertedActivityId,
    });
    const payLoad = this.seasonPricingForm.value;
    this.apiHandlerServices.apiHandler('updateSeasonPricing', 'POST', {}, {}, payLoad).subscribe({
      next: (res) => {
        if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
          this.swalService.alert.success(res.Message);
          this.loading = false;
        } else {
          this.swalService.alert.oops(res.Message);
          this.loading = false;
        }

      }, error: (err) => {
        this.swalService.alert.error(err.error.Message);
        this.loading = false;
      }
    })
  }
telephoneNumberValidation(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // block non-numeric characters
  }
}
}
