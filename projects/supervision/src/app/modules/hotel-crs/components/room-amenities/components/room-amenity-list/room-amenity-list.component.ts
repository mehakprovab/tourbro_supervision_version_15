import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('hotel-crs/HotelAmenityList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-room-amenity-list',
    templateUrl: './room-amenity-list.component.html',
    styleUrls: ['./room-amenity-list.component.scss']
})
export class RoomAmenityListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "room_amenity_name", value: 'Room Amenity Name' },
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
        this.getRoomAmenityList();
    }

    getRoomAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'roomAmenityList';
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
        data['topic'] = 'editRoomAmenity';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                const data = [{
                    id: resp.data['id'] || '',
                    room_amenity_name: resp.data['room_amenity_name'] || '',
                    status: val['status'] ? true : false,
                }];
                data['topic'] = 'updateRoomAmenity';
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


    updateRoomAmenity(data) {
        this.toUpdate.emit({ tabId: 'add_room_amenity', room_amenity: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                room_amenity_name: objData.room_amenity_name,
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
                case 'room_amenity_name': return this.utility.compare('' + a.room_amenity_name, '' + b.room_amenity_name, isAsc);
                default: return 0;
            }
        });
    }
 
deleteRoomAmenity(roomAmenity){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{id:roomAmenity['id']}]
            data['topic'] = 'deleteRoomAmenity';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Room Amenity has been deleted successfully`);
                        this.getRoomAmenityList();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
}
