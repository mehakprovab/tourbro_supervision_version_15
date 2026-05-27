import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { Logger } from '../../../../core/logger/logger.service';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

const log = new Logger('group-booking/GroupHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-group-hotel',
    templateUrl: './group-hotel.component.html',
    styleUrls: ['./group-hotel.component.scss']
})
export class GroupHotelComponent implements OnInit, OnDestroy {

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
        elementId: 'subscriptions',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: '', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'first_name', value: 'First Name' },
        { key: 'last_name', value: 'Last Name' },
        { key: 'email', value: 'Email' },
        { key: 'phone', value: 'Phone' },
        { key: 'city', value: 'City' },
        { key: 'check_in', value: 'Check in' },
        { key: 'check_out', value: 'Check out' },
        { key: 'nights', value: 'Nights' },
        { key: 'adult', value: 'Adult' },
        { key: 'child', value: 'Child' },
        { key: 'total_pax', value: 'Total Pax' },
        { key: 'recieved_on', value: 'Received on' },
        { key: 'comments', value: 'Comments' },
    ];

    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
    ) { }


    ngOnInit() {
        this.getAllHotelGroupBooking();
    }

    replyToCustomer(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelGroupBookingStatus', 'post', {}, {}, {
            id
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success('Successfully! Replied to the customer.');
                this.getAllHotelGroupBooking();
            } else {
                this.swalService.alert.oops('Something went wrong! Please retry later.');
            }
        }, error => {

        })
    }

    deleteRecordById(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.swalService.alert.success();
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteHotelGroupBooking', 'post', {}, {}, { id })
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.respData.splice(this.respData.findIndex(data => data['id'] == id), 1);
                            this.swalService.alert.success('Your record has been deleted successfully!');
                        } else {
                            this.swalService.alert.oops('Something went wrong! Please retry later.');
                        }
                    }, err => {
                        console.log(err);
                        this.swalService.alert.oops('Something went wrong! Please retry later.');
                    });
            } else {
                console.log('Not deleted');
            }
        })
    }

    getAllHotelGroupBooking() {
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('getAllHotelGroupBooking', 'post', {}, {},
            {}).subscribe(resp => {
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
                this.respData=[];
            })
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
        this.exportAsService.save(this.config, `newsletter_subscriptions`)
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
