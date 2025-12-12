import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('hotel-crs/HotelTypeList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-room-type-list',
    templateUrl: './room-type-list.component.html',
    styleUrls: ['./room-type-list.component.scss']
})
export class RoomTypeListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "room_type_name", value: 'Room Type Name' },
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
        this.getRoomTypeList();
    }

    getRoomTypeList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'roomTypeList';
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
        data['topic'] = 'editRoomType';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                const data = [{
                    id: resp.data['id'] || '',
                    room_type_name: resp.data['room_type_name'] || '',
                    status: val['status'] ? true : false,
                }];
                data['topic'] = 'updateRoomType';
                this.hotelCrsService.update(data).subscribe(resp => {
                    if (resp.statusCode == 201) {
                        this.swalService.alert.update("Your Status has been Updated Successfully.");
                    }
                    else
                        this.swalService.alert.oops();
                })
            } else {
                this.swalService.alert.opps();
            }
        });

    }


    updateRoomType(data) {
        this.toUpdate.emit({ tabId: 'add_room_type', room_type: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                room_type_name: objData.room_type_name,

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
                case 'room_type_name': return this.utility.compare('' + a.room_type_name, '' + b.room_type_name, isAsc);
                default: return 0;
            }
        });
    }
 
        deleteRoomType(roomData){
            this.swalService.alert.delete((action)=>{
                if(action){
                    const data = [{id:roomData['id']}]
                    data['topic'] = 'deleteRoomType';
                    this.hotelCrsService.fetch(data).subscribe(response => {
                     
                                if (response.statusCode == 200 || response.statusCode == 201) {
                                this.swalService.alert.success(`Room Type has been deleted successfully`);
                                this.getRoomTypeList();
                                }
                            },(err: HttpErrorResponse) => {
                                this.swalService.alert.error(err['error']['Message']);
                            }
                        );
                }
            })
        }
    }


