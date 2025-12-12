
import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { Router } from '@angular/router';
const log = new Logger('hotel-crs/HotelList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-list',
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit,AfterViewInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    tohotelImageT:boolean=false;
    regConfig: FormGroup;
    searchText:string;
    isCollapsed = true;
    showFilter:boolean=true;
    hotelAmenityList: any;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_code", value: 'Property Code' },
        { key: "hotel_name", value: 'Property Name' },
        { key: "user_type", value: 'User Type' },
        { key: "supplier_name", value: 'Supplier Name' },
        { key: "supplier_email", value: 'Supplier Email' },
        { key: "country", value: 'Country' },
        { key: "city", value: 'City' },
       { key: "currency", value: 'Currency' },
        { key: "star_rating", value: 'Star Rating' },
        { key: "address", value: 'Address' },
        { key: "contract_expiry_date", value: 'Contract Expiry Date' },
        // { key: "phone_number", value: 'Phone Number' },
        // { key: "email", value: 'Email' },
        // {key: "image", value: 'Display Image'},
        { key: "supplierRequest", value: 'Supplier Request' },
        { key: "homePagePublish", value: 'Home Page Publish (Family Deals)' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    supplierDisplayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_code", value: 'Property Code' },
        { key: "hotel_name", value: 'Property Name' },
        { key: "user_type", value: 'User Type' },
        { key: "supplier_name", value: 'Supplier Name' },
        { key: "supplier_email", value: 'Supplier Email' },
        { key: "country", value: 'Country' },
        { key: "city", value: 'City' },
       { key: "currency", value: 'Currency' },
        { key: "star_rating", value: 'Star Rating' },
        { key: "address", value: 'Address' },
        { key: "contract_expiry_date", value: 'Contract Expiry Date' },
        // { key: "phone_number", value: 'Phone Number' },
        // { key: "email", value: 'Email' },
        // {key: "image", value: 'Display Image'},
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    countData:any;
    status;
    priority;
    searchValue = new FormControl("", {});
    showPopup: boolean = false;
savingsInput: string = "";
selectedData: any;
    @Output() toUpdate = new EventEmitter<any>();
@Output() tohotelImage =new EventEmitter<any>()
dropdownSettingsForHotel = {};
dropdownSettingsForview ={}
viewList:any;
mealList:any;
currencyList: any;
datas = [
    { item_id: 1, item_text: 'Thursday' },
    { item_id: 2, item_text: 'Friday' },
    { item_id: 3, item_text: 'Saturday' },
    { item_id: 4, item_text: 'Sunday' },
   
  ];
  dropdownSettingsForWeek = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    maxHeight: 197,
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
    loggedInUser: any;
    currencyRequest: boolean = false;
    userTypeRequest: boolean = false;
    selectedHotel: any = [];
    constructor(
        private hotelCrsService: HotelCrsService,
        private swalService: SwalService,
        private utility: UtilityService,
        private fb: FormBuilder,
        private apiHandlerService:ApiHandlerService,
        private router:Router
    ) {
        this.dropdownSettingsForHotel = {
            singleSelection: false,
            idField: 'id',
            textField: 'meals',
            maxHeight: 197,
            itemsShowLimit: 2,
        };
        this.dropdownSettingsForview = {
          singleSelection: false,
          idField: 'id',
          textField: 'views',
          maxHeight: 197,
          itemsShowLimit: 2,
      };
     }

    ngOnInit() {
        this.regConfig = this.fb.group({
            hotel_name: new FormControl('', [Validators.maxLength(120)]),
            hotel_code: new FormControl('', [Validators.maxLength(120)]),
            city_name: new FormControl('', [Validators.maxLength(120)]),
            supplier_name: new FormControl('', [Validators.maxLength(120)]),
            supplier_email: new FormControl('', [Validators.maxLength(120)]),
        });
        this.loggedInUser = JSON.parse(sessionStorage.getItem("currentSupervisionUser"));
        this.getHotelList();
        this.getHotelCount();
        this. getHotelAmenityList();
        this.getMealList();
        this.getViewList();
        this.getCurrencyList();
    }
    ngAfterViewInit() {
       
           this.fetchSearchData();
          
        }
    getHotelList(event?): void {
        if(event){
            this.pageSize = event;
        }
       
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        const offset = (this.page -1)*this.pageSize;
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "hotel_name": this.regConfig.value.hotel_name || "",
                "hotel_code": this.regConfig.value.hotel_code || "",
                "city_name": this.regConfig.value.city_name || "",
                "supplier_name": this.regConfig.value.supplier_name || "",
                "supplier_email": this.regConfig.value.supplier_email || "",
                "offset":offset,
                "limit":this.pageSize,
                
            }
        }else {
            reqBody = {}
        }
        const data = [reqBody]
        data['topic'] = 'hotelList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
                respDataCopy = [...this.respData];
                this.collectionSize = this.countData;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
    getHotelCount(): void {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
       
        const data = [reqBody]
        data['topic'] = 'hotelCount';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.countData = resp.data.hotel_count;
                console.log("this.countData",this.countData)
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
    fetchSearchData() {
        this.searchValue.valueChanges.pipe(distinctUntilChanged(),debounceTime(800)).subscribe(() => {
            if( this.searchValue.value ==''){
                this.pageSize = 10;
                this.getHotelList()
            }else{
             this.searchValueData();
            }
        });
      }

      searchValueData(): void {
        this.noData = true;
        this.respData = [];
        let reqBody = {
            "query" :this.searchValue.value
        };
        if(reqBody.query ==""){
            this.pageSize =10;
            this.getHotelList
        }else{
       
        const data = [reqBody]
        data['topic'] = 'searchHotels';
        
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
                console.log("this.countData",this.countData)
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
}
    onStatusUpdate(val, index): void {
        log.debug(index);
        console.log("val",val)
        const data = [{ id: val['id'] }];
        data['topic'] = 'editHotel';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                console.log("resp",resp)
              
              //  const ami=this.getAlreadySelectedAmenities(resp.data['hotel_hotel_amenities'])
                const data = [{
                    id: resp.data['id'] || '',
                    hotel_name: resp.data['hotel_name'] || '',
                    contract_expiry_date: resp.data['contract_expiry_date'] ? `${(moment(resp.data['contract_expiry_date'])).format('YYYY-MM-DD')}` : null,
                    star_rating: resp.data['star_rating'] || '',
                    hotel_description: resp.data['hotel_description'] || '',
                    hotel_hotel_type_id: resp.data['hotel_hotel_type_id'] || '',
                    core_country_id: resp.data['core_country_id'] || '',
                    core_state_id: resp.data['core_state_id'] || '',
                    city_name: resp.data['city_name'] || '',
                    address: resp.data['address'] || '',
                    latitude: resp.data['latitude'] || '',
                    longitude: resp.data['longitude'] || '',
                    phone_number: resp.data['phone_number'] || '',
                    email: resp.data['email'] || '',
                    image: resp.data['image'] || '',
                    xl_hotel_code:resp.data['xl_hotel_code'] || '',
                    gst_state:resp.data['gst_state'] || '',
                    gst_number:resp.data['gst_number'] || '',
                    ifsc_code:resp.data['ifsc_code'] || '',
                    beneficiary_account_number:resp.data['beneficiary_account_number'] || '',
                    beneficiary_name:resp.data['beneficiary_name'] || '',
                    bank_name:resp.data['bank_name'] || '',
                    location:resp.data['location'] || '',
                    status: (resp.data['status'] == 0) ? 1 : 0,
                    priority:val['priority'] ? true : false,
                    hotel_hotel_amenities:(resp.data['hotel_hotel_amenities']) ? resp.data['hotel_hotel_amenities'] : '',
                    city_code:resp.data['city_code'],
                    check_in_time:(resp.data['check_in_time']) || '',
                    check_out_time:(resp.data['check_out_time'] )|| '',
                    meal_plans:(resp.data['meal_plans']) || '',
                    weekend_days:(resp.data['weekend_days']) || '',
                    room_view_ids:(resp.data['room_view_ids']) || '',
                    currency:(resp.data['currency']) || '',
                    children_free_before:resp.data.children_free_before,
                    paid_children_from_age:resp.data.paid_children_from_age,
                    paid_children_to_age:resp.data.paid_children_to_age,
                    local_timezone:resp.data.local_timezone,
                    channel:resp.data.channel,

                }];
                data['topic'] = 'updateHotel';
                this.hotelCrsService.update(data).subscribe(resp => {
                    if (resp.statusCode == 201) {
                        this.getHotelList();
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

    supplierRequest(data){
        this.selectedHotel = data
        this.currencyRequest = true;
      }


      supplierUserTypeRequest(data){
        this.selectedHotel = data
        this.userTypeRequest = true;
      }

    updateCurrencyRequest(data){
        const request = {
          fromCurrency: data.currency,
          currency: data.currency_request,
          hotelCode: data.hotel_code,
          email: data.supplier_email
        }
        this.apiHandlerService.apiHandler('supplierApproval', 'POST', '', '', request)
        .subscribe((resp: any) => {
          if (resp.statusCode == 201 || resp.statusCode == 200) {
            this.swalService.alert.success("Request Approved successfully!");
            this.getHotelList(); 
            this.currencyRequest = false;
          }
        }, err => {
            this.swalService.alert.oops("Something went wrong...");
            this.currencyRequest = false;
        });
      }

      updateUserTypeRequest(data){
        const request = {
          fromUserType: data.user_type,
          userType: data.usertype_request,
          hotelCode: data.hotel_code,
          email: data.supplier_email
        }
        this.apiHandlerService.apiHandler('supplierApproval', 'POST', '', '', request)
        .subscribe((resp: any) => {
          if (resp.statusCode == 201 || resp.statusCode == 200) {
            this.swalService.alert.success("Request Approved successfully!");
            this.getHotelList(); 
            this.userTypeRequest = false;
          }
        }, err => {
            this.swalService.alert.oops("Something went wrong...");
            this.userTypeRequest = false;
        });
      }

      rejectCurrencyRequest(data){
        const request = {
          currency: data.currency_request,
          hotelCode: data.hotel_code,
          email: data.supplier_email
        }
        this.apiHandlerService.apiHandler('supplierReject', 'POST', '', '', request)
        .subscribe((resp: any) => {
          if (resp.statusCode == 201 || resp.statusCode == 200) {
            this.swalService.alert.success("Request Rejected successfully!");
            this.getHotelList(); 
            this.currencyRequest = false;
          }
        }, err => {
            this.swalService.alert.oops("Something went wrong...");
            this.currencyRequest = false;
        });
      }

      rejectUserTypeRequest(data){
        const request = {
          userType: data.usertype_request,
          hotelCode: data.hotel_code,
          email: data.supplier_email
        }
        this.apiHandlerService.apiHandler('supplierReject', 'POST', '', '', request)
        .subscribe((resp: any) => {
          if (resp.statusCode == 201 || resp.statusCode == 200) {
            this.swalService.alert.success("Request Rejected successfully!");
            this.getHotelList(); 
            this.userTypeRequest = false;
          }
        }, err => {
            this.swalService.alert.oops("Something went wrong...");
            this.userTypeRequest = false;
        });
      }


    getAlreadySelectedView(amenities) {
        const amenityIds = amenities.split(',');
        console.log("this.viewList",this.viewList)
        console.log("amenityIds",amenityIds)
        const selectedView = this.viewList.filter(amenity => amenityIds.includes(String(amenity.views)));
        console.log("selectedAmenities",selectedView)
        return selectedView;
    }
    getAlreadySelectedAmenities(amenities) {
        console.log("amenities",amenities)
        const amenityIds = amenities.split(',');
        console.log("amenityIds",amenityIds)
        const selectedMeal = this.mealList.filter(amenity => amenityIds.includes(String(amenity.meals)));
        console.log("selectedAmenities",selectedMeal)
        return selectedMeal;
    }
    getAlreadySelectedWeek(amenities) {
        const amenityIds = amenities.split(',');
        console.log("amenityIds",amenityIds)
        const selectedWeek = this.datas.filter(amenity => amenityIds.includes(String(amenity.item_text)));
        console.log("selectedAmenities",selectedWeek)
        return selectedWeek;
    }

    toggleFamilyDeal(data: any) {
        this.selectedData = data;
        this.showPopup = true;
      }
      
      updateFamilyDeal(data: any, enable: boolean) {
        const request = {
          "family_deals": enable ? 1 : 0,
          "savings": enable ? this.savingsInput : "", 
          "hotelCode": data.hotel_code 
        };
      
        this.apiHandlerService.apiHandler('familyDeals', 'POST', '', '', request)
          .subscribe((resp: any) => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
              this.swalService.alert.success(enable ? "Enabled!" : "Disabled!");
              this.getHotelList();
              this.showPopup = false;
              this.savingsInput = '';
            }
          }, err => {
            this.swalService.alert.oops("Something went wrong...");
            this.showPopup = false;
          });
      }
    
    
    
    getCurrencyNameById(id: any) {
        // Ensure that the id is treated as a number for comparison
        const numericId = String(id);
        const currency = this.currencyList.find(item => item.currency === numericId);
        return currency ? currency.currency : ''; // Return the currency name
    }
     formatTime(isoTime: string): string {
        const date = new Date(isoTime);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        
        // Determine AM or PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        // Format minutes as 'MM'
        const formattedMinutes = minutes.toString().padStart(2, '0');
        
        // Return the formatted time string in 'HH:MM AM/PM' format
        return `${hours}:${formattedMinutes} ${ampm}`;
    }
    getHotelAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelAmenityList';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                this.hotelAmenityList = resp.data.filter(p => p.status == 1);
                console.log(" this.hotelAmenityList", this.hotelAmenityList)
                }
        )
    }
    // getAlreadySelectedAmenities(amenities) {
    //   const amenityIds = amenities.split(',');
    // console.log("amenityIds",amenityIds)
    // console.log("hotelAmenityList",this.hotelAmenityList)
    // const selectedAmenities = this.hotelAmenityList.filter(amenity => amenityIds.includes(String(amenity.hotel_amenity_name)));
    // console.log("selectedAmenities",selectedAmenities)
    // return selectedAmenities;
    // }
    updateHotel(data,ev) {
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        this.hotelCrsService.updateData.next(data);
        console.log("data",data)
        this.toUpdate.emit({ tabId: 'add_hotel', hotel: data,hoteltrigger:ev });
        // this.toUpdate.emit({ tabId: 'add_hotel', hotel: data });
        // this.tohotelImage.emit(true)
    }

    applyFilter(text: string) {

        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                hotel_name: objData.hotel_name,
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
                case 'hotel_name': return this.utility.compare('' + a.hotel_name, '' + b.hotel_name, isAsc);
                case 'star_rating': return this.utility.compare('' + a.star_rating, '' + b.star_rating, isAsc);
                case 'city': return this.utility.compare('' + a.core_city_id, '' + b.core_city_id, isAsc);
                case 'country': return this.utility.compare('' + a.core_country_id, '' + b.core_country_id, isAsc);
                case 'city_code': return this.utility.compare('' + a.city_code, '' + b.city_code, isAsc);
                case 'address': return this.utility.compare('' + a.address, '' + b.address, isAsc);
                case 'phone_number': return this.utility.compare('' + a.phone_number, '' + b.phone_number, isAsc);
                case 'email': return this.utility.compare('' + a.email, '' + b.email, isAsc);
                default: return 0;
            }
        });
    }
 
//     onFilter(){
//         console.log("this.showFilter",this.showFilter)
//    this.showFilter=this.showFilter == false? this.showFilter : !this.showFilter
//    }
   onfliterChange($event){
    console.log("event",$event)

   }
    
    onSearchSubmit(data) {
    if(data){
            this.pageSize=5000;
            this.getHotelList(); 
        }
    }
    onReset() {
        this.regConfig.reset();
        this.searchText=''
        this.pageSize=10;
        this.getHotelList();
    }
    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any, index: number) => {
                return {
                    "Sl No.": index + 1,
                    "Hotel Code":response.hotel_code,
                    "Hotel Name": response.hotel_name,
                    "Supplier Name": response.supplier_name,
                    "Supplier Email": response.supplier_email,
                    "Star Rating": response.star_rating,
                    "City": response.city_name,
                    "Country": response.core_country_id,
                    // "City Code":response.city_code,
                    "Address": response.address,
                    // "Phone Number": response.phone_number,
                 
                   
                }
            });

            const columnWidths = [
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 40 },
                { wch: 15 },
               
            ];

            this.utility.exportToExcel(
                fileToExport,
                'Hotel CRS Report',
                columnWidths
            );
        }
    }
    onDelete(hotelData){
        this.swalService.alert.delete((action)=>{
            if(action){
                const data = [{ id:hotelData['id'],hotel_code:hotelData['hotel_code']}]
                data['topic'] = 'deleteHotel';
                this.hotelCrsService.fetch(data).subscribe(response => {
                 
                            if (response.statusCode == 200 || response.statusCode == 201 ) {
                            this.swalService.alert.success(`Hotel has been deleted successfully`);
                            this.getHotelList();
                            }
                        },(err: HttpErrorResponse) => {
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
    }
    // onDelete(hotelData){
    //     const data = [{ id:hotelData['id']}]
    //     data['topic'] = 'deleteHotel';
    //     this.hotelCrsService.fetch(data).subscribe(resp => {
    //         if (resp.statusCode == 201) {
    //             // this.hotelImage = resp.data;
    //             this.getHotelList();
    //             this.swalService.alert.success("hotel deleted successfully!")
    //         }
    
    //     });
    // }
    getMealList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'mealList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.mealList = resp.data.filter(p => p.status == 1);
                console.log(" this.mealList", this.mealList)
            }
        });
    }
    
    getViewList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'viewList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.viewList = resp.data;
            }
        });
    }
    getCurrencyList() {
        const data = [{  }]
        data['topic'] = 'hotelCurrencyConverison';
        this.hotelCrsService.fetch(data).subscribe(resp => {
                if (resp.Status && resp.data) {
                    this.currencyList = resp.data.filter(t => t.status == 1);
                }
            }, (err: HttpErrorResponse) => {
                console.log(err.error);
            })
    }
}
