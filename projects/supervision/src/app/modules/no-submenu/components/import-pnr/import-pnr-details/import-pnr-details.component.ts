import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { SubSink } from 'subsink';

@Component({
    selector: 'app-import-pnr-details',
    templateUrl: './import-pnr-details.component.html',
    styleUrls: ['./import-pnr-details.component.scss']
})
export class ImportPnrDetailsComponent implements OnInit {
    importPNRData: any = [];
    loggedInUser: any;
    segment_indicator0: any;
    segment_indicator1: any;
    flightItineraries: any;
    buttonName: any = 'Hide Price';
    toggleStyle: boolean = true;
    loading: boolean = false;
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    loadingTemplate: any;
    private subSunk = new SubSink();
    showConfirmButtons: boolean = true;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private utilityService: UtilityService,
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem("currentSupervisionUser"));
        this.setImportData();
    }


    setImportData() {
        const importPNRResponse = localStorage.getItem('importPNRResponse');
        if (importPNRResponse) {
            this.importPNRData = JSON.parse(importPNRResponse);
            this.flightItineraries = this.importPNRData.booking.flightBookingTransactions[0];
            this.setPNRData(this.importPNRData);
        }
        else {
            this.router.navigate(['/import-pnr']);
        }
    }

    setPNRData(importPNRData) {
        this.segment_indicator0 = importPNRData.booking.flightBookingTransactions[0].flightBookingTransactionItineraries.filter(element => element.segment_indicator == 0);
        this.segment_indicator1 = importPNRData.booking.flightBookingTransactions[0].flightBookingTransactionItineraries.filter(element => element.segment_indicator == 1);
    }

    toggle() {
        this.toggleStyle = !this.toggleStyle;
        if (this.toggleStyle)
            this.buttonName = "Hide Price";
        else
            this.buttonName = "Show Price";
    }

    downloadA4(type: any, orientation?: string): void {
        this.utilityService.downloadA4(type, "Import pnr", this.print_voucher, orientation);
    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    directSaveImportPNR() {
        this.loading = true;
        const req = {
            ResultToken: this.importPNRData.ResultToken,
        };

        this.subSunk.sink = this.apiHandlerService
            .apiHandler("directSaveImportPNR", "post", {}, {}, req)
            .subscribe(
                (resp) => this.handleResponse(resp),
                (errorResponse) => this.handleError(errorResponse)
            );
    }

    private handleResponse(resp: any) {
        this.loading = false;
        if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success("Saved Successfully.");

            if (resp.data.booking_status.toUpperCase() === "BOOKING_CONFIRMED") {
                this.showConfirmButtons = false;
            }
        } else {
            this.showConfirmButtons = false;
            this.swalService.alert.oops(resp.Message);
        }
    }

    private handleError(errorResponse: any) {
        this.loading = false;
        this.showConfirmButtons = false;
        this.swalService.alert.oops(errorResponse.error.Message);
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
