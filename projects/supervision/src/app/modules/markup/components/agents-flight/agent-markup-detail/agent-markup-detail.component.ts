import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';

let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-markup-detail',
    templateUrl: './agent-markup-detail.component.html',
    styleUrls: ['./agent-markup-detail.component.scss']
})
export class AgentMarkupDetailComponent implements OnInit, OnDestroy {

    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchForm: FormGroup;
    noData: boolean = true;
    markupList: Array<any> = [];
    agentList: any;
    agencyDetails: any;
    airlineLogoUrl = "https://Booking 247.com/airline_logo/";
    filteredOptions: Observable<string[]>;
    markup_id:string="";
    selectedValue:string="";
    respData: Array<any> = [];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_name', value: 'Airlines' },
        { key: 'value_type', value: 'Value Type' },
        { key: 'value', value: 'Value' },
        { key: 'segments', value: 'Segment List' },
        { key: 'action', value: 'Action' }
    ];
    addOrUpdate: string = 'add';
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private markupService: MarkupService,
        private cd: ChangeDetectorRef,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.markupService.agentMarkupDetails.subscribe(res => {
            if (Object.keys(res).length > 0) {
                this.agencyDetails = res;
                this.selectedValue=this.agencyDetails.business_name+' ('+this.agencyDetails.uuid+')';
                this.markup_id= this.agencyDetails.auth_user_id;
                this.searchForm = this.fb.group({
                    agent_id: new FormControl(this.selectedValue, [Validators.maxLength(120)])
                });
                this.onSearchSubmit();
            } else {
                this.searchForm = this.fb.group({
                    agent_id: new FormControl('', [Validators.maxLength(120)])
                });
            }
        });
        // this.getAgentsList();
        this.getUsersList();
        
    }

    setFilteredmarkup_id() {
        this.filteredOptions = this.searchForm.controls.markup_id.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }


    onSearchSubmit() {
        let authUserId = this.markup_id;
        this.noData = true;
        this.markupList = [];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            auth_user_id: authUserId,
            module_type: "b2b_flight",
            is_deleted: 1
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.markupList = resp.data || [];
                this.agencyDetails = resp.data.length > 0 ? resp.data[0].authUser : "";
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
                    this.setFilteredmarkup_id();
                }
                else {

                }
            });
    }

    onReset() {
        this.searchForm.reset();
        this.markup_id="";
        if (!this.markupList.length) {
            this.getB2bMarkupList();
        }
    }

    getB2bMarkupList() {
        let req = {};
        req['module_type'] = 'b2b_flight';
        req['type'] = 'supplier';
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, req).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.markupList = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
            }
        })
    }

    updateMarkup(data) {
        this.markupService.toUpdateData.next(data);
        this.markupService.selectedAgent.next(this.selectedValue);
        this.toUpdate.emit({ tabId: 'default_markup', data });
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
                this.onSearchSubmit();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = JSON.parse(segment);
        return segment_list;
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name+' ('+ option.uuid+')').toLowerCase().includes(filterValue));
      }

      onSelectionChanged(event) {
        this.markup_id= event.option.id;
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

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.cd.detach();
        this.markupService.agentMarkupDetails.next({});
    }

}
