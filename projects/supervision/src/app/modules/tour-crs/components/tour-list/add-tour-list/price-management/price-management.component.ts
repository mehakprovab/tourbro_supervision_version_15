import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material';
import { TourCrsService } from '../../../../tour-crs.service';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss']
})
export class PriceManagementComponent implements OnInit {

  displayColumn=['S. No.','From Date','To Date','Adult Price','Child Price','Cancellation Policy','Action'];
  priceManagementDataList:Array<any>=[];
  priceManagementForm:FormGroup;
  tourId:number;
  subSunk=new SubSink();
  priceManagementDataListForSort:any[]=[];
  searchSpin:boolean=true;
  public tourUpdateData: any;
  public updatePriceManagement: boolean = false;
  public updatePriceManagementData: any;
  public showAddPriceManagement: boolean = true;

  constructor(private fb:FormBuilder, private apiHandlerService:ApiHandlerService, private swalService:SwalService,
              private route:ActivatedRoute, private tourService: TourCrsService) { }

  ngOnInit() {
    this.tourId=Number(sessionStorage.getItem('tourId'));
    this.getPriceManagementData();
    this.tourService.updatedPriceManagement.subscribe(data => {
      if(data) {
        this.getPriceManagementData();
      }
    }
    )
  }

  getPriceManagementData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getToursPriceManagement', 'post', {}, {},{
      "toursId":this.tourId
    })
    .subscribe(response => {
        if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
            this.priceManagementDataList = response.data || [];
            this.priceManagementDataListForSort=this.priceManagementDataList;
             this.tourService.setPriceList(this.priceManagementDataList);
            this.searchSpin=false;
          }
        },(err: HttpErrorResponse) => {
          this.searchSpin=false;
          this.priceManagementDataList = []
            this.swalService.alert.error(err['error']['Message']);
     });
  }

  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record 
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteToursPriceManagement', 'post', {}, {},
            {"Id":inputRecordToDeleted.id})
            .subscribe(response => {
              if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                    this.swalService.alert.success("Price has been deleted successfully");
                    this.getPriceManagementData();
                  }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  insertedRecordReceived(event){
    this.priceManagementDataList.unshift(event);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.priceManagementDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.priceManagementDataList = data;
        return;
    }
    this.priceManagementDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'S. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'From Date': return this.compare(a.from_date, b.from_date, isAsc);
            case 'To Date': return this.compare(a.to_date, b.to_date, isAsc);
            case 'Adult Price': return this.compare(a.adult_airliner_price, b.adult_airliner_price, isAsc);
            case 'Child Price': return this.compare(a.child_airliner_price, b.child_airliner_price, isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getChildPrices(data) {
    if(data) {
      return JSON.parse(data)
    }
  }

  updatedList(event) {
    if(event) {
      this.updatePriceManagement = false;
      this.showAddPriceManagement = true;
    }
  }

  onEdit(data) {
    this.updatePriceManagementData = data;
    this.tourService.getTourManagementData.next(data);
    this.updatePriceManagement = true;
    this.showAddPriceManagement = false;
  }
  getCancellationPloicy(data) {
    if(data) {
      return JSON.parse(data)
    }
  }
}