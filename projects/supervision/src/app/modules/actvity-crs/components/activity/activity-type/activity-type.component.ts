import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray:Array<any>=[];

@Component({
  selector: 'app-activity-type',
  templateUrl: './activity-type.component.html',
  styleUrls: ['./activity-type.component.scss']
})
export class ActivityTypeComponent implements OnInit {
  enabledForm:boolean=true;
  editForm:boolean=false;
  activityTypeDataList:any[]=[];
  displayColumn:string[]=['Sl. No.','Status','Activity Type', 'Action']
  subSunk=new SubSink();
  pageSize = 100;
  page = 1;
  collectionSize: number;  
  searchText:string='';
  activityTypeDataListForSort:any[]=[];
  searchSpin:boolean=true;

  public activityTypeForm: FormGroup;
  public activityTypeId: number;
  public saveTextTitle: string = 'Save';
  public loggedInUser: any;

  constructor( private fb:FormBuilder, private swalService:SwalService,private apiHandlerService:ApiHandlerService) { 
  }

  ngOnInit() {
    const currentDomainUser = localStorage.getItem('currentDomainUser');
      this.loggedInUser = JSON.parse(currentDomainUser);
     
    this.getActivityTypeData();
    this.createTypeForm();
  }

  createTypeForm() {
    this.activityTypeForm = this.fb.group({
        activity_type_name: ['', Validators.required],
        status:[false]
    })
  };

  onActivityTypeSave() {
    if (this.activityTypeId) {
      const req = {...this.activityTypeForm.value, id: this.activityTypeId, updated_by_id: this.loggedInUser['id']};
      this.apiHandlerService.apiHandler('updateActivityType','POST',{},{},req).subscribe({
          next: (res) => {
              console.log(res);
              if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200 )) {
                this.swalService.alert.success("Activity has been Updated successfully");
                this.getActivityTypeData();
              } else {
                this.swalService.alert.oops(res.Message);
              }
          },
          error: (err) => {
           console.log(err);
  const message = err.error.Message || err.message || 'Something went wrong';
  this.swalService.alert.oops(message);
          }
      })
    } else {
      if (!this.activityTypeForm.valid) return;
      this.activityTypeForm.value.status = false;
      const req = {...this.activityTypeForm.value, created_by_id: this.loggedInUser['id']};
      this.apiHandlerService.apiHandler('addActivityType','POST',{},{},req).subscribe({
          next: (res) => {
              console.log(res);
              if(res.Status === true && (res.statusCode === 201 || res.statusCode === 200 )) {
                this.swalService.alert.success("Activity has been added successfully");
                this.getActivityTypeData();
              } else {
                this.swalService.alert.oops(res.Message);
              }
          },
          error: (err) => {
     console.log(err);
  const message = err.error.Message || err.message || 'Something went wrong';
  this.swalService.alert.oops(message);
          }
      })
    }
    
  }

  onAddButtonClicked(){
    this.saveTextTitle = 'Save';
    this.activityTypeForm.reset();
    this.enabledForm=!this.enabledForm;
  }

  getActivityTypeData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('activityTypeList', 'post', {}, {},{})
      .subscribe(response => {
          if ((response.statusCode == 200 || response.statusCode == 201) && response.Status === true) {               
            this.activityTypeDataList = response.data || [];
            this.activityTypeDataListForSort=this.activityTypeDataList;
            this.collectionSize=this.activityTypeDataList.length;
            this.searchSpin=false;
            this.activityTypeId = 0;
            this.saveTextTitle = 'Save';
            this.activityTypeForm.reset();
             this.enabledForm = true;
          } else {
            this.activityTypeDataList = [];
          }
      },(err) => {
        this.activityTypeDataList = [];
      });
  }

onEditType(id) {
  this.activityTypeId = id;
  const activityTypeDataList = this.activityTypeDataList.filter(data => data.id === id);
  this.activityTypeForm.patchValue({
    activity_type_name: activityTypeDataList[0].activity_type_name,
    status: activityTypeDataList[0].status
  });
  this.enabledForm = true;
  this.saveTextTitle = 'Update';
}


  onDeletedRecord(inputRecordToDeleted:any){
    //api call to delete the record
    this.swalService.alert.delete((action)=>{
        if(action){
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteActivityType', 'post', {}, {},
            {"id":inputRecordToDeleted.id})
            .subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                this.swalService.alert.success("Deleted successfully");
                this.getActivityTypeData();
            }
            },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
            });
        }
    })
  }

  insertedRecordReceived(event){
    this.activityTypeDataList.unshift(event);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...this.activityTypeDataListForSort];
    if (!sort.active || sort.direction === '') {
        this.activityTypeDataList = data;
        return;
    }
    this.activityTypeDataList = data.sort((a, b) => {
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

  
  statusUpdateType(event: MatSlideToggleChange, id){
    const payLoad = {
      Status: event.checked,
      ActivityTypeId: id,
      updated_by_id: this.loggedInUser['id']
    }
    this.subSunk.sink = this.apiHandlerService.apiHandler('statusUpdateType', 'post', {}, {}, payLoad)
      .subscribe(response => {
          if ((response.statusCode === 200 || response.statusCode === 201) && response.Status === true) {               
            this.getActivityTypeData();
            this.swalService.alert.success("Status updated successfully");
          } else {
            this.swalService.alert.oops(response.Message)
          }
      },(err) => {
        this.swalService.alert.error(err.error.Message)
      });
  }

   showActionButtons(authId, loggedInId) {
        if(this.loggedInUser.auth_role_id === 3 || this.loggedInUser.auth_role_id === 1) {
            return true;
        }

        else if(this.loggedInUser.auth_role_id === 7) {
            if (this.loggedInUser['id'] === loggedInId) {
                return true;
            } else {
                return false;
            }
        }
    }
  
}
