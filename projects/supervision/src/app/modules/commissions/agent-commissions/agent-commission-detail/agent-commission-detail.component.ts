import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { Logger } from '../../../../core/logger/logger.service';
import { SwalService } from '../../../../core/services/swal.service';
import { SubSink } from 'subsink';
import { CommissionsService } from '../../commissions.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const log = new Logger('AgentCommissionDetailComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-commission-detail',
    templateUrl: './agent-commission-detail.component.html',
    styleUrls: ['./agent-commission-detail.component.scss']
})
export class AgentCommissionDetailComponent implements OnInit, OnDestroy {

    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchForm: FormGroup;
    noData: boolean = true;
    commList: Array<any> = [];
    agentList: any;
    agencyDetails: any;
    airlineLogoUrl = "https://Booking 247.com/airline_logo/";
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_name', value: 'Airlines' },
        { key: 'commission', value: 'Commission(%)' },
        { key: 'segments', value: 'Segment List' },
        { key: 'action', value: 'Action' }
    ];
    filteredAgentList: Observable<string[]>;
    agent_id:string="";
    selectedValue:string="";

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private commissionsService: CommissionsService,
        private cd: ChangeDetectorRef,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.commissionsService.agentCommissionDetails.subscribe(res => {
            if (Object.keys(res).length > 0) {
                this.agencyDetails = res;
                this.selectedValue=this.agencyDetails.business_name+' ('+this.agencyDetails.uuid+')';
                this.agent_id= this.agencyDetails.auth_user_id;
                this.searchForm = this.fb.group({
                    agent_id: new FormControl(this.selectedValue, [Validators.maxLength(120)])
                });
                this.onSearchSubmit();
            } else {
                this.searchForm = this.fb.group({
                    agent_id: new FormControl('', [Validators.required,Validators.maxLength(120)])
                });
            }
        });
        this.getAgentsList();
    }

    onSearchSubmit() {
        if (this.searchForm.invalid)
        return;
        let authUserId = parseInt(this.agent_id);
        this.noData = true;
        this.commList = [];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bCommissionList', 'post', {}, {}, { auth_user_id: authUserId }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.commList = resp.data || [];
                this.agencyDetails = resp.data.length > 0 ? resp.data[0].authUser : "";
            }
        })
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

    onReset() {
        this.searchForm.reset();
        this.noData=true;
        this.agent_id="";
        const agent_id = this.searchForm.get('agent_id');
        agent_id.setValidators([Validators.required]);
        agent_id.updateValueAndValidity();
        // if (!this.commList.length) {
        //     this.getB2bCommissionList();
        // }
    }

    getB2bCommissionList() {
        let req = {};
        req['module_type'] = 'b2b_flight';
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bCommissionList', 'post', {}, {}, req).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.commList = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
            }
        })
    }

    updateCommission(data) {
        this.commissionsService.toUpdateData.next(data);
        this.commissionsService.selectedAgent.next(this.selectedValue);
        this.toUpdate.emit({ tabId: 'default_commission', data });
    }


    deleteCommission(data) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.deleteCms(data.id);
            } else {
                console.log("Not delete")
            }
        })
    }

    deleteCms(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteB2bCommission', 'post', {}, {}, { id: id }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.onSearchSubmit();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = JSON.parse(segment);
        return segment_list;
    }

    setFilteredAgentList() {
        this.filteredAgentList = this.searchForm.controls.agent_id.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name+' ('+option.uuid+')').toLowerCase().includes(filterValue));
      }

      onSelectionChanged(event) {
        this.agent_id= event.option.id;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.cd.detach();
        this.commissionsService.agentCommissionDetails.next({});
    }

}
