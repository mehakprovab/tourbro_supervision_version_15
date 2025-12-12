import { Component, OnInit } from '@angular/core';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { MasterBalanceManagerService } from '../../../master-balance-manager.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material';
import { MatModalService, ModalConfigDataI, ModalConfigDefault } from 'projects/supervision/src/app/core/services/mat-modal.service';
import { Subscription } from 'rxjs';
import { ProcessTransactionBalanceComponent } from '../../modals/process-transaction-balance/process-transaction-balance.component';


const log = new Logger('master-balance-manager/CreditLimitRequestComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-balance-request',
    templateUrl: './balance-request.component.html',
    styleUrls: ['./balance-request.component.scss']
})
export class BalanceRequestComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: "#" },
        { key: "system_transaction_id", value: "System Transaction" },
        { key: "requested_from", value: "Request From" },
        { key: "transaction_type", value: "Transaction Type" },
        { key: "amount", value: "Amount" },
        { key: "status", value: "Status" },
        { key: "created_datetime", value: "Request Sent On", },
        // { key: "User Remarks", value: "User Remarks" },
        { key: "updated_datetime", value: "Updated On" },
        { key: "update_remarks", value: "Update Remarks" },
        { key: "processedby", value: "Processed By" },
        { key: "remarks", value: "Update Remarks" },
        { key: "Action", value: "Action" },
    ];
    noData: boolean = true;
    respData: any;
    modalConfigData: ModalConfigDataI;
    subscription: Subscription

    constructor(
        private masterBalanceManagerService: MasterBalanceManagerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private matModalService: MatModalService
    ) {
        this.modalConfigData = ModalConfigDefault;

    }

    ngOnInit() {
        this.getAgentBalanceManager();
    }

    getAgentBalanceManager(): void {
        const data = [{}];
        data['topic'] = 'agentBalanceManager';
        this.masterBalanceManagerService.fetch(data)
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else if (resp.statusCode == 404) {
                    this.noData = true;
                    this.swalService.alert.error();
                }
            });
    }


    openDialog(whichComponent, data?: any) {
        this.modalConfigData.width = '600px';
        this.modalConfigData.data = data || '';
        switch (whichComponent) {
            case 1: this.modalConfigData.component = ProcessTransactionBalanceComponent;
                break;
        }
        this.matModalService.openDialog(this.modalConfigData);
        this.getData();
    }

    getData() {
        this.subscription = this.matModalService.getData().subscribe(res => {
            if (!res.noData) {
                this.subscription.unsubscribe();
                log.debug('data found', res);
                this.updateProcess(res);
            } else {
                this.subscription.unsubscribe();
                log.debug('no data found', res);
            }
        })
    }

    updateProcess(res) {
        const data = [
            {
                "request_id": res['id'],
                "system_transaction_id": res['system_transaction_id'],
                "status": res['status'],
                "remarks": res['remarks']
            }
        ];
        data['topic'] = 'processAgentBalance';
        this.masterBalanceManagerService.update(data)
            .subscribe(resp => {
                log.debug('processAgentBalance after update', resp)
                if (resp.statusCode == 200) {
                    this.swalService.alert.update(resp.msg || '')
                } else {
                    this.swalService.alert.oops(resp.msg || '')
                }
            })

    }


    applyFilter(text: string): void {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                system_transaction_id: objData.system_transaction_id,
                requested_from: objData.requested_from,
                transaction_type: objData.transaction_type,
                amount: objData.amount,
                status: objData.status,
                created_datetime: objData.created_datetime,
                updated_datetime: objData.updated_datetime,
                update_remarks: objData.update_remarks,
                processedby: objData.processedby,
                remarks: objData.remarks,
                Action: objData.action,
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'requested_from': return this.utility.compare('' + a.requested_from, '' + b.requested_from, isAsc);
                case 'transaction_type': return this.utility.compare('' + a.transaction_type, '' + b.transaction_type, isAsc);
                case 'amount': return this.utility.compare('' + a.amount, '' + b.amount, isAsc);
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'created_datetime': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
                case 'updated_datetime': return this.utility.compare('' + a.updated_datetime, '' + b.updated_datetime, isAsc);
                case 'update_remarks': return this.utility.compare('' + a.update_remarks, '' + b.update_remarks, isAsc);
                case 'processedby': return this.utility.compare(+ a.processedby, + b.processedby, isAsc);
                case 'remarks': return this.utility.compare(+ a.remarks, + b.remarks, isAsc);
                default: return 0;
            }
        });
    }

}
