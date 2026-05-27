import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { UserManagementService } from '../../user-management.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  @Output() staffUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  pageSize = 10;
  searchText: string="";
  page = 1;
  user:any;
  collectionSize: number = 40;
  sendMail:FormGroup;
  noData: boolean = true;
  respData: Array<any> = [];
  respDataProperty:Array<any> = [];
  listType: number;
  supplier_Type:any;
  config: ExportAsConfig = {
      type: 'pdf',
      elementId: 'active-users-report',
      options: {
          jsPDF: {
              orientation: 'landscape'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
      }

  };
  userTypeList: Array<any> = [];
  showModal : boolean;
  showMailModal:boolean;
  mealList:any;
  viewList:any;
  showTransfer:any;
  regConfig:FormGroup;
  @Output() b2cUserUpdate = new EventEmitter<any>();
  supplierId:any;
  propertyId:number;
    countriesList: any;
    registerStates: any;
  constructor(
      private router: Router,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private utility: UtilityService,
      private activatedRoute: ActivatedRoute,
      private exportAsService: ExportAsService,
      private userMangementService: UserManagementService,
      private fb: FormBuilder,
  ) { }

  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'first_name', value: 'Name' },
      { key: 'phone', value: 'Contact' },
      { key: 'email', value: 'Email' },
      { key: 'city', value: 'City' },
      { key: 'state', value: 'State' },
      { key: 'country', value: 'Country' },
      { key: 'activted', value: 'Activated On' },
      { key: 'status', value: 'Status' },
    
      { key: 'action', value: 'Action' },
  ];

  ngOnInit() {
    this.createForm();
    this.getCountriesList();
      this.getTitleList();
      this.listStates();
      this.activatedRoute.queryParams.subscribe(params => {
          this.searchText="";
          this.listType = params['type'] == "active" ? 1 : 0;
          this.supplier_Type = params['supplier_type'] == "B2C" ? "B2C" : "B2B";
          this.getUsersList(this.listType);
      });
      this.userMangementService.staffUpdateData.next({});
     
  }
  createForm(){
    this.regConfig = this.fb.group({
        property_id:new FormControl(''),
    })
    this.sendMail = this.fb.group({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });
  }

  findUserLogin(loginTime, logoutTime) {
      if (loginTime && logoutTime) {
          let d1 = new Date(loginTime * 1000);
          let d2 = new Date(logoutTime * 1000);
          if (d1.getTime() > d2.getTime())
              return true;
          else
              return false;
      } else {
          return false;
      }
  }

  hoverData;
  onHover(data) {
      this.hoverData = data.last_login;
  }

  createSubAgent() {
      this.router.navigate(['/administrator/createSubAgent'])
  }
  userProfile() {
      this.router.navigate(['/administrator/agencyUserDetails'])
  }

  getUsersList(type) {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('supplierList', 'post', {}, {},
          { "status": 1,supplier_type :this.supplier_Type,"supplier_id": GlobalConstants.SUPPLIER_AUTH_ROLE_ID })
          .subscribe(resp => {
              if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                  this.noData = false;
                  this.respData = resp.data || [];
                  respDataCopy = [...this.respData];
                  this.collectionSize = respDataCopy.length;
              }
              else {
                  this.noData = false;
                  this.respData=[];
              }
          }, (err) => {
              this.noData = false;
              this.respData=[];
          });
  }

  getTitleList() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {}, {})
          .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.userTypeList = resp.data;

              } else {
                  console.log(`An error has occured`);
              }
          }, (err: HttpErrorResponse) => {
              console.error(err);
              this.swalService.alert.oops();
          });
  }

    
  getCountriesList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
        this.countriesList = res.data.popular_countries.concat(res.data.countries);
    });
}

getCountryName(countryId: number): string | null {
    const country = this.countriesList.find(c => c.id == countryId);
    return country ? country.name : null;
  }

  getStateName(stateId: number): string | null {
    const state = this.registerStates.find(state => state.id == stateId);
    return state ? state.name : null;
  }

  listStates() {
    this.apiHandlerService.apiHandler('registerState', 'POST', '', '', {})
      .subscribe(res => {
        if (res.data) {
          this.registerStates = res.data;
        } else {
            this.registerStates = [];
        }
      });
  }

  getTitleById(id) {
    console.log("id",id)
    console.log("this.userTypeList",this.userTypeList)
      let title = this.userTypeList.find(val => val.id == id);
      console.log("title",title)
      return title['title'] ? title['title'] : '';
  }

  sortData(sort: Sort) {
      const data = filterArray.length ? filterArray : [...respDataCopy];
      if (!sort.active || sort.direction === '') {
          this.respData = data;
          return;
      }
      this.respData = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
              case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
              case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
              case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
              case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);

              default: return 0;
          }
      });
  }
  download(type: SupportedExtensions, orientation?: string) {
      // if (type)
      let filename = this.listType == 1 ? "Active Supplier List" : "Inactive Supplier List";
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      const date = new Date().toDateString();
      this.exportAsService.save(this.config, filename).subscribe((_) => {
          // save started
          this.swalService.alert.success();
      }, (err) => {
          this.swalService.alert.oops();

      });
  }

  pdfCallbackFn(pdf: any) {
      // example to add page number as footer to every page of pdf
      const noOfPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= noOfPages; i++) {
          pdf.setPage(i);
          pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
      }
  }

  ngOnDestroy(): void {
      this.subSunk.unsubscribe();
  }

  updateUser(data) {
      this.userMangementService.staffUpdateData.next(data);
      this.staffUpdate.emit({ tabId: 'add_update_staff', data });
  }

  updatePrivileges(data) {
      this.router.navigate(['/user/privileges'],{ queryParams: data})
  }

  onStatusChange(data) {
 
console.log("data",data)
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateSupplier', 'post', {}, {},
          { "accept": data.status == 1 ? false : true, "supplier_id": data.id })
          .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.swalService.alert.success("User status changed successfully.");
                  this.getUsersList(this.listType);
              }
              else {
                  this.swalService.alert.oops();
              }
          }, (err: HttpErrorResponse) => {
              console.error(err);
              this.swalService.alert.oops();
          }
          );
  }

  exportExcel(): void {
      {
          const fileToExport = this.respData.map((response: any,index:number) => {
              return {
                  "Sl No.":index+1,
                  "ID": response.uuid,
                  "Name": response['first_name'] + '' +response['last_name'],
                  "Contact": response['phone'],
                  "Email": response.email,
                  "Status": response.status==0 ?'Inactive':'Active'
              }
          });
          const columnWidths = [
              { wch: 5 },
              { wch: 20 },
              { wch: 20 },
              { wch: 30 },
              { wch: 30 },
              { wch: 10 },
          ];

          this.utility.exportToExcel(
              fileToExport,
              'Supplier List',
              columnWidths
          );
      }
  }
  showPropertyProfile(id:any){
    this.showModal = true;
    // this.currentRecord = data;
    // this.paxDetails = data.Passengers
    this.getPropertyList(id)
}
getPropertyList(user) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('findProperties', 'post', {}, {},
        {  "status": user.status == 1 ? true : false,"supplier_id":user.id})
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                 this.noData =false;
                this.respDataProperty = resp.data || [];
            }
            else {
                this.noData =false;
                this.respDataProperty=[];
            }
        }, (err) => {
            this.noData =false;
            this.respDataProperty=[];
        });
}

hide()
{
  this.showModal = false;
}
onTransferProperty(user:any){
    this.supplierId = user.id;
    this.showTransfer = true;
    this.getPropertyList(user)
    // this.getUsersList(this.listType)

}
goToNewUser(propertyData : any){
    console.log("propertyData",propertyData)
     this.propertyId = propertyData.id;
    this.b2cUserUpdate.emit({ tabId: 'add_update_b2bUser',propertyId: this.propertyId});
}
existingSupplier(property){

}
onSearchSubmit(user:any){
    console.log("user",user)
    console.log("bbbb", this.regConfig.value)
    this.subSunk.sink = this.apiHandlerService.apiHandler('transferProperty', 'post', {}, {},
        {  "property_id": this.regConfig.value.property_id,"supplier_id":this.supplierId})
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                // this.property = resp.data || [];
                this.showTransfer = true;
            }
            else {
                this.respDataProperty=[];
            }
        }, (err) => {
            this.respDataProperty=[];
        });
}
updatesupplier(data) {
    this.userMangementService.supplierUpdateData.next(data);
    this.b2cUserUpdate.emit({ tabId: 'add_update_b2bUser', data });
}
// updatesupplier(user) {
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
onSubmitMail(data){
              this.showMailModal = true;
              this.subSunk.sink = this.apiHandlerService.apiHandler('mailCredentials', 'post', {}, {},
                  { "supplier_id": data.id,'email':data.email })
                  .subscribe(resp => {
                      if (resp.statusCode == 200 || resp.statusCode == 201) {
                          this.swalService.alert.success("Credentials has been sent successfully.");
                          this.getUsersList(this.listType);
                      }
                      else {
                          this.swalService.alert.oops();
                      }
                  }, (err: HttpErrorResponse) => {
                      console.error(err);
                      this.swalService.alert.oops();
                  }
                  );
          }

hideMail()
{
  this.showMailModal = false;
}
hideSupplier()
{
  this.showTransfer = false;
}
}
