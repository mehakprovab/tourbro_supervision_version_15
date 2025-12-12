import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const log = new Logger('AgentMarkupAddUpdateComponent');
@Component({
    selector: 'app-agent-markup-add-update',
    templateUrl: './agent-markup-add-update.component.html',
    styleUrls: ['./agent-markup-add-update.component.scss']
})
export class AgentMarkupAddUpdateComponent implements OnInit {

    @Input('getDataToUpdate') getDataToUpdate;
    @Output() toList = new EventEmitter<any>();
    subSunk = new SubSink();
    regConfig: FormGroup;
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
    subscription: Subscription
    filteredOptions: Observable<string[]>;
    filteredAirline: Observable<string[]>;
    agent_id:string="";
    airline_id:string="";
    supplierList :Array<any> = [];
    noData: boolean = true;
    respData: Array<any> = [];
    booking_source:any;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private appService: AppService,
        private markupsService: MarkupService,
        private utilityService: UtilityService,
        private cdr: ChangeDetectorRef,
    ) {

        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'))
        console.log("this.currentUser",this.currentUser)
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
        this.getUsersList();
        this.getSuppliers();
        this.formValueChanges();
        setTimeout(() => {
            this.getUpdateData(); 
        }, 1000);
        // this.getUpdateData();
        //  this.cdr.detectChanges();
    }

    formValueChanges() {
        const markupValueControl = this.regConfig.get('value_type');
        this.subscription = this.regConfig.get('value_type').valueChanges
            .subscribe(markupType => {
                if (markupType) {
                    if (markupType == "plus") {
                        markupValueControl.setValidators([Validators.required, Validators.max(100000)]);
                    }

                    if (markupType == "percentage") {
                        markupValueControl.setValidators([Validators.required, Validators.max(100)]);
                    }
                    markupValueControl.updateValueAndValidity({ emitEvent: false });
                }
            })
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

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.B2B_AUTH_ROLE_ID })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                    this.setFilteredAgentList();
                }
                else {

                }
            });
    }

    getUpdateData() {
        this.subSunk.sink = this.markupsService.selectedAgent.subscribe(data => {
            this.regConfig.patchValue({
             agent_id: data ? data.toString() : '',
            });
        });
        this.subSunk.sink = this.markupsService.toUpdateData.subscribe(data => {
            this.getDataToUpdate = data;
            console.log(data)
            if (data && data.auth_user_id) {
                this.agent_id= data.auth_user_id;
                this.airline_id=data.flight_airline_id;
                this.addOrUpdate = 'update';
                 console.log("this.respData",this.respData)
                const selectedAgent = this.respData.find(agent => agent.id === parseInt(data.group_id));
                this.regConfig.patchValue({
                    // id: data.id ? data.id : '',
                    // // agent_id: data.auth_user_id ? data.auth_user_id.toString() : '',
                    // airlines: (data.flightAirline.name!== '' && data.flightAirline.name !== undefined) ? data.flightAirline.name : '',
                    // module_type: data.module_type ? data.module_type : '',
                    // value: data.value ? data.value.toString() : '',
                    // value_type: data.value_type,

                    id: data.id ? data.id : '',
                    agent_id: selectedAgent.name,
                    airlines: (data.flightAirline.name!== '' && data.flightAirline.name !== undefined) ? data.flightAirline.name : '',
                    module_type: data.module_type ? data.module_type : '',
                    value: data.value ? data.value.toString() : '',
                    value_type: data.value_type ? data.value_type : '',
                    suppliers:'Travelport'
                })
                let segment = JSON.parse(data.segment_list);
                let i = 0;
                // for (const key of Object.keys(segment)) {
                //     console.log(key, segment[key]);
                //     let segs = key.split("-");
                //     ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('from_airport_name').patchValue(
                //         `${segs[0]}`
                //     );
                //     ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('to_airport_name').patchValue(
                //         `${segs[1]}`
                //     );
                //     let value = segment[key].split("-");
                //     ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('value_type').patchValue(
                //         `${value[0]}`
                //     );
                //     ((this.regConfig.get('segments') as FormArray).at(i) as FormGroup).get('value').patchValue(
                //         `${value[1]}`
                //     );
                //     i++;
                //     if (i != Object.keys(segment).length) {
                //         this.addMoreSegments();
                //     }
                // }
                console.log(this.regConfig.value)
                if ((+this.airline_id) === 0) {
                    this.segments().clear();
                }
            } else {
                this.addOrUpdate = 'add';
                this.regConfig.reset();
                this.regConfig.patchValue({
                    markupType: 'percentage'
                });
            }
        })
    }

    createForm() {
        this.regConfig = this.fb.group({
            flightCom: [''],
            hotelCom: [''],
            agent_id: [null, Validators.required],
            module_type: ['b2b_flight'],
            // airlines: [null, Validators.required],
            id: [0],
            // segments: this.fb.array([this.fb.group({
            //     from_airport_name: [''],
            //     to_airport_name: [''],
            //     value: [null],
            //     value_type: ['plus'],
            // })]),
            value: [null, Validators.required],
            value_type: ['percentage'],
            domain_list_fk: [1],
            markup_currency: ['GBP'],
            auth_user_id: [this.currentUser.auth_role_id],
            created_by_id: [this.currentUser.id],
            // supplier_value_type:['plus'],
            // supplier_value:[null, Validators.required],
            suppliers:['null', Validators.required],
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
            value: [null],
            value_type: ['percentage'],
        })
    }

    addMoreSegments() {
        this.segments().push(this.fb.group({
            from_airport_name: [''],
            to_airport_name: [''],
            value: [null],
            value_type: ['percentage'],
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
        console.log(this.regConfig.value);
        if (this.addOrUpdate == "add") {
            this.submitted = true;
        }
        if (this.regConfig.invalid)
            return;
        let segJson = {};
        // if (this.regConfig.value.segments.length > 0) {
        //     this.regConfig.value.segments.map((segment) => {
        //         segment.from_airport_name = segment.from_airport_name ?
        //             segment.from_airport_name.includes("(") ? segment.from_airport_name.substring(
        //                 segment.from_airport_name.indexOf("(") + 1,
        //                 segment.from_airport_name.lastIndexOf(")")
        //             ) : segment.from_airport_name : segment.from_airport_name;

        //         segment.to_airport_name = segment.to_airport_name ?
        //             segment.to_airport_name.includes("(") ? segment.to_airport_name.substring(
        //                 segment.to_airport_name.indexOf("(") + 1,
        //                 segment.to_airport_name.lastIndexOf(")")
        //             ) : segment.to_airport_name : segment.to_airport_name;
        //         if (segment.from_airport_name && segment.to_airport_name) {
        //             let segKey = segment.from_airport_name + "-" + segment.to_airport_name;
        //             segJson[segKey] = segment.value_type + "-" + parseFloat(segment.value);
        //         }
        //     })
        // }
        switch (this.addOrUpdate) {
            case 'add':
                this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, {
                    "value": parseFloat(this.regConfig.value.value),
                    "value_type": this.regConfig.value.value_type,
                    "markup_currency": this.defaultCurrency || 'GBP',
                     "auth_user_id": this.agent_id,
                    "supplier":this.booking_source,
                    "type":"supplier",
                    "group_id":this.agent_id.toString(),
                    "flight_airline_id": parseInt(this.airline_id) || 0,
                    "segment_list": JSON.stringify(segJson),
                    "domain_list_fk": 1,
                    // "type": "specific",
                    "fare_type": "Public",
                    "module_type": "b2b_flight",
                })
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.add(resp.msg || resp.Message || '');
                            this.regConfig.reset();
                            this.regConfig.patchValue({
                                markupType: 'percentage'
                            });
                            this.toList.emit({ tabId: 'markup_list', data: {} });
                            this.markupsService.toUpdateData.next({});
                        } else {
                            this.swalService.alert.oops(resp.Message || '');
                        }
                    }, (error) => {
                        this.swalService.alert.oops(error.error.Message || '');
                    })
                break;
            case 'update':
                this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {}, {
                    "id": this.regConfig.value.id,
                    "module_type": this.regConfig.value.module_type,
                    "value": parseFloat(this.regConfig.value.value),
                    "value_type": this.regConfig.value.value_type,
                    "markup_currency": this.defaultCurrency || 'GBP',
                    "segment_list": JSON.stringify(segJson),
                    // "auth_user_id": parseInt(this.agent_id),
                    "domain_list_fk": 1,
                    "flight_airline_id": parseInt(this.airline_id),
                    "type": "supplier",
                    "fare_type": "Public",
                })
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.update(resp.msg || resp.Message || '');
                            this.markupsService.toUpdateData.next({});
                            this.regConfig.reset();
                            this.regConfig.patchValue({
                                markupType: 'percentage'
                            });
                            this.addOrUpdate = "add";
                            this.toList.emit({ tabId: 'markup_list', data: {} });
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
            this.swalService.alert.oops('Please select the agent from Agen List to update the mark up')
        }
        let val = this.regConfig.value.flightCom || this.regConfig.value.hotelCom;
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateMarkupList', 'post', {}, {}, {
            "id": this.getDataToUpdate.id,
            "value": Number(val),
            "value_type": this.getDataToUpdate.value_type,
            "markup_currency": this.defaultCurrency
        })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update(resp.msg || resp.Message || '');
                    this.regConfig.reset();
                    this.regConfig.patchValue({
                        markupType: 'percentage'
                    });
                    this.toList.emit({ tabId: 'markup_list', data: {} });
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
        this.markupsService.toUpdateData.next({});
        this.regConfig.reset();
        this.regConfig.patchValue({
            markupType: 'percentage'
        });
        this.addOrUpdate = "add";
    }

    setFilteredAgentList() {
        this.filteredOptions = this.regConfig.controls.agent_id.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name+' ('+ option.uuid+')').toLowerCase().includes(filterValue));
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
    getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "flight",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }
    getUsersList() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {},
            { "status": 1,})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    console.log(" this.respData", this.respData)
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
            });
    }
    selectedLocation(suppliers) {
        this.booking_source = `${suppliers['source_key']}`;
        return;
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.subscription.unsubscribe();
    }




}
