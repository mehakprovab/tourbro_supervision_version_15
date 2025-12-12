import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { Logger } from '../../../../core/logger/logger.service';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { CommissionsService } from '../../commissions.service';

const log = new Logger('AgentCommissionListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-agent-commission-list',
    templateUrl: './agent-commission-list.component.html',
    styleUrls: ['./agent-commission-list.component.scss']
})
export class AgentCommissionListComponent implements OnInit {


    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchForm: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };
    pageSize = 100;
    page = 1;
    collectionSize: number = 100;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'agency_name', value: 'Agency Name' },
        { key: 'auth_user_id', value: 'Agency ID' },
        { key: 'agent_name', value: 'Agent Name' }
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    agentList: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private commissionsService: CommissionsService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.commissionsService.toUpdateData.next({});
        this.getB2bCommissionList();
    }

    onReset() {
        this.searchForm.reset();
        this.getB2bCommissionList();
    }

    getB2bCommissionList() {
        this.noData=true;
        this.respData=[];
        let req = { module_type: 'b2b_flight' };
        this.subSunk.sink = this.apiHandlerService.apiHandler('commissionList', 'post', {}, {}, req).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
                this.collectionSize = resp.data.length;
            }
            else {
                this.noData = false;
                this.respData = [];
            }
        }, (err) => {
            this.noData = false;
            this.respData = [];
        });
    }

    viewCommission(data) {
        this.commissionsService.agentCommissionDetails.next(data);
        this.toUpdate.emit({ tabId: 'agent_detail', data });
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
                case 'bank_name': return this.utility.compare('' + a.bank_name.toLocaleLowerCase(), '' + b.bank_name.toLocaleLowerCase(), isAsc);
                case 'branch_name': return this.utility.compare('' + a.branch_name, '' + b.branch_name, isAsc);
                case 'account_name': return this.utility.compare('' + a.account_name, '' + b.account_name, isAsc);
                case 'account_number': return this.utility.compare(+ a.account_number.toLocaleLowerCase(), + b.account_number.toLocaleLowerCase(), isAsc);
                case 'swift_code': return this.utility.compare(+a.swift_code, +b.swift_code, isAsc);
                case 'ssn': return this.utility.compare('' + a.ssn.toLocaleLowerCase(), '' + b.ssn.toLocaleLowerCase(), isAsc);
                case 'created_on': return this.utility.compare('' + a.created_on.toLocaleLowerCase(), '' + b.created_on.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.agent,
                transactiondate: objData.transaction,
                app_refernce: objData.app_refernce,
                transactiontype: objData.transactiontype,
                fare: objData.fare,
                remarks: objData.remarks
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

    }


}
