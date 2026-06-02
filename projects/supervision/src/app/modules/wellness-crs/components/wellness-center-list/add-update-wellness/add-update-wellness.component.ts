import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

@Component({
  selector: 'app-add-update-wellness',
  templateUrl: './add-update-wellness.component.html',
  styleUrls: ['./add-update-wellness.component.scss']
})
export class AddUpdateWellnessComponent implements OnInit {
  
   @Input() selected: any;
   @Input() wellnessOne: any;
   @Output() someEvent = new EventEmitter<any>();
   eventData: any;

   public isWellnessImage: boolean = false;
   public isRoomDetail: boolean = false;
   public isCenterTax: boolean = false;
   public showPrice: boolean = false;
   public isChildPolicy: boolean = false;

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    console.log("wellnessOne", this.selected);
    console.log("wellnessOne", this.wellnessOne);

    if (!this.utilityService.isEmpty(this.wellnessOne)) {
      (this.selected === 'isCenterImage') ? this.isWellnessImage=true : this.isWellnessImage=false;
      (this.selected === 'isRateDetail') ? this.isRoomDetail=true : this.isRoomDetail=false;
      (this.selected === 'isCenterTax') ? this.isCenterTax=true : this.isCenterTax=false;
      (this.selected === 'isChildPolicy') ? this.isChildPolicy = true : this.isChildPolicy = false;
      // (this.selected === 'isEditList') ? (this.isWellnessImage = false, this.isRoomDetail = false, this.isCenterTax = false) : (this.isWellnessImage = false, this.isRoomDetail = false, this.isCenterTax = false)
    }
  }

   wellNessImage(data: any) {
        console.log("data",data);
        this.isWellnessImage = false;
        
    }

    showRoomImage(data){
        console.log("data",data);
        this.eventData = data.rooms;
       if(data.hoteltrigger == 'addPrice'){
        this.showPrice = true;
        // this.isWellnessImage = false;
        this.isRoomDetail = false;
        // this.isCenterTax = false;
       } else {
        this.showPrice = false;
       }
  //       this.isRoomImage=true;
  //       // this.someEvent.next({hotel: this.hotelOne,roomImageRedirect: true,roomsData : data.rooms })
  //       this.roomsData = data.rooms;
  //       this.isRoomDetail =false;
  //      }else if(data.hoteltrigger== 'price'){
  //       this.isPrice =true
  //       this.roomsEditData =''
  //       this.addNewRate =''
  //       console.log("price",data)
  //       // this.someEvent.next({hotel: this.hotelOne,roomPriceRedirect: true, roomsData : data.rooms})
  //       this.isRoomDetail =false;
  //       this.roomsData = data.rooms;
  //      }else if(data.hoteltrigger== 'price_management'){
  //       this.isPriceManagement =true
  //       // this.someEvent.next({hotel: this.hotelOne,roomPriceManageRedirect: true ,roomsData : data.rooms})
  //       this.isRoomDetail =false;
  //       this.roomsData = data.rooms;
  //      }else if(data.hoteltrigger == 'cancel'){
  //       this.isCancellation =true;
  //       this.isRoomDetail =false;
  //       this.roomsData = data.rooms;
  //      }else if(data.hoteltrigger == 'goToPrice'){
  //       this.isPrice =true;
  //       this.isRoomDetail= false;
  //       this.roomsData = data.rooms;
  //  }else if(data.hoteltrigger == 'goToList'){
  //   this.isHotelDetail =true;
  //  }
    }

  

}
