import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { MarkupService } from '../../markup.service';

@Component({
  selector: 'app-b2c-tour',
  templateUrl: './b2c-tour.component.html',
  styleUrls: ['./b2c-tour.component.scss']
})
export class B2cTourComponent implements OnInit {

  updateGeneral: boolean = false;
      submitted: boolean;
      private subSunk = new SubSink();
      regConfig: FormGroup;
      supplierConfig:FormGroup;
      respData: Array<any> = [];
      supplierRespData:Array<any> = [];
      respAgentData:Array<any> = [];
      defaultCurrency: string = 'INR';
      generalMarkupId: number;
      currentUser: any;
      supplierList :any;
      dropdownSettingsForSupplier={}
      coreCityList: any;
      coreCountryList: any;
      selectedCityName: string = '';
      booking_source:any;
      noData:boolean;
      agent_id:any;
      countryCode:any;
      cityId:any;
      cityName:any;
      supplierValue:any;
      supplierValueType:any
      city:any;
      cityValue:any;
      cityValueType:any;
      displayColumn: { key: string, value: string }[] = [
          { key: 'id', value: 'Sl No.' },
         
          { key: 'supplier', value: 'Supplier Name' },
          { key: 'supplier_value', value: 'Supplier Value' },
        
          // { key: 'value_type', value: 'Value Type' },
  
  
      //    { key: 'Country', value: 'Country' },
      
         { key: 'City', value: 'City' },
        
          { key: 'action', value: 'Action' }
      ];
      selectedAgent:any;
      patchedData:any;
      supplierData:any;
      countryName:any;
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
          // this.getCoreCountryList();
                this.getCityListAuto()
      }
      createSupplierForm() {
          this.supplierConfig = this.fb.group({
              suppliers: ['', Validators.required],
            supplier_value_type: ['percentage'], // Default to 'plus' type
            supplier_value: [0 ], // Supplier valu
          });
        }
      createForm() {
          this.regConfig = this.fb.group({
          //   agent_id: [null, Validators.required],
          suppliers: ['', Validators.required],
          //   core_country_id: [''], // Country selection
            city_name: [''], // City selection
          //   country_type:[''],
          //   country_value:[''],
            city_value_type:['percentage'],
            city_value:[''],
            cities: this.fb.array([])
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
          this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
              "module_type": "b2c_tour",
              "type": "supplier",
              "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
              "is_deleted": 1,
          }).subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.respData = resp.data;
                  // if (this.respData.length != 0) {
                  //     this.updateGeneral = true;
                  //     this.generalMarkupId = this.respData[0].id;
                  //     // this.regConfig.patchValue({
                  //     //     markupValue: this.respData[0].value ? this.respData[0].value : '',
                  //     //     markupType: this.respData[0].value_type ? this.respData[0].value_type : '',
                  //     // })
                  // }
              } else {
                  this.swalService.alert.oops();
              }
          }, (err: HttpErrorResponse) => {
              this.swalService.alert.oops();
          });
      }
      // getSupplierWiseMarkupData(supplierId) {
      //     this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
      //         "module_type": "b2c_tour",
      //         "type": "supplier",
      //         "auth_user_id": this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      //         "is_deleted": 1,
      //         "supplier_id":supplierId.supplier_id,
             
      //     }).subscribe(resp => {
      //         if (resp.statusCode == 200 || resp.statusCode == 201) {
      //             this.supplierRespData = resp.data;
                
      //             console.log(" this.supplierRespData", this.supplierRespData)
      //             const formValues = this.regConfig.value;
      //             const existingCountryData = this.supplierRespData.filter(item => item.countryCode === formValues.core_country_id);
      //             console.log("existingCountryData",existingCountryData)
      //             // Construct dynamic supplier object
      //             const supplier = {
      //               country: {},
      //               city: {}
      //             };
                
      //             if (formValues.core_country_id) {
      //               supplier.country[formValues.core_country_id] = {
      //                 value: formValues.country_value,
      //                 value_type: formValues.country_type,
      //                 name: this.getCountryName(formValues.core_country_id), // Replace with a method to get the country name
      //               };
      //             }
                
      //             if (formValues.cities.length > 0) {
      //               formValues.cities.forEach((city: any) => {
      //                 supplier.city[city.city_name] = {
      //                   value: parseInt(city.city_value),
      //                   value_type: city.city_value_type,
      //                   name: this.getCityName(city.city_name), // Replace with a method to get the city name
      //                 };
      //               });
      //             } else if (formValues.city_name) {
      //               supplier.city[formValues.city_name] = {
      //                 value: parseInt(formValues.city_value),
      //                 value_type: formValues.city_value_type,
      //                 name: this.getCityName(formValues.city_name), // Replace with a method to get the city name
      //               };
      //             }
                
      //             // Construct the payload
      //             const payload = {
      //               type: 'supplier',
      //               fare_type: 'Public',
      //               module_type: 'b2c_tour',
      //               flight_airline_id: 0,
      //               value: parseInt(formValues.country_value) || 0, // Default to 0 if no value
      //               value_type: formValues.country_type || 'percentage',
      //               domain_list_fk: 1,
      //               markup_currency: 'GBP',
      //               auth_user_id: 1,
      //               supplier_id: this.supplierRespData[0]['supplier_id'], // Replace with dynamic value if needed
      //               countryCode: formValues.core_country_id || 'IN', // Default to 'IN' if no value
      //               supplier: supplier,
      //               group_id: '0',
      //             };
      //             this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
      //             .subscribe(resp => {
      //                 console.log(resp);
      //                 if (resp.statusCode == 200 || resp.statusCode == 201) {
      //                     this.getMarkupData();
      //                     this.swalService.alert.success();
      //                     this.regConfig.reset();
      //                 }
      //             });
      //             console.log('Payload:', payload);
                
            
      //         } else {
      //             this.swalService.alert.oops();
      //         }
      //     }, (err: HttpErrorResponse) => {
      //         this.swalService.alert.oops();
      //     });
      // }
      getSupplierWiseMarkupData(supplierId) {
          this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
              module_type: 'b2c_tour',
              type: 'supplier',
              auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
              is_deleted: 1,
              supplier_id: supplierId.supplier_id,
          }).subscribe(resp => {
              if (resp.statusCode === 200 || resp.statusCode === 201) {
                  this.supplierRespData = resp.data;
                  console.log("this.supplierRespData", this.supplierRespData);
      
                  const formValues = this.regConfig.value;
      
                  // // Find existing data for the selected country
                  // const existingCountryData = this.supplierRespData.find(
                  //     item => item.countryCode === formValues.core_country_id
                  // );
                  // console.log("existingCountryData", existingCountryData);
      
                  // // Parse the supplier field if existing country data is present
                  let supplier = { city: {} };
                  // if (existingCountryData && existingCountryData.supplier) {
                  //     supplier = JSON.parse(existingCountryData.supplier);
                  // }
      
                  // Add or update country data
                  // if (formValues.core_country_id) {
                  //     supplier.country[formValues.core_country_id] = {
                  //         value: formValues.country_value ? formValues.country_value : existingCountryData.value,
                  //         value_type: formValues.country_type? formValues.country_type : existingCountryData.value_type ,
                  //         name: this.getCountryName(formValues.core_country_id),
                  //     };
                  // }
      
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
                      type: 'supplier',
                      fare_type: 'Public',
                      module_type: 'b2c_tour',
                     cityId:parseInt(formValues.city_name),
                      flight_airline_id: 0,
                      value: parseInt(formValues.country_value) || 0,
                      value_type: formValues.country_type || 'percentage',
                      domain_list_fk: 1,
                      markup_currency: 'INR',
                      auth_user_id: 1,
                      supplier_id: supplierId.supplier_id,
                      countryCode:'IN',
                      supplier: (supplier), // Convert back to string
                      group_id: '0',
                  };
      
                  this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
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
      addGeneralMarkup() {
          if (this.supplierConfig.invalid) return;
      
          const formValue = this.supplierConfig.value;
          const supplierId = this.booking_source; // Supplier ID from form
          const supplierValueType = formValue.supplier_value_type;
          const supplierValue = formValue.supplier_value;
          //  this.countryCode = formValue.core_country_id; // Single country code
          const payload = {
              type: 'supplier', // Assuming static for now, can be dynamic
              fare_type: "Public", // Static as per requirement
              module_type: "b2c_tour", // Static as per requirement
              flight_airline_id: 0, // Static as per requirement
              value: parseInt(supplierValue), // Supplier value from form
              cityId:0,
              value_type: supplierValueType, // Plus or percentage
              domain_list_fk: 1, // Static as per requirement
              markup_currency: this.defaultCurrency, // Assuming this is GBP
              auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
              supplier_id: supplierId,
              countryCode: 'IN',
              supplier: {},
              group_id:"0"
          };
      
          // Submit the payload
          this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
              .subscribe(resp => {
                  console.log(resp);
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.getMarkupData();
                      this.swalService.alert.success();
                      this.supplierConfig.reset();
                  }
              });
      }
      addHotel() {
          if (this.regConfig.invalid) return;
      
          const formValues = this.regConfig.value;
          const supplierId = this.booking_source;
          // Construct dynamic supplier object
          const supplier = {
          //   country: {},
            city: {}
          };
        
          // if (formValues.core_country_id) {
          //   supplier.country[formValues.core_country_id] = {
          //     value: parseInt(formValues.country_value),
          //     value_type: formValues.country_type,
          //     name: this.getCountryName(formValues.core_country_id), // Replace with a method to get the country name
          //   };
          // }
        
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
        
          // Construct the payload
          const payload = {
            type: 'supplier',
            fare_type: 'Public',
            module_type: 'b2c_tour',
            flight_airline_id: 0,
            cityId:parseInt(formValues.city_name),
            value: parseInt(formValues.city_value) || 0, // Default to 0 if no value
            value_type: formValues.city_value_type || 'percentage',
            domain_list_fk: 1,
            markup_currency: 'INR',
            auth_user_id: 1,
            supplier_id: supplierId, // Replace with dynamic value if needed
            countryCode: formValues.core_country_id || 'IN', // Default to 'IN' if no value
            supplier: supplier,
            group_id: '0',
          };
          // Submit the payload
          this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
              .subscribe(resp => {
                  console.log(resp);
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.getMarkupData();
                      this.swalService.alert.success();
                      this.regConfig.reset();
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
          // const SupplierName = Supplier ? Supplier.name : '';
          // const supplierValueType = formValue.supplier_value_type;
          // const supplierValue = formValue.supplier_value;
          // this.countryCode = formValue.core_country_id;
  
          
          // if (this.countryCode) {
          //     const country = this.coreCountryList.find(c => c.countryCode === this.countryCode);
          //     this.countryName = country ? country.countryName : '';
          // }
      
          // const countryValueType = formValue.country_type;
          // const countryValue = formValue.country_value;
      
          const citiesArray = this.regConfig.get('cities') as FormArray;
          const citiesData = citiesArray.controls.map((cityControl) => {
              this.city= cityControl.value.city_name
              this.cityValue=cityControl.value.city_value
              this.cityValueType=cityControl.value.city_value_type
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
              type: 'supplier',
              fare_type: "Public",
              module_type: "b2c_tour",
              flight_airline_id: 0,
              cityId:parseInt(this.city),
               countryCode:'IN',
              value: parseInt(this.cityValue),
              value_type: this.cityValueType,
              domain_list_fk: 1,
              markup_currency: this.defaultCurrency,
              auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
              supplier_id: supplierId,
              supplier: {
               
                      // country: {
                      //     [this.countryCode]: {
                      //         value: parseInt(countryValue),
                      //         value_type: countryValueType,
                      //         name: this.countryName
                      //     }
                      // },
                      city: citiesData.reduce((acc, city) => ({ ...acc, ...city }), {}),
                      // value: parseInt(supplierValue),
                      // value_type: supplierValueType,
                     
                  
              },
              group_id: "0"
          };
      
          // Submit the payload
          this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
              .subscribe(resp => {
                  console.log(resp);
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.getMarkupData();
                         this.supplierData='';
                      this.swalService.alert.success();
                      this.regConfig.reset();
                  }
              });
      }
      
      onSubmit() {
          if(this.respData == null || !this.respData.length){
              this.addHotel()
            }else if(this.supplierData){
          this.updatedMarkup()
       }else {
          if (this.regConfig.invalid) return;
        
          const supplierId = this.booking_source; // Supplier ID from form
  
          const existingSupplierData = this.respData.filter(item => item.supplier_id === supplierId);
         console.log("existingSupplierData",existingSupplierData)
          if(existingSupplierData.length){
              this.getSupplierWiseMarkupData(existingSupplierData[0])
   
            } else{
               this.addHotel();
           };
       }
      }
      selectedLocation(suppliers) {
          console.log("suppliers",suppliers)
          this.booking_source = `${suppliers['source_key']}`;
          return;
      }
  
      getSuppliers() {
          this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
              "module": "tour",
               "userType":"B2C"
          }).subscribe(resp => {
              if (resp.statusCode == 201 || resp.statusCode == 200) {
                  this.supplierList = resp.data.filter(supplier =>
                      supplier.name !== "Humming Bird" && supplier.name !== "Stuba"
                  );
                  console.log(" this.supplierList", this.supplierList)
              }
          });
      }
      getCityListAuto(): void {
              this.subSunk.sink = this.apiHandlerService.apiHandler('markupCityList', 'post', {}, {}, {
                  "country_code":'IN',   
              }).subscribe(resp => {
                    this.coreCityList = resp.data;
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
          const selectedCity = this.coreCityList.find(city => city.city_name === cityId);
          this.selectedCityName = selectedCity ? selectedCity.city_name : '';
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
   
  //  selectedSupplierList(agent){
    
  //     const agentData = agent;
  //     const selectedAgent = this.supplierList.find(agent => agent.source_key === (agentData.supplier_id));
  //     return this.selectedAgent = selectedAgent.name;
    
  //     // return  this.selectedAgent;
  // }
  selectedSupplierList(agent: any): string {
      if (!agent || !agent.supplier_id) {
        return 'Unknown Supplier'; // Handle cases where supplier_id is missing
      }
      const selectedAgent = this.supplierList.find(
        (supplier) => supplier.source_key === agent.supplier_id
      );
      return selectedAgent ? selectedAgent.name : 'Unknown Supplier'; // Handle cases where supplier is not found
    }
  
  getFormattedSegment(segment: string): any {
      try {
        return [JSON.parse(segment || '{}')]; // Parse and wrap in an array for iteration
      } catch (error) {
        console.error('Error parsing supplier segment:', error);
        return [{}]; // Return an empty object if parsing fails
      }
    }
    
  patchFormData(data: any) {
  
      try {
        // ... existing code ...
        const selectedAgent = this.respAgentData.find(agent => agent.id === parseInt(data.group_id));
        const supplierData = JSON.parse(data.supplier);
         this.supplierData = JSON.parse(data.supplier);
    
        if(!data.cityId){
          this.supplierConfig.patchValue({
              supplier_value:data.value,
              supplier_value_type:data.value_type,
              suppliers: this.supplierList.find(supplier => supplier.source_key === data.supplier_id).name,
    
           
            });
        }else{
          this.cities.clear();
    
          // Handle country data
          // const countryKey = Object.keys(supplierData.country)[0];
          // const countryValue = supplierData.country[countryKey];
                console.log("supplierList",this.supplierList)
          this.regConfig.patchValue({
          //   core_country_id: countryKey,
          //   country_value: countryValue.value,
          //   country_type: countryValue.value_type,
    
            suppliers: this.supplierList.find(supplier => supplier.source_key === data.supplier_id).name,
  
         
          });
          this.getCityListAuto();
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
    createCityFormGroup(cityId: string, value: number, valueType: string): FormGroup {
      return this.fb.group({
        city_name: [cityId, Validators.required],
        city_value: [value, Validators.required],
        city_value_type: [valueType, Validators.required]
      });
    }
  
  
    get cities(): FormArray {
      return this.regConfig.get('cities') as FormArray;
    }
  updateMarkup(data) {
      this.patchedData = data
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
  getCountryName(countryCode: string): string {
      const country = this.coreCountryList.find((c: any) => c.countryCode === countryCode);
      return country ? country.countryName : 'Unknown';
    }
    
    getCityName(cityId: string): string {
      const city = this.coreCityList.find((c: any) => c.Id === cityId);
      return city ? city.cityName : 'Unknown';
    }
    parseSupplier(supplier: string | object): any {
      try {
        // Parse the supplier string into a JSON object if it's not already parsed
        return typeof supplier === 'string' ? JSON.parse(supplier) : supplier;
      } catch (error) {
        console.error('Error parsing supplier:', error);
        return {}; // Return an empty object if parsing fails
      }
    }
    
    
      ngOnDestroy() {
          this.subSunk.unsubscribe();
      }
  }
  