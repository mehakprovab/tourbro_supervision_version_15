import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { ActivityCrsService } from "../../../../activity-crs.service";
import { Router } from "@angular/router";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { MatSlideToggleChange } from "@angular/material";

const log = new Logger('transfer-crs/TransferVehicleListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-list-activity-country',
    templateUrl: './list-activity-country.component.html',
    styleUrls: ['./list-activity-country.component.scss']
})

export class ListActivityCountryComponent implements OnInit {
    public pageSize = 10;
    public page = 1;
    public collectionSize: number;
    public displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "status", value: 'Status' },
        { key: "counrty_name", value: 'Country Name' },
        
    ];
    public noData: boolean = true;
    public respData: any[] = [];
    @Output() toUpdate = new EventEmitter<any>();
    public searchText: string = '';
    public loggedInUser: any;
    constructor(
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private activityCRSService: ActivityCrsService,
        private router: Router,
        private swalService: SwalService
    ) { }
    ngOnInit(): void {
        const currentDomainUser = localStorage.getItem('currentDomainUser');
      this.loggedInUser = JSON.parse(currentDomainUser);
        if (this.loggedInUser.auth_role_id !== 7) {
      this.displayColumn.push({ key: "action", value: 'Actions' },)
    }
        
        this.getCounrtyList()
    }

    getCounrtyList() {
        this.noData = true;
        this.respData = [];
        this.apiHandlerService.apiHandler('activityCountryList', 'POST',{},{},{}).subscribe({
            next: (res) => {
                console.log(res);
                if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                    this.respData = res.data;
                    this.collectionSize = res.data.length;
                    this.noData = false;
                } else {
                    this.respData = [];
                    this.noData = true;
                }
            }, error: (err) => {
                console.log(err);
                this.noData = true;
                this.respData = [];
            }
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
                case 'hotel_type_name': return this.utility.compare('' + a.hotel_type_name, '' + b.hotel_type_name, isAsc);
                default: return 0;
            }
        });
    }

    updateCountry(data) {
         this.router.navigate(
          ['/activity/add-activity-country'],
          { queryParams: { tab: 'add_activity_country' } }
        );
        this.activityCRSService.getCountryData.next(data);
    }

    deleteCountry(data) {
        this.swalService.alert.delete((action) => {
            if (action) {
                this.apiHandlerService.apiHandler('deleteActivityCountry', 'POST',{},{},{id: data.id}).subscribe({
                    next: (res) => {
                        console.log(res);
                        if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                            this.respData = res.data;
                            this.collectionSize = res.data.length;
                            this.noData = false;
                        } else {
                            this.respData = [];
                            this.noData = true;
                        }
                    }, error: (err) => {
                        console.log(err);
                        this.noData = true;
                        this.respData = [];
                    }
                })
            }})
    }

    updateStatus(event: MatSlideToggleChange, id) {
        const req = {
            "Id": id,
            "Status":event.checked
        }
         this.apiHandlerService.apiHandler('updateCountryStatus', 'POST',{},{},req).subscribe({
            next: (res) => {
                console.log(res);
                if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                    this.respData = res.data;
                    this.collectionSize = res.data.length;
                    this.noData = false;
                } else {
                    this.respData = [];
                    this.noData = true;
                }
            }, error: (err) => {
                console.log(err);
                this.noData = true;
                this.respData = [];
            }
        })
    }
}