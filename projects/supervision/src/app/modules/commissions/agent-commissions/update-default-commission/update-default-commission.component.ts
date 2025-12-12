import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Logger } from '../../../../core/logger/logger.service';
import { CommissionsService } from '../../commissions.service';

const log = new Logger('report/B2cHotelComponent');
@Component({
    selector: 'app-update-default-commission',
    templateUrl: './update-default-commission.component.html',
    styleUrls: ['./update-default-commission.component.scss']
})
export class UpdateDefaultCommissionComponent implements OnInit, OnDestroy {

    @Input('getDataToUpdate') getDataToUpdate;
    @Output() toList = new EventEmitter<any>();
    subSunk = new SubSink();
    regConfig: FormGroup;
    tabLinks = [
        {
            label: 'Update Default Commission',
            icon: 'fa fa-plane',
            customClass: '',
        }
    ];
    commissions = [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
    ];
    towards = [
        { id: 0, name: 'All', value: 'all' },
        { id: 1, name: 'Flight Booking', value: 'b2b_flight' },
        { id: 2, name: 'Hotel Booking', value: 'b2b_hotel' },
        { id: 3, name: 'Car Booking', value: 'b2b_car' },
    ];

    defaultCurrency: string = '';
    agentList: any;
    addOrUpdate: string = 'add';
    submitted: boolean = false;
    preferredAirlines: Array<any> = [];
    locationsOrigin: Array<any> = [];
    locationsDestination: Array<any> = [];
    segmentsList: {} = {};
    lastKeyupTstamp: number = 0;
    currentUser: any;
    selectedCity: any;
    filteredAgentList: Observable<string[]>;
    filteredAirline: Observable<string[]>;
    agent_id:string="";
    airline_id:string="";

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private appService: AppService,
        private commissionsService: CommissionsService,
        private utilityService: UtilityService
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'))
        this.createForm();
        switch (this.getDataToUpdate && this.getDataToUpdate.module_type) {
            case "b2b_flight":
                this.regConfig.patchValue({
                    flightCom: this.getDataToUpdate.value
                }, { emitEvent: false });
                
                break;
            case "b2b_hotel":
                this.regConfig.patchValue({
                    hotelCom: this.getDataToUpdate.value
                }, { emitEvent: false });
                break;
            case "b2c_hotel":
                this.regConfig.patchValue({
                    hotelCom: this.getDataToUpdate.value
                }, { emitEvent: false });
                break;
            default:
                break
        };

        this.getAgentsList();
        this.getUpdateData();
        this.getAirlines();
    }

    getAirlines() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
            "name": ""
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.preferredAirlines = resp.data;
                this.setFilteredAirlineList();
            }
        });
    }

    getUpdateData() {
        this.subSunk.sink = this.commissionsService.selectedAgent.subscribe(data => {
            this.regConfig.patchValue({
             agent_id: data ? data.toString() : '',
            });
        });

        this.subSunk.sink = this.commissionsService.toUpdateData.subscribe(data => {
            this.getDataToUpdate = data;
            console.log(data)
            if (data && data.auth_user_id) {
                this.agent_id= data.auth_user_id;
                this.airline_id=data.flight_airline_id;
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    // agent_id: data.auth_user_id ? data.auth_user_id.toString() : '',
                    airlines: (data.flightAirline.name!== '' && data.flightAirline.name !== undefined) ? data.flightAirline.name : '',
                    module_type: data.module_type ? data.module_type : '',
                    c_value: data.value ? data.value.toString() : '',
                    value_type: data.value_type ? data.value_type : '',
                })
                let segment = JSON.parse(data.segment_list);
                let i = 0;
                for (const key of Object.keys(segment)) {
                    console.log(key, segment[key]);
                    let segs = key.split("-");
                    ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('from_airport_name').patchValue(
                        `${segs[0]}`
                    );
                    ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('to_airport_name').patchValue(
                        `${segs[1]}`
                    );
                    ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('s_value').patchValue(
                        `${segment[key]}`
                    );
                    i++;
                    if (i != Object.keys(segment).length) {
                        this.addMoreSegments();
                    }
                }
                if (+this.airline_id === 0) {
                    this.segments().clear();
                }
            } else {
                this.addOrUpdate = 'add';
                this.regConfig.reset();
            }
        })
    }

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.B2B_AUTH_ROLE_ID })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                    this.setFilteredAgentList();
                }
                else {

                }
            });
    }

    createForm() {
        this.regConfig = this.fb.group({
            flightCom: [''],
            hotelCom: [''],
            agent_id: [null, Validators.required],
            module_type: ['b2b_flight'],
            airlines: [null, Validators.required],
            id: [0],
            segments: this.fb.array([this.fb.group({
                from_airport_name: [''],
                to_airport_name: [''],
                s_value: [null],
            })]),
            c_value: [null, Validators.required],
            value_type: ['percentage'],
            domain_list_fk: [1],
            commission_currency: ['GBP'],
            auth_user_id: [this.currentUser.id],
            created_by_id: [this.currentUser.id]
        })
    }

    get segment(): FormArray {
        return this.regConfig.get('segments') as FormArray;
    }

    segments(): FormArray {
        return this.regConfig.get("segments") as FormArray
    }

    moreSegments(): FormGroup {
        return this.fb.group({
            from_airport_name: [''],
            to_airport_name: [''],
            s_value: [null],
        })
    }

    addMoreSegments() {
        this.segments().push(this.fb.group({
            from_airport_name: [''],
            to_airport_name: [''],
            s_value: [null],
        }));
    }

    removeSegment(i: number) {
        this.segments().removeAt(i);
    }

    checkAirline(event) {
        this.airline_id= event.option.id;
        if (event.option.id == 0) {
            this.segments().clear();
        } else if (this.segments().length == 0) {
            this.addMoreSegments();
        }
    }

    onSubmit() {
        if (this.addOrUpdate == "add") {
            this.submitted = true;
        }
        if (this.regConfig.invalid)
            return;
        let segJson = {};
        this.regConfig.value.segments.map((segment) => {
            segment.from_airport_name = segment.from_airport_name.includes("(") ? segment.from_airport_name.substring(
                segment.from_airport_name.indexOf("(") + 1,
                segment.from_airport_name.lastIndexOf(")")
            ) : segment.from_airport_name;

            segment.to_airport_name = segment.to_airport_name.includes("(") ? segment.to_airport_name.substring(
                segment.to_airport_name.indexOf("(") + 1,
                segment.to_airport_name.lastIndexOf(")")
            ) : segment.to_airport_name;
            let segKey = segment.from_airport_name + "-" + segment.to_airport_name;
            segJson[segKey] = parseFloat(segment.s_value);
        })
        switch (this.addOrUpdate) {
            case 'add':
                this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bCommission', 'post', {}, {}, {
                    //  "id": this.regConfig.value.id,
                    "module_type": "b2b_flight",
                    "value": parseFloat(this.regConfig.value.c_value),
                    "value_type": "percentage",
                    "commission_currency": this.defaultCurrency || 'GBP',
                    "auth_user_id": parseInt(this.agent_id),
                    "flight_airline_id": parseInt(this.airline_id),
                    "segment_list": JSON.stringify(segJson),
                    "domain_list_fk": 1,
                })
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.add(resp.msg || resp.Message || '');
                            this.regConfig.reset();
                            this.toList.emit({ tabId: 'agent_list', data: {} });
                        } else {
                            this.swalService.alert.oops(resp.Message || '');
                        }
                    }, (error) => {
                        this.swalService.alert.oops(error.error.Message || '');
                    })
                break;
            case 'update':
                this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bCommission', 'post', {}, {}, {
                    "id": this.regConfig.value.id,
                    "module_type": this.regConfig.value.module_type,
                    "value": parseFloat(this.regConfig.value.c_value),
                    "value_type": 'percentage',
                    "commission_currency": this.defaultCurrency || 'GBP',
                    "segment_list": JSON.stringify(segJson),
                    "auth_user_id": parseInt(this.agent_id),
                    "domain_list_fk": 1,
                    "flight_airline_id": parseInt(this.airline_id),
                })
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.update(resp.msg || resp.Message || '');
                            this.commissionsService.toUpdateData.next({});
                            this.regConfig.reset();
                            this.addOrUpdate = "add";
                            this.toList.emit({ tabId: 'agent_list', data: {} });
                        }
                    })
                break;
            default:
                break;
        }
    }

    onUpdate() {
        console.log(this.regConfig.value)
        if (this.utilityService.isEmpty(this.regConfig.value)) {
            this.swalService.alert.oops('Please select the agent from Agen List to update the commission')
        }
        let val = this.regConfig.value.flightCom || this.regConfig.value.hotelCom;
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateB2bCommission', 'post', {}, {}, {
            "id": this.getDataToUpdate.id,
            "value": Number(val),
            "value_type": this.getDataToUpdate.value_type || 'percentage',
            "commission_currency": this.defaultCurrency
        })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update(resp.msg || resp.Message || '');
                    this.regConfig.reset();
                    this.toList.emit({ tabId: 'agent_list', data: {} });
                }
            })
    }

    getAutoCompleteLocations(event, type, i) {
        this.selectedCity = i;
        let inpValue = event.target.value;
        this.locationsDestination.length = 0;
        this.locationsOrigin.length = 0;
        if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('flightAutocomplete', 'post', {}, {}, {
                text: `${inpValue}`
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    if (type == 'from') {
                        this.locationsOrigin = resp.data || [];
                    } else if (type == 'to') {
                        this.locationsDestination = resp.data || [];
                    }
                } else {
                    log.error('Something went wrong')
                }
            }, err => { log.error(err) });
            this.lastKeyupTstamp = event.timeStamp;
        }
    }

    selectedOrigin(location, i) {
        this.segmentsList['origin'] = location.AirportCode;
        ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('from_airport_name').patchValue(
            `${location.AirportName + ' ' + '(' + location.AirportCode + ')'}`
        );
        this.locationsOrigin = [];
        return;
    }

    selectedDest(location, i) {
        this.segmentsList['destination'] = location.AirportCode;
        ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('to_airport_name').patchValue(
            `${location.AirportName + ' ' + '(' + location.AirportCode + ')'}`
        );
        this.locationsDestination = [];
        return;
    }

    getAirportLocation(location) {
        return location.AirportName + ' ' + location.AirportCity + '(' + location.AirportCode + '), ' + location.CountryName;
    }

    reset() {
        this.commissionsService.toUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = "add";
    }

    setFilteredAgentList() {
        this.filteredAgentList = this.regConfig.controls.agent_id.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name+' ('+ option.uuid +')').toLowerCase().includes(filterValue));
      }

      setFilteredAirlineList() {
        this.filteredAirline = this.regConfig.controls.airlines.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAirline(value || '')),
        );
    }

    _filterAirline(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.preferredAirlines.filter(option => (option.name+' ('+ option.code +')').toLowerCase().includes(filterValue));
      }

      onSelectionChanged(event) {
        this.agent_id= event.option.id;
    }  

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    numberOnly(event): boolean {
        return this.utilityService.numberOnly(event);
    }

}
