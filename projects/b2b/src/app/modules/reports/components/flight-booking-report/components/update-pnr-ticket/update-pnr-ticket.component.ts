import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const log = new Logger('report/VoucherComponent')

@Component({
    selector: 'app-update-pnr-ticket',
    templateUrl: './update-pnr-ticket.component.html',
    styleUrls: ['./update-pnr-ticket.component.scss']
})
export class UpdatePnrTicketComponent implements OnInit, OnDestroy {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    airLineLogoUrl: string = 'https://Booking 247.com/airline_logo/'; //AI.svg
    domainInformation: any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'flight_voucher',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    pnrForm: FormGroup;
    ticketForm: FormGroup;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['AppReference']);
        });
        this.getB2bFlightVoucher();
        // this.getDomain();
        this.createPnrForm();
        this.createTicketForm()
    }

    createPnrForm() {
        this.pnrForm = this.fb.group({
            pnr: new FormControl('', [Validators.pattern(this.utility.regExp.alphaNum)]),
        });
    }

    createTicketForm() {
        this.ticketForm = this.fb.group({
            ticketDetails: new FormArray([])
        })
    }

    getB2bFlightVoucher() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    resp.data[0]['FlightItineraries'].forEach((element, i) => {
                        if (element.attributes) {
                            let attributes = element.attributes.replace(/\"/gi, "\"");
                            resp.data[0]['FlightItineraries'][i]['attributes'] = JSON.parse(attributes);
                        }
                    });
                    this.voucherData = resp.data[0] || [];
                    this.pnrForm.patchValue({
                        pnr: this.voucherData['FlightItineraries'][0]['airline_pnr'],
                    });
                    if (this.voucherData && this.voucherData['Passengers'])
                        this.updateTicketForm(this.voucherData['Passengers'].length)
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }
    

    get f() { return this.ticketForm.controls; }
    get t() { return this.f.ticketDetails as FormArray; }

    updateTicketForm(e) {
        const numberOfItems = e;
        const passengers = this.voucherData['Passengers'];
        for (let i = 0; i < passengers.length; i++) {
            //  if(passengers[i].id){
            this.t.push(this.fb.group({
                id: [''],
                name: [''],
                type: [''],
                ticket_no: ['']
            }));
            const controlArray = <FormArray>this.ticketForm.get('ticketDetails');
            controlArray.controls[i].get('id').setValue(passengers[i].id);
            controlArray.controls[i].get('name').setValue(`${passengers[i].title} ${passengers[i].first_name} ${passengers[i].last_name}`);
            controlArray.controls[i].get('type').setValue(passengers[i].passenger_type);
            controlArray.controls[i].get('ticket_no').setValue(passengers[i].ticket_no);
            // }
        }
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            })
    }

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }
    calculateDiffTime(fromDate, toDate) {
        return this.utility.calculateDiffTime(fromDate, toDate);
    }

    getTime(t) {
        return t.split(" ")[1];
    }

    cancelBooking() {

    }

    findLeaduserDetails(data) {
        if (data) {
            let leadUser = data.filter(x => {
                return x.LeadPax == true
            });
            return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        setTimeout(() => {
            this.exportAsService.save(this.config, `voucher`).subscribe((_) => {
                // save started
                console.log(`success`);
                this.swalService.alert.success();
            }, (err) => {
                console.log(err);
                this.swalService.alert.oops();
            });
        }, 1000)

    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    updatePnr() {
        let req = {
            "app_reference": this.app_reference,
            "pnr_no": this.pnrForm.value.pnr,
            "ids": this.ticketForm.value.ticketDetails
        }
        console.log(req)
        this.subSunk.sink = this.apiHandlerService.apiHandler('flightUpdatePNR', 'post', {}, {},
            req)
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: this.app_reference } });
                    this.swalService.alert.success('Record updated successfully!!')
                }
            })
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    duration(origin, destination) {
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';

    }


    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
