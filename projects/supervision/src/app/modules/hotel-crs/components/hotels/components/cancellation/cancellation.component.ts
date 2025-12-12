import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Router } from '@angular/router';
const log = new Logger('Hotel/AddUpdateHotel');
@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss']
})
export class CancellationComponent implements OnInit {
    showCancelPolicyList: boolean=true;
    showCancelPolicyForm: boolean;
    addedCancelPolicyDetail: any;
    roomCancellationPolicyForm: FormGroup;
    submittedRoomCancelPolicy: boolean = false;
    @Input() hotelOne: object = {};
    @Input() cancelData: object = {};
    addedRoomDetail: any;
    @Output() goToRoomdetail  = new EventEmitter<any>();
    @Output() someEvent = new EventEmitter<any>();
    roomId:object = {};
    cancelList:any;
    noDataMessage: string;
    showCancelList: boolean;
    showCancelForm: boolean;
    patchdData:any
  constructor(
    private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.createRoomCancellationPolicyForm();
    this.hotelCrsService.roomDetailList.subscribe(res => {
        this.addedRoomDetail = res;
        console.log("seasonCopy",this.addedRoomDetail)
    });
    this.hotelCrsService.roomId.subscribe(res =>{
        this.roomId=res; 
        console.log(this.roomId)
    })
    this.grtCancellationList();
  }
  createRoomCancellationPolicyForm() {
    this.roomCancellationPolicyForm = this.fb.group({
        hotel_room_id: [''],
        cancel_to: ['', Validators.required],
        penalty_type: ['', Validators.required],
        penalty: ['', Validators.required],
        cancel_description: ['', Validators.required],
        refund_policy: ['', Validators.required],
        status: [true]
    })
}
  onClickAddCancelPolicy() {
    this.showCancelPolicyList = false;
    this.showCancelPolicyForm = true;
}
onEdit(patchData) {
    this.patchdData =patchData;
    this.showCancelPolicyForm =true;
    this.showCancelPolicyList =false;
console.log("patchData",patchData)
    this.roomCancellationPolicyForm.patchValue({
        cancel_to: patchData['cancel_to'] || '',
        penalty_type: patchData['penalty_type'] || '',
        penalty: patchData['penalty'] || '',
        cancel_description: patchData['cancel_description'] || '',
        refund_policy: patchData['refund_policy'] || '',
        // image: patchData['image'] || '',
        // hotel_id:patchData['hotel_id'],
        status:true ,
    });
}
onSubmitCancelPolicy() {
    this.submittedRoomCancelPolicy = true;
    if (this.roomCancellationPolicyForm.valid) {
        this.roomCancellationPolicyForm.value.hotel_room_id = this.addedRoomDetail['id'];
        let data = Object.assign({}, this.roomCancellationPolicyForm.value);
        try {
            if (this.patchdData) {
                data['hotel_room_id'] = this.cancelData['id'];
                data['id'] = this.patchdData['id'];
                data = [data];
                data['topic'] = 'updateCancellationPolicy';
            }
            else {
                data['hotel_room_id'] = this.cancelData['id'];
                data = [data];
                data['topic'] = 'addCancellationPolicy';
            }
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedCancelPolicyDetail = resp['data']
                this.grtCancellationList()
                this.showCancelPolicyForm =false;
                this.showCancelPolicyList =true;
                this.swalService.alert.success("Hotel and Room Allocation added successfully!")
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.msg)
            }
            else {
                this.swalService.alert.oops(resp.msg);
            }
        })
    }
    else {
        return;
    }

}
grtCancellationList(){
    let room_id = this.cancelData['id']
    const data = [{ hotel_room_id: room_id, offset: 0, limit: 10 }]
    data['topic'] = 'getCancellationPolicy';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.cancelList = resp.data;

            }
            else if (resp.statusCode == 404) {
                this.noDataMessage = "No records found"
            }
        }
    )  
}
goToRoomCancel(){
    this.goToRoomdetail.emit({rooms:this.cancelData,hoteltrigger:'goToRoomDetailFromCancel'})
}
get hotelRoomCancelPolicy() { return this.roomCancellationPolicyForm.controls; }
}
