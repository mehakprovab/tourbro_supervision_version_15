import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { AppService } from 'projects/supervision/src/app/app.service';
import { MarkupService } from '../../markup.service';

@Component({
    selector: 'app-agents-hotel',
    templateUrl: './agents-hotel.component.html',
    styleUrls: ['./agents-hotel.component.scss']
})
export class AgentsHotelComponent implements OnInit, OnDestroy {

    updateGeneral: boolean = false;
    submitted: boolean;
    private subSunk = new SubSink();
    regConfig: FormGroup;
    supplierConfig:FormGroup;
    respData: Array<any> = [];
    respAgentData:Array<any> = [];
    defaultCurrency: string = 'USD';
    generalMarkupId: number;
    currentUser: any;
    supplierList: any[] = [];
    dropdownSettingsForSupplier={}
    coreCityList: any;
    coreCountryList: any;
    selectedCityName: string = '';
    booking_source:any;
    noData:boolean;
    agent_id:any;
    cityName:any;
    countryCode:any;
    supplierData:any;
    supplierValue:any;
    supplierValueType:any;
    updated:boolean =true;
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'agent_name', value: 'Agent Name' },
        { key: 'supplier', value: 'Supplier Name' },
        { key: 'supplier_value', value: 'Supplier Value(%)' },
        // { key: 'value_type', value: 'Value Type' },


       { key: 'Country', value: 'Country' },
    
       { key: 'City', value: 'City' },
      
        { key: 'action', value: 'Action' }
    ];
    selectedAgent:any;
    patchedData:any;
    cityId:any;
    countryName:any;
    supplierRespData:Array<any> = [];
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private util: UtilityService,
        private appService: AppService,
        private markupservice:MarkupService
    ) {
        this.dropdownSettingsForSupplier = {
            singleSelection: false,
            // idField: 'id',
            textField: 'name',
            maxHeight: 197,
            itemsShowLimit: 2,
        };
     }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createSupplierForm();
        this.createForm();
        
        this.getMarkupData() 
        // this.formValueChanges();
        this.getUsersList();
        this.getSuppliers();
        this.getCoreCountryList();

    }

    createForm() {
        this.regConfig = this.fb.group({
          agent_id: [null, Validators.required],
          supplier_value_type: ['plus'], // Default to 'plus' type
          supplier_value: [0 ], // Supplier value
          suppliers: ['',Validators.required], // Supplier dropdown
          core_country_id: [''], // Country selection
          city_name: [''], // City selection
          country_type:['percentage'],
          country_value:[''],
          city_value_type:['percentage'],
          city_value:[''],
          cities: this.fb.array([])
        });
      }
      createSupplierForm() {
        this.supplierConfig = this.fb.group({
          agent_id: [null, Validators.required],
          supplier_value_type: ['percentage'], // Default to 'plus' type
          supplier_value: [0 ], // Supplier valu
          suppliers: ['',Validators.required], // Supplier dropdown
        });
      }
      get cities(): FormArray {
        return this.regConfig.get('cities') as FormArray;
      }
      createCityFormGroup(cityId: string, value: number, valueType: string): FormGroup {
        return this.fb.group({
          city_name: [cityId, Validators.required],
          city_value: [value, Validators.required],
          city_value_type: [valueType, Validators.required]
        });
      }
    onAddGeneralMarkup(data) {
        if (this.regConfig.invalid) {
            return;
        }
        // if (this.updateGeneral) {
        //     this.updateGeneralMarkup(data);
        // } else {
           this.onHotelAdd(data)
        // }

    }
    getMarkupData() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            "module_type": "b2b_hotel",
            "type": "agent_group",
            "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            "is_deleted": 0
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.respData = resp.data;

                console.log("this.respData",this.respData)
                this.collectionSize = resp.data.length;
                if (this.respData.length != 0) {
                    this.updateGeneral = true;
                    this.generalMarkupId = this.respData[0].id;
                    // this.regConfig.patchValue({
                    //     markupValue: this.respData[0].value ? this.respData[0].value : '',
                    //     markupType: this.respData[0].value_type ? this.respData[0].value_type : '',
                    // })
                }
            } else {
                this.swalService.alert.oops();
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops();
        });
    }
    updateGeneralMarkup(data) {
        console.log("upp",data)
        let generalMarkup = [{
            id: this.generalMarkupId,
            value: parseInt(data.markupValue),
            value_type: data.markupType,
            markup_currency: 'INR',
            //auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
        }]
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateFlightMarkup', 'POST', '', '', generalMarkup).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }
    onHotelAdd(hotelData) {
        console.log("hotelData",hotelData)
        this.submitted = true;
        if (this.regConfig.invalid) {
            return;
        }
        let markupForm = {
            flight_airline_id: 0,
            value_type: hotelData.markupType,
            value: parseInt(hotelData.markupValue),
            type: "generic",
            domain_list_fk: 0,
            module_type: "b2b_hotel",
            markup_currency: "INR",
            fare_type: "Public",
           auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'POST', '', '', markupForm).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }
    onSelectionChanged(event) {
        console.log("event",event)
        this.agent_id= event.option.id;
    } 
    // addHotel() {
    //     if (this.regConfig.invalid) return;
    
    //     const formValue = this.regConfig.value;
    //     const supplierId = this.booking_source; // Supplier ID from form
    //      this.countryCode = formValue.core_country_id; // Single country code
    //      if(this.countryCode){
    //         const country = this.coreCountryList.find(c => c.countryCode === this.countryCode);
    //         this.countryName = country ? country.countryName : '';
    //      }
    //     const countryValueType = formValue.country_type; // Single country value type
    //     const countryValue = formValue.country_value; // Single country value
    //      this.cityId = formValue.city_name; // Single city ID
    //     if(this.cityId){
    //      const city = this.coreCityList.find(c => c.Id === (this.cityId));
    //      this.cityName = city ? city.cityName : '';
    //     }
    //     const cityValueType = formValue.city_value_type; // Single city value type
    //     const cityValue = formValue.city_value; // Single city value
    //     const groupId = this.patchedData ? this.patchedData.group_id : this.agent_id ; // Group ID
     
    //     const Supplier = this.supplierList.find(c => c.source_key === supplierId);
    //     const SupplierName = Supplier ? Supplier.name : '';
    //     // Build the payload as per your required format
    //     const payload = {
    //         type: 'agent_group', // Assuming static for now, can be dynamic
    //         fare_type: "Public", // Static as per requirement
    //         module_type: "b2b_hotel", // Static as per requirement
    //         flight_airline_id: 0, // Static as per requirement
    //         value: parseInt(countryValue), // Supplier value from form
    //         value_type: countryValueType, // Plus or percentage
    //         domain_list_fk: 1, // Static as per requirement
    //         markup_currency: this.defaultCurrency, // Assuming this is GBP
    //         auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
    //         supplier_id: supplierId,
    //         countryCode: this.countryCode,
    //         supplier: {
    //             [supplierId]: {
    //                 country: {
    //                     [this.countryCode]: {
    //                         value: parseInt(countryValue), // Country value
    //                         value_type: countryValueType, // Plus or percentage
    //                         name: this.countryName // Country name
    //                     }
    //                 },
    //                 city: {
    //                     [this.cityId]: {
    //                         value: parseInt(cityValue), // City value
    //                         value_type: cityValueType, // Plus or percentage
    //                         name: this.cityName // City name
    //                     }
    //                 },
    //             }
    //         },
    //         group_id:this.patchedData ? groupId : groupId.toString()
    //     };
    
    //     // Submit the payload
    //     this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, payload)
    //         .subscribe(resp => {
    //             console.log(resp);
    //             if (resp.statusCode == 200 || resp.statusCode == 201) {
    //                 this.getMarkupData();
    //                 this.swalService.alert.success();
    //                 this.regConfig.reset();
    //             }
    //         });
    // }
    addHotel() {
        if (this.regConfig.invalid) return;
    
        const formValues = this.regConfig.value;
        const supplierId = this.booking_source;
        // Construct dynamic supplier object
        const supplier = {
          country: {},
          city: {}
        };
      
        if (formValues.core_country_id) {
          supplier.country[formValues.core_country_id] = {
            value: parseInt(formValues.country_value),
            value_type: formValues.country_type,
            name: this.getCountryName(formValues.core_country_id), // Replace with a method to get the country name
          };
        }
      
        if (formValues.cities.length > 0) {
          formValues.cities.forEach((city: any) => {
            supplier.city[city.city_name] = {
              value: parseInt(city.city_value),
              value_type: city.city_value_type,
              name: this.getCityName(city.city_name), // Replace with a method to get the city name
            };
          });
        } else if (formValues.city_name) {
          supplier.city[formValues.city_name] = {
            value: formValues.city_value,
            value_type: formValues.city_value_type,
            name: this.getCityName(formValues.city_name), // Replace with a method to get the city name
          };
        }
        const groupId = this.patchedData ? this.patchedData.group_id : this.agent_id ; // Group ID
        // Construct the payload
        const payload = {
          type: 'agent_group',
          fare_type: 'Public',
          module_type: 'b2b_hotel',
          flight_airline_id: 0,
          value: parseInt(formValues.country_value) || 0, // Default to 0 if no value
          value_type: formValues.country_type || 'percentage',
          domain_list_fk: 1,
          markup_currency: 'GBP',
          auth_user_id: 1,
          supplier_id: supplierId, // Replace with dynamic value if needed
          countryCode: formValues.core_country_id || 'IN', // Default to 'IN' if no value
          supplier: supplier,
          group_id: this.patchedData ? groupId : groupId.toString(),
        };
        // Submit the payload
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, payload)
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.getMarkupData();
                    this.swalService.alert.success();
                    this.regConfig.reset();
                    this.regConfig.patchValue({
                        country_type :'percentage',
                       city_value_type:'percentage',
                    });
                }
            });
    }
    addGeneralMarkup() {
        if (this.supplierConfig.invalid) return;
    
        const formValue = this.supplierConfig.value;
        const supplierId = this.booking_source; // Supplier ID from form
        const supplierValueType = formValue.supplier_value_type;
        const supplierValue = formValue.supplier_value;
         this.countryCode = formValue.core_country_id; // Single country code
        const groupId = this.patchedData ? this.patchedData.group_id : this.agent_id ; // Group ID
        const payload = {
            type: 'agent_group', // Assuming static for now, can be dynamic
            fare_type: "Public", // Static as per requirement
            module_type: "b2b_hotel", // Static as per requirement
            flight_airline_id: 0, // Static as per requirement
            value: parseInt(supplierValue), // Supplier value from form
            value_type: supplierValueType, // Plus or percentage
            domain_list_fk: 1, // Static as per requirement
            markup_currency: this.defaultCurrency, // Assuming this is GBP
            auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            supplier_id: supplierId,
            countryCode: '',
            supplier: {},
            group_id:this.patchedData ? groupId : groupId.toString()
        };
    
        // Submit the payload
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, payload)
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.getMarkupData();
                    this.swalService.alert.success();
                    this.supplierConfig.reset();
                }
            });
    }
 
    updatedMarkup() {
        if (this.regConfig.invalid) return;
        const formValue = this.regConfig.value;
        console.log("formValue", formValue);
        const supplierNameId = formValue.suppliers;
   
        const Supplier = this.supplierList.find(c => c.name === supplierNameId);
        const supplierId = Supplier ? Supplier.source_key : '';
        console.log("supplierId",supplierId)
        const groupId = this.patchedData ? this.patchedData.group_id : this.agent_id;
        // const SupplierName = Supplier ? Supplier.name : '';
        // const supplierValueType = formValue.supplier_value_type;
        // const supplierValue = formValue.supplier_value;
        this.countryCode = formValue.core_country_id;
        
        if (this.countryCode) {
            const country = this.coreCountryList.find(c => c.countryCode === this.countryCode);
            this.countryName = country ? country.countryName : '';
        }
    
        const countryValueType = formValue.country_type;
        const countryValue = formValue.country_value;
    
        const citiesArray = this.regConfig.get('cities') as FormArray;
        const citiesData = citiesArray.controls.map((cityControl) => {
            const cityId = cityControl.value.city_name;
            const cityValue = cityControl.value.city_value;
            const cityValueType = cityControl.value.city_value_type;
            const city = this.coreCityList.find(c => c.Id === cityId);
            const cityName = city ? city.cityName : '';
    
            return {
                [cityId]: {
                    value: parseInt(cityValue), // City value
                    value_type: cityValueType, // Plus or percentage
                    name: cityName // City name
                }
            };
        });
    
        // const groupId = this.patchedData ? this.patchedData.group_id : this.agent_id;
    
        // const Supplier = this.supplierList.find(c => c.source_key === supplierId);
        // const SupplierName = Supplier ? Supplier.name : '';
    
        // Build the payload with the multiple cities
        const payload = {
            type: 'agent_group',
            fare_type: "Public",
            module_type: "b2b_hotel",
            flight_airline_id: 0,
            value: parseInt(countryValue),
            value_type: countryValueType,
            domain_list_fk: 1,
            markup_currency: this.defaultCurrency,
            auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            supplier_id: supplierId,
            countryCode: this.countryCode,
            supplier: {
             
                    country: {
                        [this.countryCode]: {
                            value: parseInt(countryValue),
                            value_type: countryValueType,
                            name: this.countryName
                        }
                    },
                    city: citiesData.reduce((acc, city) => ({ ...acc, ...city }), {}),
                    // value: parseInt(supplierValue),
                    // value_type: supplierValueType,
                   
                
            },
            group_id: this.patchedData ? groupId : groupId.toString()
        };
    
        // Submit the payload
        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, payload)
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.getMarkupData();
                    this.updated =true;
                    this.swalService.alert.success();
                    this.regConfig.reset();
                    this.regConfig.patchValue({
                        country_type :'percentage',
                       city_value_type:'percentage',
                    });
                    this.supplierData ='';
                    const cities = this.regConfig.get('cities') as FormArray;
                    if (cities) {
                        cities.clear(); // This will remove all controls from the array
                    }
                }
            });
    }
    
    
    onSubmit() {
      if(this.respData == null || !this.respData.length  ){
        this.addHotel()
      }else if(this.supplierData){
        this.updatedMarkup()
     }else {
        if (this.regConfig.invalid) return;
        const formValue = this.regConfig.value;
        const supplierId = this.booking_source; // Supplier ID from form
        const existingGroupData = this.respData.filter(item => parseInt(item.group_id) === this.agent_id);
        if(existingGroupData.length){
            const existingSupplierData = existingGroupData.filter(item => item.supplier_id === supplierId); 
            if(existingSupplierData.length){
                this.getSupplierWiseMarkupData(existingSupplierData[0])
     
              } else{
                 this.addHotel();
             };
        }else{
            this.addHotel();
        }     
     }
    }
    
    getSupplierWiseMarkupData(supplierId) {
        console.log("supplierId",supplierId)
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            module_type: 'b2b_hotel',
            type: 'agent_group',
            auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            is_deleted: 1,
            supplier_id: supplierId.supplier_id,
            group_id:supplierId.group_id

        }).subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.supplierRespData = resp.data;
                console.log("this.supplierRespData", this.supplierRespData);
    
                const formValues = this.regConfig.value;
    
                // Find existing data for the selected country
                const existingCountryData = this.supplierRespData.find(
                    item => item.countryCode === formValues.core_country_id
                );
                console.log("existingCountryData", existingCountryData);
    
                // Parse the supplier field if existing country data is present
                let supplier = { country: {}, city: {} };
                if (existingCountryData && existingCountryData.supplier) {
                    supplier = JSON.parse(existingCountryData.supplier);
                }
    
                // Add or update country data
                if (formValues.core_country_id) {
                    supplier.country[formValues.core_country_id] = {
                        value: formValues.country_value ? formValues.country_value : existingCountryData.value,
                        value_type: formValues.country_type? formValues.country_type : existingCountryData.value_type ,
                        name: this.getCountryName(formValues.core_country_id),
                    };
                }
    
                // Add or update city data
                const mergedCityData = { ...supplier.city };
                if (formValues.cities.length > 0) {
                    formValues.cities.forEach((city: any) => {
                        mergedCityData[city.city_name] = {
                            value: parseInt(city.city_value),
                            value_type: city.city_value_type,
                            name: this.getCityName(city.city_name),
                        };
                    });
                } else if (formValues.city_name) {
                    mergedCityData[formValues.city_name] = {
                        value: parseInt(formValues.city_value),
                        value_type: formValues.city_value_type,
                        name: this.getCityName(formValues.city_name),
                    };
                }
    
                // Update supplier.city with merged data
                supplier.city = mergedCityData;
    
                // Construct the payload
                const payload = {
                    type: 'agent_group',
                    fare_type: 'Public',
                    module_type: 'b2b_hotel',
                    flight_airline_id: 0,
                    value: parseInt(formValues.country_value) || 0,
                    value_type: formValues.country_type || 'percentage',
                    domain_list_fk: 1,
                    markup_currency: 'GBP',
                    auth_user_id: 1,
                    supplier_id: supplierId.supplier_id,
                    countryCode: formValues.core_country_id || 'IN',
                    supplier: (supplier), // Convert back to string
                    group_id: supplierId.group_id,
                };
    
                this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, payload)
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode === 200 || resp.statusCode === 201) {
                            this.getMarkupData();
                            this.swalService.alert.success();
                            this.regConfig.reset();
                        }
                    });
    
                console.log('Payload:', payload);
            } else {
                this.swalService.alert.oops();
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops();
        });
    }
    
    
    
    selectedLocation(suppliers) {
        console.log("suppliers",suppliers)
        this.booking_source = `${suppliers['source_key']}`;
        return;
    }
    // formValueChanges() {
    //     const markupValueControl = this.regConfig.get('markupValue');

    //     this.regConfig.get('markupType').valueChanges
    //         .subscribe(markupType => {
    //             if (markupType == "plus") {
    //                 markupValueControl.setValidators([Validators.required, Validators.max(100000)]);
    //             }

    //             if (markupType == "percentage") {
    //                 markupValueControl.setValidators([Validators.required, Validators.max(100)]);
    //             }
    //             markupValueControl.updateValueAndValidity();
    //         })
    // }
    getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "hotel",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }
    getCityListAuto(event): void {
        console.log("event",event.target.value)
            this.subSunk.sink = this.apiHandlerService.apiHandler('markupCityList', 'post', {}, {}, {
                "country_code":event.target.value,   
            }).subscribe(resp => {
                  this.coreCityList = resp.data;
                  console.log("this.coreCityList",this.coreCityList)
              }
          )
      }

      getCoreCountryList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('markupCountryList', 'post', {}, {}, {
        }).subscribe(resp => {
                this.coreCountryList = resp.data;
            }
        )
    }
    onCityChange(event) {
        console.log("event",event)
        let cityId = event;
        console.log("coreCityList",this.coreCityList)
        if(this.coreCityList){
        const selectedCity = this.coreCityList.find(city => city.city_name === cityId);
        this.selectedCityName = selectedCity ? selectedCity.city_name : '';
        }
        // this.selectedCityCode = selectedCity ? selectedCity.CityCode : '';
      }
      getUsersList() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {},
            { "status": 1,})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respAgentData = resp.data || [];
                }
                else {
                    this.noData = false;
                    this.respAgentData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respAgentData=[];
            });
    }
    selectedAgentList(agent){
        if(agent.group_id != '0'){
        const agentData = agent;
        const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(agentData.group_id));
        return this.selectedAgent = selectedAgent.name;
        }else{
            return  0; 
        }
        // return  this.selectedAgent;
 }
 
//  getFormattedSegment(segment) {
//     let segment_list = [JSON.parse(segment)];
//     console.log("segment_list",segment_list)
//     return segment_list;
// }
getFormattedSegment(segment: string): any {
    try {
      return [JSON.parse(segment || '{}')]; // Parse and wrap in an array for iteration
    } catch (error) {
      console.error('Error parsing supplier segment:', error);
      return [{}]; // Return an empty object if parsing fails
    }
  }
// patchFormData(data: any) {

//     try {
//       // ... existing code ...
//       const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(data.group_id));
//       const supplierData = JSON.parse(data.supplier);
//        this.supplierData = JSON.parse(data.supplier);
//       console.log("supplierData", supplierData);
  
//       const supplierKey = Object.keys(supplierData)[0];
//       if (supplierKey && supplierData[supplierKey]) {
//         const supplierInfo = supplierData[supplierKey];
  
//         // Clear previous cities
//         this.cities.clear();
  
//         // Handle country data
//         const countryKey = Object.keys(supplierInfo.country)[0];
//         const countryValue = supplierInfo.country[countryKey];
        
//         this.regConfig.patchValue({
//           core_country_id: countryKey,
//           country_value: countryValue.value,
//           country_type: countryValue.value_type,
//           suppliers: this.supplierList.find(supplier => supplier.source_key === supplierKey).name,
//           agent_id: selectedAgent ? selectedAgent.name : null, // Fallback in case agent is not found
//           supplier_value: supplierInfo.value,
//           supplier_value_type: supplierInfo.value_type,
//         });
//         this.getCityListAuto({ target: { value: countryKey } });
//         // Handle city data (repeat for the number of cities you have)
//         for (const cityId in supplierInfo.city) {
//             console.log("cityId",cityId)
//           const cityData = supplierInfo.city[cityId];
//           console.log("cityData",cityData)
//           this.cities.push(this.createCityFormGroup(cityId, cityData.value, cityData.value_type));
//         }
//       }
//     } catch (error) {
//       console.error("Error patching form data:", error);
//     }
//   }
  patchFormData(data: any) {

    try {
      // ... existing code ...
      const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(data.group_id));
      const supplierData = JSON.parse(data.supplier);
      console.log("supplierData",supplierData)
       this.supplierData = JSON.parse(data.supplier);
  
      if(data.countryCode == ""){
        this.supplierConfig.patchValue({
            supplier_value:data.value,
            supplier_value_type:data.value_type,
            suppliers: this.supplierList.find(supplier => supplier.source_key === data.supplier_id).name,
            agent_id: selectedAgent ? selectedAgent.name : null, // Fallback in case agent is not found
       
         
          });
      }else{
        this.cities.clear();
  
        // Handle country data
        const countryKey = Object.keys(supplierData.country)[0];
        const countryValue = supplierData.country[countryKey];
        
        this.regConfig.patchValue({
          core_country_id: countryKey,
          country_value: countryValue.value,
          country_type: countryValue.value_type,
          suppliers: this.supplierList.find(supplier => supplier.source_key === data.supplier_id).name,
          agent_id: selectedAgent ? selectedAgent.name : null, // Fallback in case agent is not found
       
        });
        this.getCityListAuto({ target: { value: countryKey } });
        // Handle city data (repeat for the number of cities you have)
        for (const cityId in supplierData.city) {
            console.log("cityId",cityId)
          const cityData = supplierData.city[cityId];
          console.log("cityData",cityData)
          this.cities.push(this.createCityFormGroup(cityId, cityData.value, cityData.value_type));
        }
      }
    } catch (error) {
      console.error("Error patching form data:", error);
    }
  }
// Method to patch supplier data into the form

  
  // Example usage

  
updateMarkup(data) {
    this.updated = false;
    this.patchedData = data;
    this.booking_source = this.patchedData.supplier_id;
    // const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(this.respData[0].group_id));
    this.patchFormData(data)
    // this.markupService.toUpdateB2CData.next(data);
    // this.markupService.isEditMode = true;
    // this.toUpdate.emit({ tabId: 'default_markup', data });
}
deleteMarkup(data) {
    this.swalService.alert.delete(willDelete => {
        if (willDelete) {
            this.delete(data.id);
        } else {
            console.log("Not delete")
        }
    })
}
delete(id) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.getMarkupData();
        }
    })
}
selectedSupplierList(agent: any): string {
    if (!agent || !agent.supplier_id) {
      return 'Unknown Supplier'; // Handle cases where supplier_id is missing
    }
    const selectedAgent = (Array.isArray(this.supplierList) ? this.supplierList : []).find(
      (supplier) => supplier.source_key === agent.supplier_id
    );
    return selectedAgent ? selectedAgent.name : 'Unknown Supplier'; // Handle cases where supplier is not found
  }
getCountryName(countryCode: string): string {
    const country = this.coreCountryList.find((c: any) => c.countryCode === countryCode);
    return country ? country.countryName : 'Unknown';
  }
  
  getCityName(cityId: string): string {
    const city = this.coreCityList.find((c: any) => c.Id === cityId);
    return city ? city.cityName : 'Unknown';
  }
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
