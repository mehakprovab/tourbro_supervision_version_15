import { Component, OnInit } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { Logger } from '../../../../../core/logger/logger.service';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material/sort';
import { AppService } from 'projects/b2b/src/app/app.service';

const log = new Logger('report/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-invoice-flight',
  templateUrl: './invoice-flight.component.html',
  styleUrls: ['./invoice-flight.component.scss']
})
export class InvoiceFlightComponent implements OnInit {
  searchText: string;
  private subSunk = new SubSink()
  pageSize = 100;
  page = 1;
  collectionSize: number;
  status: boolean;
  respData: Array<any> = [];
  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'date', value: 'Date' },
    { key: 'first_name', value: 'Name' },
    { key: 'gds_pnr', value: 'GDS PNR' },
    { key: 'AppReference', value: 'App Reference' },
    { key: 'total_fare', value: 'Total Fare' },
    { key: 'booking_status', value: 'Booking Status' },
    { key: 'invoice', value: 'Invoice' },
  ];
  noData: boolean = true;
  currentBalance: any;
  topic: string = '';
  defaultCurrency: string = '';
  constructor(
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private exportAsService: ExportAsService,
    private appService: AppService
  ) {
    this.defaultCurrency = this.appService.defaultCurrency;
  }

  ngOnInit() {
    this.searchByModule()
  }

  searchByModule() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('flightInvoiceReport', 'post', {}, {}, {
      status: 'ALL'
    }).subscribe(resp => {
        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
        this.noData = false;
        this.respData = resp.data;
        this.collectionSize = resp.data.length;
      }
      else{
        this.noData = false;
        this.respData=[];
      }
    }, (err) => {
        this.noData = false;
        this.respData=[];
      })
  };

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
  }
}
