import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { SettingService } from '../../../../setting.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2b-tour-api',
  templateUrl: './b2b-tour-api.component.html',
  styleUrls: ['./b2b-tour-api.component.scss']
})
export class B2bTourApiComponent implements OnInit {

  pageSize = 6;
  page = 1;
  collectionSize: number;
  displayColumn: { key: string, value: string }[] = [
      { key: "Slno", value: 'SI No.' },
      { key: "name", value: 'Name' },
      { key: "description", value: 'Description' },
      { key: "status", value: 'Current Status' },
      { key: "b2b_status", value: 'Status' },
      // { key: "b2c_status", value: 'B2C Status' },
      // { key: "action", value: 'Actions' },
  ];
  noData: boolean = true;
  respData: any;
  status;
  private subSunk = new SubSink();
  userType:any;
  @Output() toUpdate = new EventEmitter<any>();

  constructor(
      private settingService: SettingService,
      private swalService: SwalService,
      private utility: UtilityService,
      private apiHandlerService: ApiHandlerService
  ) { }

  ngOnInit() {
      this.getFlightApiList();
  }

  getFlightApiList(): void {
      this.subSunk.sink = this.apiHandlerService.apiHandler('hotelManageApiList', 'post', {}, {}, {
          module: 'Sightseeing',
           userType: "B2B",
      }).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.noData = false;
              this.respData = resp.data || [];
              respDataCopy = [...this.respData];
              this.collectionSize = respDataCopy.length;
          }
          else {
              this.noData = true;
              this.swalService.alert.error(resp.msg || '');
          }
      })
  }

  onStatusUpdate(data): void {
      const request = {
          id: data.id,
          status: data.b2b_status,
          userType : "B2B",
       }
   
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelManageApiList', 'post', {}, {},request).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success('Satus has been updated successfully!');
              this.getFlightApiList();
          }
          else {
              this.noData = true;
              this.swalService.alert.error(resp.msg || '');
          }
      })
  }
  onB2cStatusUpdate(data,module_type): void {
      const request = {
          id: data.id,
          status:data.b2c_status,
          userType : module_type,
       }
    
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelManageApiList', 'post', {}, {},request).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success('Satus has been updated successfully!');
              this.getFlightApiList();
          }
          else {
              this.noData = true;
              this.swalService.alert.error(resp.msg || '');
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
              case 'name': return this.utility.compare('' + a.name, '' + b.name, isAsc);
              case 'description': return this.utility.compare('' + a.description, '' + b.description, isAsc);
              case 'booking_engine_status': return this.utility.compare('' + a.booking_engine_status, '' + b.booking_engine_status, isAsc);
              default: return 0;
          }
      });
  }
  
  isB2BActive(data:any,event){
      if(data && event.target.checked){
         data.b2b_status="1";
      }
      else{
          data.b2b_status="0";
      }
      this.onStatusUpdate(data);
  }

}
