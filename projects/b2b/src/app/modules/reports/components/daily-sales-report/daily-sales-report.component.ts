import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../reports.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';


const log = new Logger('report/DailySalesReportComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-daily-sales-report',
    templateUrl: './daily-sales-report.component.html',
    styleUrls: ['./daily-sales-report.component.scss']
})
export class DailySalesReportComponent implements OnInit {

    navLinks = [];
    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'reference_number', value: 'Reference Number' },
        { key: 'status', value: 'Status' },
        { key: 'pnr', value: 'PNR' },
        { key: 'leadpax_name', value: 'Customer Name' },
        { key: 'from', value: 'From' },
        { key: 'to', value: 'To' },
        { key: 'type', value: 'Trip Type' },
        { key: 'agent_netfare', value: 'Agent Net Fare' },
        { key: 'agent_commission', value: 'Agent Commission' },
        { key: 'agent_markup', value: 'Agent Markup' },
        { key: 'tds', value: 'TDS' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'tarvel_date', value: 'Travel Date' },
        { key: 'booked_on', value: 'Booked On' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: any;



    constructor(
        private reportsService: ReportService,
        private utility: UtilityService,
        private swalService: SwalService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.navLinks = getLinks();
        this.getDailySalesReport();
    }

    getDailySalesReport() {
        this.reportsService.fetchDailySalesReport()
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data['flight_booking_reports'];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                } else {
                    this.noData = true;
                    log.debug('something went worng', resp);
                    this.swalService.alert.oops(resp.data['error_msg']);
                }
            });
    }

    getVoucher(data) {
        log.debug('getVoucher called', data);
        this.router.navigate(['/reports/flight-voucher'], {queryParams: {data: JSON.stringify(data)}} );
    }

    onSelect(tab, i) {
    }

    beforeChange(e) {
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                reference_number: objData.reference_number,
                pnr: objData.pnr,
                leadpax_name: objData.leadpax_name,
                from: objData.from,
                to: objData.to,
                type: objData.type,
                agent_netfare: objData.agent_netfare,
                agent_commission: objData.agent_commission,
                agent_markup: objData.agent_markup,
                tds: objData.tds,
                total_fare: objData.total_fare,
                tarvel_date: objData.tarvel_date,
                booked_on: objData.booked_on,
                status: objData.status,
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
                case 'reference_number': return this.utility.compare('' + a.reference_number.toLocaleLowerCase(), '' + b.reference_number.toLocaleLowerCase(), isAsc);
                case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
                case 'leadpax_name': return this.utility.compare('' + a.leadpax_name.toLocaleLowerCase(), '' + b.leadpax_name.toLocaleLowerCase(), isAsc);
                case 'from': return this.utility.compare('' + a.from.toLocaleLowerCase(), '' + b.from.toLocaleLowerCase(), isAsc);
                case 'to': return this.utility.compare('' + a.to, '' + b.to, isAsc);
                case 'type': return this.utility.compare('' + a.type.toLocaleLowerCase(), '' + b.type.toLocaleLowerCase(), isAsc);
                case 'agent_netfare': return this.utility.compare(+ a.agent_netfare.toLocaleLowerCase(), + b.agent_netfare.toLocaleLowerCase(), isAsc);
                case 'agent_commission': return this.utility.compare(+ a.agent_commission.toLocaleLowerCase(), + b.agent_commission.toLocaleLowerCase(), isAsc);
                case 'agent_markup': return this.utility.compare(+ a.agent_markup.toLocaleLowerCase(), + b.agent_markup.toLocaleLowerCase(), isAsc);
                case 'tds': return this.utility.compare(+ a.tds.toLocaleLowerCase(), + b.tds.toLocaleLowerCase(), isAsc);
                case 'total_fare': return this.utility.compare(+ a.total_fare.toLocaleLowerCase(), + b.total_fare.toLocaleLowerCase(), isAsc);
                case 'tarvel_date': return this.utility.compare('' + a.tarvel_date.toLocaleLowerCase(), '' + b.tarvel_date.toLocaleLowerCase(), isAsc);
                case 'booked_on': return this.utility.compare(+ a.booked_on.toLocaleLowerCase(), + b.booked_on.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }


}

function getSearchOption() {
    return [
        {

        }
    ]
}

function getLinks() {
    return [
        {
            icon: 'fa fa-plane',
            label: 'Flight Report',
            class: '',
            report: 'Flight',
        },
    ]
}