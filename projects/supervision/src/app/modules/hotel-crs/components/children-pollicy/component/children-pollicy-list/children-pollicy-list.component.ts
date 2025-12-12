import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
const log = new Logger('hotel-crs/HotelTypeList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-children-pollicy-list',
  templateUrl: './children-pollicy-list.component.html',
  styleUrls: ['./children-pollicy-list.component.scss']
})
export class ChildrenPollicyListComponent implements OnInit {
  @Input() hotelOneData;
  pageSize = 10;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: "Slno", value: 'SI No.' },
      { key: "Accommodation", value: 'Accommodation' },
      { key: "Meals", value: 'Meals' },
      { key: "children_free_accom", value: 'Children free accom' },
      { key: "accom_children_from_age", value: 'Accom children from_age' },
      { key: "accom_children_to_age", value: 'Accom children to age' },
    //   { key: "accommodation_charge", value: 'Accommodation charge' },
      { key: "Meals", value: 'Children free meals' },
      { key: "meal_children_from_age", value: 'Meal children from_age' },
      { key: "meal_children_to_age", value: 'Meal children to age' },
    //   { key: "Lunch", value: 'Lunch' },
    //   { key: "Iftar", value: 'Iftar' },
    //   { key: "Sahour", value: 'Sahour' },
    //   { key: "Dinner", value: 'Dinner' },
    //   { key: "Breakfast", value: 'Breakfast' },

  ];
  displayColumns: { key: string, value: string }[] = [
  { key: "discount", value: 'Discount' },
  { key: "status", value: 'Status' },
  { key: "action", value: 'Actions' },
  ];
  noData: boolean = true;
  respData: any;
  status;
  mealHeaders: string[] = [];
  @Output() toUpdate = new EventEmitter<any>();
  mealPriceKeys: string[] = [];
  constructor(
      private hotelCrsService: HotelCrsService,
      private swalService: SwalService,
      private utility: UtilityService,
  ) { }

  ngOnInit() {
      this.getPolicyList();
  }

  getPolicyList(): void {
      const data = [{ offset: 0, limit: 10, hotelCode : this.hotelOneData.hotel_code}]
      data['topic'] = 'ChildrenPolicyList';
      this.hotelCrsService.fetch(data).subscribe(resp => {
          log.debug(resp);
          if (resp.statusCode == 200) {
              this.noData = false;
              this.respData = resp.data;
              this.respData = resp.data.map(item => {
                // If meal_prices array exists, determine keys dynamically
                if (item.meal_prices && item.meal_prices.length > 0) {
                    this.mealPriceKeys = Object.keys(item.meal_prices[0]);
                    
                    // Append new meal keys to mealHeaders for dynamic columns
                    this.mealHeaders = [...new Set([...this.mealHeaders, ...this.mealPriceKeys])];
                    
                    // Merge meal_prices into the main item object
                    return { ...item, ...item.meal_prices[0] };
                }
                return item;
            });
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
    console.log("val",val)
    let data = Object.assign({}, val);
    data['id']=val['id']
    data['status']= val['status'] ? 0 : 1;
    data = [data];
    delete data[0].created_at;
    delete data[0].created_by_id;
    data['topic'] = 'hotelChildrenPolicy';
            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.getPolicyList()
                    this.swalService.alert.update();
                }
                else
                    this.swalService.alert.oops();
            })
     
   

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
                  const data = [{id:hotelData['id'],hotelCode : this.hotelOneData.hotel_code}]
                  data['topic'] = 'deleteChildrenPolicy';
                  this.hotelCrsService.fetch(data).subscribe(response => {
                   
                              if (response.statusCode == 200 || response.statusCode == 201) {
                              this.swalService.alert.success(`Children Policy has been deleted successfully`);
                              this.getPolicyList();
                              }
                          },(err: HttpErrorResponse) => {
                              this.swalService.alert.error(err['error']['Message']);
                          }
                      );
              }
          })
      }
}
