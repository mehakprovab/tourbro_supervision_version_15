import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';

import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { AppService } from 'projects/supervision/src/app/app.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { MarkupService } from '../../markup.service';


@Component({
  selector: 'app-b2c-heli',
  templateUrl: './b2c-heli.component.html',
  styleUrls: ['./b2c-heli.component.scss']
})
export class B2cHeliComponent implements OnInit, OnDestroy{

  updateGeneral = false;
  submitted: boolean;

  private subSunk = new SubSink();

  regConfig: FormGroup;
  supplierConfig: FormGroup;

  respData: Array<any> = [];
  supplierRespData: Array<any> = [];
  respAgentData: Array<any> = [];

  defaultCurrency = 'INR';
  generalMarkupId: number;
  currentUser: any;

  supplierList: any[] = [];
  dropdownSettingsForSupplier = {};

  coreCityList: any[] = [];
  coreCountryList: any[] = [];

  selectedCityName = '';
  booking_source: any;
  noData: boolean;

  agent_id: any;
  countryCode: any;
  cityId: any;
  cityName: any;

  supplierValue: any;
  supplierValueType: any;

  city: any;
  cityValue: any;
  cityValueType: any;

  selectedAgent: any;
  patchedData: any;
  supplierData: any;
  countryName: any;

  displayColumn: { key: string; value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'supplier', value: 'Supplier Name' },
    { key: 'supplier_value', value: 'Supplier Value' },
    { key: 'City', value: 'City' },
    { key: 'action', value: 'Action' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private util: UtilityService,
    private appService: AppService,
    private markupservice: MarkupService
  ) {
    this.dropdownSettingsForSupplier = {
      singleSelection: false,
      textField: 'name',
      maxHeight: 197,
      itemsShowLimit: 2
    };
  }

  ngOnInit() {
    this.defaultCurrency = this.appService.defaultCurrency;

    this.createSupplierForm();
    this.createForm();

    this.getMarkupData();
    this.getUsersList();
    this.getSuppliers();
    this.getCityListAuto();
  }

  createSupplierForm() {
    this.supplierConfig = this.fb.group({
      suppliers: ['', Validators.required],
      supplier_value_type: ['percentage'],
      supplier_value: [0]
    });
  }

  createForm() {
    this.regConfig = this.fb.group({
      suppliers: ['', Validators.required],
      city_name: [''],
      city_value_type: ['percentage'],
      city_value: [''],
      cities: this.fb.array([])
    });
  }

  getMarkupData() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
      module_type: 'b2c_helicopter',
      type: 'supplier',
      auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      is_deleted: 1
    }).subscribe(
      resp => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.respData = resp.data;
        } else {
          this.swalService.alert.oops();
        }
      },
      (err: HttpErrorResponse) => {
        this.swalService.alert.oops();
      }
    );
  }

  addGeneralMarkup() {
    if (this.supplierConfig.invalid) {
      return;
    }

    const formValue = this.supplierConfig.value;

    const payload = {
      type: 'supplier',
      fare_type: 'Public',
      module_type: 'b2c_helicopter',
      flight_airline_id: 0,
      value: parseInt(formValue.supplier_value),
      value_type: formValue.supplier_value_type,
      domain_list_fk: 1,
      markup_currency: this.defaultCurrency,
      auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      supplier_id: this.booking_source,
      countryCode: 'IN',
      cityId: 0,
      supplier: {},
      group_id: '0'
    };

    this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
      .subscribe(resp => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.getMarkupData();
          this.swalService.alert.success();
          this.supplierConfig.reset();
          this.supplierConfig.patchValue({
            supplier_value_type: 'percentage',
            supplier_value: 0
          });
        }
      });
  }

  addHeli() {
    if (this.regConfig.invalid) {
      return;
    }

    const formValues = this.regConfig.value;
    const supplierId = this.booking_source;

    const supplier = {
      city: {}
    };

    if (formValues.cities.length > 0) {
      formValues.cities.forEach((city: any) => {
        supplier.city[city.city_name] = {
          value: parseInt(city.city_value),
          value_type: city.city_value_type,
          name: this.getCityName(city.city_name)
        };
      });
    } else if (formValues.city_name) {
      supplier.city[formValues.city_name] = {
        value: parseInt(formValues.city_value),
        value_type: formValues.city_value_type,
        name: this.getCityName(formValues.city_name)
      };
    }

    const payload = {
      type: 'supplier',
      fare_type: 'Public',
      module_type: 'b2c_helicopter',
      flight_airline_id: 0,
      cityId: parseInt(formValues.city_name),
      value: parseInt(formValues.city_value) || 0,
      value_type: formValues.city_value_type || 'percentage',
      domain_list_fk: 1,
      markup_currency: this.defaultCurrency,
      auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      supplier_id: supplierId,
      countryCode: 'IN',
      supplier: supplier,
      group_id: '0'
    };

    this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
      .subscribe(resp => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.getMarkupData();
          this.swalService.alert.success();
          this.regConfig.reset();
          this.regConfig.patchValue({
            city_value_type: 'percentage'
          });
        }
      });
  }

  getSupplierWiseMarkupData(supplierId) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
      module_type: 'b2c_helicopter',
      type: 'supplier',
      auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      is_deleted: 1,
      supplier_id: supplierId.supplier_id
    }).subscribe(
      resp => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.supplierRespData = resp.data;

          const formValues = this.regConfig.value;

          let supplier = { city: {} };
          const mergedCityData = { ...supplier.city };

          if (formValues.cities.length > 0) {
            formValues.cities.forEach((city: any) => {
              mergedCityData[city.city_name] = {
                value: parseInt(city.city_value),
                value_type: city.city_value_type,
                name: this.getCityName(city.city_name)
              };
            });
          } else if (formValues.city_name) {
            mergedCityData[formValues.city_name] = {
              value: parseInt(formValues.city_value),
              value_type: formValues.city_value_type,
              name: this.getCityName(formValues.city_name)
            };
          }

          supplier.city = mergedCityData;

          const payload = {
            type: 'supplier',
            fare_type: 'Public',
            module_type: 'b2c_helicopter',
            cityId: parseInt(formValues.city_name),
            flight_airline_id: 0,
            value: parseInt(formValues.city_value) || 0,
            value_type: formValues.city_value_type || 'percentage',
            domain_list_fk: 1,
            markup_currency: this.defaultCurrency,
            auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
            supplier_id: supplierId.supplier_id,
            countryCode: 'IN',
            supplier: supplier,
            group_id: '0'
          };

          this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
            .subscribe(resp => {
              if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.getMarkupData();
                this.swalService.alert.success();
                this.regConfig.reset();
                this.regConfig.patchValue({
                  city_value_type: 'percentage'
                });
              }
            });
        } else {
          this.swalService.alert.oops();
        }
      },
      (err: HttpErrorResponse) => {
        this.swalService.alert.oops();
      }
    );
  }

  updatedMarkup() {
    if (this.regConfig.invalid) {
      return;
    }

    const formValue = this.regConfig.value;
    const supplierNameId = formValue.suppliers;

    const Supplier = this.supplierList.find(c => c.name === supplierNameId);
    const supplierId = Supplier ? Supplier.source_key : '';

    const citiesArray = this.regConfig.get('cities') as FormArray;

    const citiesData = citiesArray.controls.map(cityControl => {
      this.city = cityControl.value.city_name;
      this.cityValue = cityControl.value.city_value;
      this.cityValueType = cityControl.value.city_value_type;

      const cityId = cityControl.value.city_name;
      const cityValue = cityControl.value.city_value;
      const cityValueType = cityControl.value.city_value_type;

      const city = this.coreCityList.find(c => c.Id == cityId);
      const cityName = city ? city.cityName : '';

      return {
        [cityId]: {
          value: parseInt(cityValue),
          value_type: cityValueType,
          name: cityName
        }
      };
    });

    const payload = {
      type: 'supplier',
      fare_type: 'Public',
      module_type: 'b2c_helicopter',
      flight_airline_id: 0,
      cityId: parseInt(this.city),
      countryCode: 'IN',
      value: parseInt(this.cityValue),
      value_type: this.cityValueType,
      domain_list_fk: 1,
      markup_currency: this.defaultCurrency,
      auth_user_id: this.util.readStorage('currentSupervisionUser', sessionStorage).id,
      supplier_id: supplierId,
      supplier: {
        city: citiesData.reduce((acc, city) => ({ ...acc, ...city }), {})
      },
      group_id: '0'
    };

    this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {}, payload)
      .subscribe(resp => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.getMarkupData();
          this.supplierData = '';
          this.swalService.alert.success();
          this.regConfig.reset();
          this.regConfig.patchValue({
            city_value_type: 'percentage'
          });
        }
      });
  }

  onSubmit() {
    if (this.respData == null || !this.respData.length) {
      this.addHeli();
    } else if (this.supplierData) {
      this.updatedMarkup();
    } else {
      if (this.regConfig.invalid) {
        return;
      }

      const supplierId = this.booking_source;
      const existingSupplierData = this.respData.filter(item => item.supplier_id === supplierId);

      if (existingSupplierData.length) {
        this.getSupplierWiseMarkupData(existingSupplierData[0]);
      } else {
        this.addHeli();
      }
    }
  }

  selectedLocation(suppliers) {
    this.booking_source = `${suppliers['source_key']}`;
  }

  getSuppliers() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
      module: 'Helicopter',
      userType: 'B2C'
    }).subscribe(resp => {
      if (resp.statusCode === 201 || resp.statusCode === 200) {
        this.supplierList = resp.data.filter(
          supplier => supplier.name !== 'Humming Bird' && supplier.name !== 'Stuba'
        );
      }
    });
  }

  getCityListAuto(): void {
    this.subSunk.sink = this.apiHandlerService.apiHandler('markupCityList', 'post', {}, {}, {
      country_code: 'IN'
    }).subscribe(resp => {
      this.coreCityList = resp.data;
    });
  }

  getUsersList() {
    this.noData = true;
    this.respData = [];

    this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {}, {
      status: 1
    }).subscribe(
      resp => {
        this.noData = false;

        if ((resp.statusCode === 200 || resp.statusCode === 201) && resp.data && resp.data.length > 0) {
          this.respAgentData = resp.data || [];
        } else {
          this.respAgentData = [];
        }
      },
      err => {
        this.noData = false;
        this.respAgentData = [];
      }
    );
  }

  onCityChange(event) {
    const cityId = event;
    const selectedCity = this.coreCityList.find(city => city.Id == cityId);
    this.selectedCityName = selectedCity ? selectedCity.cityName : '';
  }

  selectedSupplierList(agent: any): string {
    if (!agent || !agent.supplier_id) {
      return 'Unknown Supplier';
    }

    const selectedAgent = (Array.isArray(this.supplierList) ? this.supplierList : []).find(
      supplier => supplier.source_key === agent.supplier_id
    );

    return selectedAgent ? selectedAgent.name : 'Unknown Supplier';
  }

  getFormattedSegment(segment: string): any {
    try {
      return [JSON.parse(segment || '{}')];
    } catch (error) {
      console.error('Error parsing supplier segment:', error);
      return [{}];
    }
  }

  patchFormData(data: any) {
    try {
      const supplierData = JSON.parse(data.supplier || '{}');
      this.supplierData = supplierData;

      const supplier = this.supplierList.find(supplier => supplier.source_key === data.supplier_id);
      const supplierName = supplier ? supplier.name : '';

      if (!data.cityId) {
        this.supplierConfig.patchValue({
          supplier_value: data.value,
          supplier_value_type: data.value_type,
          suppliers: supplierName
        });

        this.booking_source = data.supplier_id;
      } else {
        this.cities.clear();

        this.regConfig.patchValue({
          suppliers: supplierName
        });

        this.booking_source = data.supplier_id;
        this.getCityListAuto();

        if (supplierData.city) {
          for (const cityId in supplierData.city) {
            const cityData = supplierData.city[cityId];
            this.cities.push(
              this.createCityFormGroup(cityId, cityData.value, cityData.value_type)
            );
          }
        }
      }
    } catch (error) {
      console.error('Error patching form data:', error);
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
    this.patchedData = data;
    this.patchFormData(data);
  }

  deleteMarkup(data) {
    this.swalService.alert.delete(willDelete => {
      if (willDelete) {
        this.delete(data.id);
      }
    });
  }

  delete(id) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, {
      id: id,
      is_deleted: 0
    }).subscribe(resp => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.getMarkupData();
      }
    });
  }

  getCityName(cityId: any): string {
    const city = this.coreCityList.find((c: any) => c.Id == cityId);
    return city ? city.cityName : 'Unknown';
  }

  parseSupplier(supplier: string | object): any {
    try {
      return typeof supplier === 'string' ? JSON.parse(supplier) : supplier;
    } catch (error) {
      console.error('Error parsing supplier:', error);
      return {};
    }
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
