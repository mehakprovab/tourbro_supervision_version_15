import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserManagementService } from 'projects/supervision/src/app/modules/user-management/user-management.service';

const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-agent-new-listing',
  templateUrl: './agent-new-listing.component.html',
  styleUrls: ['./agent-new-listing.component.scss']
})
export class AgentNewListingComponent implements OnInit {

  @Output() staffUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  pageSize = 10;
  searchText: string="";
  page = 1;
  collectionSize: number = 40;
  noData: boolean = true;
  respData: Array<any> = [];
  listType: any;
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
  hotelTypeForm:FormGroup;
  userTypeList: Array<any> = [];
  respDataProperty:Array<any> = [];
  showModal : boolean;
  showConfirm:boolean=false;
  cancelData:any;
  reason:any;
  rejectedData:any
  underProcess:boolean = false;
    deleteUserData: any;
    registerCountries: any;
    errorMessage: any;
    registerStates: any;
    supplier_type:any;
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
      { key: 'first_name', value: 'Prime User' },
      { key: 'phone', value: 'Contact' },
      { key: 'email', value: 'Email' },
      { key: 'travel_agent_name', value: 'Travel Agent Name' },
      { key: 'country', value: 'Country' },
      { key: 'city', value: 'City' },
      { key: 'supplierCurrency', value: 'Agent Currency'},
      { key: 'status', value: 'Status' },
    
      { key: 'action', value: 'Action' },
  ];

  ngOnInit() {
      this.getTitleList();
      this.listCountries();
      this.listStates();
      this.createForm();
      this.activatedRoute.queryParams.subscribe(params => {
          this.searchText="";
          this.listType = params['type'] == "new-listing" ? 2 : 0;
          this.supplier_type = params['supplier_type'] == "DMC" ? 7 : GlobalConstants.B2B_AUTH_ROLE_ID;
          this.getUsersList( this.listType,this.supplier_type);
      });
      this.userMangementService.staffUpdateData.next({});
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
  createForm(): void {
    this.hotelTypeForm = this.fb.group({
        description:new FormControl(''),
    });
}
  createSubAgent() {
      this.router.navigate(['/administrator/createSubAgent'])
  }
  userProfile() {
      this.router.navigate(['/administrator/agencyUserDetails'])
  }

  getStateName(stateId: number): string | null {
    const state = this.registerStates.find(state => state.id == stateId);
    return state ? state.name : null;
  }

  getCountryName(CountryId: number): string | null {
    const country = this.registerCountries.find(country => country.id == CountryId);
    return country ? country.name : null;
  }

  getUsersList(data,supplier_type) {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
          { status: 2, "auth_role_id": supplier_type })
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

  getTitleById(id) {
      let title = this.userTypeList.find(val => val.id == id);
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
      let filename = "New Agent List";
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


  onStatusChange(user, event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const status = selectedValue === '2' ? 0 : Number(selectedValue);

    this.subSunk.sink = this.apiHandlerService.apiHandler(
        'updateUserStatus',
        'post',
        {},
        {},
        { status, reason: '', id: user.id }
    ).subscribe(
        (resp) => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.swalService.alert.success('User status changed successfully.');
                this.showConfirm = false;
                this.getUsersList(this.listType,this.supplier_type);
            } else {
                this.swalService.alert.oops();
            }
        },
        (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops();
            this.showConfirm = false;
        }
    );
}

  onRejectStatusChange() {
 
console.log("rejectedData",this.rejectedData)
    this.reason = this.hotelTypeForm.value.description
   
         this.subSunk.sink = this.apiHandlerService.apiHandler('updateSupplier', 'post', {}, {},
             { "accept": this.rejectedData.status == 3 ? true : false, reason:this.reason,"supplier_id": this.rejectedData.id })
             .subscribe(resp => {
                 if (resp.statusCode == 200 || resp.statusCode == 201) {
                     this.swalService.alert.success("User status changed successfully.");
                     this.showConfirm=false;
                     this.getUsersList(this.listType,this.supplier_type);
                 }
                 else {
                     this.swalService.alert.oops();
                 }
             }, (err: HttpErrorResponse) => {
                 console.error(err);
                 this.swalService.alert.oops();
                 this.showConfirm=false;
             }
             );
     }
  rejectSupplier(data,value) {
    console.log("data",value)
    if(value == 3 ){
    this.showConfirm = true;
    this.rejectedData = data;
    // this.underProcess = true;
    }else{
        this.showConfirm = false; 
        //  this.onStatusChange(data)
    }
    
}
// cancelBooking() {
//   let hotelData=this.cancelData;
//   console.log("hotelData",hotelData,)
//   let reqBody = {
//       "AppReference": hotelData.BookingDetails.AppReference,
//       "booking_source": hotelData.BookingDetails.booking_source
//   }
//   this.subSunk.sink = this.apiHandlerService.apiHandler('cancelHotelBooking', 'post', '', '', reqBody).subscribe(res => {
//       if (res) {
//         this.swalService.alert.success("Ticket cancelled sucessfully");
//           this.showConfirm=false;
//           this.getB2bHotelReport()
//       }
//   }, err => {
//       if (err.status == 400)
//         this.swalService.alert.oops(err.error.Message);
//           this.showConfirm=false;
//   });
// }
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
              'New Agent List',
              columnWidths
          );
      }
  }
  showPropertyProfile(id:any){
    this.showModal = true;
    this.getPropertyList(id)
}
getPropertyList(user) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('viewUser', 'post', {}, {},
        { "id":user.id, "auth_role_id": this.supplier_type})
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                this.respDataProperty = resp.data || [];
            }
            else {
                this.respDataProperty=[];
            }
        }, (err) => {
            this.respDataProperty=[];
        });
}
hide()
{
  this.showConfirm = false;
  this.showModal = false;
}

cancelDeletePopup(data) {
    this.showConfirm = true;
    this.deleteUserData = data;
}

listCountries() {
    this.apiHandlerService.apiHandler('registerCountry', 'POST', '', '', {})
      .subscribe(res => {
        if (res.data) {
          this.registerCountries = res.data;
        } else {
          this.errorMessage = res.data.msg;
        }
      });
  }
  listStates() {
    this.apiHandlerService.apiHandler('registerState', 'POST', '', '', {})
      .subscribe(res => {
        if (res.data) {
          this.registerStates = res.data;
        } else {
          this.errorMessage = res.data.msg;
        }
      });
  }

mailVerification(user){
    this.subSunk.sink = this.apiHandlerService.apiHandler('sendVerfication', 'post', {}, {},
    {"user_id": user.id })
    .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success("Verification mail sent successfully.");
            this.getUsersList(this.listType,this.supplier_type);
        }
        else {
            this.swalService.alert.oops();
        }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.oops();
    }
    );
}

deleteUser(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('deleteUser', 'post', {}, {},
    {"id": this.deleteUserData.id })
    .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.showConfirm=false;
            this.swalService.alert.success("User deleted successfully.");
            this.getUsersList(this.listType,this.supplier_type);
        }
        else {
            this.swalService.alert.oops();
        }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.oops();
    }
    );
}


}
