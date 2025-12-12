import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
    private subSunk = new SubSink();
    searchForm: FormGroup;
    searchText: string;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };

    pageSize = 100;
    page = 1;
    collectionSize: number = 0;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'event', value: 'Event' },
        { key: 'AIR_ID', value: 'Transaction ID' },
        { key: 'eventDateTime', value: 'Event Date & Time' },
        // { key: 'userIP', value: 'User IP' }
    ];
    noData: boolean = true;
    respData: Array<any> = [];
  constructor(
      private activatecRouted: ActivatedRoute,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private utility:UtilityService
  ) { }

  ngOnInit() {
      this.activatecRouted.queryParams.subscribe(q => {
        console.log(q);
        this.subSunk.sink = this.apiHandlerService.apiHandler('masterLog', 'post', {}, {}, q)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    console.log(this.respData);
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = true;
                    this.swalService.alert.error(resp.msg || '');
                }
            });
      })
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
            case 'id': return this.utility.compare(+a.id, +b.id, isAsc);
            case 'event': return this.utility.compare(+a.event, +b.event, isAsc);
            case 'AIR_ID': return this.utility.compare(+a.AIR_ID, +b.AIR_ID, isAsc);
            case 'eventDateTime': return this.utility.compare(+a.eventDateTime, +b.eventDateTime, isAsc);
            case 'userIP': return this.utility.compare(+a.userIP, +b.userIP, isAsc);      
            default: return 0;
        }
    });
}

  applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
    filterArray = respDataCopy.slice().filter((objData, index) => {
        const filterOnFields = {
            event: objData.event,
            AIR_ID: objData.AIR_ID,
            eventDateTime: objData.eventDateTime,
            userIP: objData.userIP,
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

}
