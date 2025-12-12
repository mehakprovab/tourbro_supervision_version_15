import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
const log = new Logger('Hotel/AddUpdateHotel');
import { formatDate } from 'ngx-bootstrap/chronos';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
    @Output() showRoomImage = new EventEmitter<any>();
    @Output() isPrice =new EventEmitter<boolean>(false);
    @Output() showIsPrice=new EventEmitter<boolean>(false);
    @Output() someEvent = new EventEmitter<any>();
    @Output() roomDataChange = new EventEmitter<any>();
    @Output() selectionChanged = new EventEmitter<any>();

    selectedMealPlans: any[] = [];
    selectedRoomViews: any[] = [];
    showRoomList: boolean=true;
    showRoomForm: boolean;
    showPriceDetail:boolean;
    roomList: any;
    hotel:any;
    submittedHotel:any;
    addedRoomDetail: any;
    @Input() hotelOne;
    noDataMessage: string;
    submittedRoom: boolean = false;
    noData: boolean = true;
    roomDetailForm: FormGroup;
    roomAmenityList: any;
    patchdData:any
    roomTypeList: any;
    dropdownSettingsForRoom = {};
    addedHotelDetail: any;
    RoomId:any;
    hotelAmenityList: any;
    selectedModuleCheckboxes: Array<any> = [];
    selectedMealCheckboxes: Array<any> = [];
    data:Array<any> = [];
    dropdownSettingsForview ={}
    dropdownSettingsForHotel ={}
    BoardList = [
        { id: 'RO', name: 'Room Only(RO)',isChecked:false},
        { id: 'BB', name: 'Bed and Breakfast(BB)',isChecked:false},
        { id: 'HB', name: 'Half Board(HB)',isChecked:false},
    ];
    // mealList = [
    //     { id: 'veg', name: 'Veg',isChecked:false},
    //     { id: 'nonVeg', name: 'Non-Veg',isChecked:false},
    // ];
    mealView:any;
    viewList:any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    filteredMealView = []; // Options for the meal dropdown based on priceData
    filteredViewList = []; 
    occupancyError: boolean = false;
    private subSunk = new SubSink();
  constructor( private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router :Router,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,) { 
          
    this.dropdownSettingsForRoom = {
        singleSelection: false,
        idField: 'id',
        textField: 'room_amenity_name',
        maxHeight: 197,
        itemsShowLimit: 2,
    };
    this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'meals',
        maxHeight: 197,
        itemsShowLimit: 1,
    };
    this.dropdownSettingsForview = {
      singleSelection: false,
      idField: 'id',
      textField: 'views',
      maxHeight: 197,
      itemsShowLimit: 1,
  };
  this.getScreenSize()
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.getScreenSize();
      // Perform actions based on new screen size
      // e.g., update component styles, change content
    }

    getScreenSize() {
        console.log( window.innerWidth, window.innerHeight);
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        if (screenWidth < 1510) {
        }
    }
  ngOnInit() {
    this.createHotelRoomForm();
    this.getHotelRoomTypeList()
    this.getHotelRoomAmenityList()
    this.getRoomsByHotelId();
    // this.getMealList();
    // this.getViewList();
    this.loadOptions();
    this.hotelCrsService.addedHotelDetail.subscribe(res => {
        this.addedHotelDetail = res;
    });
  
  }
  onClickAddRoom() {
    this.submittedRoom = false;
    this.showRoomList = false;
    this.roomDetailForm.reset()
    this.patchdData='';
    this.BoardList.forEach(module => {
        module.isChecked =false;
    })
    // this.mealList.forEach(module => {
    //     module.isChecked =false;
    // })
    this.showRoomForm = true;
//    this.showPriceDetail=true;

}
createHotelRoomForm(): void {
    this.roomDetailForm = this.fb.group({
        hotel_room_type_id: ['', Validators.required],
        room_name: ['',Validators.required ],
        occupancy: ['', Validators.required],
        meal_type:['', Validators.required],
        bed_type:['', Validators.required],
        room_view:['', Validators.required],
        occupancy_child:['',Validators.required],
        occupancy_adult: ['', Validators.required],
        occupancy_infant: [0],
        // room_description: [''],
         hotel_room_cancellation_policy:[''],
        hotel_room_amenity_ids: [[''], Validators.required],
        hotel_id: [''],
        status: new FormControl('')
    })
    this.roomDetailForm.get('occupancy_adult').valueChanges.subscribe(() => this.updateTotalOccupancy());
    this.roomDetailForm.get('occupancy_child').valueChanges.subscribe(() => this.updateTotalOccupancy());
    this.roomDetailForm.get('occupancy_infant').valueChanges.subscribe(() => this.updateTotalOccupancy());
}

updateTotalOccupancy() {
    const occupancyControl = this.roomDetailForm.get('occupancy');
    console.log("occupancyControl",occupancyControl)
    const adult = this.roomDetailForm.get('occupancy_adult').value || 0;
    const child = this.roomDetailForm.get('occupancy_child').value || 0;
    const infant = this.roomDetailForm.get('occupancy_infant').value || 0;
    const totalOccupancy = adult + child + infant;
console.log("totalOccupancy",totalOccupancy)
    // If the total occupancy is less than or equal to the occupancy value, set an error
   
    if (totalOccupancy > occupancyControl.value) {
        occupancyControl.setErrors({ occupancyInvalid: true });
    } else {
        occupancyControl.setErrors(null);
    }
}
onEdit(patchData) {
    this.patchdData = patchData;
    this.showRoomForm =true;
    this.showRoomList = false;
    this.selectedModuleCheckboxes=this.patchdData.board_type.split(',').map(api => api.replace(/[\[\]\"\\]/g, '').trim())
    // this.selectedMealCheckboxes = this.patchdData.meal_type.split(',').map(type => type.trim());
    console.log("selectedMealCheckboxes",this.selectedMealCheckboxes)
      this.BoardList.forEach(module => {
        if (this.selectedModuleCheckboxes.includes(module.id)) {
            module.isChecked = true;
        }
      });
    this.dropdownSettingsForRoom = {
        singleSelection: false,
        idField: 'id',
        textField: 'room_amenity_name',
        maxHeight: 197,
        itemsShowLimit: 2,
    };
    this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'meals',
        maxHeight: 197,
        itemsShowLimit: 1,
    };
    this.dropdownSettingsForview = {
      singleSelection: false,
      idField: 'id',
      textField: 'views',
      maxHeight: 197,
      itemsShowLimit: 1,
  };

    this.roomDetailForm.patchValue({
        hotel_room_type_id: patchData['hotel_room_type_id'] || '',
        room_name:patchData['room_name'] || '',
        // no_of_rooms:patchData['no_of_rooms'] || '',
        occupancy: patchData['occupancy'] || '',
        // room_description: patchData['room_description'] || '',
        hotel_room_cancellation_policy: patchData['hotel_room_cancellation_policy'] || '',
        hotel_room_amenity_ids:this.getAlreadySelectedAmenities(patchData['hotel_room_amenity_ids']),
        room_view:this.getAlreadySelectedView(patchData['room_view']),
        meal_type:this.getAlreadySelectedMeal(patchData['meal_type']),
        occupancy_adult:patchData['occupancy_adult'] || '',
        occupancy_child:patchData['occupancy_child'] || '',
        occupancy_infant:patchData['occupancy_infant'] || 0,
        hotel_id:patchData['hotel_id'],
        bed_type:patchData['bed_type'] || '',
        status:patchData['room_status'] ? true : false
    });
}

numberOnly(event): boolean {
    return this.utility.numberOnly(event);
}

loadOptions() {
    forkJoin({
      mealOptions: this.getMealList(),
      viewOptions: this.getViewList()
    }).subscribe(results => {
      this.mealView = results.mealOptions;
      this.viewList = results.viewOptions;

      // Populate dropdowns based on the fetched data
      this.updateDropdownOptions();
      // Populate form controls if `priceData` is available
      if (this.hotelOne) {
        this.updateMealOptions();
        this.updateViewOptions();
      }
    });
  }

  getMealList(): Observable<any[]> {
    const data = [{ offset: 0, limit: 10 }];
    data['topic'] = 'mealList';
    return this.hotelCrsService.fetch(data).pipe(
      map(resp => resp.statusCode === 200 ? resp.data :[])
    );
  }

  getViewList(): Observable<any[]> {
    const data = [{ offset: 0, limit: 10 }];
    data['topic'] = 'viewList';
    return this.hotelCrsService.fetch(data).pipe(
      map(resp => resp.statusCode === 200 ? resp.data : [])
    );
  }

  updateDropdownOptions() {
    // Filter meal and view options based on `priceData`
    const mealPlans = this.hotelOne.meal_plans.split(',').filter(Boolean);
    const roomViews = this.hotelOne.room_view_ids.split(',').filter(Boolean);
    console.log("mealPlans",mealPlans)
console.log("mealView",this.mealView)
    this.filteredMealView = this.mealView.filter(option => mealPlans.includes(option.meals));
    this.filteredViewList = this.viewList.filter(option => roomViews.includes(option.views));

    console.log("filteredMealView",this.filteredMealView)
  }

  updateMealOptions() {
    console.log("hotelOne",this.hotelOne)
    // Update the meal_type form control with filtered options
    const mealPlans = this.hotelOne.meal_plans.split(',').filter(Boolean);
    // this.roomDetailForm.get('meal_type').setValue(mealPlans);
  }

  updateViewOptions() {
    // Update the room_view form control with filtered options
    const roomViews = this.hotelOne.room_view_ids.split(',').filter(Boolean);
    // this.roomDetailForm.get('room_view').setValue(roomViews);
  }

getAlreadySelectedAmenities(amenities) {
    const amenityIds = amenities.split(',');
    console.log("amenityIds",amenityIds)
    const selectedAmenities = this.roomAmenityList.filter(amenity => amenityIds.includes(String(amenity.room_amenity_name)));
    console.log("selectedAmenities",selectedAmenities)
    return selectedAmenities;
}
getAlreadySelectedView(amenities) {
    const amenityIds = amenities.split(',');
    console.log("amenityIds",amenityIds)
    const selectedView = this.viewList.filter(amenity => amenityIds.includes(String(amenity.views)));
    console.log("selectedAmenities",selectedView)
    return selectedView;
}
getAlreadySelectedMeal(amenities) {
    const amenityIds = amenities.split(',');
    console.log("amenityIds",amenityIds)
    const selectedMeal = this.mealView.filter(amenity => amenityIds.includes(String(amenity.meals)));
    console.log("selectedAmenities",selectedMeal)
    return selectedMeal;
}
// getAlreadySelectedView(amenities: string): string[] {
//     console.log("amenities", amenities);  // '15'
//     const amenityIds = amenities.split(',').map(view => view.trim()); // Trim any extra spaces
//     const selectedAmenityNames = this.viewList
//         .filter(amenity => amenityIds.includes(String(amenity.views)))  // Convert id to string
//         .map(amenity => amenity.views);
//     return selectedAmenityNames;
// }
// getAlreadySelectedMeal(amenities: string): string[] {
//     console.log("amenities", amenities);  // '15'
//     const amenityIds = amenities.split(',').map(meals => meals.trim()); // Trim any extra spaces
//     console.log("amenityIds", amenityIds);  // [ '15' ]
//     console.log("hotelAmenityList", this.mealView);  // [ { id: 15, meals: 'Meal 1' } ]
//     const selectedmeal = this.mealView
//         .filter(amenity => amenityIds.includes(String(amenity.meals)))  // Convert id to string
//         .map(amenity => amenity.meals);
//     return selectedmeal;
// }
onSubmitRoomDetail(): void {
    this.submittedRoom = true;
    if (this.roomDetailForm.valid) {
        this.roomDetailForm.value.hotel_id =  this.addedHotelDetail['id'];
        this.roomDetailForm.value.occupancy_child = this.roomDetailForm.get('occupancy_child').value || 0;
        this.roomDetailForm.value.occupancy_infant = this.roomDetailForm.get('occupancy_infant').value || 0;
        console.log("this.roomDetailForm.value.meal_type",this.roomDetailForm.value.meal_type)
        this.roomDetailForm.value.meal_type = this.roomDetailForm.value.meal_type.map(v => v.meals).join(",");  
        this.roomDetailForm.value.room_view = this.roomDetailForm.value.room_view.map(v => v.views).join(",");
        this.roomDetailForm.value.hotel_room_amenity_ids = this.roomDetailForm.value.hotel_room_amenity_ids.map(v => v.room_amenity_name).join(",");  
        const cancellationPolicy = []
        this.roomDetailForm.value.hotel_room_cancellation_policy = cancellationPolicy;  
        let data = Object.assign({}, this.roomDetailForm.value);
        data['board_type'] = this.selectedModuleCheckboxes;
        // data['board_type'] = '';
        data['room_policy']=''
        data['max_passanger_capacity']= 0;
        data['max_adult_capacity'] = 0;
        data['max_child_capacity'] = 0;
        data['extra_bed_availability'] = 0;
        data['no_of_rooms'] = 0;
        delete data['Cancellation_type'];
        delete data['date_from'];
        delete data['date_to'];
        delete data['charge'];
        delete data['currency'];
        delete data['charge_type'];
        data['refundable'] = this.roomDetailForm.value.refundable === 'true';
        // data['meal_type'] = []
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
            if (this.patchdData) {
                console.log("patchdData",this.patchdData)
                // data['hotel_id'] = this.hotelOne['id'];
                data['id']=this.patchdData['id']
                data['hotel_id'] = this.hotelOne['id'];
                data['hotel_code']= this.hotelOne['hotel_code'];
                // data['room_name']=this.patchdData['room_name']
                data = [data];
                data['topic'] = 'updateRoom';
            }
            else {
                data['hotel_id'] = this.hotelOne['id'];
                data['hotel_code']= this.hotelOne['hotel_code'];
                data = [data];
                data['topic'] = 'addRoom';
                
            }

            this.hotelCrsService.update(data).subscribe(resp => {
            console.log("resp",resp)
            if (resp.statusCode == 201) {
                this.addedRoomDetail = resp['data']
                this.hotelCrsService.roomDetailList.next(this.addedRoomDetail);
                this.getRoomsByHotelId();
                this.showRoomForm = false;
                this.roomDetailForm.reset();
                this.showRoomList = true;
                this.submittedRoom = false;
                if(data['topic'] == 'addRoom'){
                    this.swalService.alert.success("Room detail added successfully!") 
                }else{
                    this.swalService.alert.success("Room detail Updated successfully!")
                }
            } else if (resp.statusCode == 400) {
                console.log("resp",resp)
                this.swalService.alert.oops(resp.Message)
            }
            else {
                this.swalService.alert.oops(resp.Message);
            }
        }, err => {
          console.log("err err",err)
            this.swalService.alert.oops("Internal server error");
        })
    }
    else {
        return;
    }
}
getHotelRoomAmenityList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'roomAmenityList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.roomAmenityList = resp.data.filter(p => p.status == 1);
        }
    });
}


validateOccupancy() {
    const occupancy = Number(this.roomDetailForm.get('occupancy').value || 0);
    let adults = Number(this.roomDetailForm.get('occupancy_adult').value || 0);
    let children = Number(this.roomDetailForm.get('occupancy_child').value || 0);
    let total = adults + children;

    // Ensure total occupancy does not exceed the selected occupancy
    if (total > occupancy) {
        setTimeout(() => {
            // Reduce children first if total exceeds occupancy
            if (children > 0) {
                children = Math.max(0, occupancy - adults);
                this.roomDetailForm.get('occupancy_child').setValue(children);
            }

            // Recalculate total after adjusting children
            total = adults + children;

            // If still exceeding, reduce adults
            if (total > occupancy) {
                adults = Math.max(1, occupancy - children); // Ensure at least 1 adult
                this.roomDetailForm.get('occupancy_adult').setValue(adults);
            }
            this.roomDetailForm.get('occupancy').setErrors(null);
        });
    }

    // **Fix for validation issue: Ensure the total is exactly equal to occupancy**
    if (total <= occupancy) {
        this.roomDetailForm.get('occupancy').setErrors(null);
    } else {
        this.roomDetailForm.get('occupancy').setErrors({ invalidOccupancy: true });
    }
}




getRoomsByHotelId(): void {
    console.log("this.hotelOne",this.hotelOne)
    let hotel_id = this.hotelOne['hotel_code']
        const data = [{ hotel_code: hotel_id, offset: 0, limit: 10 }]
        data['topic'] = 'getRoomsByHotelId';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.roomList = resp.data;
                }
                else if (resp.statusCode == 404) {
                    this.noData = true;
                    this.noDataMessage = "No records found"
                }
            }
        )
}
getHotelRoomTypeList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'roomTypeList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.roomTypeList = resp.data.filter(p => p.status == 1);
        }

    });
}
goToRoom(roomId,tab){
    // this.hotelCrsService.showTab.next(tab)
    // this.someEvent.next({ hoteltrigger: 'roomImage' })
    console.log("selectedMealPlans",this.selectedMealPlans)

    this.showRoomImage.emit({  rooms: roomId,roomsEditData :'',hoteltrigger:tab });
}
// goToHotelList(){
//     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//     this.router.onSameUrlNavigation = 'reload';
//     this.router.navigate(['/hotels/hotel-crs-lists']);
// }
goToHotelList() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
    });
}
 get hotelRoom()
  { 
    return this.roomDetailForm.controls; 
}
 
 onBoardCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedModuleCheckboxes.push(inclusion);
    } else {
      const index = this.selectedModuleCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedModuleCheckboxes.splice(index, 1);
      }
   }
  }
  onMealCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedMealCheckboxes.push(inclusion);
    } else {
      const index = this.selectedMealCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedMealCheckboxes.splice(index, 1);
      }
   }
  }
  onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{id:pricedata['id']}]
            data['topic'] = 'deleteHotelRoom';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Hotel Room has been deleted successfully`);
                        this.getRoomsByHotelId();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
// getMealList(): void {
//     const data = [{ offset: 0, limit: 10 }]
//     data['topic'] = 'mealList';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 200) {
//             this.mealView = resp.data.filter(p => p.status == 1);
           
//         }
//     });
// }

// getViewList(): void {
//     const data = [{ offset: 0, limit: 10 }]
//     data['topic'] = 'viewList';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 200) {
//             this.viewList = resp.data;
//         }
//     });
// }
//   onDelete(pricedata){
//     const data = [{id:pricedata['id']}]
//     data['topic'] = 'deleteHotelRoom';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             // this.hotelImage = resp.data;
//             this.getRoomsByHotelId();
//             this.swalService.alert.success("Hotel room detail deleted successfully!")
//         }

//     });
// }

onStatusUpdate(val, index): void {
    // this.selectedModuleCheckboxes=val.board_type.split(',').map(api => api.replace(/[\[\]\"\\]/g, '').trim())
    // this.selectedMealCheckboxes = val.meal_type.split(',').map(type => type.trim());
    let data = Object.assign({}, val);
    // data['hotel_room_amenity_ids']=this.getAlreadySelectedAmenities(val['hotel_room_amenity_ids'])
    // data['board_type'] = this.selectedModuleCheckboxes;
    // data['meal_type'] = this.selectedMealCheckboxes;
    data['id']=val['id']
    data['hotel_id'] = this.hotelOne['id'];
    data['hotel_code']= this.hotelOne['hotel_code'];
    data['status']= val['room_status'] ? false : true;
    // data['room_name']=this.patchdData['room_name']
    data = [data];
    data['topic'] = 'updateRoom';
            data['topic'] = 'updateRoom';
            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.getRoomsByHotelId()
                    this.swalService.alert.update();
                }
                else
                    this.swalService.alert.oops();
            })
     
   

}
 onbBackClick(){
    this.showRoomList = true;
    this.roomDetailForm.reset();
    this.showRoomForm = false;
  }
}
