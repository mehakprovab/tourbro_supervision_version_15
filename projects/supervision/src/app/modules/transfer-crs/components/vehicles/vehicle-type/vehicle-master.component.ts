import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray: Array<any> = [];
@Component({
    selector: 'app-vehicle-master',
    templateUrl: './vehicle-master.component.html',
    styleUrls: ['./vehicle-master.component.scss']
})

export class VehicleTypeComponent implements OnInit {
    enabledForm: boolean = true;
    editForm: boolean = false;
    vehicleMasterDataList: any[] = [];
    displayColumn: string[] = ['Sl. No.', 'Vehicle Type', 'Current State', 'Action']
    subSunk = new SubSink();
    pageSize = 20;
    page = 1;
    collectionSize: number;
    searchText: string = '';
    vehicleMasterDataListForSort: any[] = [];
    searchSpin: boolean = true;

    public vehicleMasterForm: FormGroup;
    public countryList: any;
    saveTextName: string = 'Save';
    public updateVehicle: boolean = false;
    vehicleId: number;
    submittedVehicle: boolean = false;
    loggedInUserId: any;

    public loadingTemplate: any
    public secondaryColour: any;
    public primaryColour: any;
    public loading: boolean = false;

    constructor(private fb: FormBuilder, private swalService: SwalService, private apiHandlerService: ApiHandlerService) {
    }

    ngOnInit() {
        const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
        this.loggedInUserId = JSON.parse(currentDomainUser)['id'];
        this.getVehicleMasterData();
        this.createTypeForm();
    }

    createTypeForm() {
        this.vehicleMasterForm = this.fb.group({
            name: ['', Validators.required],
            status: [false]
        })
    };

    onVehicleMasterSave() {
        
        if (this.updateVehicle && this.vehicleId) {
            this.loading = true;
            const req ={ ...this.vehicleMasterForm.value,id: this.vehicleId,status:true };
             this.apiHandlerService.apiHandler('vehicleMasterUpdate', 'POST', {}, {}, req).subscribe({
                next: (res) => {
                    console.log(res);
                    if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                        this.loading = false;
                        this.swalService.alert.success("Vehicle Type has been Updated successfully");
                        this.getVehicleMasterData();
                    } else {
                        this.swalService.alert.oops(res.Message);
                        this.loading = false;
                    }
                },
                error: (err) => {
                    this.swalService.alert.error(err.Message);
                    this.loading = false;
                    console.log(err);
                }
            })
        } else {
            this.loading = true;
            if (!this.vehicleMasterForm.value.status) {
                this.vehicleMasterForm.patchValue({
                    status: false
                })
            }
            const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
            const loggedInAuthUser = JSON.parse(currentDomainUser)['auth_role_id'];
            let created_by_id;
            if(loggedInAuthUser !== 7) {
                created_by_id = 1
            } else {
                created_by_id = JSON.parse(currentDomainUser)['id'];
            }
            const req = {...this.vehicleMasterForm.value, created_by_id: created_by_id,status:true  };
            this.apiHandlerService.apiHandler('addVehicleType', 'POST', {}, {}, req).subscribe({
                next: (res) => {
                    console.log(res);
                    if (res.Status === true && (res.statusCode === 201 || res.statusCode === 200)) {
                        this.swalService.alert.success("Vehicle Type has been Added successfully");
                        this.loading = false;
                        this.getVehicleMasterData();
                    } else {
                        this.swalService.alert.oops(res.Message);
                        this.loading = false;
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.loading = false;
                    this.swalService.alert.error(err.Message);
                }
            })
        }
        
    }

    onAddButtonClicked() {
        this.saveTextName = 'Save';
        this.updateVehicle = false;
        this.vehicleMasterForm.reset();
        this.enabledForm = !this.enabledForm;
    }

    getVehicleMasterData() {
        const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
        const loggedInAuthUser = JSON.parse(currentDomainUser)['auth_role_id'];
        let created_by_id;
        if(loggedInAuthUser !== 7) {
            created_by_id = 1
        } else {
            created_by_id = JSON.parse(currentDomainUser)['id'];
        }
        const payLoad = {
            created_by_id: (created_by_id)
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('vehicleMasterList', 'post', {}, {}, payLoad)
            .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                    this.vehicleMasterDataList = response.data || [];
                    this.vehicleMasterDataListForSort = this.vehicleMasterDataList;
                    this.collectionSize = this.vehicleMasterDataList.length;
                    this.vehicleMasterForm.reset();
                    this.editForm = false;
                    this.enabledForm = true;
                    this.searchSpin = false;
                }
            });
    }

    onDeletedRecord(inputRecordToDeleted: any) {
        //api call to delete the record
        this.loading = true;
        this.swalService.alert.delete((action) => {
            if (action) {
                this.subSunk.sink = this.apiHandlerService.apiHandler('vehicleMasterDelete', 'post', {}, {},
                    { "id": inputRecordToDeleted.id })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.loading = false;
                            this.swalService.alert.success("Vehicle has been deleted successfully");
                            this.getVehicleMasterData();
                        } else {
                             this.swalService.alert.oops(response.Message);
                            this.loading = false;
                        }
                    }, (err: HttpErrorResponse) => {
                        this.loading = false;
                        this.swalService.alert.error(err['error']['Message']);
                    });
            }
        })
    }

    insertedRecordReceived(event) {
        this.vehicleMasterDataList.unshift(event);
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.vehicleMasterDataListForSort];
        if (!sort.active || sort.direction === '') {
            this.vehicleMasterDataList = data;
            return;
        }
        this.vehicleMasterDataList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'Sl. No.': return this.compare(+a.id, +b.id, isAsc);
                case 'Tour Theme': return this.compare(a.tour_subtheme.toLowerCase(), b.tour_subtheme.toLowerCase(), isAsc);
                case 'Current State': return this.compare(a.status, b.status, isAsc);
                case 'State Change': return this.compare(a.status, b.status, isAsc);
                default: return 0;
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get f() {
        return this.vehicleMasterForm.controls;
    }

    onEditVehicleType(id) {
        this.vehicleId = id;
        const vehicleMasterDataList = this.vehicleMasterDataList.filter(data => data.id === id);
        this.enabledForm = true;
        this.saveTextName = 'Update';
        this.updateVehicle = true;
        this.vehicleMasterForm.patchValue({
            name: vehicleMasterDataList[0].name,
            status: vehicleMasterDataList[0].status
        })
    }
}