import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material';
const log = new Logger('hotel-crs/HotelTypeList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.scss']
})
export class MealListComponent implements OnInit {

  pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_meal_type_name", value: 'Hotel Meal Type' },
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
        const data = [{ offset: 0, limit: 10 }];
        data['topic'] = 'mealList';
    
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode === 200) {
                this.noData = false;
                this.respData = resp.data.map(item => ({
                    ...item,
                    status: item.status.toString() // Ensure status is always a string
                }));
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            } else if (resp.statusCode === 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        });
    }
    
    

    onStatusUpdate(val, index): void {
        const data = { ...val }; // Create a shallow copy of the object
        data['id'] = val['id'];
    
        // Toggle the status
        data['status'] = data['status'] === "1" ? 0 : 1;
    
        const updatePayload = [data];
        console.log("Updated data:", updatePayload);
        delete updatePayload[0].created_at;
        delete updatePayload[0].created_by_id;
        updatePayload['topic'] = 'updateMeal';
    
        this.hotelCrsService.update(updatePayload).subscribe(resp => {
            if (resp.statusCode === 200) {
                this.getHotelTypeList();
                this.swalService.alert.update("Your Status has been updated Successfully.");
            } else {
                this.swalService.alert.oops();
            }
        });
    }
    
    
    
  


    updateHotelType(data) {
        console.log("data",data)
        this.toUpdate.emit({ tabId: 'add_hotel_type', hotel_type: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                hotel_type_name: objData.meals,
                
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
                    data['topic'] = 'deleteMeal';
                    this.hotelCrsService.fetch(data).subscribe(response => {
                     
                                if (response.statusCode == 200 || response.statusCode == 201) {
                                this.swalService.alert.success(`Meal Type has been deleted successfully`);
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
