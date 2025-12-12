import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { UserManagementService } from '../../user-management.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-create-agent-grouping',
  templateUrl: './create-agent-grouping.component.html',
  styleUrls: ['./create-agent-grouping.component.scss']
})
export class CreateAgentGroupingComponent implements OnInit {
  regConfig:FormGroup;
  private subSunk = new SubSink();
  @Output() b2cUserUpdate = new EventEmitter<any>();
  addOrUpdate: string = '';
  constructor(private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private utility: UtilityService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    this.creatForm();
    this.getToUpdate();
  }
  creatForm(){
    this.regConfig = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    })
  
  }
  onSubmit() {
    if (this.regConfig.invalid) {
        return;
    }
    let req = JSON.parse(JSON.stringify(this.regConfig.value));
    switch (this.addOrUpdate) {
        case 'add':
            delete req.id;
            delete req.confirm_password;
            this.subSunk.sink = this.userManagementService.addAgent(req)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("User added successfully.");
                        this.regConfig.reset();
                        this.b2cUserUpdate.emit({ tabId: 'supplier_list' });
                    } else {
                        this.swalService.alert.oops("Unable to add user.");
                    }
                }, (err: HttpErrorResponse) => {
                    const errorMsg = err.error.Message;
                    const formatMessage = errorMsg.replace(/[0-9]/g, '');
                    this.swalService.alert.oops(formatMessage);
                })
            break;
        case 'update':
            this.subSunk.sink = this.userManagementService.updateUsers(req)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("User updated successfully.");
                        this.regConfig.reset();
                        this.b2cUserUpdate.emit({ tabId: 'b2cUsers_list' });
                    } else {
                        this.swalService.alert.oops("Unable to update user.");
                    }
                }, (err: HttpErrorResponse) => {
                    this.swalService.alert.oops(err.error.Message);
                })
            break;
        default:
            break;
    }
  
  }
  omitSpecialCharacters(event) {
    return this.utility.omitSpecialCharacters(event);
  }
  getToUpdate() {
    this.subSunk.sink = this.userManagementService.supplierUpdateData.subscribe(data => {
      console.log("data",data)
        if (!this.utility.isEmpty(data)) {
            this.addOrUpdate = 'update';
            this.regConfig.patchValue({
                id: data.id ? data.id : '',
                first_name: data.first_name ? data.name : '',

  
            }, { emitEvent: false })
  
        } else {
            this.addOrUpdate = 'add';
        }
  
     
    })
  }
}
