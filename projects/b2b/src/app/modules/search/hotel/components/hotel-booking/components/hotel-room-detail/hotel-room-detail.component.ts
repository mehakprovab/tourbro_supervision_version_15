import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CancelInfoComponent } from '../cancel-info/cancel-info.component';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';

@Component({
    selector: 'app-hotel-room-detail',
    templateUrl: './hotel-room-detail.component.html',
    styleUrls: ['./hotel-room-detail.component.scss']
})
export class HotelRoomDetailComponent implements OnInit,AfterViewInit {
    @Input() hotel: any;
    @Input() traveller: any;
    hotelRoomDetails = [];
    @ViewChild('mapContainer', { static: true }) gMap: ElementRef<HTMLDivElement>
    map: any; //google.maps.Map;
    coordinates: any;
    mapOptions: google.maps.MapOptions;
    lat: number;
    lng: number;
    center!: google.maps.LatLngLiteral;
    marker: google.maps.Marker;
    details: any = {};
    mapLoaded: Promise<boolean>;
    protected subs = new SubSink();
    travellerAdult: any = 0;
    travellerChild: any = 0;
    showShortDescOverview = true;
    totalPrice :number = 0;
    allRoomsSelected: boolean = false;
    selectedRoomTypeName: string = ''; // Initialize with an empty string or default value
    selectedBoardType: string = '';
    visibleCancelPolicyIndex = -1;
    activePanelId: string = 'ngb-panel-0';
    lastSelectedPanelIndex: number = 0;
    selectedRoomId: string = '';
    booking_source:any;
    selectedRooms: any[] = [];
    selectedDescription : string = '';
    selectedSutbaMeal:string ='';
    selectedDotWaMeal:string ='';
    selectedRoomIndex: number = null; // Track the selected room index
    selectedGroupIndex: number = null; // Track the selected group index
    visibleNonCancelPolicyIndex =-1;
    updatedDateFrom: string;
    public hotelPolicy: any;
    public childPolicy: any;
    expandedItemId: number | null = null;
    expandedNoteId: number | null = null;
    constructor(
        private elementRef: ElementRef,
        private hotelService: HotelService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private dialog: MatDialog,
        private utility: UtilityService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.resizeMap();
        this.scrollToRoomDetails();
        this.booking_source = this.hotel.searchRequest.booking_source;
        this.hotelPolicy = this.hotel.HotelPolicy[0] ? this.hotel.HotelPolicy[0].replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
        const childPolicy = this.hotel.RoomDetails[0][0].Rooms[0].childrenPolicyDetails ? this.hotel.RoomDetails[0][0].Rooms[0].childrenPolicyDetails[0].description : '';
        this.childPolicy = childPolicy ? childPolicy.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>') : '';
    }
    ngAfterViewInit(){
      this.getGeoCoords();
  }
      getGeoCoords() {
          navigator.geolocation.getCurrentPosition(pos => {
              this.center = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
              };
              if (this.center) {
                  this.mapInitializer();
              }
          }, err => {
              // log.error(`Browser dose not support GeoLocation`, err);
          })
      }
     
    scrollToOverview() {
        const datestabElement = this.elementRef.nativeElement.querySelector('#tab_default_1');
        if (datestabElement) {
          datestabElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      scrollToLocation() {
        const datestabElement = this.elementRef.nativeElement.querySelector('#location');
        if (datestabElement) {
          datestabElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      scrollToRooms(roomstab) {
        const datestabElement = this.elementRef.nativeElement.querySelector('#room_options');
        if (datestabElement) {
          datestabElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      scrollToAmenities() {
        const datestabElement = this.elementRef.nativeElement.querySelector('#tab_default_3');
        if (datestabElement) {
          datestabElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
      scrolloverview(el) {
        el.scrollIntoView({behavior:"smooth"});
      }
      scrollToHotelPolicy() {
        const datestabElement = this.elementRef.nativeElement.querySelector('#policy');
        if (datestabElement) {
          datestabElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

      scrollToRoomDetails() {
        this.hotelService.scrollToRoomDetails.subscribe(t => {
            if (t) {
                    const roomstabElement = this.elementRef.nativeElement.querySelector('#room_tab');
                    if (roomstabElement) {
                      roomstabElement.scrollIntoView({ behavior: 'smooth' });
                    }
                 }
        });
    }

    cancelInfo(data) {
        this.dialog.open(CancelInfoComponent, {
            data: data
        });
    }

    selectedRoom(rooms, room, index, roomIndex) {

      this.totalPrice = 0;
    
      // Only reset the rooms for the current index (index) without affecting other indices
      if (this.hotel && this.hotel.RoomDetails && this.hotel.RoomDetails[index]) {
        for (let roomList of this.hotel.RoomDetails[index]) {
          roomList.SelectedRoom = null; // Reset the SelectedRoom for the current index
          for (let r of roomList.Rooms) {
            r.isSelected = false; // Reset the isSelected flag for the current index
          }
        }
      }
    
      // Set the selected room for the current index
      this.selectedBoardType = room.RoomType;
      this.selectedRoomId = room.Id;
      this.selectedDescription =  room.MealPlanCode;
      this.selectedSutbaMeal = room.RoomType;
      this.selectedDotWaMeal = room.RoomType;
      rooms.SelectedRoom = room;
      room.isSelected = true;
      room.SelectedIndex = roomIndex;

    
      // Total price calculation considering all selected rooms
      if (this.hotel && this.hotel.RoomDetails) {
        this.hotel.RoomDetails.forEach((roomList, roomGroupIndex) => {
          roomList.forEach((roomDetail) => {
            if (roomDetail.SelectedRoom) {
              this.totalPrice += (roomDetail.SelectedRoom.Price[0].Amount);
            }
          });
        });
      }
    
      // Check if all rooms across all indices are selected
      this.allRoomsSelected = this.hotel.RoomDetails.every((roomList) => {
        return roomList.some((room) => room.SelectedRoom != null);
      });
      this.selectedRoomIndex = index;
      const nextIndex = index + 1;
    
      if (nextIndex < this.hotel.RoomDetails.length) {
        // Move to the next panel if it exists
        this.activePanelId = `ngb-panel-${nextIndex}`;
        this.lastSelectedPanelIndex = nextIndex;
      } else {
        // If it is the last panel, stay on it
        this.activePanelId = `ngb-panel-${index}`;
        this.lastSelectedPanelIndex = index;
      }
      // Store the selected indices to track selections across rooms
      this.selectedRoomIndex = roomIndex;
      this.selectedGroupIndex = index;
    

    }
    selectedHotelRoom(rooms, room, index, roomIndex) {

      this.totalPrice = 0;
    
      // Only reset the rooms for the current index (index) without affecting other indices
      if (this.hotel && this.hotel.RoomDetails && this.hotel.RoomDetails[index]) {
        for (let roomList of this.hotel.RoomDetails[index]) {
          roomList.SelectedRoom = null; // Reset the SelectedRoom for the current index
          for (let r of roomList.Rooms) {
            r.isSelected = false; // Reset the isSelected flag for the current index
          }
        }
      }
    
      // Set the selected room for the current index
      rooms.SelectedRoom = room;
      room.isSelected = true;
      room.SelectedIndex = roomIndex;
    
      // Total price calculation considering all selected rooms
      if (this.hotel && this.hotel.RoomDetails) {
        this.hotel.RoomDetails.forEach((roomList, roomGroupIndex) => {
          roomList.forEach((roomDetail) => {
            if (roomDetail.SelectedRoom) {
              this.totalPrice += parseFloat(roomDetail.SelectedRoom.Price[0].Amount);
            }
          });
        });
      }
    
      // Check if all rooms across all indices are selected
      this.allRoomsSelected = this.hotel.RoomDetails.every((roomList) => {
        return roomList.some((room) => room.SelectedRoom != null);
      });
      this.selectedRoomIndex = index;
      const nextIndex = index + 1;
    
      if (nextIndex < this.hotel.RoomDetails.length) {
        // Move to the next panel if it exists
        this.activePanelId = `ngb-panel-${nextIndex}`;
        this.lastSelectedPanelIndex = nextIndex;
      } else {
        // If it is the last panel, stay on it
        this.activePanelId = `ngb-panel-${index}`;
        this.lastSelectedPanelIndex = index;
      }
      // Store the selected indices to track selections across rooms
      this.selectedRoomIndex = roomIndex;
      this.selectedGroupIndex = index;
    
      // Handle Non-Refundable room case for specific booking sources
      // if (room.NonRefundable && this.booking_source != 'TLAPNO00003') {
      //   const modalRef = this.modalService.open(ConfirmationModelComponent);
      //   modalRef.result.then(
      //     (result) => {
      //       if (result) {
      //         this.cdr.detectChanges();
      //       }
      //     },
      //     (reason) => {
      //       console.log('Dismissed');
      //     }
      //   );
      // }
    }
    unselectRoom(groupIndex: number, roomId: string) {
      for (let roomList of this.hotel.RoomDetails) {
        for (let roomDetail of roomList) {
          console.log("roomDetail",roomDetail)
          if (roomDetail.SelectedRoom && roomDetail.SelectedRoom.Id === roomId) {
            roomDetail.SelectedRoom = null;
            console.log(" roomDetail.SelectedRoom",roomDetail.SelectedRoom)
            for (let room of roomDetail.Rooms) {
              if (room.Id === roomId) {
                room.isSelected = false;
                room.SelectedIndex =null;
                 // Reset the selection state
              }
            }
          }
        }
      }
    
      this.updateTotalPriceAndSelectionState();
    }
    updateTotalPriceAndSelectionState() {
      this.totalPrice = 0;
      if (this.hotel && this.hotel.RoomDetails) {
        for (let roomList of this.hotel.RoomDetails) {
          for (let roomDetail of roomList) {
            if (roomDetail.SelectedRoom) {
              this.totalPrice += roomDetail.SelectedRoom.Price[0].Amount;

            }
          }
        }
      }
    
      if (this.hotel && this.hotel.RoomDetails) {
        this.allRoomsSelected = this.hotel.RoomDetails.every(roomList => {
          return roomList.some(roomDetail => roomDetail.SelectedRoom != null);
        });
      }
    }
    onPanelChange(panelIndex: string) {
        // Extract the index from the panel ID
        const index = parseInt(panelIndex.replace('ngb-panel-', ''), 10);
        this.activePanelId = panelIndex;
        this.lastSelectedPanelIndex = index;
    }
    onBookNow(hotel: any, rooms: any) {
        this.hotelService.loading.next(true);
        let roomIndex=[];
        let resultToken=[];

        if (rooms) {
            for (let roomDetails of hotel.RoomDetails) {
                for (let rooms of roomDetails) {
                    if (rooms.SelectedRoom) {
                        resultToken.push(rooms.ResultIndex);
                    }
                }
            }
        }
        else {
            resultToken = [];
        }
        if (rooms) {
            for (let roomDetails of hotel.RoomDetails) {
                for (let rooms of roomDetails) {
                    for(let room of rooms.Rooms){
                    if (room.SelectedIndex != null) {
                      if(room.isSelected == true){
                        roomIndex.push(room.Index)
                      }
                    }
                }
            }
            }
        }
        else {
            roomIndex = [];
        }
     
        const currentUserId = this.utility.readStorage('b2cUser', sessionStorage)['id'];
        this.subs.sink = this.apiHandlerService.apiHandler('blockRoom', 'POST', '', '', {
           // ResultToken:rooms.ResultIndex,
            ResultToken:resultToken,
            BlockRoomId:roomIndex,
            booking_source: this.booking_source,
            UserId: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser'))['id'] : 0,
            //booking_source: hotel['booking_source']
        }).subscribe(res => {
            if (res.data) {
                this.hotelService.blockHotelRoom.next(res);
                localStorage.setItem('blockHotelRoomState', JSON.stringify(this.hotelService.blockHotelRoom.getValue()));
                this.hotelService.resultToken = res.ResultToken;
                this.hotelService.traveller = this.traveller;
                // sessionStorage.setItem('activeId','');
                this.cdr.detectChanges();
                this.router.navigate(['/search/hotel/guests']);
            } else {
                this.hotelService.loading.next(false);
                alert(res.Message);
            }
            this.hotelService.loading.next(false);
        }, (err) => {
          this.hotelService.loading.next(false);
          alert("Something went wrong. Please try again.");
        });
    }
    // onBookNow(hotel: any, roomResultIndex: any) {
    //     this.hotelService.loading.next(true);
    //     const currentUserId = this.utility.readStorage('currentUser', sessionStorage)['id'];
    //     this.subs.sink = this.apiHandlerService.apiHandler('blockRoom', 'POST', '', '', {
    //         UserId: currentUserId,
    //         UserType: "B2B",
    //         HotelResultToken: hotel['ResultIndex'],
    //         RoomResultToken: roomResultIndex,
    //         booking_source: hotel['booking_source']
    //     }).subscribe(res => {
    //         if (res.data) {
    //             this.hotelService.blockHotelRoom.next(res);
    //             localStorage.setItem('b2bBlockHotelRoomState', JSON.stringify(this.hotelService.blockHotelRoom.getValue()));
    //             this.hotelService.resultToken = res.ResultToken;
    //             this.hotelService.traveller = this.traveller;
    //             this.router.navigate(['/search/hotel/guests']);
    //         } else {
    //             this.hotelService.loading.next(false);
    //             alert(res.Message);
    //         }
    //         this.hotelService.loading.next(false);
    //     });
    // }

    amenityAvailable(item: string, match: string) {
        const regx = new RegExp(`${match}`, 'gi');
        if (item == match)
            return true;
        return false;
    }
    shortDescText() {
        this.showShortDescOverview = !this.showShortDescOverview
    }


    //   isRoomSelected(groupIndex: number, roomId: string): boolean {
    //     return this.selectedRooms[groupIndex]?.Id === roomId;
    // }

    resizeMap() {
        this.coordinates = { lat: this.hotel.Latitude, lng: this.hotel.Longitude };
        this.mapInitializer();
    }

  //   mapInitializer() {
  //     this.map = new google.maps.Map(this.gMap.nativeElement, {
  //         center: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
  //         zoom: 17,
  //         mapTypeId: google.maps.MapTypeId.ROADMAP
  //     });
  //     this.placeMarker();
  // }
  mapInitializer() {
    this.mapOptions = {
        center: this.center,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    console.log("gmap",this.gMap)
    this.map = new google.maps.Map(this.gMap.nativeElement, this.mapOptions);
    console.log("map",this.map)
    this.placeMarker();
    // this.initializeSearchBox();
}

  placeMarker() {
    let infowindow = new google.maps.InfoWindow()
    let latlngset = new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng);
    let marker = new google.maps.Marker({
        map: this.map,
        title: this.hotel.HotelName,
        position: latlngset,
    });
    this.map.setCenter(marker.getPosition())
    let style_pop_up = 'height="60" width="60"';
    let style_image = 'height="30" width="30"';
    let pop_up_hotel_image = '<img src="' + this.hotel['HotelPicture'] + '" ' + style_pop_up + '>';
    let $pop_up = '<div style="width:300px; padding:2px;"><div class="mapplot" style="color:#3399FE;"> <div class="projimg1" style="float:left;"> ' + pop_up_hotel_image + '</div> <div class="mapplot_desc"><div style="color: royalblue; font-size: 14px; font-weight:bold;"> ' + this.hotel.HotelName + ', <small style="color:#000;"> ' + this.hotel.HotelAddress + '</small></div> <div style="float:left"> </div></div> </div></div></div>';
    let currentInfoWin = true;

    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
            if (currentInfoWin) {
                infowindow.close();
            }
            infowindow.setContent($pop_up);
            infowindow.open(this.map, marker);
            currentInfoWin = true;
        };
    })(marker, this.hotel.HotelName, infowindow));

}
showSubCancelPolicy(cancelpolicy,policy) {
  console.log("policy",policy)
    if (this.visibleCancelPolicyIndex === cancelpolicy) {
      this.visibleCancelPolicyIndex = -1;
    } else {
      this.visibleCancelPolicyIndex = cancelpolicy;
    //   this.unselectRoom = policy.map((data) => {
    //     const dateFrom = new Date(data.date_from); // Convert to Date object
    //     dateFrom.setDate(dateFrom.getDate() - 1); // Subtract one day
    //     return dateFrom.toISOString().split('T')[0]; 
    //     console.log(" this.updatedDateFrom", this.updatedDateFrom)
    // })
    const minDate = policy
      .map(data => new Date(data.date_from))
      .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest one

    if (minDate) {
      minDate.setDate(minDate.getDate() - 1); // Subtract 1 day
      this.updatedDateFrom = minDate.toISOString().split('T')[0];
      console.log("this.updatedDateFrom", this.updatedDateFrom);
    }
    }
  }
  showNonCancelPolicy(cancelpolicy) {
    if (this.visibleNonCancelPolicyIndex === cancelpolicy) {
      this.visibleNonCancelPolicyIndex = -1;
    } else {
      this.visibleNonCancelPolicyIndex = cancelpolicy;
    }
  }

  isEmptyPay(arr: any[]): boolean {
    return Array.isArray(arr) && arr.some(item => item.arrival_tax_type === "plus");
}

getPolicies(data) {
  if (data) {
    const policies = data.split(';');
    return policies;
  }
}

getPoliciesPlit(data) {
  if (data) {
    const policies = data.split('.,');
    return policies;
  }
}

getPolicieSplit(data) {
  if (data) {
    const policies = data.split(';')
    return policies;
  }
}

splitByColon(value: string): string[] {
  return value.split(':') || [];
}

getNotes(data) {
  if (data) {
    const policies = data;
    return policies;
  }
}

toggleSkil(id){
  this.expandedItemId = this.expandedItemId === id ? null : id;

}

toggleNote(id){
  this.expandedNoteId = this.expandedNoteId === id ? null : id;
}

}


// function ViewChild(arg0: string, arg1: { static: boolean; }) {
//     throw new Error('Function not implemented.');
// }

