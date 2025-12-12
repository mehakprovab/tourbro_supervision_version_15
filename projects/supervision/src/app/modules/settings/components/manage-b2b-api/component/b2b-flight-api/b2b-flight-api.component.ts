import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { SettingService } from '../../../../setting.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material';

const log = new Logger("manage-api/FlightApiComponent");
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-b2b-flight-api',
  templateUrl: './b2b-flight-api.component.html',
  styleUrls: ['./b2b-flight-api.component.scss']
})
export class B2bFlightApiComponent implements OnInit {
  pageSize = 10;
  page = 1;
  collectionSize: 10;
  displayColumn: { key: string; value: string }[] = [
      { key: "Slno", value: "SI No." },
      { key: "name", value: "Name" },
      { key: "description", value: "Description" },
      { key: "booking_engine_status", value: "Current Status" },
    //   { key: "action", value: "Actions" },
      { key: "B2B Active", value: "Status" },
      // { key: "B2C Active", value: "B2C Active" },
    //   { key: "Block AirLine B2B", value: "Block AirLine B2B" },
    //   { key: "B2BUpdate", value: "B2B Update" },
    //   { key: "Block AirLine B2C", value: "Block AirLine B2C" },
    //   { key: "B2CUpdate", value: "B2C Update" },
  ];
  noData: boolean = true;
  respData: any = [];
  private subSunk = new SubSink();
  allAirLine: any[] = [];
  @ViewChild("airLineInput", { static: false })
  airLineInput: ElementRef<HTMLInputElement>;
  form: FormGroup;
  dropdownSettingsForAirLine: IDropdownSettings;

  constructor(
      private settingService: SettingService,
      private swalService: SwalService,
      private utility: UtilityService,
      private apiHandlerService: ApiHandlerService,
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
      this.getFlightList();
      this.initForm();
        this.dropdownSettingsForAirLine = {
          singleSelection: false,
          idField: 'code',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true
        };
  }

  getFlightList() {
      this.subSunk.sink = this.apiHandlerService.apiHandler("hotelManageApiList", "post", {}, {}, {  module: "flight", userType: "B2B",  }
      ).subscribe((resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.noData = false;
              if (resp && resp.data) {
                  for (let flightList of resp.data) {
                      if(flightList.b2b_block_airline_list!="" && flightList.b2b_block_airline_list!=null ){
                          flightList.b2b_block_airline_list=JSON.parse(flightList.b2b_block_airline_list);
                          flightList.b2b_block_airline_list.forEach( item => delete item.id ); // Removed id from json
                      }
                      if(flightList.block_airline_list!="" && flightList.block_airline_list!=null){
                         flightList.block_airline_list=JSON.parse(flightList.block_airline_list);
                         flightList.block_airline_list.forEach( item => delete item.id ); // Removed id from json
                      }
                   this.getCheckedItemList(flightList);// Set selected items
                  }
              }
              this.respData = resp.data || [];
              respDataCopy = [...this.respData];
          } else {
              this.noData = true;
              this.swalService.alert.error(resp.msg || "");
          }
      }, (err) => {
              this.swalService.alert.oops(err.msg || "");
      });
  }

  initForm() {
      this.form = this.formBuilder.group({
          airLineListB2C1: ['', Validators.required],
          airLineListB2C2: ['', Validators.required],
          airLineListB2C3: ['', Validators.required],
          airLineListB2B1: ['', Validators.required],
          airLineListB2B2: ['', Validators.required],
          airLineListB2B3: ['', Validators.required],
          airLineList: ['', Validators.required]
      });
  }
  
  onB2BItemSelect(data: any, isCheckboxSelected: any) {
      data.b2b_block_airline_list.forEach(b2b_block_airline_list => {
          if (b2b_block_airline_list.code === isCheckboxSelected.code) {
              b2b_block_airline_list.isSelected=true;
          }
      });
  }

  onB2BItemDeSelect(data: any, isCheckboxSelected: any) {
      data.b2b_block_airline_list.forEach(b2b_block_airline_list => {
          if (b2b_block_airline_list.code === isCheckboxSelected.code) {
              b2b_block_airline_list.isSelected=false;
          }
      });
  }

  onB2BSelectAll(data: any, isCheckboxSelected: any) {
      for (let b2b_block_airline_list of data.b2b_block_airline_list) {
          b2b_block_airline_list.isSelected = true;
      }
  }

  onB2BItemDeSelectAll(data: any, isCheckboxSelected: any){
      for (let b2b_block_airline_list of data.b2b_block_airline_list) {
          b2b_block_airline_list.isSelected = false;
      }
  }

  onB2CItemSelect(data: any, isCheckboxSelected: any) {
      data.block_airline_list.forEach(block_airline_list => {
          if (block_airline_list.code === isCheckboxSelected.code) {
              block_airline_list.isSelected=true;
          }
      });
  }

  onB2CItemDeSelect(data: any, isCheckboxSelected: any) {
      data.block_airline_list.forEach(block_airline_list => {
          if (block_airline_list.code === isCheckboxSelected.code) {
              block_airline_list.isSelected=false;
          }
      });
  }

  onB2CSelectAll(data: any,isCheckboxSelected: any) {
      for (let block_airline_list of data.block_airline_list) {
          block_airline_list.isSelected = true;
      }
  }

  onB2CItemDeSelectAll(data: any, isCheckboxSelected: any){
      for (let block_airline_list of data.block_airline_list) {
          block_airline_list.isSelected = false;
      }
  }

  getCheckedItemList(data: any) {
      if(data && data.block_airline_list ){
          let filteredArray = data.block_airline_list.filter(
              block_airline_listItem => block_airline_listItem.isSelected);
             data.selectedItems=filteredArray;
           // data.selectedItems = [];
          // for (let item of filteredArray) {
          //     data.selectedItems.push(item)
          // }
      }
      if(data && data.b2b_block_airline_list ){
          let b2bfilteredArray = data.b2b_block_airline_list.filter(
              b2b_block_airline_listItem => b2b_block_airline_listItem.isSelected);
          data.b2bselectedItems= b2bfilteredArray;
         // data.b2bselectedItems = [];
          // for (let item of b2bfilteredArray) {
          //     data.b2bselectedItems.push(item)
          // }
      }
  }
  
  updateAirLine(data: any, id: any,module_type:any) {
      const request = {
         id: id,
         block_airline_list: JSON.stringify(data.block_airline_list),
         b2b_block_airline_list:JSON.stringify(data.b2b_block_airline_list),
         module_type:module_type
      }
      if (module_type === 'B2B') {
          delete request.block_airline_list;
      }
      else {
          delete request.b2b_block_airline_list;
      }
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateAirlineList', 'post', {}, {}, request)
          .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.swalService.alert.success(
                      "Block airline updated successfully!"
                  );
                this.getFlightList();
              }
              else {
                  this.swalService.alert.error(resp.msg || "");
              }
          }, (err) => {
              this.swalService.alert.error(err.msg || "");
          });
  }

  private _filter(value: any): any[] {
      const filterValue = value;
      return this.allAirLine.filter(
          (option) =>
              option.name.toLowerCase() == filterValue ||
              option.code.toLowerCase() == filterValue
      );
  }

  onStatusUpdate(val): void {
      this.subSunk.sink = this.apiHandlerService.apiHandler("updateApiStatus","post",{},{},{
                  id: val.id,
                  booking_engine_status:
                      val.booking_engine_status == true ? false : true,
              }
          )
          .subscribe((resp) => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.swalService.alert.success(
                      "Status has been updated successfully!"
                  );
                  this.ngOnInit();
              } else {
                  this.noData = true;
                  this.swalService.alert.error(resp.msg || "");
              }
          }, (err) => {
              this.swalService.alert.error(err.msg || "");
          });
  }

  sortData(sort: Sort) {
      const data = filterArray.length ? filterArray : [...respDataCopy];
      if (!sort.active || sort.direction === "") {
          this.respData = data;
          return;
      }
      this.respData = data.sort((a, b) => {
          const isAsc = sort.direction === "asc";
          switch (sort.active) {
              case "name":
                  return this.utility.compare("" + a.name, "" + b.name, isAsc);
              case "description":
                  return this.utility.compare(
                      "" + a.description,
                      "" + b.description,
                      isAsc
                  );
              case "booking_engine_status":
                  return this.utility.compare(
                      "" + a.booking_engine_status,
                      "" + b.booking_engine_status,
                      isAsc
                  );
              default:
                  return 0;
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
      this.updateActiveStatus(data);
  }



  updateActiveStatus(data){
      const request = {
          id: data.id,
          status: data.b2b_status,
          userType : "B2B",
          
       }
  
      this.apiHandlerService.apiHandler("updateHotelManageApiList","post",{},{},request).subscribe((resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success(
                  "Status has been updated successfully!"
              );
              this.ngOnInit();
          } else {
              this.swalService.alert.error(resp.msg || "");
          }
      });
  }
}
