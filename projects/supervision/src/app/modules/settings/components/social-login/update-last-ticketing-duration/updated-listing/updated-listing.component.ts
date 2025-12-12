import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

const log = new Logger('UpdatedListingComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-updated-listing',
    templateUrl: './updated-listing.component.html',
    styleUrls: ['./updated-listing.component.scss']
})
export class UpdatedListingComponent implements OnInit {

    displayColumn: string[] = ['Sl No.', 'Airline Name', 'Duration', 'Action']
    updateLastTicketingDataList: any[] = [];
    errorMessage: string;
    subSunk = new SubSink();
    editable: boolean = false;
    selectedIndex: any;
    pageSize = 50;
    page = 1;
    collectionSize: number;
    searchText: string;
    noData:boolean=true;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.getLastTicketingUpdatedTime();
    }

    triggerTab($event) {

    }

    getLastTicketingUpdatedTime() {
        this.noData=true;
        this.updateLastTicketingDataList=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('getLastTicketingUpdatedTime', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.updateLastTicketingDataList = resp.data;
                this.noData=false;
                respDataCopy = [...this.updateLastTicketingDataList];
                this.collectionSize = respDataCopy.length;
            } else {
                this.noData=false;
                this.updateLastTicketingDataList=[];
            }
        }, err => {
                this.noData=false;
                this.updateLastTicketingDataList=[];
        });
    }

    onUpdateTime(input: any, index: any) {
        this.editable = true;
        this.selectedIndex = index;
    }

    onSaveRecords(saveData: any) {
        const airlineName = saveData.name;
        let airlineId = 0;
        for (const item of this.updateLastTicketingDataList) {
            if (item.name === airlineName) {
                airlineId = item.id;
                break;
            }
        }

        const time = saveData.duration || saveData.last_ticketing_time;
        const updateData = { Id: String(airlineId), Minutes: String(time) };

        this.subSunk.sink = this.apiHandlerService.apiHandler('updateLastTicketingTime', 'post', {}, {},
            updateData
        ).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.swalService.alert.success("Last ticketing time has been updated.");
                this.editable=false;
                 this.getLastTicketingUpdatedTime();
            } else {
                this.errorMessage = resp.Message;
                this.swalService.alert.oops(this.errorMessage);
                this.editable=false;
            }
        }, err => {
            log.error(err);
            this.swalService.alert.oops(err.message);
            this.editable=false;
        });
    }

    onInputChange(event: any, property: string, data: any) {
        data[property] = event.target.innerText;
    }

    sortData(sort: Sort) {
    }
}
