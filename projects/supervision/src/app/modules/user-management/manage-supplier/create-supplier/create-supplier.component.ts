import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../user-management.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent implements OnInit {
  regConfig:FormGroup;
  userTitleList: Array<any> = [];
  private subSunk = new SubSink();
  @Output() b2cUserUpdate = new EventEmitter<any>();
  @Input() propertyId;
  addOrUpdate: string = '';
    countriesList: any;
  constructor( private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService
  ) { }

  ngOnInit() {
    this.creatForm();
    this.getTitleList();
    this.getCountriesList();
    this.getToUpdate();
  }
  creatForm(){
  this.regConfig = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    job_title: ['', Validators.required],
    phone_number: ['', [Validators.required, Validators.minLength(8)]],
    alternate_phone_number:['', [ Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    alternate_email:['', [ Validators.email]],
    supplier_type:['', [ Validators.required]]
  })

}

getCountriesList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
        this.countriesList = res.data.popular_countries.concat(res.data.countries);
    });
}

getTitleList() {
  this.subSunk.sink = this.userManagementService.fetchTitleList()
      .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              const data = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
              this.userTitleList = data.filter((item: any) => item.pax_type === 'ADULT');
          } else {
              this.swalService.alert.oops();
          }
      }, (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
      })
}
omitSpecialCharacters(event) {
  return this.utility.omitSpecialCharacters(event);
}
numberOnly(event): boolean {
  return this.utility.numberOnly(event);
}
getToUpdate() {
  this.subSunk.sink = this.userManagementService.supplierUpdateData.subscribe(data => {
    console.log("data",data)
      if (!this.utility.isEmpty(data)) {
          this.addOrUpdate = 'update';
          this.regConfig.patchValue({
              id: data.id ? data.id : '',
              title: data.title ? data.title : '',
              first_name: data.first_name ? data.first_name : '',
              last_name: data.last_name ? data.last_name : '',
              email: data.email ? data.email : '',
              city: data.city ? data.city : '',
              state: data.state ? data.state : '',
              country: data.country ? data.country : '',
              phone_number: data.phone_number ? data.phone_number : '',
              job_title:data.job_title ? data.job_title : '',
              alternate_phone_number:data.alternate_phone_number ? data.alternate_phone_number : '',
              alternate_email:data.alternate_email ? data.alternate_email : '',

          }, { emitEvent: false })

      } else {
          this.addOrUpdate = 'add';
      }

   
  })
}
onSubmit() {
  if (this.regConfig.invalid) {
      return;
  }

  let req = JSON.parse(JSON.stringify(this.regConfig.value));
  req.property_id = this.propertyId;
  switch (this.addOrUpdate) {
      case 'add':
          delete req.id;
          delete req.confirm_password;
          this.subSunk.sink = this.userManagementService.addSupplier(req)
              .subscribe(resp => {
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.swalService.alert.success("User added successfully.");
                      this.regConfig.reset();
                      this.b2cUserUpdate.emit({ tabId: 'supplier_list' });
                  } else {
                      this.swalService.alert.oops("Unable to add user.");
                  }
              }, (err: HttpErrorResponse) => {
                  this.swalService.alert.oops(err.error.Message);
              })
          break;
      case 'update':
          this.subSunk.sink = this.userManagementService.updateSupplier(req)
              .subscribe(resp => {
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.swalService.alert.success("User updated successfully.");
                      this.regConfig.reset();
                      this.b2cUserUpdate.emit({ tabId: 'supplier_list' });
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
// onSubmit(user) {
//     this.subSunk.sink = this.apiHandlerService.apiHandler('updateSupplierList', 'post', {}, {},
//         {  user})
//         .subscribe(resp => {
//             if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
//                 this.respDataProperty = resp.data || [];
//             }
//             else {
//                 this.respDataProperty=[];
//             }
//         }, (err) => {
//             this.respDataProperty=[];
//         });
// }
}
