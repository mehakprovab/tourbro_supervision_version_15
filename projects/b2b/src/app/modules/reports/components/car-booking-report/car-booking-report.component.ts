import { Component, OnInit ,OnDestroy} from '@angular/core';
import { ReportService } from '../../reports.service';
import { SwalService } from '../../../../core/services/swal.service';
import { untilDestroyed } from '../../../../core/services';
import { Logger } from '../../../../core/logger/logger.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';

const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-car-booking-report',
  templateUrl: './car-booking-report.component.html',
  styleUrls: ['./car-booking-report.component.scss']
})
export class CarBookingReportComponent implements OnInit,OnDestroy {
    searchType="car";
    navLinks = [];
    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Status' },
        { key: 'pnr', value: 'Supplier Confirmation' },
        { key: 'Email', value: 'Passenger Details' },
        { key: 'CarFromDate', value: 'From' },
        { key: 'CarToDate', value: 'To' },
        { key: 'CarFromDate', value: 'Travel Date' },
        { key: 'FinalCancelDate', value: 'Cancellation Deadline' },
        { key: 'TotalFare', value: 'XML Rate' },
        { key: 'agent_commission', value: 'Agent Markup' },
        { key: 'TotalFare', value: 'Customer Rate' },
        { key: 'Currency', value: 'Currency' },
        { key: 'CarFromDate', value: 'Booked On' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: any;
  constructor(
    private reportsService: ReportService,
    private swalService: SwalService,
    private utility: UtilityService,
    private router: Router
  ) {
      this.searchType='car';
   }

  ngOnInit() {
  }

  receiveSearchValues($event) {
    this.getBookingReports($event);
}

  getBookingReports(searchForm) {
    this.respData = [];
    this.reportsService.fetchCarBookingReports(searchForm)
        .pipe(untilDestroyed(this))
        .subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                if(resp.data.length!=0){
                this.noData = false;
                this.respData = resp.data;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
                }else{
                    this.noData = true;  
                }
            } else {
                log.debug('something went worng', resp);
            }
        });
}

applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
    filterArray = respDataCopy.slice().filter((objData, index) => {
        const filterOnFields = {
            AppReference: objData.AppReference,
            Status: objData.Status,
            pnr: objData.pnr,
            Email: objData.Email,
            CarFromDate: objData.CarFromDate,
            CarToDate: objData.CarToDate,
            traveldate: objData.CarFromDate,
            FinalCancelDate: objData.FinalCancelDate,
            XMLfare: objData.TotalFare,
            agent_commission: objData.agent_commission,
            TotalFare: objData.TotalFare,
            Currency: objData.Currency,
           
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
            case 'AppReference': return this.utility.compare('' + a.AppReference, '' + b.AppReference, isAsc);
            case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
            case 'CarFromDate': return this.utility.compare('' + a.CarFromDate, '' + b.CarFromDate, isAsc);
            case 'CarToDate': return this.utility.compare('' + a.CarToDate, '' + b.CarToDate, isAsc);
            case 'traveldate': return this.utility.compare(+ a.traveldate, + b.traveldate, isAsc);
            case 'FinalCancelDate': return this.utility.compare(+ a.FinalCancelDate, + b.FinalCancelDate, isAsc);
            case ' XMLfare': return this.utility.compare(+ a. XMLfare, + b. XMLfare, isAsc);
            case 'agent_commission': return this.utility.compare(+ a.agent_commission, + b.agent_commission, isAsc);
            case 'TotalFare': return this.utility.compare(+ a.TotalFare, + b.TotalFare, isAsc);
            case 'JourneyStart': return this.utility.compare('' + a.JourneyStart, '' + b.JourneyStart, isAsc);
            case 'Currency': return this.utility.compare(+ a.Currency, + b.Currency, isAsc);
            case 'Status': return this.utility.compare('' + a.Status.toLocaleLowerCase(), '' + b.Status.toLocaleLowerCase(), isAsc);
            default: return 0;
        }
    });
}

ngOnDestroy() { }

}
