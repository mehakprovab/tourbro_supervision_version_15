import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import {  FormGroup} from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

const log = new Logger('group-booking/GroupCarComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-group-car',
  templateUrl: './group-car.component.html',
  styleUrls: ['./group-car.component.scss']
})
export class GroupCarComponent implements OnInit,OnDestroy {

  private subSunk = new SubSink();
    regConfig: FormGroup;
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'subscriptions',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };

    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: '', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'first_name', value: 'First Name' },
        { key: 'last_name', value: 'Last Name' },
        { key: 'email', value: 'Email' },
        { key: 'phone', value: 'Phone' },
        { key: 'from', value: 'From' },
        { key: 'to', value: 'To' },
        { key: 'pick_up_date', value: 'Pick Up Date' },
        { key: 'drop_off_date', value: 'Drop Off Date' },
        { key: 'pick_up_time', value: 'Pick Up Time' },
        { key: 'drop_off_time', value: 'Drop off Time' },
        { key: 'total_pax', value: 'Total Pax' },
        { key: 'recieved_on', value: 'Received on' },
        { key: 'comments', value: 'Comments' },
    ];

    ngOnInit() {
    	this.getNewsletterSubscription();
    }

    getNewsletterSubscription(){
    	this.subSunk.sink = this.apiHandlerService.apiHandler('getAllCarGroupBooings', 'post', {}, {},
            {}).subscribe(resp => {
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
    }
    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `groupCar_booking`)
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
