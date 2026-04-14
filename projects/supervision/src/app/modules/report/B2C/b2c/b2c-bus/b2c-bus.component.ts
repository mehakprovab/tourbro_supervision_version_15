import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
let filterArray: Array<any> = [];
import { Sort } from "@angular/material/sort";
@Component({
  selector: 'app-b2c-bus',
  templateUrl: './b2c-bus.component.html',
  styleUrls: ['./b2c-bus.component.scss']
})
export class B2cBusComponent implements OnInit {

  private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    maxDate = new Date();
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    showConfirm:boolean=false;
    isOpen = false as boolean;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName:string;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        // { key: 'trip_id', value: 'Trip Id' },
        // { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        // { key: 'approvar_status', value: 'Approvar Status' },
        // { key: 'approvar_name', value: 'Approvar Name' },
        // { key: 'corporate_name', value: 'Corporate Name' },
        { key: 'departure_date', value: 'Departure Date' },
        { key: 'arrival_date', value: 'Arrival Date' },
        { key: 'departure_from', value: 'Departure From' },
        { key: 'arrival_to', value: 'Arrival To' },
        { key: 'bus_type', value: 'Bus Type' },
        { key: 'operator', value: 'Operator' },
        { key: 'pnr', value: 'PNR' },
        { key: 'ticket', value: 'Ticket' },
        { key: 'currency', value: 'Currency' },
        { key: 'totalFare', value: 'TotalFare' },
        { key: 'booked_by', value: 'Booked By' },
        { key: 'created_at', value: 'Booked On' }
    ];
    filteredCorp: Observable<string[]>;
    corporateList: Array<any> = []; 
    status: string;
    deleteData: any;
    loading: boolean;
    corporateId: string;
    loggedInUser: any;
 
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private router: Router,
        private swalService:SwalService,
        private cdr:ChangeDetectorRef
      ) { }

    ngOnInit() {
        this.initialize();
        this.getBusReport();
    }

    initialize(){
        this.regConfig = this.fb.group({
            bus_booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            bus_booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            bus_app_reference: new FormControl('', [Validators.maxLength(120)]),
            bus_phone: new FormControl('', [Validators.maxLength(50)]),
            bus_email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            bus_status: new FormControl('ALL'),
            // corporate: new FormControl('', [Validators.maxLength(120)]),
        });
    }

    onValueChange(value){
        if(value==''){
            this.corporateId='';
        }
  }
  
  onSelectionChanged(event) {
    this.corporateId= event.option.id;
}


    confirmCancel(data,value){
        this.status=value;
        this.deleteData = data;
        this.showConfirm = true;
    }
    
    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter((option:any )=> (option.business_name+' ('+option.id+')').toLowerCase().includes(filterValue));
    }

    convertDatetime(datetime) {
        if (datetime) {
            return datetime.replace(/\.$/, '.000Z');
        }
    };

    getBusReport() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "status": this.regConfig.get('bus_status').value,
            "app_reference": this.regConfig.get('bus_app_reference').value,
            "booked_from_date": this.regConfig.get('bus_booked_from_date').value ? formatDate(this.regConfig.get('booked_from_date').value, 'YYYY-MM-DD') : "",
            "booked_to_date": this.regConfig.get('bus_booked_to_date').value ? formatDate(this.regConfig.get('booked_to_date').value, 'YYYY-MM-DD') : "",
            "email":'',
            'pnr':'',
            "corporate_id":this.corporateId
        }
        this.apiHandlerService.apiHandler('busReport', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.respData = res.data;
                this.collectionSize = this.respData.length;
                this.noData = false;
            }
            else {
                this.respData = [];
                this.collectionSize = this.respData.length;
                this.noData = false;
            }
        }, (err) => {
                this.respData = [];
                this.collectionSize = this.respData.length;
                this.noData = false;
        });
    }

    eticket(data: any) {
       const appReference = data.app_reference;
       this.router.navigate(['/report/voucher/bus'], { queryParams: { appReference:appReference,booking_source:data.booking_source } });
    }

    exportExcel(): void {
        if (this.respData && this.respData.length > 0) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                // Check if itinerary exists and has data
                const itinerary = response.itinerary && response.itinerary[0];
                const status = this.getFormtedStatus(response.status);
                const departure_datetime = itinerary ? this.convertDatetime(itinerary.departure_datetime) : null;
                const arrival_datetime = itinerary ? this.convertDatetime(itinerary.arrival_datetime) : null;
                const created_at = itinerary ? this.convertDatetime(itinerary.created_at) : null;
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.app_reference,
                    "Trip Id": response.trip_id,
                    "Trip Name": response.trip_name,
                    "Booking Status": response.status,
                    "Approvar Status": response.approvar_status || 'PENDING',
                    "Approvar Name": response.approvar_name || 'N/A',
                    "Corporate Name": response.corporate_name || 'N/A',
                    "Departure Date": departure_datetime ? new Date(departure_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Arrival Date": arrival_datetime ? new Date(arrival_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Departure From": itinerary ? itinerary.departure_from : '',
                    "Arrival To": itinerary ? itinerary.arrival_to : '',
                    "Bus Type": itinerary ? itinerary.bus_type || 'N/A' : 'N/A',
                    "Operator": itinerary ? itinerary.operator : '',
                    "PNR": response.pnr || 'N/A',
                    "Ticket": response.ticket || 'N/A',
                    "Currency": response.currency,
                    "TotalFare": response.total_fare,
                    "Booked By": response.booked_by || 'N/A',
                    "Booked On": created_at ? new Date(created_at).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                }
            });
    
            const columnWidths = [
                { wch: 5 }
            ];
            const fieldsLength = this.respData.length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 });
            }
            this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
            let value = this.loggedInUser.auth_role_id == 1 ? "Admin" : 'Staff'
            this.utility.exportToExcel(
                fileToExport,
                value+'-Bus Report',
                columnWidths
            );
        }
    }
    

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onSearchSubmit(){
        this.getBusReport();
    }
    
    hide(){
        this.showConfirm=false;
    }

    cancelTicket() {
        this.loading = true;
        this.showConfirm = false;
        let payload={
            booking_source: this.deleteData.booking_source,
            AppReference:this.deleteData.app_reference,
        }
        this.apiHandlerService.apiHandler('buscancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
                this.getBusReport();
            }
            else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
            this.cdr.detectChanges();
        });
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respData];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'appReference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'trip_id': return this.utility.compare('' + a.trip_id, '' + b.trip_id, isAsc);
                case 'trip_name': return this.utility.compare('' + a.trip_name, '' + b.trip_name, isAsc);
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'booked_by ': return this.utility.compare('' + a.bookedBy, '' + b.bookedBy, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.approvar_status, '' + b.approvar_status, isAsc);
                case 'departure_date': return this.utility.compare('' + a.itinerary[0].departure_datetime, '' + b.itinerary[0].departure_datetime, isAsc);
                case 'arrival_date': return this.utility.compare('' + a.itinerary[0].arrival_datetime, '' + b.itinerary[0].arrival_datetime, isAsc);
                case 'departure_from': return this.utility.compare('' + a.itinerary[0].departure_from, '' + b.itinerary[0].departure_from, isAsc);
                case 'arrival_to': return this.utility.compare('' + a.itinerary[0].arrival_to, '' + b.itinerary[0].arrival_to, isAsc);
                case 'bus_type': return this.utility.compare('' + a.itinerary[0].bus_type, '' + b.itinerary[0].bus_type, isAsc);
                case 'operator': return this.utility.compare('' + a.itinerary[0].operator, '' + b.itinerary[0].operator, isAsc);
                case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
                case 'ticket': return this.utility.compare('' + a.ticket, '' + b.ticket, isAsc);
                case 'currency': return this.utility.compare('' + a.currency, '' + b.currency, isAsc);
                case 'totalFare': return this.utility.compare('' + a.total_fare, '' + b.total_fare, isAsc);
                case 'created_at': return this.utility.compare('' + a.itinerary[0].created_at, '' + b.itinerary[0].created_at, isAsc);
                default: return 0;
            }
        });
    }

    onReset(){
        this.corporateId='';
        this.initialize();
    }

    voidTicket(){

    }

}
