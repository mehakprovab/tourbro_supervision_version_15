import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '../../../../core/services/until-destroyed';
import { Sort } from '@angular/material';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('settings/ApiCurrencyRateListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = []


@Component({
  selector: 'app-api-currency-rate-list',
  templateUrl: './api-currency-rate-list.component.html',
  styleUrls: ['./api-currency-rate-list.component.scss']
})
export class ApiCurrencyRateListComponent implements OnInit, OnDestroy {

    pageSize = 6;
    page = 1;
    collectionSize;
    noData: boolean = true;
    respData: object[];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'api', value: 'API' },
        { key: 'currency', value: 'Currency' },
        { key: 'value', value: 'Value' },
        { key: 'updated_datetime', value: 'Updated On' }
    ];
    value: any;
    status;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.apiHandlerService.apiHandler('apiCurrencyRateList', 'get')
            .pipe(
                finalize(() => {
                }),
                untilDestroyed(this),
            )
            .subscribe(resp => {
                log.debug(resp);
                if (resp['Status'] && resp['Data']) {
                    this.noData = false;
                    this.respData = resp['Data'];
                    this.collectionSize = this.respData.length;
                    respDataCopy = [...this.respData]
                }
            });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            // keys that are required to filter.
            let filterKeys = {
                api: objData.api,
                currency: objData.currency,
                value: objData.value,
                updated_datetime: objData.updated_datetime,
            };
            if (Object.values(filterKeys).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        log.debug(filterArray);
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
                case 'api': return compare(a.api, b.api, isAsc);
                case 'currency': return compare(a.currency, b.currency, isAsc);
                case 'value': return compare(+ a.value, + b.value, isAsc);
                case 'updated_datetime': return compare(a.updated_datetime, b.updated_datetime, isAsc);
                default: return 0;
            }
        });
    }

    onUpdate(doc) {
        doc = {
            "currency_id": Number(doc.id),
             "value": `${doc.value}`
           }
        console.log(doc);
        this.apiHandlerService.apiHandler('updateApiCurrencyRate', 'post', {}, {}, doc)
            .subscribe(resp => {
                if (resp.Status && resp['Data']['msg'])
                    this.swalService.alert.update();
                else if (resp.Status && resp['Data']['error_msg'])
                    this.swalService.alert.oops();
            })
    }

    ngOnDestroy() {
    }

}


function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
