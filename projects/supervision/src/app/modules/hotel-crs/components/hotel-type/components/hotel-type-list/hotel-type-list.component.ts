import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SwalService } from '../../../../../../../../src/app/core/services/swal.service';
import { UtilityService } from '../../../../../../../../src/app/core/services/utility.service';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('hotel-crs/HotelTypeList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-type-list',
    templateUrl: './hotel-type-list.component.html',
    styleUrls: ['./hotel-type-list.component.scss']
})
export class HotelTypeListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_type_name", value: 'Hotel Type Name' },
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
        this.getHotelTypeList();
    }

    getHotelTypeList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelTypeList';
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
        data['topic'] = 'editHotelType';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                const data = [{
                    id: resp.data['id'] || '',
                    hotel_type_name: resp.data['hotel_type_name'] || '',
                    status: val['status'] ? true : false,
                }];
                data['topic'] = 'updateHotelType';
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


    updateHotelType(data) {
        this.toUpdate.emit({ tabId: 'add_hotel_type', hotel_type: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                hotel_type_name: objData.hotel_type_name,
                
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
                case 'hotel_type_name': return this.utility.compare('' + a.hotel_type_name, '' + b.hotel_type_name, isAsc);
                default: return 0;
            }
        });
    }
  
        deleteHotelType(hotelData){
            this.swalService.alert.delete((action)=>{
                if(action){
                    const data = [{id:hotelData['id']}]
                    data['topic'] = 'deleteHotelType';
                    this.hotelCrsService.fetch(data).subscribe(response => {
                     
                                if (response.statusCode == 200 || response.statusCode == 201) {
                                this.swalService.alert.success(`Hotel Type has been deleted successfully`);
                                this.getHotelTypeList();
                                }
                            },(err: HttpErrorResponse) => {
                                this.swalService.alert.error(err['error']['Message']);
                            }
                        );
                }
            })
        }
    }

