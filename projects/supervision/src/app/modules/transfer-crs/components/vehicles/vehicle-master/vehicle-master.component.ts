import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSlideToggleChange, Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'projects/b2b/src/environments/environment.prod';
const baseUrl = environment.SA_URL;

@Component({
    selector: 'app-vehicle-master',
    templateUrl: './vehicle-master.component.html',
    styleUrls: ['./vehicle-master.component.scss']
})

export class VehicleMasterComponent implements OnInit {
    public addUpdateVehcleForm: FormGroup;
    public editForm: boolean = false;
    public searchText: string;
    public enabledForm: boolean = true;
    public vehiclesType: Array<any>[] = [];
    public seatCapacity = Array.from({ length: 71 }, (_, index) => index + 1);
    public ratingList = [
        { key: 'Standard' },
        { key: 'Premium' },
        { key: 'Mid-Luxury' },
        { key: 'Luxury' },
        { key: 'Ultra-Luxury' }
    ];
    public acType = [{ key: 'Yes' }, { key: 'No' }];
    public rideType = [
        { key: 'private', value: 'private' },
        // { key: 'public', value: 'public' }
    ];
    public saveTextName: string = 'Save';
    public id: number;
    public vehicleMasterDataList: Array<any>[] = [];
    public searchSpin: boolean = true;
    public loading: boolean = false;
    public primaryColour: any;
    public loadingTemplate: any;
    public secondaryColour: any;
    public displayColumn = ['Sl.No','Status', 'Vehicle Name', 'Vehicel Type', 'Capacity', 'Ride Type', 'Catagoty', 'Image', 'Action']
    public pageSize = 20;
    public page = 1;
    public collectionSize: any;
    public imageFile: any;
    public loggedInUserId: any;
    public vehicleImage: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerServices: ApiHandlerService,
        private swalService: SwalService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
    this.loggedInUserId = JSON.parse(currentSupervisionUser)['id'];
        this.createForm();
        this.getVehicleTypeList();
        this.getVehicleMasterList();
    }

    getVehicleTypeList() {
        const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
        const loggedInAuthUser = JSON.parse(currentSupervisionUser)['auth_role_id'];
        let created_by_id;
        // if(loggedInAuthUser !== 7) {
            created_by_id = 1
        // } else {
            // created_by_id = JSON.parse(currentSupervisionUser)['id'];
        // }
        const payLoad = {
            created_by_id: String(created_by_id),
            
        }
        this.apiHandlerServices.apiHandler('vehicleMasterList', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.vehiclesType = res.data;
                    this.vehicleImage = '';
                    this.imageFile = '';
                } else {
                    this.vehiclesType = [];
                }
            }, error: (err) => {
                this.vehiclesType = [];
            }
        })
    }

    createForm() {
        this.addUpdateVehcleForm = this.fb.group({
            vehicle_type: ['', Validators.required],
            vehicle_name: ['', Validators.required],
            ac_vehicle: ['', Validators.required],
            max_capacity: ['', Validators.required],
            ride_type: ['private', Validators.required],
            ratings: ['', Validators.required],
            luggage_allowances: ['', Validators.required],
            image: [''],
            status: [false]
        })
    }

    onAddButtonClicked() {
        this.saveTextName = 'Save';
        this.addUpdateVehcleForm.reset();
        this.enabledForm = true;
    }

    onVehicleMasterSave() {
        
        if (!this.imageFile) {
            this.swalService.alert.oops('Please Add Image');
            return;
        }
        
        if (!this.addUpdateVehcleForm.valid) {
            return;
        }
        this.loading = true;
        const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
            const loggedInAuthUser = JSON.parse(currentSupervisionUser)['auth_role_id'];
            let created_by_id;
            if(loggedInAuthUser !== 7) {
                created_by_id = 1
            } else {
                created_by_id = JSON.parse(currentSupervisionUser)['id'];
            }
        const payLoad = {
            ...this.addUpdateVehcleForm.value,
            vehicle_type: Number(this.addUpdateVehcleForm.value.vehicle_type),
            status: this.addUpdateVehcleForm.value.status ? this.addUpdateVehcleForm.value.status : false,
created_by_id: created_by_id 
        };
        this.apiHandlerServices.apiHandler('createVehicleMaster', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    // this.enabledForm = false;
                    this.uploadImage(res.data.id)
                    this.vehicleImage = '';
                    this.imageFile = '';
                    this.loading = false;
                    this.addUpdateVehcleForm.reset();
                    this.swalService.alert.success(res.Message);
                    this.getVehicleMasterList();
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message)
                }
            }, error: (err) => {
                this.loading = false;
                this.swalService.alert.error(err.error.Message)
            }
        })
    }

    getVehicleMasterList() {
        this.searchSpin = true;
        
        const currentSupervisionUser = sessionStorage.getItem('currentSupervisionUser');
        const loggedInAuthUser = JSON.parse(currentSupervisionUser)['auth_role_id'];
        let created_by_id;
        if(loggedInAuthUser !== 7) {
            created_by_id = 1
        } else {
            created_by_id = JSON.parse(currentSupervisionUser)['id'];
        }
        const payLoad = {
            created_by_id: String(created_by_id)
        }
        this.apiHandlerServices.apiHandler('vehicleMasterDataList', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    this.vehicleMasterDataList = res.data;
                    this.collectionSize = this.vehicleMasterDataList.length;
                    this.searchSpin = false;
                } else {
                    this.vehicleMasterDataList = [];
                }
            }, error: (err) => {
                this.vehicleMasterDataList = [];
            }
        })
    }
    onEditVehicleType(data) {
        console.log(data);
        this.addUpdateVehcleForm.patchValue({
            vehicle_type: data.vehicle_type,
            vehicle_name: data.vehicle_name,
            ac_vehicle: data.ac_vehicle,
            max_capacity: String(data.max_capacity),
            ride_type: data.ride_type,
            ratings: data.ratings,
            luggage_allowances: data.luggage_allowances,
            image: '',
            status: data.status ? true : false
        });
        this.id = data.id;
        this.vehicleImage = `${baseUrl + '/sa/transfer/getTransferImage/' + data.image}`;
        this.enabledForm = true;
        this.saveTextName = 'Update';
        window.scroll({top:0, behavior:'smooth'})
    }

    onDeletedRecord(id) {
        const req = {
        id: id
      }
      this.loading = true;
        this.swalService.alert.delete((action)=>{
        if(action){
             this.apiHandlerServices.apiHandler('deleteVehicleMaster', 'post', {}, {},req)
            .subscribe(response => {
                if (response.Status === true && (response.statusCode == 200 || response.statusCode == 201)) {
                  this.loading = false;
                    this.swalService.alert.success('Transfer List has been deleted successfully')
                    this.getVehicleMasterList();
                } else {
                  this.swalService.alert.oops(response.Message)
                  this.loading = false;
                }
            },(err: HttpErrorResponse) => {
              this.loading = false;
            this.swalService.alert.error(err['error']['Message']);
            });
        }
      })
    }

    onCancel() {
        // this.enabledForm = false;
        this.vehicleImage = '';
        this.saveTextName = 'Save';
        this.addUpdateVehcleForm.reset();
    }

    upateVehicleMaster() {
        this.loading = true;
        const payLoad = { 
            ...this.addUpdateVehcleForm.value, 
            id: this.id,
            vehicle_type: Number(this.addUpdateVehcleForm.value.vehicle_type),
         }

            
        this.apiHandlerServices.apiHandler('updateVehicleMaster', 'POST', {}, {}, payLoad).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    
                    this.swalService.alert.success(res.Message);
                    // this.enabledForm = false;
                    this.vehicleImage = '';
                    this.imageFile = '';
                    this.getVehicleMasterList();
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message)
                }
            }, error: (err) => {
                this.loading = false;
                this.swalService.alert.error(err.Message)
            }
        })
    }

     onFileSelected(event: any) {
    const file: File = event.target.files[0];
    //  this.vehicleImage = file
     const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.vehicleImage = reader.result; // base64 URL
    };
    if (file) {
      console.log("File selected:", file.name, file.type);
      // Example validation
      const allowedTypes = [
        'image/jpeg',
        'image/png'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type!");
        event.target.value = ''; // reset input
      } else {
        this.imageFile = file;
       
      }

    }
  }
    uploadImage(id) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image',this.imageFile);
    this.loading = true;
    this.apiHandlerServices.apiHandler('addTransferImage','POST',{},{},formData).subscribe({
      next: (res) => {
        if (res.Status === true && res.statusCode === 201 || res.statusCode === 200) {
            this.loading = false;
            this.swalService.alert.success(res.Message)
        } else {
            this.loading = false;
            this.swalService.alert.oops(res.Message)
        }
      }, error: (err) => {
        this.loading = false;
        this.swalService.alert.error(err.error.Message)
      }
    })
  }
  onStatusChange(event: MatSlideToggleChange, id) {
    console.log(event.checked);
    this.id = id
    this.addUpdateVehcleForm.patchValue({
        status: event.checked
    })
    const req = {
        id: id,
        status: event.checked
    }
    this.apiHandlerServices.apiHandler('updateVehicleMasterStatus', 'POST', {}, {}, req).subscribe({
            next: (res) => {
                if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                    
                    this.swalService.alert.success("Status Updated Successfully");
                    // this.enabledForm = false;
                    this.getVehicleMasterList();
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.swalService.alert.oops(res.Message)
                }
            }, error: (err) => {
                this.loading = false;
                this.swalService.alert.error(err.Message)
            }
        })

  }

   getImage(img){
        return `${baseUrl + '/sa/transfer/getTransferImage/' + img}`;
      }
}