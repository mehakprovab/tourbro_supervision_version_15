import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Router } from '@angular/router';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {

  enabledForm:boolean=false;
  editForm:boolean=false;
  toursDataList:any[]=[];
  subSunk=new SubSink();
  showActionsMenu:boolean=false;
  pageSize = 100;
  page = 1;
  collectionSize: number;
  searchText:string='';
  toursDataListForSort:any[]=[];
  scrollPosition=0;
  searchSpin:boolean=true;
  loggedInUserId: any;
  displayColumn:string[]=['Sl. No.','Tour Name','Tour Type','Country','City','Duration','Supplier Name','Distribution Channel','Start Date','Expiry Date','Publish Status','Trending','Book Now','Action']
  loggedInAuthId: any;
  showBookNow: boolean = false;

  constructor( private fb:FormBuilder, 
               private swalService:SwalService,
               private apiHandlerService:ApiHandlerService,
               private router:Router) { 
                }

  ngOnInit() {
    this.getToursData();
    
  }

  onAddButtonClicked(){
    this.enabledForm=!this.enabledForm;
    this.router.navigate(['/tour-crs/tour-list/add-tour'])
  }

  getToursData(){
    const loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    this.loggedInUserId = loggedInUser.id;
    this.loggedInAuthId = loggedInUser.auth_role_id;
    if(this.loggedInAuthId === 7) {
      this.displayColumn.splice(11,2)
    }
    const req = {
      supplier_id: this.loggedInUserId
    }
    // api to get tour data getToursList
    this.subSunk.sink = this.apiHandlerService.apiHandler('getToursList', 'post', {}, {}, req)
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                      this.toursDataList = response.data || [];
                      this.toursDataListForSort=this.toursDataList;
                      this.collectionSize=this.toursDataList.length;
                      this.searchSpin=false
                    } else {
                      this.toursDataList = [];
                      this.searchSpin=false;
                    }
              }, (err: HttpErrorResponse) => {
                this.toursDataList = [];
                this.swalService.alert.error(err['error']['Message']);
                this.searchSpin=false;
              });
  }


  navigateToDetails(id: number): void {
    this.router.navigate(['/people', id]);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/people', id, 'edit']);
  }

  navigateToDelete(id: number): void {
    // Implement the logic to delete the person...
  }

  price(inputTourData:any){
    localStorage.setItem('tourName',inputTourData['tour_name'])
    sessionStorage.setItem('tourId',inputTourData['id'])
    sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
    this.router.navigate(["tour-crs/tour-list/add-tour/price-management"])
  }

  updateTourPackage(inputTourId:number){
    const QuaryParam={
      tourId:inputTourId
    }
    this.router.navigate(["tour-crs/tour-list/update-tour-package"],{queryParams:QuaryParam})
  }

  updateTourItinerary(inputTourData:any){
    sessionStorage.setItem('tourId',inputTourData['id'])
    localStorage.setItem('tourName',inputTourData['tour_name'])
    localStorage.setItem('tourDuration',inputTourData['duration'])
    localStorage.setItem('updateTourPackage','Yes')
    this.router.navigate(["tour-crs/tour-list/add-tour/tour-itinerary"])

  }

  updateDepartureDate(inputTourData:any){
    localStorage.setItem('tourName',inputTourData['tour_name'])
    sessionStorage.setItem('tourId',inputTourData['id'])
    localStorage.setItem('updateDepartureDate','Yes')
    this.router.navigate(["tour-crs/tour-list/add-tour/departure-date"])
  }

  cityDetails(inputTourData:any){
    localStorage.setItem('tourName',inputTourData['tour_name'])
    sessionStorage.setItem('tourId',inputTourData['id'])
    localStorage.setItem('updateTourCities','Yes')
    this.router.navigate(["tour-crs/tour-list/add-tour/visited-city"])
  }

  DeleteTourRecord(inputTourId:number){
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTour', 'post', {}, {},{
            "Id":inputTourId
            })
            .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Tour record has been deleted successfully')
                    this.getToursData();
                }
            },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  brochureDetails(inputTourId:number){
    const QuaryParam={
      tourId:inputTourId
    }
    this.router.navigate(["tour-crs/tour-list/brochure"],{queryParams:QuaryParam})
  }

  onPublish(checked:boolean,publishRecord:any){
    this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourPublishStatus', 'post', {}, {},{
        "tourId":publishRecord.id,
        "PublishStatus": checked==true ? 1 : 0,
        "HomePublishStatus":"",
        "EnquiryFormStatus":"",
        "BookNowStatus": "",
        "trending": ""
    })
    .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            if(checked){
              if (this.loggedInAuthId === 7) {
              //   this.showBookNow = true;
              //   const bookNowOption = 'Book Now';
              //   // this.displayColumn.splice(11,2);
              //   console.log(this.displayColumn)
              //   // this.displayColumn.push(bookNowOption);
              //   if (!this.displayColumn.includes(bookNowOption)) {
              //     this.displayColumn.splice(11, 0, bookNowOption);
              //   }
                
                this.enableBookNow(true,publishRecord);
              }
                this.swalService.alert.success('Successfully Enabled')
            }else{

              if (this.loggedInAuthId === 7) {
              //   this.showBookNow = false;
              //   this.displayColumn.splice(11,1);
              this.enableBookNow(false,publishRecord);
              }
                this.swalService.alert.success('Successfully removed from trending list')
            }
        }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  enableTrending(checked:boolean,publishRecord:any){
    this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourPublishStatus', 'post', {}, {},{
        "tourId":publishRecord.id,
        "PublishStatus": "",
        "HomePublishStatus":"",
        "EnquiryFormStatus":"",
        "BookNowStatus": "",
        "trending": checked==true ? 1 : 0,
    })
    .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            if(checked){
             
                this.swalService.alert.success('Successfully published')
                this.getToursData();
            }else{
                this.swalService.alert.success('Successfully removed from published list')
            }
        }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }
  
  onHomePublish(checked:boolean,publishRecord:any){
    this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourPublishStatus', 'post', {}, {},{
      "tourId":publishRecord.id,
      "PublishStatus":"",
      "HomePublishStatus":checked==true ? 1 : 0,
      "EnquiryFormStatus":"",
      "BookNowStatus": "",
      "trending":""
    })
    .subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {
        if(checked){
            this.swalService.alert.success('Successfully published on Home')
        }else{
            this.swalService.alert.success('Successfully reomved from published on Home')
        }
      }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  enableBookNow(checked:boolean,publishRecord:any){
    this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourPublishStatus', 'post', {}, {},{
      "tourId":publishRecord.id,
      "PublishStatus":"",
      "HomePublishStatus":"",
      "EnquiryFormStatus":"",
      "BookNowStatus": checked==true ? 1 : 0,
      "trending":""
    })
    .subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {
        if(checked){
           if (this.loggedInAuthId === 7) {
                this.swalService.alert.success('Book Now Successfully Enabled');
              }else {

              
            this.swalService.alert.success('Successfully Enabled')
            }
        }else{
            this.swalService.alert.success('Successfully Disabled')
        }
      }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  enableEnquiryForm(checked:boolean,publishRecord:any){
    this.subSunk.sink = this.apiHandlerService.apiHandler('updateTourPublishStatus', 'post', {}, {},{
      "tourId":publishRecord.id,
      "PublishStatus":"",
      "HomePublishStatus":"",
      "EnquiryFormStatus":checked==true ? 1 : 0,
      "BookNowStatus": "",
      "trending":""
    })
    .subscribe(response => {
      if (response.statusCode == 200 || response.statusCode == 201) {
        if(checked){
          this.swalService.alert.success('Successfully Enabled')
        }else{
          this.swalService.alert.success('Successfully Disabled')
        }
      }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.toursDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.toursDataList = data;
        return;
    }
    this.toursDataList = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const pattern = /(\d+)/;
        switch (sort.active) {
            case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
            case 'Tour Name': return this.compare(a.tour_name.toLowerCase(), b.tour_name.toLowerCase(), isAsc);
            case 'Tour Type': return this.compare(a.tour_type.toLowerCase(), b.tour_type.toLowerCase(), isAsc);
            case 'Country': return this.compare(a.country_name.toLowerCase(), b.country_name.toLowerCase(), isAsc);
            case 'City': return this.compare(a.city_name.toLowerCase(), b.city_name.toLowerCase(), isAsc);
            case 'Duration': return this.compare(parseInt(a.duration.match(pattern)[0]), parseInt(b.duration.match(pattern)[0]), isAsc);
            case 'Publish Status': return this.compare(a.publish_status, b.publish_status, isAsc);
            case 'Show in Home Page': return this.compare(a.home_status, b.home_status, isAsc);
            case 'Enquiry Form': return this.compare(a.enquiry_status, b.enquiry_status, isAsc);
            case 'Book Now': return this.compare(a.booknow_status, b.booknow_status, isAsc);
            default: return 0;
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
