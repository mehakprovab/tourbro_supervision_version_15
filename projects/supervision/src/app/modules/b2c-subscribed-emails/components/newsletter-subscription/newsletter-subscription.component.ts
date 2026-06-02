import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

const log = new Logger('promocode-list/NewsletterSubscriptionComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-newsletter-subscription',
  templateUrl: './newsletter-subscription.component.html',
  styleUrls: ['./newsletter-subscription.component.scss']
})
export class NewsletterSubscriptionComponent implements OnInit,OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: any = {
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
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'email_id', value: 'Email' },
        { key: 'created_at', value: 'Subscribed Date' },
    ];

    ngOnInit() {
    	this.getNewsletterSubscription();
    }

    getNewsletterSubscription(){
        this.noData=true;
        this.respData=[];
    	this.subSunk.sink = this.apiHandlerService.apiHandler('emailSubscriptionsList', 'post', {}, {},
            {
            	"subscription_type":"NewsLetter" ,
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
            });
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
                case 'id': return this.utility.compare('' + a.id, '' + b.id, isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);
                case 'email_id': return this.utility.compare('' + a.email_id.toLocaleLowerCase(), '' + b.email_id.toLocaleLowerCase(), isAsc);

                default: return 0;
            }
        });
    }
    download(type: any, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `newsletter_subscriptions`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    exportExcel(): void {
        this.utility.downloadExcel(this.respData,'News Letter Subscriptions');
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
