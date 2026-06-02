import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Location } from '@angular/common'
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
    airLineLogoUrl: string = 'https://www.travelsoho.com/antrip_v1/extras/system/library/images/airline_logo/'; //AI.gif
    domainInformation: any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'flight_voucher',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    isB2Credirrection:boolean=false;
    isUpdateLTT:boolean=false;//To update last ticketing time
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
        private location:Location
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
           this.setQueryParams(queryParams);
        });
        this.getFlightDetails();
        this.createPnrForm();
        this.createTicketForm()
    }

    createPnrForm() {
        this.pnrForm = this.fb.group({
            pnr: new FormControl('', [Validators.pattern(this.utility.regExp.alphaNum)]),
            gdspnr: new FormControl('', [Validators.pattern(this.utility.regExp.alphaNum)]),
            lastDateToTicket:new FormControl('')
        });
    }

    createTicketForm() {
        this.ticketForm = this.fb.group({
            ticketDetails: new FormArray([])
        })
    }

    getFlightDetails() {
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
                    this.setEmpty(this.voucherData);
                    this.pnrForm.patchValue({
                        pnr: this.voucherData['FlightItineraries'][0]['airline_pnr'],
                        gdspnr:this.voucherData['GDS_PNR'],
                        lastDateToTicket:this.voucherData['LastDateToTicket']
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
            this.t.push(this.fb.group({
                id: [''],
                name: [''],
                type: [''],
                ticket_no: ['']
            }));
            if(passengers[i].ticket_no==null || passengers[i].ticket_no==undefined)
            {
                passengers[i].ticket_no="";
            }
            const controlArray = <FormArray>this.ticketForm.get('ticketDetails');
            controlArray.controls[i].get('id').setValue(passengers[i].id);
            controlArray.controls[i].get('name').setValue(`${passengers[i].title}. ${passengers[i].first_name} ${passengers[i].last_name}`);
            controlArray.controls[i].get('type').setValue(passengers[i].passenger_type);
            controlArray.controls[i].get('ticket_no').setValue(passengers[i].ticket_no);
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
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        setTimeout(() => {
            this.exportAsService.save(this.config, `voucher`).subscribe();
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

    checkWalletBalance() {
        if (this.app_reference) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: this.app_reference })
                .subscribe(res => {
                    if (res && res.data[0].ticketFare) {
                        if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                            this.swalService.alert.oops("Your wallet balance is not sufficient.");
                        }
                        else {
                            this.updatePnr();
                        }
                    }
                }, (err) => {
                    this.swalService.alert.oops(err.error.Message)
                });
        }
    }

    updatePnr() {
        let req = {
            "app_reference": this.app_reference,
            "pnr_no": this.pnrForm.value.pnr,
            "gdspnr":this.pnrForm.value.gdspnr,
            "ids": this.ticketForm.value.ticketDetails,
            "lastDateToTicket":this.pnrForm.value.lastDateToTicket
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('flightUpdatePNR', 'post', {}, {},
            req)
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.swalService.alert.success('Record updated successfully!!')
                    if (!this.isUpdateLTT && !this.isB2Credirrection) {
                        this.deductFromWallet();
                    }
                    else
                    {  
                        this.onRefresh()
                    }
                }
            }, (err) => {
                this.swalService.alert.oops(err.error.Message)
            });
    }

    deductFromWallet() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: this.app_reference }).subscribe(res => {
            if (res) {
                this.router.navigate(['/report/b2b/voucher/flight'], { queryParams: { appReference: this.app_reference  } });
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message)
        });
    }

    setQueryParams(queryParams) {
        this.app_reference = (queryParams['AppReference']);
        if (queryParams && queryParams.Module && queryParams.Module=='B2C') {
            this.isB2Credirrection = true;
        }
        if (queryParams && queryParams.Module && queryParams.Module=='LTT') {
            this.isUpdateLTT = true;
        }
    }

    setEmpty(voucherData)
    {
        if (this.voucherData['FlightItineraries'][0]['airline_pnr'] == null || this.voucherData['FlightItineraries'][0]['airline_pnr'] == undefined) {
            this.voucherData['FlightItineraries'][0]['airline_pnr'] = "";
        }
        if (this.voucherData['GDS_PNR'] == null || this.voucherData['GDS_PNR'] == undefined) {
            this.voucherData['GDS_PNR'] = "";
        }
        if (this.voucherData['LastDateToTicket'] == null || this.voucherData['LastDateToTicket']== undefined) {
            this.voucherData['LastDateToTicket']="";
        }
    }

    onRefresh() {
        this.ngOnInit(); 
    }

    goBackToPrevPage(): void {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
