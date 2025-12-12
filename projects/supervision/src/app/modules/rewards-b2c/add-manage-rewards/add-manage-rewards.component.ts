import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsService } from 'ngx-export-as';

const log = new Logger('b2c-enquiry/B2cEnquiryComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-add-manage-rewards',
  templateUrl: './add-manage-rewards.component.html',
  styleUrls: ['./add-manage-rewards.component.scss']
})
export class AddManageRewardsComponent implements OnInit {

  private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'email', value: 'Email' },
        { key: 'name', value: 'Name' },
        { key: 'general_rewards', value: 'General Rewards' },
        { key: 'specific_rewards', value: 'Specific Rewards' },
        { key: 'pending_rewards', value: 'Pending Rewards' },
        { key: 'used_rewards', value: 'Used Rewards' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            requested_date_from: new FormControl('', [Validators.maxLength(120)]),
            requested_date_to: new FormControl('', [Validators.maxLength(120)]),
            contact_info: new FormControl('', [Validators.maxLength(10)]),
            email_id: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        });
        this.getCoreRewardList();
    }
    onSearchSubmit() {
        console.log('this.regConfig.value', this.regConfig.value);
        this.noData = true;
        this.respData = [];
        this.getCoreRewardList();
    }

    onReset() {
        this.regConfig.reset();
        if (!this.respData.length) {
            this.getCoreRewardList();
        }
    }
    
    getCoreRewardList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('coreRewardList', 'post', {}, {},
            {
                "email_id": this.regConfig.value.email_id || ""
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = true;
                    this.swalService.alert.error(resp.msg || '');
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'name': return this.utility.compare('' + a.name.toLocaleLowerCase(), '' + b.name.toLocaleLowerCase(), isAsc);
                case 'general_rewards': return this.utility.compare('' + a.general_rewards, '' + b.general_rewards, isAsc);
                case 'specific_rewards': return this.utility.compare('' + a.specific_rewards.toLocaleLowerCase(), '' + b.specific_rewards.toLocaleLowerCase(), isAsc);
                case 'pending_rewards': return this.utility.compare(+a.pending_rewards, +b.pending_rewards, isAsc);
                case 'used_rewards': return this.utility.compare('' + a.used_rewards.toLocaleLowerCase(), '' + b.used_rewards.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        let resultData = [];
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                resultData = this.respData.filter(function (a) {
                    return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.toDate).getTime())
                });
            } else if ($event.transactionId) {
                resultData = this.respData.filter(b => {
                    return b.app_refernce == $event.transactionId;
                })
            }
            this.respData = resultData;
            respDataCopy = [...this.respData];
            this.collectionSize = respDataCopy.length;
        } else {
            this.getCoreRewardList();
        }
    }

}
