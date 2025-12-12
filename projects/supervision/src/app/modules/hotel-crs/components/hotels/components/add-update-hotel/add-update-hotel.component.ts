import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '../../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { HotelCrsService } from '../../../../hotel-crs.service';

const log = new Logger('Hotel/AddUpdateHotel');

@Component({
    selector: 'app-add-update-hotel',
    templateUrl: './add-update-hotel.component.html',
    styleUrls: ['./add-update-hotel.component.scss']
})
export class AddUpdateHotelComponent implements OnInit, AfterViewInit {
    data:boolean=true;
    showSelectedPrice:boolean=false;
    isHotelDetail: boolean;
    isRoomDetail: boolean;
    isHotelTax:boolean;
    isChildrenPollicy:boolean;
    isHotelImage: boolean;
    isRoomImage: boolean=false;
    isPriceManagement:boolean;
    isSeason: boolean;
    isPrice: boolean;
    isCancellation: boolean;
    hotelData: any;
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    geocoder: google.maps.Geocoder;
    mapOptions: google.maps.MapOptions;
    marker: google.maps.Marker;
    center;
    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelOne: object = {};
    @Input() selected;
    @Input() isPricedetail;
    hotelImageList;
    roomsData:any;
    priceList:any;
    priceDataList:any;
    roomsEditData:any;
    addNewRate:any;
    constructor(
        private hotelCrsService: HotelCrsService,
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private swalService: SwalService,
    ) {
        this.isHotelDetail = true;
        this.isRoomDetail = false;
        this.isHotelImage = false;
        this.isRoomImage = false;
        this.isPriceManagement= false;
        this.isSeason = false;
        this.isPrice = false;
        this.isCancellation = false;
        this.isHotelTax =false;
        this.isChildrenPollicy =false;
    }
    ngAfterViewInit() {
    }
    ngOnInit(): void {
        console.log("hotelOne",this.hotelOne)
        console.log("isPricedetail",this.isPricedetail)
        console.log("selected",this.selected)
        if (!this.utilityService.isEmpty(this.hotelOne)) {
        (this.selected=='isHotelData')?this.isHotelDetail=true:this.isHotelDetail=false;
        (this.selected=='isHotelImage')?this.isHotelImage=true:this.isHotelImage=false;
        (this.selected=='isRoomDetail')?this.isRoomDetail=true:this.isRoomDetail=false;
        (this.selected=='istax')? this.isHotelTax=true:this.isHotelTax=false;
        (this.selected=='isChildren')? this.isChildrenPollicy = true : this.isChildrenPollicy = false;
         (this.selected=='isRoomImage' || this.isPricedetail.roomImageRedirect == true )?this.isRoomImage=true:this.isRoomImage=false;
         (this.selected=='isPriceManagement' || this.isPricedetail.roomPriceManageRedirect == true )?this.isPriceManagement=true:this.isPriceManagement=false;
         (this.selected=='isSeason')?this.isSeason=true:this.isSeason=false;
         (this.selected=='isPrice' || this.isPricedetail.roomPriceRedirect == true)?this.isPrice=true:this.isPrice=false;
         (this.selected=='isCancel')?this.isCancellation=true:this.isCancellation=false;
         if( this.isPricedetail.roomPriceRedirect == true){
            this.roomsData = this.isPricedetail.roomsData;
         }else if(this.isPricedetail.roomPriceManageRedirect == true){
            this.roomsData = this.isPricedetail.roomsData;
         }else if(this.isPricedetail.roomImageRedirect == true){
            this.roomsData = this.isPricedetail.roomsData;
         }

      
        } 
    }
    hotelImage(data: any) {
        console.log("data",data)
        this.isRoomDetail = data;
        this.isHotelImage=false;
    }
    hotelTax(data: any) {
        console.log("data",data)
        this.isRoomDetail = data;
        this.isHotelTax=false;
    }
    childrenPollicy(data: any) {
        console.log("data",data)
        this.isRoomDetail = data;
        this.isChildrenPollicy = false;
    }
    hotelDetail(data: any) {
        console.log("data",data)
        this.isHotelImage =true;
        this.isRoomImage=false;
        this.isHotelDetail= false;
    }
    showSeason(data:any){
        if(data.hoteltrigger == 'goToRoomDetail')
        console.log("data rommmm",data)
        this.isRoomDetail= true;
        this.isRoomImage=false;
        this.roomsData = data.rooms;
    }
    showRoomImage(data){
        console.log("data",data);
       if(data.hoteltrigger == 'room'){
        this.isRoomImage=true;
        this.someEvent.next({hotel: this.hotelOne,roomImageRedirect: true,roomsData : data.rooms })
        this.roomsData = data.rooms;
        this.isRoomDetail =false;
       }else if(data.hoteltrigger== 'price'){
        this.isPrice =true
        this.roomsEditData =''
        this.addNewRate =''
        console.log("price",data)
        this.someEvent.next({hotel: this.hotelOne,roomPriceRedirect: true, roomsData : data.rooms})
        this.isRoomDetail =false;
        this.roomsData = data.rooms;
       }else if(data.hoteltrigger== 'price_management'){
        this.isPriceManagement =true
        this.someEvent.next({hotel: this.hotelOne,roomPriceManageRedirect: true ,roomsData : data.rooms})
        this.isRoomDetail =false;
        this.roomsData = data.rooms;
       }else if(data.hoteltrigger == 'cancel'){
        this.isCancellation =true;
        this.isRoomDetail =false;
        this.roomsData = data.rooms;
       }else if(data.hoteltrigger == 'goToPrice'){
        this.isPrice =true;
        this.isRoomDetail= false;
        this.roomsData = data.rooms;
   }else if(data.hoteltrigger == 'goToList'){
    this.isHotelDetail =true;
   }
    }

    showRoomDetail(data){
        console.log("data",data)
        this.someEvent.next({hotel: this.hotelOne,hoteltrigger: 'isRoomDetail' })
        if(data.hoteltrigger == 'goToRoomDetail'){
        this.isRoomDetail= true;
        this.isPrice=false;
        this.roomsData = data.rooms;
        this.priceDataList = data.data[0]
        console.log(" this.priceDataList", this.priceDataList)
        }
    }
    showRoomDetailPrice(data){
        console.log("data pppp",data)
        this.someEvent.next({hotel: this.hotelOne,hoteltrigger: 'isRoomDetail' })
        if(data.hoteltrigger == 'goToRoomDetail'){
        this.isRoomDetail= true;
        this.isPriceManagement=false;
         this.roomsEditData = '';
         this.addNewRate ='';
        this.roomsData = data.rooms;
        }else if(data.hoteltrigger == 'goToPrice'){
            this.isPrice =true;
            this.isPriceManagement =false;
            this.roomsEditData = data.editData;
            this.addNewRate = data.addNewRate;
        }
    }
    goToRoomdetail(data){
        if(data.hoteltrigger == 'goToRoomDetailFromCancel'){
            this.isRoomDetail= true;
            this.isCancellation=false;
            this.roomsData = data.rooms;
        }
    }
    showIsPrice(event:any){
        this.isPrice=true;
        this.isSeason=false;
    }
    showCancel(event:any){
        this.isPrice=false;
        this.isRoomImage =false;
        this.isCancellation=true;
        
    }

    handleRoomDetailSelection(data: any) {
        this.roomsData = {
          mealPlans: data.mealPlans,
          roomViews: data.roomViews
        };
        console.log("roomsData",this.roomsData)
        // this.isRoomDetail = false;
        // this.isPrice = true;
      }
}