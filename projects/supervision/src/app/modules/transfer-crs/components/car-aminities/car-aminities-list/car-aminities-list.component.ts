import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs/hotel-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material';
import { TransferCrsService } from '../../../transfer-crs.service';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-car-aminities-list',
  templateUrl: './car-aminities-list.component.html',
  styleUrls: ['./car-aminities-list.component.scss']
})
export class CarAminitiesListComponent implements OnInit {

   pageSize = 10;
     page = 1;
     collectionSize: number;
     displayColumn: { key: string, value: string }[] = [
         { key: "Slno", value: 'SI No.' },
         { key: "room_amenity_name", value: 'Car Amenity Name' },
         { key: "status", value: 'Status' },
         { key: "action", value: 'Actions' },
     ];
     noData: boolean = true;
     respData: any;
     status;
 
     @Output() toUpdate = new EventEmitter<any>();
 
     constructor(
         private hotelCrsService: TransferCrsService,
         private swalService: SwalService,
         private utility: UtilityService,
     ) { }
 
     ngOnInit() {
         this.getRoomAmenityList();
     }
 
     getRoomAmenityList(): void {
         const data = [{ offset: 0, limit: 10 }]
         data['topic'] = 'listCarAmenities';
         this.hotelCrsService.fetch(data).subscribe(resp => {
            //  log.debug(resp);
             if (resp.statusCode == 201) {
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
        //  log.debug(index);
         const data = [{ id: val['id'] }];
         data['topic'] = 'editCarAmenitiesStatus';
         this.hotelCrsService.fetch(data).subscribe(resp => {
             if (resp.statusCode == 200) {
                 const data = [{
                     id: resp.data['id'] || '',
                     room_amenity_name: resp.data['room_amenity_name'] || '',
                     status: val['status'] ? true : false,
                 }];
                 data['topic'] = 'updateCarAmenities';
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
             data['topic'] = 'deleteCarAmenities';
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
 


