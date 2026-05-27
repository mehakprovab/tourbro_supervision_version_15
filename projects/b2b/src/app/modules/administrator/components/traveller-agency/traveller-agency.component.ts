import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TravellerInfoComponent } from '../traveller-info/traveller-info.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdministratorService } from '../../administrator.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Location } from '@angular/common';
import * as moment from 'moment';


let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-traveller-agency',
    templateUrl: './traveller-agency.component.html',
    styleUrls: ['./traveller-agency.component.scss']
})
export class TravellerAgencyComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    pageSize = 10;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'traveller-list',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private administratorService: AdministratorService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private exportAsService: ExportAsService,
        private location: Location,
    ) { }
    travellerForm: FormGroup;

    ngOnInit() {
        this.createForm();
        this.getTravellersList();
    }

    createForm() {
        this.travellerForm = this.fb.group({
            first_name: [''],
            last_name: [''],
            // application_reference: [''],
            phone_number: [''],
            email: ['', Validators.email],
        });
    }
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    onTraveller(t: any) {
        if (t.invalid) {
            return;
        } else {
            this.noData = true;
            this.respData=[];
            this.subSunk.sink = this.apiHandlerService.apiHandler('searchTravellers', 'post', {}, {}, t.value).subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.respData = resp.data.length ? resp.data : this.administratorService.isDevelopement;
                    this.noData = false;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    this.sortData(
                        {
                            active: "created_at",
                            direction: "desc"
                        })
                } else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err: HttpErrorResponse) => {
                this.noData = false;
                this.respData=[];
            });

        }
    }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'first_name', value: 'Traveller Name' },
        { key: 'phone_number', value: 'Phone Number' },
        { key: 'email', value: 'Email Id' },
        { key: 'created_at', value: 'Registered Date' },
        // { key: 'info', value: 'Booking Info.' },
        // { key: 'pax', value: 'Pax Info' },
        { key: 'action', value: 'Action' },
    ];

    getTravellersList() {
        this.noData = true;
        this.respData=[];
        this.subSunk.sink = this.administratorService.fetchTravellersList()
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.respData = resp.data.length ? resp.data : this.administratorService.isDevelopement;
                    this.noData = false;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    this.sortData(
                        {
                            active: "created_at",
                            direction: "desc"
                        })
                } else {
                   this.respData=[];
                   this.noData=false;
                }
            }, (err: HttpErrorResponse) => {
                this.respData=[];
                this.noData=false;
            })
    }

    goBack() {
        this.location.back();
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                first_name: objData.first_name,
                phone_number: objData.phone_number,
                email: objData.email,
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
                case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'phone_number': return this.utility.compare(+ a.phone_number, + b.phone_number, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);

                default: return 0;
            }
        });
    }


    bookingInfo(data) {
        this.dialog.open(TravellerInfoComponent, {
            data: data
        });

    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const ts = new Date().toDateString();
        this.exportAsService.save(this.config, `${ts}`)
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    paxInfo(data) {

    }

    updateTraveller(data) {
        this.router.navigate(['/administrator/addtraveller']);

        this.administratorService.travellerUpdateData.next(data);
    }

    public addTraveller() {
        this.administratorService.travellerUpdateData.next({}); //Added since if we click on "update traveller" and the then click on "add new traveller" form was not resetting 
        this.router.navigate(['/administrator/addtraveller']);
    }

    public bookingView() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'admin-traveller-info';
        dialogConfig.width = '892px';
        dialogConfig.height = '605px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { id: 1 }
        this.dialog
            .open(TravellerInfoComponent, dialogConfig)
            .afterClosed()
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Traveller Name": response.first_name,
                "Phone Number": response.phone_number,
                "Email Id": response.email,
                "Registered Date": moment(response.created_at).format("MMM DD, YYYY"),
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Traveller List',
            columnWidths
        );
    }

    onSearch() {

    }

    onReset() {

    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
