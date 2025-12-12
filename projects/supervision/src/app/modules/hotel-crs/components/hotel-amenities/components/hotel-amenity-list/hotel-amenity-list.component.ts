import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Logger } from '../../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('hotel-crs/HotelAmenityList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-amenity-list',
    templateUrl: './hotel-amenity-list.component.html',
    styleUrls: ['./hotel-amenity-list.component.scss']
})
export class HotelAmenityListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_amenity_name", value: 'Hotel Amenity Name' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    status;

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private hotelCrsService: HotelCrsService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getHotelAmenityList();
    }

    getHotelAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelAmenityList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        });
    }

    onStatusUpdate(val, index): void {
        log.debug(index);
        const data = [{ id: val['id'] }];
        data['topic'] = 'editHotelAmenity';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                const data = [{
                    id: resp.data['id'] || '',
                    hotel_amenity_name: resp.data['hotel_amenity_name'] || '',
                    status: val['status'] ? true : false,
                }];
                data['topic'] = 'updateHotelAmenity';
                this.hotelCrsService.update(data).subscribe(resp => {
                    if (resp.statusCode == 201) {
                        this.swalService.alert.update();
                    }
                    else
                        this.swalService.alert.oops();
                })
            } else {
                this.swalService.alert.opps();
            }
        });

    }


    updateHotelAmenity(data) {
        this.toUpdate.emit({ tabId: 'add_hotel_amenity', hotel_amenity: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                hotel_amenity_name: objData.hotel_amenity_name,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

            this.page = 1;
            this.collectionSize = this.respData.length;
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
                case 'hotel_amenity_name': return this.utility.compare('' + a.hotel_amenity_name, '' + b.hotel_amenity_name, isAsc);
                default: return 0;
            }
        });
    }
  
    deleteHotelAmenity(hotelAmenity){
        this.swalService.alert.delete((action)=>{
            if(action){
                const data = [{id:hotelAmenity['id']}]
                data['topic'] = 'deleteHotelAmenity';
                this.hotelCrsService.fetch(data).subscribe(response => {
                 
                            if (response.statusCode == 200 || response.statusCode == 201) {
                            this.swalService.alert.success(`Hotel Amenity has been deleted successfully`);
                            this.getHotelAmenityList();
                            }
                        },(err: HttpErrorResponse) => {
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
    }
}
