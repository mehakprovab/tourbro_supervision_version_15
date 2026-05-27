import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {  Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('hotel-crs/HotelTypeList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-tax-list',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss']
})
export class TaxListComponent implements OnInit {

    @Input() hotelOneData;
  pageSize = 10;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: "Slno", value: 'SI No.' },
      { key: "tax_type_name", value: 'Tax Type' },
      { key: "tax_value", value: 'Tax Value' },
      { key: "pay_upon_arrival", value: 'Pay Upon Arrival' },
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
      this.getTaxList();
  }

  getTaxList(): void {
      const data = [{hotel_code:  this.hotelOneData.hotel_code}]
      data['topic'] = 'taxList';
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

  onStatusUpdate(val: any, index: number, event: MatSlideToggleChange): void {
    const isChecked = event.checked; // Get the boolean value directly from the event
  
    let data = Object.assign({}, val);
    data['id']=val['id']
    data['status']= isChecked ? '1' : '0';
    data = [data];
    delete data[0].created_at;
    delete data[0].created_by_id;
    data['topic'] = 'updateTax';
  
    // Send the updated data to the service
    this.hotelCrsService.update(data).subscribe(
      (resp) => {
        if (resp.statusCode === 200) {
          this.getTaxList(); // Refresh the tax list on success
          this.swalService.alert.update(); // Show success alert
        } else {
          this.swalService.alert.oops(); // Show error alert
        }
      },
      (error) => {
        this.swalService.alert.oops(); // Handle errors gracefully
      }
    );
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
                  const data = [{id:hotelData['id']}]
                  data['topic'] = 'deleteTax';
                  this.hotelCrsService.fetch(data).subscribe(response => {
                   
                              if (response.statusCode == 200 || response.statusCode == 201) {
                              this.swalService.alert.success(`Hotel Tax has been deleted successfully`);
                              this.getTaxList();
                              }
                          },(err: HttpErrorResponse) => {
                              this.swalService.alert.error(err['error']['Message']);
                          }
                      );
              }
          })
      }
}
