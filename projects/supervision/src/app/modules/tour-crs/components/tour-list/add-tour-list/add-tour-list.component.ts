import { Component, OnInit,Output , EventEmitter} from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators, FormArray } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink'; 
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-tour-list',
  templateUrl: './add-tour-list.component.html',
  styleUrls: ['./add-tour-list.component.scss']
})
export class AddTourListComponent implements OnInit {

  @Output() staticContentTab = new EventEmitter<any>();
    activitiesList: Array<any> = [];
    selectedtActivity: Array<any> = [];
    regionData: Array<any> = [];
    themeList: Array<any> = [];
    selectedTheme: Array<any> = [];
    countryList:Array<any>=[];
    cityList:Array<any>=[];
    tourForm: FormGroup;
    selectedCity:Array<any>=[];
    finalSelectedCountry={};
    finalSelectedCity:any=[];
    ckeditorContent = "Some Text";
    addOrUpdate;
    private subSunk = new SubSink();
    minDate: Date = new Date(); // Default minDate to today
    minExpiryDate: Date | null = null; // To dynamically update expiry date

    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
      };
      
    editForm:boolean=true;
    // //Object structure to hold continent information to send to api after grouping all information on creat tour click button
    finalSelectedContinent ={
        "id": 0,
        "name":'',
        "status": 0
    };

    selectedCountries: any[] = [];

    durationData=[{'id':1,'name':'2 Days | 1 Night'},
        {'id':2,'name':'3Days|2Nights'},
        {'id':3,'name':'4Days|3Nights'},
        {'id':4,'name':'5Days|4Nights'},
        {'id':5,'name':'6Days|5Nights'},
        {'id':6,'name':'7Days|6Nights'},
        {'id':7,'name':'8Days|7Nights'},
        {'id':8,'name':'9Days|8 Nights'},
        {'id':9,'name':'10Days|9 Nights'},
        {'id':10,'name':'11Days|10Nights'},
        {'id':11,'name':'12Days|11Nights'},
        {'id':12,'name':'13Days|12Nights'},
        {'id':13,'name':'14Days|13Nights'},
        {'id':14,'name':'15Days|14Nights'},
        {'id':15,'name':'16Days|15Nights'},
        {'id':16,'name':'17Days|16Nights'},
        {'id':17,'name':'18Days|17Nights'},
        {'id':18,'name':'19Days|18Nights'},
        {'id':19,'name':'20Days|19Nights'},
        {'id':20,'name':'21Days|20Nights'},
        {'id':21,'name':'22Days|21Nights'},
        {'id':22,'name':'23Days|22Nights'},
        {'id':23,'name':'24Days|23Nights'},
        {'id':24,'name':'25Days|24Nights'},
        {'id':25,'name':'26Days|25Nights'},
        {'id':26,'name':'27Days|26Nights'},
        {'id':27,'name':'28Days|27Nights'},
        {'id':28,'name':'29Days|28Nights'},
        {'id':29,'name':'30Days|29Nights'},
        {'id':30,'name':'31Days|30Nights'}
        
    ]
    tourTypeOptions = [
        { id: 'Holiday', label: 'Holiday', value: 'Holiday' },
        // { id: 'Homestay', label: 'Homestay', value: 'Homestay' },
        // { id: 'Resort', label: 'Resort', value: 'Resort' }
      ];
    selectedCountry: Array<any>=[];

    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        itemsShowLimit: 3,
        allowSearchFilter: true // Enables search feature
      };

      // Dropdown settings
      cityDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'cityName',
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        itemsShowLimit: 4,
        allowSearchFilter: true
    };
    terms: boolean = false;
     public isOpen = false as boolean;
     public filteredCounrtyList: any[] = [];
     public loggedInUserId: any;
    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private router:Router,
        private apiHandlerService:ApiHandlerService
    ) { }

    ngOnInit() {
        this.createForm();
        this.getModuleList();
        this.getActivitiesDataList();
        this.getRegionData();
        this.getThemeListData();
        
        this.tourForm.get('startDate').valueChanges.subscribe(selectedDate => {
            if (selectedDate) {
              this.minExpiryDate = new Date(selectedDate); // Set expiry min date to selected start date
            } else {
              this.minExpiryDate = null; // Reset if no start date selected
            }
          });
    }

    getModuleList() {
       
    }

    createForm() {
        this.tourForm = this.fb.group({
          tourName: new FormControl('', [Validators.required]),
          tourDescription: new FormControl('',[Validators.required]),
          tourType: new FormControl('Holiday'),
          startDate: new FormControl('', [Validators.required]),
          expirayDate: new FormControl('', [Validators.required]),
          chooseDuration:new FormControl('',[Validators.required]),
          price:new FormControl(''),
          isRefundable: new FormControl(false),
          countryId: new FormControl('',[Validators.required]),
        });
    }

    

    getRegionData(){
  this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterContinet', 'post', {}, {},{})
    .subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {

        this.regionData = response.data.data.filter(data => (data.status === '1' || data.status === 1)) || [];
        this.regionData.sort();

        // ✅ Set Asia as default
        const asia = this.regionData.find(r => r.name.toLowerCase() === 'asia');

        if (asia) {
          this.finalSelectedContinent = {
            id: asia.id,
            name: asia.name,
            status: Number(asia.status)
          };

          // call country API automatically
          this.loadCountries(asia.id);
        }
      }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
  });
}

loadCountries(continentId:number){

  this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterCountryList', 'post', {}, {},{
    
  })
  .subscribe(response => {

    if (response.statusCode == 200 || response.statusCode == 201 ) {

      this.filteredCounrtyList = response.data.data.countries;

      this.countryList = response.data.data.countries.filter(data => (data.status === '1' || data.status === 1)) || [];
      this.sortcountry();

      // ✅ Set India as default
      const india = this.countryList.find(c => c.name.toLowerCase() === 'india');

      if(india){
        this.finalSelectedCountry = india;
  // ✅ THIS LINE IS IMPORTANT
  this.tourForm.patchValue({
    countryId: india.id
  });

        // Load cities of India automatically
        this.loadCities(india.id);
      }
    }

  },(err: HttpErrorResponse) => {
    this.swalService.alert.error(err['error']['Message']);
  });
}
loadCities(countryId:number){

  const selectedCountryData = {
    id: countryId
  };

  this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterCityList', 'post', {}, {}, selectedCountryData)
    .subscribe(response => {

      if ((response.statusCode === 200 || response.statusCode === 201) && response.data.data) {
  this.cityList = response.data.data.map(city => ({
  id: city.cityId,            // 🔥 FIX HERE
  cityName: city.cityName
}));
        this.sortCity();
      }

    }, (err: HttpErrorResponse) => {
      this.swalService.alert.error(err.error.Message);
    });
}
    getThemeListData(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getTourThemeList', 'post', {}, {},{})
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201) {
                    this.themeList = response.data.filter(data => (data.status === '1' || data.status === 1)) || [];
                    this.sortTheme();
                  }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
            });
    }

    sortTheme(){
        this.themeList.sort((a, b) => 
            a.tour_subtheme.localeCompare(b.tour_subtheme)
        );
    }

    getActivitiesDataList(){
        //this.activitiesList=this.dummyActivitiesList;
        this.subSunk.sink = this.apiHandlerService.apiHandler('getTourActivityList', 'post', {}, {},{})
        .subscribe(response => {
            if ((response.statusCode == 200 || response.statusCode == 201) && response.data ) {
                this.activitiesList = response.data.filter(data => (data.status === '1' || data.status === 1)) || [];
                this.sortActivity();
             }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
    }

    sortActivity(){
        this.activitiesList.sort((a, b) => 
            a.tour_activity.localeCompare(b.tour_activity)
        );
    }

    selectActivity(selectedAcivity:string){
        selectedAcivity['status']=parseInt(selectedAcivity['status']);
        this.selectedtActivity.push(selectedAcivity)
        let getIndexOfSelectedActivity=this.activitiesList.indexOf(selectedAcivity);
        if(getIndexOfSelectedActivity >-1){
            this.activitiesList.splice(getIndexOfSelectedActivity,1);
        }
    }

    deSelectActivity(deSelectedAcivity:string){
        let getIndexOfDeselectedActivity=this.selectedtActivity.indexOf(deSelectedAcivity);
        if(getIndexOfDeselectedActivity >-1){
            this.activitiesList.push(this.selectedtActivity[getIndexOfDeselectedActivity]);
            this.selectedtActivity.splice(getIndexOfDeselectedActivity,1);
        }
    }

    onRegionChange(regionInput){
         this.loadCountries(regionInput);
        // let selectedContinentName;
        // this.regionData.forEach(item=>{
        // if(item.id==regionInput){
        //     selectedContinentName=item.name;
        //     this.finalSelectedContinent.id=item.id;
        //     this.finalSelectedContinent.name=item.name;
        //     this.finalSelectedContinent.status=Number(item.status);
        // }
        // })
        // this.subSunk.sink = this.apiHandlerService.apiHandler('getMasterCountryList', 'post', {}, {},{
        //     "id": Number(regionInput),
        
        // }).subscribe(response => {
        //     if (response.statusCode == 200 || response.statusCode == 201 ) {
        //         this.filteredCounrtyList = response.data.data.countries;
        //         console.log(this.filteredCounrtyList)
        //         this.countryList = response.data.data.countries.filter(data => (data.status === '1' || data.status === 1))  || [];
        //         this.sortcountry();
        //     }
        // },(err: HttpErrorResponse) => {
        //         this.swalService.alert.error(err['error']['Message']);
        // });
    }

    sortcountry(){
        this.countryList.sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    }

    selectTheme(selectedTheme:string){
        selectedTheme['status']=parseInt(selectedTheme['status']);
        this.selectedTheme.push(selectedTheme)
        let getIndexOfSelectedTheme=this.themeList.indexOf(selectedTheme);
        if(getIndexOfSelectedTheme >-1){
            this.themeList.splice(getIndexOfSelectedTheme,1);
        }
    }

    deSelectTheme(deSelectedtheme:string){
        let getIndexOfDeseelectedTheme=this.selectedTheme.indexOf(deSelectedtheme);
        if(getIndexOfDeseelectedTheme >-1){
            this.themeList.push(this.selectedTheme[getIndexOfDeseelectedTheme]);
            this.selectedTheme.splice(getIndexOfDeseelectedTheme,1);
        }
    }

    sortCity(){
        this.cityList.sort((a, b) => 
            a.cityName.localeCompare(b.cityName)
        );
    }

onCitySelect(item: any) {
  console.log("Dropdown item:", item);

  // 🔥 IMPORTANT: match using cityName (because id may be missing)
  const cityObj = this.cityList.find(
    c => c.cityName === (item.cityName || item.CityName)
  );

  if (cityObj) {
    const exists = this.selectedCity.find(c => c.id === cityObj.id);

    if (!exists) {
      this.selectedCity.push({
        id: cityObj.id,
        cityName: cityObj.cityName
      });

      // remove from list (like country)
      this.cityList = this.cityList.filter(c => c.id !== cityObj.id);
    }
  } else {
    console.error("City not found in list", item);
  }
}
    
    // Deselect city and move it back to cityList
onCityDeSelect(item: any) {
  const cityObj = this.selectedCity.find(
    c => c.cityName === (item.cityName || item.CityName)
  );

  if (cityObj) {
    this.cityList.push(cityObj);
    this.selectedCity = this.selectedCity.filter(c => c.id !== cityObj.id);
  }
}
     
      

    // selectCity(inputSelectedCity:string){
    //     this.selectedCity.push(inputSelectedCity)
    //     let getIndexOfSelectedTheme=this.cityList.findIndex(item=>item.CityName==inputSelectedCity["CityName"]);
    //     if(getIndexOfSelectedTheme >-1){
    //         this.cityList.splice(getIndexOfSelectedTheme,1);
    //     }
    // }

    // deSelectCity(deSelectedCity:string){
    //     let getIndexOfDeseelectedCity=this.selectedCity.findIndex(item=>item.CityName==deSelectedCity["CityName"]);
    //     if(getIndexOfDeseelectedCity >-1){
    //         this.cityList.push(this.selectedCity[getIndexOfDeseelectedCity]);
    //         this.selectedCity.splice(getIndexOfDeseelectedCity,1);
    //     }
    // }


    selectCountry(inputSelectedCountry: any) {
        const index = this.selectedCountries.findIndex(item => item.id === inputSelectedCountry.id);
        if (index === -1) {
          this.selectedCountries.push(inputSelectedCountry);
          this.countryList = this.countryList.filter(item => item.id !== inputSelectedCountry.id);
        }
      }
    
      // Deselect a country and move it back to the available list
      deSelectCountry(deSelectedCountry: any) {
        this.countryList.push(deSelectedCountry);
        this.selectedCountries = this.selectedCountries.filter(item => item.id !== deSelectedCountry.id);
      }
    
      // Handle selection from dropdown (same function as clicking)
      onItemSelect(item: any) {
        this.selectCountry(item);
      }
    
      // Handle deselection from dropdown (same function as clicking)
      onItemDeSelect(item: any) {
        this.deSelectCountry(item);
      }

  onCountryChange(countryId: number) {

  const selectedCountry = this.filteredCounrtyList.find(
    data => Number(data.id) === Number(countryId)
  );

  if (selectedCountry) {
    this.finalSelectedCountry = selectedCountry;

    // ✅ Load cities
    this.loadCities(selectedCountry.id);
  }
}   

    onCreateTour(){
      console.log(this.selectedCity,"jhjk")
        const currentDomainUser = localStorage.getItem('currentDomainUser');
        const businessName = JSON.parse(currentDomainUser);
       if(this.tourForm.valid){
        const loggedInUser = JSON.parse(localStorage.getItem('currentDomainUser'));
        this.loggedInUserId = loggedInUser.id;
        const createTourData={
            "TourName": this.tourForm.get('tourName').value,
            "TourDescription": this.tourForm.get('tourDescription').value,
            "TourType": this.tourForm.get('tourType').value,
            "StartDate": (this.tourForm.get('startDate').value).toISOString().split('T')[0],
            "ExpiryDate": (this.tourForm.get('expirayDate').value).toISOString().split('T')[0],
            "SupplierName": businessName.business_name,
            "Theme":this.selectedTheme,
            "Activity": this.selectedtActivity,
            "Continent":this.finalSelectedContinent ,
            "Country":this.finalSelectedCountry,
            "City":this.selectedCity.map(city => ({
  id: city.id,
  cityName: city.cityName
})),
            "Duration":this.tourForm.get('chooseDuration').value,
            "sim_price":this.tourForm.get('price').value,
            created_by_id: this.loggedInUserId
            // "isRefundable": this.tourForm.get('isRefundable').value,
            // "CancPolicy": this.tourForm.get('isRefundable').value ? this.tourForm.get('CancPolicy').value : []
        }
        
        this.subSunk.sink = this.apiHandlerService.apiHandler('addTour', 'post', {}, {},
            createTourData
        ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                    localStorage.setItem('tourName',response.data[0].package_name)
                    sessionStorage.setItem('tourId',response.data[0].id)
                    this.swalService.alert.success("Tour is added successfully");
                    localStorage.removeItem('updateDepartureDate')
                    // this.router.navigate(['/tour-crs/tour-list/add-tour/departure-date']);
                    localStorage.removeItem('updateTourCities');
                    this.router.navigate(["/tour-crs/tour-list/add-tour/visited-city"]);
                }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
        });
       }
    }
    
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

    onTerms(e) {
        this.terms = e;
    }

}
