import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Logger } from '../../../../core/logger/logger.service';
import { untilDestroyed } from '../../../../core/services';
import { Sort } from '@angular/material/sort';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { PaymentService } from '../../payment.service';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from 'ngx-bootstrap/chronos';
import { AppService } from '../../../../../app/app.service';
import * as moment from 'moment';

const log = new Logger('report/AccountLedgerComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  searchText: string;
  searchForm: FormGroup;
  pageSize = 100;
  page = 1;
  collectionSize: number;
  defaultCurrency: string = '';
  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'transaction_date', value: 'Date' },
    { key: 'reference_number', value: 'Transaction Id.' },
    { key: 'app_Reference_Number', value: 'Booking Id.' },
    { key: 'pnr', value: 'PNR' },
    { key: 'gds_pnr', value: 'GDS PNR' },
    { key: 'ticket_no', value: 'Ticket No.' },
    { key: 'type', value: 'Type' },
    { key: 'debit_amount', value: `Debit` },
    { key: 'credit_amount', value: 'Credit' },
    { key: 'opening_balance', value: 'Opening Balance' },
    { key: 'closing_balance', value: 'Closing Balance' },
    { key: 'description', value: 'Description' },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  showFullContent: boolean[] = [];
  config: ExportAsConfig = {
    type: 'pdf',
    elementId: 'account-ladger',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };
  isOpen = false as boolean;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };

  constructor(
    private paymentService: PaymentService,
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private exportAsService: ExportAsService,
    private fb: FormBuilder,
    private appService: AppService,
  ) {
    this.defaultCurrency = this.appService.defaultCurrency;
  }

  ngOnInit() {
      let fromDate = this.utility.setFromDate();
      let toDate = this.utility.setToDate();
      this.searchForm = this.fb.group({
      from_date: new FormControl('', [Validators.maxLength(120)]),
      to_date: new FormControl('', [Validators.maxLength(120)]),
      transaction_id: new FormControl('', [Validators.maxLength(30)]),
      module_type: new FormControl('', [Validators.maxLength(120)]),
      bookedBy: new FormControl('', [Validators.maxLength(120)]),
    })
    this.searchForm.patchValue({
      from_date: formatDate(fromDate, 'DD/MM/YYYY'),
      to_date: formatDate(toDate, 'DD/MM/YYYY'),
    }, { emitEvent: false });

    this.getAgentAccountLedger();
  }

  openDate() {
    this.isOpen = true;
  }

  onSearchSubmit() {
    this.getAgentAccountLedger();
  }

  onReset() {
    this.searchForm.reset();
    let fromDate = this.utility.setFromDate();
    let toDate = this.utility.setToDate();
    this.searchForm.patchValue({
        module_type: '',
        bookedBy: '',
        from_date:fromDate,
        to_date:toDate
    });
    this.getAgentAccountLedger();
  }

  searchByTimeLine(param) {
    let to_date = new Date(), from_date;
    switch (param) {
      case 'today':
        from_date = new Date();
        break;
      case 'lastDay':
        from_date = new Date(to_date.valueOf() - (1 * 24 * 60 * 60 * 1000))
        break;
      case 'oneWeek':
        from_date = new Date(to_date.valueOf() - (7 * 24 * 60 * 60 * 1000))
        break;
      case 'oneMonth':
        from_date = new Date(to_date.valueOf() - (30 * 24 * 60 * 60 * 1000))
        break;
    }

    this.searchForm.patchValue({
      from_date: formatDate(from_date, 'DD/MM/YYYY'),
      to_date: formatDate(to_date, 'DD/MM/YYYY'),
    });
    this.getAgentAccountLedger();
  }

  getAgentAccountLedger() {
    this.noData=true;
    this.respData=[];
    let fromDate = (typeof this.searchForm.value.from_date == 'string' ? (this.searchForm.value.from_date).split("/").reverse().join("-") : formatDate(this.searchForm.value.from_date, 'YYYY-MM-DD'));
    let toDate = (typeof this.searchForm.value.to_date == 'string' ? (this.searchForm.value.to_date).split("/").reverse().join("-") : formatDate(this.searchForm.value.to_date, 'YYYY-MM-DD'));
    this.subSunk.sink = this.apiHandlerService.apiHandler('accountLedgerAccountSys', 'post', {}, {},
      {
        "from_date": fromDate, // ? formatDate(this.searchForm.value.from_date, 'YYYY-MM-DD') : formatDate(new Date(), 'YYYY-MM-DD'),
        "to_date": toDate, // ? formatDate(this.searchForm.value.to_date, 'YYYY-MM-DD') : formatDate(new Date(), 'YYYY-MM-DD'),
        "transaction_id": this.searchForm.value.transaction_id ? this.searchForm.value.transaction_id : '',
        "module_type": this.searchForm.value.module_type ? this.searchForm.value.module_type : '',
      })
      .pipe(untilDestroyed(this))
      .subscribe(resp => {
        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.transaction_details.length>0) {
          this.noData = false;
          this.respData = resp.data['transaction_details'] || [];
          respDataCopy = [...this.respData];
          this.collectionSize = respDataCopy.length;
        } else {
            this.respData=[];
            this.noData = false;
        }
    }, (err) => {
        this.noData = false;
        this.respData=[];
      })
  }

  onSelect(tab, i) {
  }

  beforeChange(e) {
  }

  applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
    filterArray = respDataCopy.slice().filter((objData, index) => {
      const filterOnFields = {
        transaction_date: objData.transaction_date,
        reference_number: objData.transaction_id,
        description: objData.description,
        payment_type: objData.payment_type,
        debit_amount: objData.debit_amount,
        type:objData.transaction_type,
        credit_amount: objData.credit_amount,
        opening_balance: objData.opening_balance,
        closing_balance: objData.closing_balance,
        app_Reference_Number:objData.reference_number
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
        case 'transaction_date': return this.utility.compare('' + a.transaction_date.toLocaleLowerCase(), '' + b.transaction_date.toLocaleLowerCase(), isAsc);
        case 'reference_number': return this.utility.compare('' + a.transaction_id.toLocaleLowerCase(), '' + b.transaction_id.toLocaleLowerCase(), isAsc);
        case 'description': return this.utility.compare('' + a.description.toLocaleLowerCase(), '' + b.description.toLocaleLowerCase(), isAsc);
        case 'payment_type': return this.utility.compare('' + a.payment_type.toLocaleLowerCase(), '' + b.payment_type.toLocaleLowerCase(), isAsc);
        case 'type': return this.utility.compare('' + a.transaction_type.toLocaleLowerCase(), '' + b.transaction_type.toLocaleLowerCase(), isAsc);
        case 'payment_type': return this.utility.compare('' + a.payment_type.toLocaleLowerCase(), '' + b.payment_type.toLocaleLowerCase(), isAsc);
        case 'debit_amount': return this.utility.compare(+ a.debit_amount.toLocaleLowerCase(), + b.debit_amount.toLocaleLowerCase(), isAsc);
        case 'credit_amount': return this.utility.compare(+ a.credit_amount.toLocaleLowerCase(), + b.credit_amount.toLocaleLowerCase(), isAsc);
        case 'opening_balance': return this.utility.compare(+ a.opening_balance.toLocaleLowerCase(), + b.opening_balance.toLocaleLowerCase(), isAsc);
        case 'closing_balance': return this.utility.compare(+ a.closing_balance.toLocaleLowerCase(), + b.closing_balance.toLocaleLowerCase(), isAsc);
        case 'app_Reference_Number': return this.utility.compare(+ a.reference_number.toLocaleLowerCase(), + b.reference_number.toLocaleLowerCase(), isAsc);
        default: return 0;
      }
    });
  }
  searchByTimeLineExt($event) {
    let resultData = [];
    if ($event.from_date && $event.to_date) {
      resultData = this.respData.filter(function (a) {
        return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.from_date).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.to_date).getTime())
      });
      this.respData = resultData;
      respDataCopy = [...this.respData];
      this.collectionSize = respDataCopy.length;
    } else {
      this.getAgentAccountLedger();
    }
  }

  download(type: SupportedExtensions, orientation?: string) {
    this.config.type = type;
    if (orientation) {
      this.config.options.jsPDF.orientation = orientation;
    }
    const ts = new Date().getTime();
    this.exportAsService.save(this.config, `${ts}`).subscribe((_) => {
      // save started
      this.swalService.alert.success();
    }, (err) => {
      this.swalService.alert.oops();
    });
  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
  }

  toggleFullContent(index: number): void {
    this.showFullContent[index] = !this.showFullContent[index];
  }

  exportExcel(): void {
    const fileToExport = this.respData.map((response: any,index:number) => {
        let pnr = "";
        let GDS = "";
        let Ticket = "";
        if (response.REF) {
            [, pnr, GDS, Ticket] = response.REF.split("***");
        }
        
        return {
            "Sl No.":index+1,
            "Date": moment(response.transaction_date).format("MMM DD, YYYY, hh:mm:ss A"),
            "Transaction Id":response.transaction_id,
            "Booking Id":response.reference_number,
            "PNR": pnr,
            "GDS PNR":GDS,
            "Ticket No.":Ticket,
            "Type":response.transaction_type,
            "Debit":response.debit_amount,
            "Credit":response.credit_amount,
            "Opening Balance":response.opening_balance,
            "Closing Balance":response.closing_balance,
            "Description":response.description
        }
    });

    const columnWidths = [
        { wch: 5 },
        { wch: 30 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 }
    ];

    this.utility.exportToExcel(
        fileToExport,
        'Account ledger',
        columnWidths
    );
}
  
  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}

function getData() {
  return {
    "data": {
      "transaction_details": [
        {
          "agency_name": "",
          "reference_number": "MP5465474",
          "transaction_date": "2020-05-15T06:04:34.000Z",
          "currency": "USD",
          "debit_amount": "1000.00",
          "credit_amount": "0.00",
          "description": "accepted credit limit",
          "full_description": "accepted credit limit - null",
          "transaction_details": null,
          "opening_balance": "2000.00",
          "closing_balance": "2000.00"
        },
        {
          "agency_name": "",
          "reference_number": "MP5465479",
          "transaction_date": "2020-05-15T05:55:30.000Z",
          "currency": "USD",
          "debit_amount": "2500.00",
          "credit_amount": "0.00",
          "description": "Credited Towards: flight_booking<br/>Reference: <br/>testing purpose addingthe balance",
          "full_description": "Credited Towards: flight_booking<br/>Reference: <br/>testing purpose addingthe balance - null",
          "transaction_details": null,
          "opening_balance": "0.00",
          "closing_balance": "2500.00"
        }
      ]
    },
    "statusCode": 201,
    "Message": "",
    "Status": true
  }
}
