import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
const log = new Logger('transfer-crs/TransferVehicleListComponent');
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import * as moment from 'moment';
import { TransferCrsService } from '../../../transfer-crs.service';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-vehicle-list',
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.scss']
})
export class TransferVehicleListComponent implements OnInit {
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "status", value: 'Status.' },
        { key: "vehicle_name", value: 'Vehicle Name' },
        { key: "vehicle_type", value: 'Vehicle Type' },
        // { key: "country", value: 'Country' },
        { key: "start_point", value: 'Starting point' },
        { key: "end_point", value: 'Ending point' },
                        { key: "action", value: 'Action' },
        
    ];
    public noData: boolean = true;
    public respData: any;
    vehiclePriceForm: FormGroup;
    public isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-green'
    };
    status;
    public saveBtnText: string = 'Add';
    public vehicleId: number;
    @Output() toUpdate = new EventEmitter<any>();
    public vehicleMasterDataList: any[] = [];
    public onEditPrice: boolean = false;
    public searchText: string = '';
    subSunk=new SubSink();

    public vehicleListForm: FormGroup;
    public onEditTransferVehicle: boolean = false;
    public vehiclesType: any[] = [];
    public seatCapacity = Array.from({ length: 71 }, (_, index) => index + 1);
    public ratingList = [
        { key: 'Standard' },
        { key: 'Premium' },
        { key: 'Mid-Luxury' },
        { key: 'Luxury' },
        { key: 'Ultra-Luxury' }
    ];
    public acType = [{ key: 'Yes' }, { key: 'No' }];
    public rideType = [
        { key: 'private', value: 'private' },
        { key: 'public', value: 'public' }
    ];
    public countryList: any[] = [];
    public routesNamesLocation: any[] = [];
    public endPointLocations: any[] = [];
    public startingPointLocations: any[] = [];
    public citySearchTimeout: any;
    public startPointSelectedLocation: any;
    public endPointSelectedLocation: any;
    public transferCityList: any;
    public locationSelected: any;
    public selectedMultipleLocation: any[] = [];

    public loadingTemplate: any
    public secondaryColour: any;
    public primaryColour: any;
    public loading: boolean = false;
    public submittedVehicle: boolean = false;
    public submitted:boolean = false;
    public minDate = new Date();
    public minEndDate = new Date();
    seasonMinDates: Date[] = [];
    endMinDates: Date[] = [];
    public searchSpin: boolean = true;
    multipleRoutes: FormArray;
    maxRoutesCount: any;
    fromStatusUpdate: boolean = false;
    public dynamicColumnsAdded: boolean = false;
    public loggedInAuthUser: any;
    viewPriceDetails: boolean = false;
    priceDetails: any;
    loggedInAuthId: any;
        canEditRouteList: boolean = false;
onlyViewRouteList: boolean = false;
canEditTransfers: boolean = false;
loggedUserCurrency: any;
 public isAddRouteCityLoading: boolean[] = [];

    constructor(
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private transferCrsService: TransferCrsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
        this.loggedInAuthUser = JSON.parse(currentDomainUser)['id'];
        this.loggedInAuthId = JSON.parse(currentDomainUser)['auth_role_id'];
        this.loggedUserCurrency = JSON.parse(currentDomainUser)['currency'];
        this.getvehicleMasterList();
        this.updateVehiclePriceForm();
        this.createVehicleListForm();
        this.getVehicleTypeList();
        this.getCoreCountryList();
    }

    getVehicleTypeList() {
        const payload = {
            created_by_id: 1
        }
        this.apiHandlerService.apiHandler('vehicleMasterList', 'POST', {}, {}, payload).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.vehiclesType = res.data
                } else {
                    this.vehiclesType = [];
                }
            }, error: (err) => {
                this.vehiclesType = [];
            }
        })
    }
    getCoreCountryList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'countryList';
        this.transferCrsService.fetch(data).subscribe(
            resp => {
                this.countryList = resp.data.countries;
            }
        )
    }

    createVehicleListForm() {
        this.vehicleListForm = this.fb.group({
            id: [''],
            vehicle_type: [0, Validators.required],
            vehicle_name: ['', Validators.required],
            ac_vehicle: ['', Validators.required],
            max_capacity: ['', Validators.required],
            ride_type: ['', Validators.required],
            ratings: ['', Validators.required],
            image: ['', Validators.required],
            status: [false, Validators.required],
            luggage_allowances: ['', Validators.required],
            country_id: ['', Validators.required],
            starting_point: ['', Validators.required],
            end_point: ['', Validators.required],
            route: [''],
            route_name: [''],
            routes: this.fb.array([]),
        })
        this.multipleRoutes = this.vehicleListForm.get('routes') as FormArray;
    }

    // get multipleRoutes(): FormArray {
    //     return this.vehicleListForm.get('routes') as FormArray;
    // }

    addRoutes() {
        const addingRoutes = this.fb.group({
            route: [''],
            route_name: ['']
        });
        this.multipleRoutes.push(addingRoutes);
    }
    removeRoutes(index: number) {
        this.multipleRoutes.removeAt(index);
        if(this.selectedMultipleLocation) {
            this.selectedMultipleLocation.splice(index,1)
        }
    }


    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'vehicle_name': return this.utility.compare('' + a.vehicle_name, '' + b.vehicle_name, isAsc);
                default: return 0;
            }
        });
    }

    getvehicleMasterList() {
        const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
        const loggedInAuthUser = JSON.parse(currentDomainUser)['auth_role_id'];
        let created_by_id;
        if(loggedInAuthUser !== 7) {
            created_by_id = 1
        } else {
            created_by_id = JSON.parse(currentDomainUser)['id'];
        }
        const payLoad = {
            created_by_id: String(created_by_id),
            auth_role_d: loggedInAuthUser
        }
        this.apiHandlerService.apiHandler('getVehicleList', 'POST', {}, {}, payLoad).subscribe({
            next: (response) => {
                console.log(response)
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    
                    response.data.forEach(item => {
                    try {
                        item.route_name_list = JSON.parse(item.route_name || "[]");
                    } catch(err) {
                        item.route_name_list = [];
                    }
                    });
                    
                    
                     response.data.forEach((data) => {

                        // Default permissions for every row
                        data.canEditRouteList = false;
                        data.onlyViewRouteList = false;
                        data.canEditTransfers = false;

                        // CASE 1: Session role is Admin or Sub Admin
                        if (this.loggedInAuthId === 1 || this.loggedInAuthId === 3) {

                            if (data.auth_role_id === 1 || data.auth_role_id === 3) {
                                data.canEditRouteList = true;
                            } else {
                                data.onlyViewRouteList = true;
                            }

                        }

                        // CASE 2: Session role is 7
                        else if (this.loggedInAuthId === 7) {
                            data.canEditRouteList = true;
                        }

                        });
                        this.respData = response.data;
                    
                    this.maxRoutesCount = Math.max(
                        ...this.respData.map(item => item.route_name_list.length)
                        );
                         this.displayColumn = this.displayColumn.filter(
                            col => !col.key.startsWith("location_")
                        );
                        // if (!this.dynamicColumnsAdded) {
                        //     this.dynamicColumnsAdded = true; 
                            for (let i = 1; i <= this.maxRoutesCount; i++) {
                                this.displayColumn.splice(5 + (i - 1), 0, {
                                    key: "location_" + i,
                                    value: "Location " + i
                                });
                            }
                        // }
                    this.collectionSize = response.data.length;
                    this.noData = false;
                    this.searchSpin = true;
                }
                else {
                    this.searchSpin = false;
                    this.noData = false;
                    this.respData = [];
                }

            }, error: (err) => {
                this.searchSpin = false;
                this.respData = [];
                this.noData = false;
            }
        })
    }

    updateVehiclePriceForm() {
        this.vehiclePriceForm = this.fb.group({
            vehicle_pricing_details: this.fb.array([])
        })
    }
    get cancellationPolicies(): FormArray {
        return this.vehiclePriceForm.get('vehicle_pricing_details') as FormArray;
    }

    addPolicy() {
        const policyGroup = this.fb.group({
            id:[''],
            date_from: ['', Validators.required],
            date_to: ['', Validators.required],
            is_return: [false],
            base_price: ['', Validators.required],
            same_day_return: [0],
            diff_day_return: [0],
            is_refundable: [false],
            charge_type: ['', Validators.required],
            cancellation_charge: [0],
            refundable_before_days: [0, Validators.required],
            additional_info: [''],
        });

        const lastIndex = this.cancellationPolicies.length - 1;
        let nextStartDate = this.minDate;
         if (lastIndex >= 0) {
        const prevEnd = this.cancellationPolicies.at(lastIndex).get('date_to').value;
        if (prevEnd) {
            // Convert to Date object if it's a string (DD/MM/YYYY format)
            let prevEndDate: Date;
            if (typeof prevEnd === 'string') {
                prevEndDate = moment(prevEnd, 'DD/MM/YYYY').toDate();
            } else {
                prevEndDate = new Date(prevEnd);
            }
            // Set next start date to day after previous end date
            nextStartDate = new Date(prevEndDate.getTime() + 24 * 60 * 60 * 1000);
            // Auto-fill the date_from field
            policyGroup.patchValue({
                date_from: moment(nextStartDate).format('DD/MM/YYYY')
            });
        }
        this.seasonMinDates.push(nextStartDate);
    } else {
        this.seasonMinDates.push(this.minDate);
    }
        this.endMinDates.push(this.minDate);
        
        this.cancellationPolicies.push(policyGroup);
    }
    onStartDateChange(event: Date, seasonIndex: number) {
    this.endMinDates[seasonIndex] = new Date(event);
    const season = this.cancellationPolicies.at(seasonIndex);
    const endDateCtrl = season.get('date_to');
    if (endDateCtrl.value && new Date(endDateCtrl.value) < event) {
      endDateCtrl.setValue('');
    }
  }
    onEndDateChange(event: Date, seasonIndex: number) {
        const nextIndex = seasonIndex + 1;
        if (nextIndex < this.cancellationPolicies.length) {
            this.seasonMinDates[nextIndex] = new Date(event);
        }
    }
    removePolicy(index: number) {
        this.cancellationPolicies.removeAt(index);
    }

    populatePriceForn(data) {
        this.cancellationPolicies.clear();
        data.forEach((data) => {
            this.cancellationPolicies.push(
                this.fb.group({
                    id: data.id,
                    date_from: moment(data.date_from).format('DD/MM/YYYY'),
                    date_to: moment(data.date_to).format('DD/MM/YYYY'),
                    is_return: data.return_trip === 1 ? true : false,
                    base_price: data.base_price,
                    same_day_return: data.same_day_return,
                    diff_day_return: data.diff_day_return,
                    is_refundable: data.is_refundable === 1 ? true : false,
                    charge_type: data.charge_type,
                    cancellation_charge: data.cancellation_charge,
                    refundable_before_days: data.refundable_before_days,
                    additional_info: data.additional_info
                })
            )
        })
    }
    hide() {
        this.viewPriceDetails = false;
    }
    updateVehiclePrice(id, type, from) {
        if(this.onEditTransferVehicle) {
            this.onEditTransferVehicle = false;
        }
        this.vehicleId = Number(id);
        const req = { id: id }
        if (type === 'update') {
           
            this.loading = true;
            this.apiHandlerService.apiHandler('getVehiclePriceList', 'POST', {}, {}, req).subscribe({
                next: (res) => {
                    if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                        this.loading = false;
                        res.data.sort((a, b) => {
                            const d1 = new Date(a.date_from).getTime();
                            const d2 = new Date(b.date_from).getTime();

                            if (d1 !== d2) return d1 - d2;

                            // if date_from same → sort by date_to
                            return new Date(a.date_to).getTime() - new Date(b.date_to).getTime();
                            });
                            this.minDate = new Date(
                            Math.max(...res.data.map(item => new Date(item.date_to).getTime()))
                            );
                        this.priceDetails = res.data;
                        if(from !== 'view') {
                            this.saveBtnText = 'Update'
                            this.populatePriceForn(res.data);
                            this.onEditPrice = true;
                        }
                         if (from === 'view') {
                this.viewPriceDetails = true;
            }
                        
                    } else {
                        this.loading = false;
                    }

                    console.log(res)
                }, error: (err) => {
                    this.loading = false;
                    console.log(err);
                    this.swalService.alert.error(err.Message);
                }
            })
        }
        if (type === 'add') {
            this.saveBtnText = 'Add';
            this.onEditPrice = true;
            this.cancellationPolicies.clear();
            this.addPolicy();
        }
        
    }

    onCancel() {
        this.vehiclePriceForm.reset();
        this.cancellationPolicies.clear();
        this.onEditPrice = false;
        this.onEditTransferVehicle = false;
    }

    

    onSubmit() {
        const getUserData = sessionStorage.getItem('currentSupervisionUser');
        const userId = JSON.parse(getUserData);
        const loggedInAuthUser = JSON.parse(getUserData)['auth_role_id'];
            let created_by_id;
            if(loggedInAuthUser !== 7) {
                created_by_id = 1
            } else {
                created_by_id = JSON.parse(getUserData)['id'];
            }
        const rawValue = this.vehiclePriceForm.value;
        const formattedRequest = {
            ...rawValue, vehicle_id: this.vehicleId,
            created_by_id: created_by_id,
            vehicle_pricing_details: rawValue.vehicle_pricing_details.map((detail: any) => ({
                ...detail,
                date_from: moment(detail.date_from, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                date_to: moment(detail.date_to, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                is_refundable: detail.is_refundable === true ? true : false,
                is_return: detail.is_return === false ? 0 : 1
            }))
        };
        if (this.saveBtnText === 'Add') {
            this.loading = true;
            this.apiHandlerService.apiHandler('addVehiclePrice', 'POST', {}, {}, formattedRequest).subscribe({
                next: (res) => {
                    if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                        this.loading = false;
                        this.swalService.alert.success('Vehicle Price Added Scuccessfully');
                        this.onEditPrice = false;
                        this.onEditTransferVehicle = false;
                        this.cancellationPolicies.clear();
                        this.vehiclePriceForm.reset();
                        this.getvehicleMasterList();
                    } else {
                        this.loading = false;
                        this.swalService.alert.oops(res.Message);
                    }

                    console.log(res)
                }, error: (err) => {
                    console.log(err);
                    this.loading = false;
                    this.swalService.alert.error(err.Message);
                }
            })
        }
        if (this.saveBtnText === 'Update') {
            this.loading = true;
            this.apiHandlerService.apiHandler('updateVehiclePrice', 'POST', {}, {}, formattedRequest).subscribe({
                next: (res) => {
                    if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                        this.loading = false;
                        this.swalService.alert.success('Vehicle Price Updated Scuccessfully');
                        this.onEditPrice = false;
                        this.cancellationPolicies.clear();
                        this.vehiclePriceForm.reset();
                        this.getvehicleMasterList();
                    } else {
                        this.loading = false;
                        this.swalService.alert.oops(res.Message);
                    }

                    console.log(res)
                }, error: (err) => {
                    console.log(err);
                    this.loading = false;
                    this.swalService.alert.error(err.Message);
                }
            })
        }
    }

    onSubmitVehicleUpdate() {
        const selectedLocatin = this.selectedMultipleLocation.map(item => {
                                if (item.hasOwnProperty('route')) {
                                    return item; // already has correct keys
                                } else {
                                    return {
                                    route: item.id,
                                    route_name: item.location_name
                                    };
                                }
                                });
        const getSelectedId = selectedLocatin.map(data=> data.route);
        const getSelectedLocation = selectedLocatin.map(data=> data.route_name);
        this.vehicleListForm.patchValue({
            route: getSelectedId.filter(data => data !== ''),
            route_name: getSelectedLocation.filter(data => data !== ''),
            starting_point: this.startPointSelectedLocation.id,
            end_point: this.endPointSelectedLocation.id,
            vehicle_type: Number(this.vehicleListForm.value.vehicle_type),
            country_id: String(this.vehicleListForm.value.country_id),
            max_capacity: String(this.vehicleListForm.value.max_capacity),
            status: this.vehicleListForm.value.status ? true : false
        })
        this.vehicleListForm.removeControl('routes');
        console.log(this.vehicleListForm.value);
        const req = this.vehicleListForm.value
        this.loading = true;
        this.apiHandlerService.apiHandler('updateTransfer', 'POST', {}, {}, req).subscribe({
            next: (res) => {
                console.log(res);
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.swalService.alert.success(res.Message);
                    this.loading = false;
                    this.onEditTransferVehicle = false;
                    this.onEditPrice = false;
                    this.getvehicleMasterList();
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                console.log(err);
                this.loading = false;
                this.swalService.alert.error(err.Message);
            }
        })
    }

    deleteVehicle(id) {

    }

    updateVehicleList(data) {
//         this.router.navigate(
//   ['/transfers/transfer-crs-list'],
//   { queryParams: { tab: 'add_vehicles' } }
// );
// this.transferCrsService.updatTransferData.next(data);
         this.multipleRoutes = this.vehicleListForm.get('routes') as FormArray;
        console.log(data);
        if (this.onEditPrice && !this.fromStatusUpdate) {
            this.onEditPrice = false;
        }
        this.loading = true;
        this.startPointSelectedLocation = {id: data.starting_point};
        this.endPointSelectedLocation = {id: data.end_point};
        this.onEditTransferVehicle = true;
        this.vehicleListForm.patchValue({
            vehicle_type: data.vehicle_type,
            vehicle_name: data.vehicle_name,
            ac_vehicle: data.ac_vehicle,
            max_capacity: data.max_capacity,
            ride_type: data.ride_type,
            ratings: data.ratings,
            image: '',
            status: data.status,
            luggage_allowances: data.luggage_allowances,
            country_id: data.country_id,
            starting_point: data.start_point_name,
            end_point: data.end_point_name,
            id: data.id
        });
        if (!this.multipleRoutes) {
            this.multipleRoutes = this.fb.array([]);
            this.vehicleListForm.setControl('routes', this.multipleRoutes);
        } else {
            this.multipleRoutes.clear(); // optional: clear old routes
        }
        
        const route = JSON.parse(data.route);
        const routeName = JSON.parse(data.route_name);
        if (routeName.length && route.length) {
            routeName.forEach((routData, index) => {
                this.multipleRoutes.push(
                    this.fb.group({
                        route: route[index],
                        route_name: routData
                    })
                )
            })
        } else {
            this.addRoutes();
        }
        this.selectedMultipleLocation = this.vehicleListForm.value.routes;
        this.loading = false;
    }

    getAutoCompleteLocations(event, control, index) {
        let inpValue = event.target.value;
        if (this.vehicleListForm.get('end_point').value != '' && this.vehicleListForm.get('starting_point').value != '' && this.vehicleListForm.get('end_point').value == this.vehicleListForm.get('starting_point').value) {
            this.swalService.alert.oops('Departure and destination city cannot be same');
            return;
        }
        const routesArray = this.vehicleListForm.get('routes') as FormArray;

        if (routesArray && routesArray.at(index)) {
            const routeGroup = routesArray.at(index) as FormGroup;
            if (inpValue && inpValue.trim() !== '') {
                routeGroup.get('route_name').setValidators([Validators.required]);
            } else {
                routeGroup.get('route_name').clearValidators();
            }
            routeGroup.get('route_name').updateValueAndValidity();
        }

        if (this.routesNamesLocation && !this.routesNamesLocation[index]) {
            this.routesNamesLocation[index] = [];
        }
        if (control === 'route_name') {
            this.isAddRouteCityLoading[index] = true;
        }

        clearTimeout(this.citySearchTimeout);
        const city_name = `${event.target.value}`;
        // Set a new timer
        this.citySearchTimeout = setTimeout(() => {
            this.getCityList(event, control, city_name, index);
        }, 1000);
    }

    getCityList(event, control, city_name, index) {
        // this.loading = true;
        let request = { 'Name': city_name, 'userType': 'B2C' };
        this.apiHandlerService.apiHandler('transferCityList', 'POST', '', '', request)
            .pipe(debounceTime(2000))
            .subscribe((resp: any) => {
                if ((resp.statusCode === 200 || resp.statusCode === 201) && resp.Status === true) {
                    console.log(resp);
                    this.loading = false;
                    if (control === 'startPoint') {
                        this.startingPointLocations = resp.data;
                    }
                    if (control === 'endPoint') {
                        this.endPointLocations = resp.data;
                    }
                    if (control === 'route_name') {
                        this.isAddRouteCityLoading[index] = false;
                        this.routesNamesLocation[index] = resp.data;
                    }
                    if (resp.data.length === 0) {
                        // this.loading = true;
                        const getCountryId = this.vehicleListForm.value.country_id;
                        const selectedCountry = this.countryList.find(country => country.id == getCountryId);
                        const req = {
                            CityName: city_name,
                            CountryName: selectedCountry.name
                        }
                        this.apiHandlerService.apiHandler('addTransferCity', 'POST', {}, {}, req).subscribe({
                            next: (res) => {
                                console.log(res)
                                if ((res.statusCode === 200 || res.statusCode === 201) && res.Status === true) {
                                    console.log(res);
                                    this.loading = false;
                                    if (control === 'startPoint') {
                                        this.startingPointLocations = res.data;
                                    }
                                    if (control === 'endPoint') {
                                        this.endPointLocations = res.data;
                                    }
                                    if (control === 'route_name') {
                                        this.isAddRouteCityLoading[index] = false;
                                        this.routesNamesLocation[index] = res.data;
                                    }
                                } else {
                                    this.loading = false;
                                    this.transferCityList = [];
                                    this.routesNamesLocation[index] = [];
                                    this.endPointLocations = [];
                                    this.startingPointLocations = [];
                                }
                            }, error: (err) => {
                                this.loading = false;
                                console.log(err)
                                this.transferCityList = [];
                                this.routesNamesLocation[index] = [];
                                this.endPointLocations = [];
                                this.startingPointLocations = [];
                            }
                        })
                    }

                } else {
                    this.loading = false;
                    this.transferCityList = [];
                    this.routesNamesLocation[index] = [];
                    this.endPointLocations = [];
                    this.startingPointLocations = [];
                }
            }, err => {
                console.error("API error:", err);
                this.loading = false;
                this.transferCityList = [];
                this.routesNamesLocation[index] = [];
                this.endPointLocations = [];
                this.startingPointLocations = [];
            });
    }

    selectedLocation(event, control, index) {
        console.log(event);
        if (event) {
            this.locationSelected = event;
            if (control === 'starting_point') {
                this.startPointSelectedLocation = event;
                this.vehicleListForm.patchValue({
                    starting_point: event.location_name,
                });
            }
            if (control === 'end_point') {
                this.endPointSelectedLocation = event;
                this.vehicleListForm.patchValue({
                    end_point: event.location_name
                });
            }
            if (control === 'route_name') {
                this.isAddRouteCityLoading[index] = false;
                const routesArray = this.vehicleListForm.get('routes') as FormArray;
                const selectedRouteName = event.location_name;

                const startPoint = this.vehicleListForm.get('starting_point').value;
                const endPoint = this.vehicleListForm.get('end_point').value;

                const existingRouteNames = routesArray.controls
                    .map((ctrl, i) => (i !== index ? ctrl.get('route_name').value : null))
                    .filter(v => !!v);

                if (
                    selectedRouteName === startPoint ||
                    selectedRouteName === endPoint ||
                    existingRouteNames.includes(selectedRouteName)
                ) {
                    this.swalService.alert.oops(
                        'This route location cannot be same as starting point, end point, or another route name.'
                    );
                    routesArray.at(index).get('route_name').setValue('');
                    return;
                }
                if (
                    selectedRouteName !== startPoint ||
                    selectedRouteName !== endPoint ||
                    !existingRouteNames.includes(selectedRouteName)
                ) {
                    this.selectedMultipleLocation.push(event);
                }
                routesArray.at(index).get('route_name').setValue(selectedRouteName);
            }

            if (this.vehicleListForm.get('end_point').value != '' && this.vehicleListForm.get('starting_point').value != '' && this.vehicleListForm.get('end_point').value == this.vehicleListForm.get('starting_point').value) {
                this.swalService.alert.oops('Departure and destination city cannot be same');
                if (control === 'starting_point') {
                    this.vehicleListForm.patchValue({
                        starting_point: '',
                    });
                }
                if (control === 'end_point') {
                    this.vehicleListForm.patchValue({
                        end_point: ''
                    });
                }
                return;
            }
            this.endPointLocations = [];
            this.startingPointLocations = [];
            this.transferCityList = [];
            this.routesNamesLocation[index ? index : 0] = [];
        }
    }

    
  onCheckboxChange(event, index) {
    const checked = event.target.checked;
    const policyGroup = this.cancellationPolicies.at(index) as FormGroup;
    policyGroup.patchValue({
      is_return: checked ? 1 : 0,
    });
    const sameDayCtrl = policyGroup.get('same_day_return');
    const diffDayCtrl = policyGroup.get('diff_day_return');
    if (checked) {
      sameDayCtrl.setValidators([Validators.required]);
      diffDayCtrl.setValidators([Validators.required]);
    } else {
      sameDayCtrl.clearValidators();
      diffDayCtrl.clearValidators();
      sameDayCtrl.setValue('');
      diffDayCtrl.setValue('');
    }

    sameDayCtrl.updateValueAndValidity();
    diffDayCtrl.updateValueAndValidity();
  }

  get f() {
    return this.vehicleListForm.controls;
  }

  cancelDeletePopup(id) {
      const req = {
        id: id
      }
      this.loading = true;
        this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('transferListDelete', 'post', {}, {},req)
            .subscribe(response => {
                if (response.Status === true && (response.statusCode == 200 || response.statusCode == 201)) {
                  this.loading = false;
                    this.swalService.alert.success('Transfer List has been deleted successfully')
                    this.getvehicleMasterList();
                } else {
                  this.swalService.alert.oops(response.Message)
                  this.loading = false;
                }
            },(err: HttpErrorResponse) => {
              this.loading = false;
            this.swalService.alert.error(err['error']['Message']);
            });
        }
      })
    }
  
    ondateChange(event) {
        this.minEndDate = new Date(event)
    }

    onStatusChange(event:MatSlideToggleChange,data) {
        this.fromStatusUpdate = true;
        this.onEditPrice = false;
        const req = {
            id: data.id,
            status: event.checked
        }
        this.loading = true;
        this.apiHandlerService.apiHandler('updateVehicleStatus', 'POST', {}, {}, req).subscribe({
            next: (res) => {
                console.log(res);
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.swalService.alert.success("Status Updated Successfully.");
                    this.loading = false;
                    this.onEditTransferVehicle = false;
                    this.onEditPrice = false;
                    this.getvehicleMasterList();
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message);
                }
            }, error: (err) => {
                console.log(err);
                this.loading = false;
                this.swalService.alert.error(err.Message);
            }
        })
    }


}
