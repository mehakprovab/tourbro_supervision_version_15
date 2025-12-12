import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../environments/environment.prod';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
environment

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-update-tour-package',
  templateUrl: './update-tour-package.component.html',
  styleUrls: ['./update-tour-package.component.scss']
})
export class UpdateTourPackageComponent implements OnInit {

  @Output() staticContentTab = new EventEmitter<any>();
  activitiesList: Array<any> = [];
  selectedtActivity: Array<any> = [];
  regionData: Array<any> = [];
  themeList: Array<any> = [];
  selectedTheme: Array<any> = [];
  countryList: Array<any> = [];
  cityList: Array<any> = [];
  tourUpdateForm: FormGroup;
  selectedCity: Array<any> = [];
  finalSelectedCountry = {};
  finalSelectedCity: any = [];
  selectedCheckboxes = [];
  ckeditorContent = "Some Text";
  addOrUpdate;
  private subSunk = new SubSink();
  tourId: number;
  preFilledUpdateData: any;
  bannerImagename: string;
  galleryImageName: string;
  tourDuration: string = '9Days|8Nights'
  bannerImage;
  gallery: any[] = [];
  video;
  logoConfig: FormGroup;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };

  // //Object structure to hold continent information to send to api after grouping all information on creat tour click button
  finalSelectedContinent = {
    "id": 0,
    "name": '',
    "status": 0
  };

  inclusions = ['Hotel', 'Meals', 'Sightseeing', 'Transfer'];
  galleryImageList: any = [];
  minDate: Date = new Date(); // Prevent past dates for 'startDate'
  minExpireDate: Date = new Date(); 
  galleryImages: any;
  public currentUser: any;
  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.currentUser = JSON.parse(currentDomainUser);
    this.getThemeListData();
    this.getActivitiesDataList();
    this.createUpdateForm();
    this.logoConfig = this.fb.group({
      banner_logo: [''],
      gallery_image: [[]]
    })
    this.route.queryParams.subscribe((data) => {
      if (data) {
        console.log(data);
        this.tourId = data['tourId']
      }
    })

    this.tourUpdateForm.get('startDate').valueChanges.subscribe((startDate) => {
      if (startDate) {
        // this.tourUpdateForm.get('expirayDate').setValue(null); // Reset if needed
        this.minExpireDate = new Date(startDate); // To Date must be after From Date
      }
    });
  
    setTimeout(() => {
      this.getUpdateTourData();
    },500);
    this.cdRef.detectChanges();
  }

  createUpdateForm() {
    this.tourUpdateForm = this.fb.group({
      tourId: new FormControl(''),
      tourName: new FormControl('', [Validators.required]),
      tourDescription: new FormControl(''),
      tourType: new FormControl(''),
      startDate: new FormControl('', [Validators.required]),
      expirayDate: new FormControl('', [Validators.required]),
      supplierName: new FormControl(''),
      duration: new FormControl(''),
      region: new FormControl(''),
      highlights: new FormControl(''),
      inclusions: new FormControl(''),
      exclusions: new FormControl(''),
      termsConditions: new FormControl(''),
      OptionalTours: this.fb.array([]),
      MeetingPoint: new FormControl('')
      // cancellationPolicy: this.fb.array([]),
      // tripNotes: new FormControl(''),
    });
    // this.addCancellationPolicies();
    // this.addOptionalTours()
  }

  get optionalToursPrices(): FormArray {
    return this.tourUpdateForm.get('OptionalTours') as FormArray;
  }

  addOptionalTours() {
    if (this.preFilledUpdateData[0].optional_tours) {
      const tours = JSON.parse(this.preFilledUpdateData[0].optional_tours);
      const indexVal = Math.max(...tours.map((t: any) => t.id || 0))
    
      const addTours = this.fb.group({
        name: [''],
        id:[indexVal+1],
        duration: [''],
        price: ['']
      });
      this.optionalToursPrices.push(addTours);
    } else {
      const addTours = this.fb.group({
        name: [''],
        id:[],
        duration: [''],
        price: ['']
      });
      this.optionalToursPrices.push(addTours);
    }
     
  }

  removeOptionalTours(index) {
    this.optionalToursPrices.removeAt(index)
  }

   get cancellationPolicies() :FormArray {
          return this.tourUpdateForm.get('cancellationPolicy') as FormArray;
      }
  
      addCancellationPolicies() {
          const policies = this.fb.group({
              charge_type: ['Percentage'],
              charge: [''],
              additional_info: [''],
              date_from: [''],
          })
          this.cancellationPolicies.push(policies);
      }
  
      removeCancellationPolicies(index) {
          this.cancellationPolicies.removeAt(index);
      }


  getUpdateTourData() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('getToursById', 'post', {}, {}, {
      "Id": Number(this.tourId)
    }) //getToursById
      .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          this.preFilledUpdateData = response.data || [];
          this.getImagetoShow(this.preFilledUpdateData[0]['banner_image']);
          this.getGalleryImagetoShow(this.preFilledUpdateData[0]['gallery']);
          this.fillFormField();
          this.getGalleryImages();
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  getGalleryImages() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('toursImageList', 'post', {}, {}, {
      "tour_id": Number(this.tourId)
    }) //getToursById
      .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          this.galleryImages = response.data || [];
        
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  getImagetoShow(imageName: any) {
    this.bannerImagename = imageName;
  }

  getImage() {
    return `${baseUrl + '/tour/tours/getBannerImage/' + this.bannerImagename}`;
  }
  getGalleryImage(imageName: string) {
    return `${baseUrl + '/tour/tours/getGalleryImages/' + imageName}`;
  }

  getGalleryImagetoShow(inputGalleryImageName: any) {
    if (inputGalleryImageName !== null && inputGalleryImageName !== undefined) {
      this.galleryImageList = inputGalleryImageName.split(',');
    } else {
      this.galleryImageList = [];
    }
  }



  fillFormField() {
    const data = this.preFilledUpdateData[0];
    if (data) {
      this.tourUpdateForm.get('tourId').patchValue(data['id']);
      this.tourUpdateForm.get('tourName').patchValue(data['package_name']);
      this.tourUpdateForm.get('tourDescription').patchValue(data['package_description']);
      this.tourUpdateForm.get('supplierName').patchValue(data['supplier_name']);
      this.tourUpdateForm.get('tourType').patchValue(data['module_type']);
      this.tourUpdateForm.get('startDate').patchValue(
        data['start_date'] ? this.formatDateForPicker(data['start_date']) : null
      );
      
      this.tourUpdateForm.get('expirayDate').patchValue(
        data['expire_date'] ? this.formatDateForPicker(data['expire_date']) : null
      );      
      // this.tourUpdateForm.get('startDate').patchValue(data['start_date']  ? data['start_date'].substr(0, 10) : null);
      // this.tourUpdateForm.get('expirayDate').patchValue(data['expire_date'] ? data['expire_date'].substr(0, 10) : null);
      this.tourUpdateForm.get('duration').patchValue(data['duration']);
      this.tourUpdateForm.get('region').patchValue(data['tours_continent']);
      this.tourUpdateForm.get('highlights').patchValue(data['highlights']);
      this.tourUpdateForm.get('inclusions').patchValue(data['inclusions']);
      this.tourUpdateForm.get('exclusions').patchValue(data['exclusions']);
      this.tourUpdateForm.get('termsConditions').patchValue(data['terms']);
      // this.tourUpdateForm.get('optionalTours').patchValue(data['optional_tours']);
      this.tourUpdateForm.get('MeetingPoint').patchValue(data['meeting_point']);
      // this.tourUpdateForm.get('cancellationPolicy').patchValue(data['canc_policy']);
      // this.tourUpdateForm.get('tripNotes').patchValue(data['trip_notes']);
      this.selectedCheckboxes = data['inclusions_checks'] ? data['inclusions_checks'].split(',') : [];
    }
    if(data['optional_tours']) {
      this.optionalToursPrices.clear();
      const optionalPriceList = JSON.parse(data['optional_tours']);
      optionalPriceList.forEach((data) => {
        const optionalPrice = this.fb.group({
          id: data.id,
          name: data.name,
          duration: data.duration,
          price: data.price
        });
        this.optionalToursPrices.push(optionalPrice)
      })
    } else {
      this.addOptionalTours();
    }
    // if(data['canc_policy']) {
    //   this.cancellationPolicies.clear();
    //   const cancPolicy = JSON.parse(data['canc_policy']);
    //   cancPolicy.forEach((policy) => {
    //     const policyGroup = this.fb.group({
    //       charge_type: [policy.charge_type || 'Percentage'],
    //       charge: [policy.charge || ''],
    //       additional_info: [policy.additional_info || ''],
    //       date_from: [policy.date_from],
    //     });

    //     this.cancellationPolicies.push(policyGroup);
    //   });
    // }
    let theme = data.theme.split(',');
    let activity = data.tour_type.split(',');
    let activityWithId = activity.map((item) => {
      return { id: item.trim() };
    });
    let themesWithId = theme.map((item) => {
      return { id: item.trim() };
    });
    themesWithId.forEach(themeItem => {
      let matchedTheme = this.themeList.filter(item => item.id == themeItem.id);
      if (matchedTheme.length > 0) {
        this.selectTheme(matchedTheme[0]);
        this.cdRef.detectChanges();
      }
    });
    activityWithId.forEach(activityItem => {
      let matchedActivity = this.activitiesList.filter(item => item.id == activityItem.id);
      if (matchedActivity.length > 0) {
        this.selectActivity(matchedActivity[0]);
      }
    });
    this.cdRef.detectChanges();
  }

  formatDateForPicker(dateString: string): Date {
    if (!dateString) return null;
    const [year, month, day] = dateString.substr(0, 10).split('-');
    return new Date(+year, +month - 1, +day); // Month index starts from 0
  }
  

  getThemeListData() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourThemeList', 'post', {}, {}, {})
      .subscribe(async response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          this.themeList = await response.data || [];
          this.cdRef.detectChanges();
        }
      });
  }

  getActivitiesDataList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourActivityList', 'post', {}, {}, {})
      .subscribe(response => {
        if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
          this.activitiesList = response.data || [];
        }
      });
  }

  selectActivity(selectedAcivity: string) {
    selectedAcivity['status'] = parseInt(selectedAcivity['status']);
    this.selectedtActivity.push(selectedAcivity)
    let getIndexOfSelectedActivity = this.activitiesList.indexOf(selectedAcivity);
    if (getIndexOfSelectedActivity > -1) {
      this.activitiesList.splice(getIndexOfSelectedActivity, 1);
    }
  }

  deSelectActivity(deSelectedAcivity: string) {
    let getIndexOfDeselectedActivity = this.selectedtActivity.indexOf(deSelectedAcivity);
    if (getIndexOfDeselectedActivity > -1) {
      this.activitiesList.push(this.selectedtActivity[getIndexOfDeselectedActivity]);
      this.selectedtActivity.splice(getIndexOfDeselectedActivity, 1);
    }
  }

  updatedTheme(id) {
    // Check if id is provided and is a valid value
    if (id && typeof id === 'number') {
      // Extracting themes from data
      const data = this.preFilledUpdateData[0];
      const themes = data.data.map(item => item.theme.split(',').map(Number)).flat();

      // Initialize array to store matching themes
      const separateArray = [];

      // Matching themes and copying separately
      themes.forEach(theme => {
        if (this.themeList.some(themeItem => themeItem.id === theme)) {
          separateArray.push(theme);
        }
      });

      return separateArray;
    } else {
      // Handle invalid id
      console.error('Invalid id provided');
      return [];
    }
  }


  selectTheme(selectedTheme: string) {
    selectedTheme['status'] = parseInt(selectedTheme['status']);
    this.selectedTheme.push(selectedTheme)
    let getIndexOfSelectedTheme = this.themeList.indexOf(selectedTheme);
    if (getIndexOfSelectedTheme > -1) {
      this.themeList.splice(getIndexOfSelectedTheme, 1);
    }
    this.cdRef.detectChanges();
  }

  upadteTheme(selectedTheme: string) {
    // selectedTheme['status']=parseInt(selectedTheme['status']);
    this.selectedTheme.push(selectedTheme)
    let getIndexOfSelectedTheme = this.themeList.indexOf(selectedTheme);
    if (getIndexOfSelectedTheme > -1) {
      this.themeList.splice(getIndexOfSelectedTheme, 1);
    }
  }


  deSelectTheme(deSelectedtheme: string) {
    let getIndexOfDeseelectedTheme = this.selectedTheme.indexOf(deSelectedtheme);
    if (getIndexOfDeseelectedTheme > -1) {
      this.themeList.push(this.selectedTheme[getIndexOfDeseelectedTheme]);
      this.selectedTheme.splice(getIndexOfDeseelectedTheme, 1);
    }
  }

  onUpdateTour() {
    if (this.tourUpdateForm.valid) {
      //api call to save bannerImage
      if (this.logoConfig.get('banner_logo').value) {
        this.addImageApiCall();
      }

      //api call to save gallery
      // if (this.logoConfig.get('gallery_image').value) {
      //   this.addGalleryImageApiCall();
      // }
      const startDate = new Date(this.tourUpdateForm.get('startDate').value);
      const expiryDate = new Date(this.tourUpdateForm.get('expirayDate').value);
      
      // Adjust for local timezone
      const formattedStartDate = startDate.getFullYear() + '-' +
        String(startDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(startDate.getDate()).padStart(2, '0');
      
      const formattedExpiryDate = expiryDate.getFullYear() + '-' +
        String(expiryDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(expiryDate.getDate()).padStart(2, '0');
      const updateTourData = {
        "Id": Number(this.tourId),
        "TourName": this.tourUpdateForm.get('tourName').value,
        "TourDescription": this.tourUpdateForm.get('tourDescription').value,
        "TourType": this.tourUpdateForm.get('tourType').value,
        "StartDate": formattedStartDate,
        "ExpiryDate": formattedExpiryDate,
        "SupplierName": this.tourUpdateForm.get('supplierName').value,
        "Theme": this.selectedTheme,
        "Activity": this.selectedtActivity,
        "Highlights": this.tourUpdateForm.get('highlights').value ? this.tourUpdateForm.get('highlights').value.replace(/\n$/, '') : '',
        "Inclusions": this.tourUpdateForm.get('inclusions').value ? this.tourUpdateForm.get('inclusions').value.replace(/\n$/, '').replace(/\n$/, '') : '',
        "Exclusions": this.tourUpdateForm.get('exclusions').value ? this.tourUpdateForm.get('exclusions').value.replace(/\n$/, '') : '',
        "Terms": this.tourUpdateForm.get('termsConditions').value ? this.tourUpdateForm.get('termsConditions').value.replace(/\n$/, '') : '',
        "OptionalTours": this.tourUpdateForm.get('OptionalTours').value.map((item, index) => ({
        ...item,id: index+1
      })),
        "MeetingPoint": this.tourUpdateForm.get('MeetingPoint').value,
        // "CancPolicy": this.tourUpdateForm.get('cancellationPolicy').value,
        // "TripNotes": this.tourUpdateForm.get('tripNotes').value ? this.tourUpdateForm.get('tripNotes').value.replace(/\n$/, '') : '',
        "inclusionsChecks": this.selectedCheckboxes
      }

      setTimeout(()=>{
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateTour', 'post', {}, {},
        updateTourData
      ).subscribe(response => {
        if ((response.statusCode == 200 || response.statusCode == 201) && response.Status) {
          this.swalService.alert.success("Tour has been updated successfully");
          this.router.navigate(['/tour-crs/tour-list']);
        }
      }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
      },1000);
    }
  }

  addImageApiCall() {
    const formData = new FormData();
    formData.append('Id', this.tourId.toString());
    formData.append('BannerImage', this.logoConfig.get('banner_logo').value);
    // formData.append('Video', 'video.mp4');
    this.subSunk.sink = this.apiHandlerService.apiHandler('uploadBannerImage', 'post', {}, {},
      formData
    ).subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {

      }
    });
  }

  addGalleryImageApiCall() {
    let galleryImage = this.logoConfig.get('gallery_image').value
    const formData = new FormData();
    formData.append('id', this.tourId.toString());
    for (let i = 0; i < galleryImage.length; i++) {
      formData.append('Gallery', galleryImage[i]);
    }
    // formData.append('Video', 'video.mp4');

    this.subSunk.sink = this.apiHandlerService.apiHandler('uploadGallery', 'post', {}, {},
      formData
    ).subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {
          this.galleryImages = response.data;
      }
    });
  }


  deleteGalleryImage(imageName: string) {
    let req = {
      id: this.tourId.toString(),
      image_url: imageName
    };
  
    this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTourImage', 'post', {}, {}, req)
      .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
          // Remove deleted image from the local list
          this.galleryImages = this.galleryImages.filter(img => img !== imageName);
        }
      });
  }
  

  inclusionSelection(checked: Boolean, inclusion: String) {
    if (checked) {
      this.selectedCheckboxes.push(inclusion);
    } else {
      const index = this.selectedCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedCheckboxes.splice(index, 1);
      }
    }
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];

    if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
          this.swalService.alert.oops("Only JPG, JPEG, PNG, SVG, and WEBP formats are allowed.");
            event.target.value = ''; // Reset file input
            return;
        }

        this.bannerImage = file;
        this.logoConfig.get('banner_logo').patchValue(file);
    }
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
        this.swalService.alert.oops("Only JPG, JPEG, PNG, SVG, and WEBP formats are allowed.");
          event.target.value = ''; // Reset file input
          return;
      }

      this.gallery = validFiles;
      this.logoConfig.get('gallery_image').patchValue(validFiles);
      this.addGalleryImageApiCall();
  }
}


  onVideoSelect($event) {
    this.video = $event.target.files[0].file;
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }

}
