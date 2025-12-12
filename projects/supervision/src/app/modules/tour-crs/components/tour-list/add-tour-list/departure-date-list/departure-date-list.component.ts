import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-departure-date-list',
  templateUrl: './departure-date-list.component.html',
  styleUrls: ['./departure-date-list.component.scss']
})
export class DepartureDateListComponent implements OnInit {

  displayColumn=['S.N','Departure Date','Action']
  departureDateList=[];
  data:any;
  tourName:string;
  tourId:Number;
  subSunk=new SubSink();
  departureDateListForSort:any[]=[]
  searchSpin:boolean=true;
  
  constructor( private route:ActivatedRoute, private apiHandlerService:ApiHandlerService, private swalService:SwalService) { }

  ngOnInit() {

    this.tourName=localStorage.getItem('tourName')
    this.tourId=Number(localStorage.getItem('tourId'))
    this.getDepartureDataList()

  }
  getDepartureDataList(){
    //to get the departure date list
    this.subSunk.sink = this.apiHandlerService.apiHandler('getDepartureDateList', 'post', {}, {},{
      "tourId":this.tourId 
        }).subscribe(response => {
            if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                this.departureDateList = response.data || [];
                this.departureDateListForSort=this.departureDateList;
                this.searchSpin=false;
            }
        },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
  }

  onDeletedRecord(inputRecordToDeleted){
    //api call to delete the record 
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteDepartureDateList', 'post', {}, {},
            {"Id":inputRecordToDeleted.id})
            .subscribe(response => {
              if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                    this.swalService.alert.success("Depature date has been deleted successfully");
                    this.getDepartureDataList();
                  }
            },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
    }
  insertedRecordReceived(){
    this.getDepartureDataList();
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.departureDateListForSort];
    if (!sort.active || sort.direction === '') {
        this.departureDateList = data;
        return;
    }
    this.departureDateList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'S.N': return this.compare(+a.id, +b.id, isAsc);
            case 'Departure Date': return this.compare(a.dep_date, b.dep_date, isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
