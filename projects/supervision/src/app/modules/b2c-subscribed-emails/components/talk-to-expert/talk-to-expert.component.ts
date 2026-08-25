import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-talk-to-expert',
  templateUrl: './talk-to-expert.component.html',
  styleUrls: ['./talk-to-expert.component.scss']
})
export class TalkToExpertComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  pageSize = 100;
  page = 1;
  collectionSize = 0;
  noData = true;
  respData: Array<any> = [];

  config: any = {
    type: 'pdf',
    elementIdOrContent: 'talk-to-expert-list',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn
    }
  };

  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'name', value: 'Name' },
    { key: 'email', value: 'Email' },
    { key: 'phone', value: 'Phone' },
    { key: 'message', value: 'Message' },
    // { key: 'created_at', value: 'Requested Date' },
  ];

  constructor(
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
  ) { }

  ngOnInit() {
    this.getTalkToExpertList();
  }

  getTalkToExpertList() {
    this.noData = true;
    this.respData = [];
    this.subSunk.sink = this.apiHandlerService.apiHandler('enquiryList', 'post', {}, {}, {})
      .subscribe(resp => {
        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
          this.noData = false;
          this.respData = resp.data || [];
          respDataCopy = [...this.respData];
          this.collectionSize = respDataCopy.length;
        } else {
          this.noData = false;
          this.respData = [];
          respDataCopy = [];
          this.collectionSize = 0;
        }
      }, () => {
        this.noData = false;
        this.respData = [];
        respDataCopy = [];
        this.collectionSize = 0;
      });
  }

  getValue(data: any, keys: string[]): any {
    for (const key of keys) {
      if (data && data[key] !== undefined && data[key] !== null && data[key] !== '') {
        return data[key];
      }
    }
    return '';
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
        case 'name': return this.utility.compare(('' + this.getValue(a, ['full_name', 'first_name', 'customer_name'])).toLocaleLowerCase(), ('' + this.getValue(b, ['name', 'first_name', 'customer_name'])).toLocaleLowerCase(), isAsc);
        case 'email': return this.utility.compare(('' + this.getValue(a, ['email', 'email_id'])).toLocaleLowerCase(), ('' + this.getValue(b, ['email', 'email_id'])).toLocaleLowerCase(), isAsc);
        case 'phone': return this.utility.compare('' + this.getValue(a, ['phone', 'phone_number', 'mobile', 'mobile_number']), '' + this.getValue(b, ['phone', 'phone_number', 'mobile', 'mobile_number']), isAsc);
        case 'created_at': return this.utility.compare('' + this.getValue(a, ['created_at', 'requested_date', 'created_datetime']), '' + this.getValue(b, ['created_at', 'requested_date', 'created_datetime']), isAsc);
        default: return 0;
      }
    });
  }

  download(type: any, orientation?: string) {
    this.config.type = type;
    if (orientation) {
      this.config.options.jsPDF.orientation = orientation;
    }
    this.utility.downloadElementAsPdf(this.config.elementIdOrContent, 'talk_to_expert_list', orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
  }

  pdfCallbackFn(pdf: any) {
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
  }

  exportExcel(): void {
    const fileToExport = this.respData.map((response: any, index: number) => {
      return {
        'Sl No.': index + 1,
        // 'Name': this.getValue(response, ['full_name', 'first_name', 'customer_name']),
        'Email': this.getValue(response, ['email', 'email_id']),
        'Phone': this.getValue(response, ['phone', 'phone_number', 'mobile', 'mobile_number']),
        'Message': this.getValue(response, ['message', 'remarks', 'description', 'comments']),
        // 'Requested Date': this.formatDate(this.getValue(response, ['created_at', 'requested_date', 'created_datetime'])),
      };
    });
    this.utility.exportToExcel(fileToExport, 'Talk To Expert', [
      { wch: 8 },
      { wch: 25 },
      { wch: 35 },
      { wch: 18 },
      { wch: 50 },
      { wch: 20 },
    ]);
  }

  formatDate(value: any): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return [
      ('0' + date.getDate()).slice(-2),
      ('0' + (date.getMonth() + 1)).slice(-2),
      date.getFullYear()
    ].join('/');
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
