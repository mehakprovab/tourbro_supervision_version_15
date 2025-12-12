import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { PaymentService } from '../../payment.service';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { Sort } from '@angular/material';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';


const log = new Logger('payment/BankAccountDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-bank-account-details',
    templateUrl: './bank-account-details.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit, OnDestroy {

    @Output() passedTab = new EventEmitter<any>();
    pageSize = 6;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'banklogo', value: 'Bank Logo' },
        { key: 'accountname', value: 'Account Name' },
        { key: 'accountnumber', value: 'Account Number' },
        { key: 'bankname', value: 'Bank Name' },
        { key: 'branchname', value: 'Branch Name' },
        { key: 'ifsccode', value: 'IFS Code' },
    ];
    noData: boolean = true;

    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getBankAccountDetails();
    }

    getBankAccountDetails() {
        const data = [{}];
        data['topic'] = 'bankAccountDetails';
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug('resp', resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                accountname: objData.accountname,
                accountnumber: objData.accountnumber,
                bankname: objData.bankname,
                branchname: objData.branchname,
                ifsccode: objData.ifsccode,
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
            const isAsc = sort.direction == 'asc';
            switch (sort.active) {
                case 'accountname': return this.utility.compare(' '+a.accountname.toLocaleLowerCase(), ' '+b.accountname.toLocaleLowerCase(), isAsc);
                case 'accountnumber': return this.utility.compare(+a.accountnumber, +b.accountnumber, isAsc);
                case 'bankname': return this.utility.compare(' '+a.bankname.toLocaleLowerCase(), ' '+b.bankname.toLocaleLowerCase(), isAsc);
                case 'branchname': return this.utility.compare(' '+a.branchname.toLocaleLowerCase(), ' '+b.branchname.toLocaleLowerCase(), isAsc);
                case 'ifsccode': return this.utility.compare(' '+a.ifsccode.toLocaleLowerCase(), ' '+b.ifsccode, isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }
}




function getData() {
    return [
        {
            '#': 1,
            'Bank Logo': 'https://travelomatix.in/extras/custom/TMX1512291534825461/images/bank_logo/1454423800.png',
            'Account Name': 'Provab Tecnosoft',
            'Account Number': '9876543210123456',
            'Bank Name': 'ICICI Bank',
            'Branch Name': 'Electronic City',
            'IFS Code': 'ICICI2121',
        },
        {
            '#': 2,
            'Bank Logo': 'https://travelomatix.in/extras/custom/TMX1512291534825461/images/bank_logo/1532339354.jpg',
            'Account Name': 'Provab',
            'Account Number': '1234567890',
            'Bank Name': 'HDFC',
            'Branch Name': 'Jayanagar 4th Block',
            'IFS Code': 'HDFC1234',
        },
        {
            '#': 3,
            'Bank Logo': 'https://travelomatix.in/extras/custom/TMX1512291534825461/images/bank_logo/1560850370.png',
            'Account Name': 'Rajesh Malakar',
            'Account Number': '1234567890',
            'Bank Name': 'HDFC',
            'Branch Name': 'E City',
            'IFS Code': 'IFSC0004796',
        },
        {
            '#': 4,
            'Bank Logo': 'https://travelomatix.in/extras/custom/TMX1512291534825461/images/bank_logo/1561127037.png',
            'Account Name': 'Savings',
            'Account Number': '098765432987654',
            'Bank Name': 'SBI',
            'Branch Name': 'Bangalore',
            'IFS Code': 'SBIN0004796',
        },
        {
            '#': 1,
            'Bank Logo': 'data:image/jpeg;base64,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',
            'Account Name': 'Badri Nath',
            'Account Number': '1234567890',
            'Bank Name': 'Bank Of India',
            'Branch Name': 'Electronic City, Bangaluru',
            'IFS Code': 'BKID0005054',
        }
    ]
}