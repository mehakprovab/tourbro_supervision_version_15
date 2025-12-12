import { Component, OnInit, OnDestroy,EventEmitter,Output } from '@angular/core';
import { Sort } from '@angular/material';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment.prod';

const baseUrl = environment.baseUrl;
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-list-airline-partner',
  templateUrl: './list-airline-partner.component.html',
  styleUrls: ['./list-airline-partner.component.scss']
})
export class ListAirlinePartnerComponent implements OnInit, OnDestroy {

    @Output() staticContentTab = new EventEmitter<any>();

    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 100;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'module_name', value: 'Module' },
        { key: 'title', value: 'Title' },
        { key: 'logo', value: 'Logo' },
        { key: 'description', value: 'Description' },
        { key: 'status', value: 'Status' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    logoBankUri = baseUrl;

    constructor(
        private cmsService: CmsService,
        private utility: UtilityService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.cmsService.hotelAirlineData.next({});
        this.getAirlineHotelList();
    }


    updateContent(data) {
        this.cmsService.hotelAirlineData.next(data);
        this.staticContentTab.emit({ tabId: 'add_update_airline', data });
    }

    onStatusChange(data) {
        console.log(data);
        this.subSunk.sink = this.cmsService.updateAirlineHotelPartnerStatus(
            { "status": data.status == 1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Status updated successfully.");
                    this.getAirlineHotelList();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            }
            );
    }

    deleteAirline(data){
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.subSunk.sink = this.cmsService.deleteAirlineHotelPartner(
                    { "id": data.id })
                    .subscribe(resp => {
                        console.log(resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Record deleted successfully.");
                            this.getAirlineHotelList();
                        }
                        else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    }
                    );
                }
            }); 
    }

    getAirlineHotelList() {
        this.noData=true;
        this.respData=[];
        let data = {
            "module_name": "Flight"
        }
        this.subSunk.sink = this.cmsService.airlineHotelPartnerList(data).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = false;
                this.respData = [];
            }
        }, (err) => {
            this.noData = false;
            this.respData = [];
        });
    }

    sortData(sort: Sort) {
        console.log(sort)
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'module_name': return this.utility.compare('' + a.module_name.toLocaleLowerCase(), '' + b.module_name.toLocaleLowerCase(), isAsc);
                case 'title': return this.utility.compare('' + a.title.toLocaleLowerCase(), '' + b.title.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare(+ a.status, + b.status, isAsc);
                case 'description': return this.utility.compare('' + a.description.toLocaleLowerCase(), '' + b.description.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
