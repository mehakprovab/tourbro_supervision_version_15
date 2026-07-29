import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { UserManagementService } from '../../../user-management.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-supplier-new-listing',
  templateUrl: './supplier-new-listing.component.html',
  styleUrls: ['./supplier-new-listing.component.scss']
})
export class SupplierNewListingComponent implements OnInit {

  @Output() staffUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  pageSize = 10;
  searchText: string="";
  page = 1;
  collectionSize: number = 40;
  noData: boolean = true;
  respData: Array<any> = [];
  listType: any;
  config: any = {
      type: 'pdf',
      elementIdOrContent: 'active-users-report',
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
  selectedSupplier: any;
  showSupplierDetails = false;
  showConfirm:boolean=false;
  cancelData:any;
  reason:any;
  rejectedData:any
  underProcess:boolean = false;
  supplier_Type:any;
  constructor(
      private router: Router,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private utility: UtilityService,
      private activatedRoute: ActivatedRoute,
      private userMangementService: UserManagementService,
      private fb: FormBuilder,
  ) { }

  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'Sl No.' },
      { key: 'first_name', value: 'Name' },
      { key: 'phone', value: 'Contact' },
      { key: 'email', value: 'Email' },
      { key: 'status', value: 'Status' },
    
      { key: 'action', value: 'Action' },
  ];

  ngOnInit() {
      this.getTitleList();
      this.createForm();
      this.activatedRoute.queryParams.subscribe(params => {
          this.searchText="";
          this.listType = params['type'] == "new-listing" ? 2 : 0;
          this.supplier_Type = params['supplier_type'] == "B2C" ? "B2C" : "B2B";
          this.getUsersList( this.listType);
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

  viewSupplierDetails(supplier: any) {
      this.selectedSupplier = supplier;
      this.showSupplierDetails = true;
  }

  closeSupplierDetails() {
      this.showSupplierDetails = false;
      this.selectedSupplier = null;
  }

  getSupplierRows(resp: any): Array<any> {
      if (Array.isArray(resp?.data)) {
          return resp.data;
      }
      if (Array.isArray(resp?.data?.data)) {
          return resp.data.data;
      }
      if (Array.isArray(resp?.data?.data?.data)) {
          return resp.data.data.data;
      }
      return [];
  }

  private getExportFileName(): string {
      if (this.listType === 1) {
          return 'Active Supplier List';
      }
      if (this.listType === 2) {
          return 'New Supplier List';
      }
      return 'Inactive Supplier List';
  }

  private getExportStatusLabel(response: any): string {
      if (response?.status === 1 || response?.status === true) {
          return 'Active';
      }
      if (response?.status === 2) {
          return 'Under Verification';
      }
      return 'Inactive';
  }

  private buildExportRows(): any[] {
      return this.respData.map((response: any, index: number) => ({
          'Sl No.': index + 1,
          'ID': response.uuid || response.supplier_id || response.id,
          'Name': `${response.first_name || ''} ${response.last_name || ''}`.trim(),
          'Contact': response.phone_number || response.phone || '',
          'Email': response.email || '',
          'City': response.city || '',
          'State': response.state || '',
          'Country': response.country || '',
          'Activated On': response.activated_at || response.activted || '',
          'Status': this.getExportStatusLabel(response),
          'Action': 'Available'
      }));
  }

  private buildExportTableHtml(rows: any[]): string {
      const headers = Object.keys(rows[0] || {});
      const rowsHtml = rows.map((row: any) => {
          return `<tr>${headers.map((header: string) => `<td style="border:1px solid #ddd; padding:6px;">${row[header] ?? ''}</td>`).join('')}</tr>`;
      }).join('');

      return `
          <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif;">
              <thead>
                  <tr>
                      ${headers.map((header: string) => `<th style="border:1px solid #ddd; padding:6px; text-align:left; background:#f5f5f5;">${header}</th>`).join('')}
                  </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
          </table>
      `;
  }

  private downloadExportPdf(fileName: string, orientation?: string): void {
      const exportRows = this.buildExportRows();
      if (!exportRows.length) {
          this.swalService.alert.oops();
          return;
      }

      const exportContainer = document.createElement('div');
      exportContainer.id = 'supplier-export-table';
      exportContainer.style.position = 'fixed';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '100%';
      exportContainer.style.background = '#ffffff';
      exportContainer.style.padding = '16px';
      exportContainer.innerHTML = this.buildExportTableHtml(exportRows);
      document.body.appendChild(exportContainer);

      this.utility.downloadElementAsPdf('supplier-export-table', fileName, orientation || 'landscape');
      exportContainer.remove();
  }

  getUsersList(data) {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('supplierList', 'post', {}, {},
          { status: 2,supplier_type :this.supplier_Type, "supplier_id": GlobalConstants.SUPPLIER_AUTH_ROLE_ID })
          .subscribe(resp => {
              const suppliers = this.getSupplierRows(resp);
              if ((resp.statusCode == 200 || resp.statusCode == 201) && suppliers.length > 0) {
                  this.noData = false;
                  this.respData = suppliers;
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
  download(type: any, orientation?: string) {
      const filename = this.getExportFileName();
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      this.downloadExportPdf(filename, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
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


  onStatusChange(user: any, event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    // Convert status values correctly
    let status: boolean | number;
    if (selectedValue === '1') {
        status = true; // Active
    } else if (selectedValue === '0') {
        status = false; // Inactive
    } else {
        status = 0; // Under Verification (default to Inactive)
    }

    this.subSunk.sink = this.apiHandlerService.apiHandler('updateSupplier', 'post', {}, {},
        { "accept": status === true, "supplier_id": user.supplier_id || user.id }) // Sends `true` for active, `false` for inactive
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("User status changed successfully.");
                this.showConfirm = false;
                this.getUsersList(this.listType);
            } else {
                this.swalService.alert.oops();
            }
        }, (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops();
            this.showConfirm = false;
        });
}

//   onRejectStatusChange() {
 
// console.log("rejectedData",this.rejectedData)
//     this.reason = this.hotelTypeForm.value.description
   
//          this.subSunk.sink = this.apiHandlerService.apiHandler('updateSupplier', 'post', {}, {},
//              { "accept": this.rejectedData.status == 3 ? true : false, reason:this.reason,"supplier_id": this.rejectedData.id })
//              .subscribe(resp => {
//                  if (resp.statusCode == 200 || resp.statusCode == 201) {
//                      this.swalService.alert.success("User status changed successfully.");
//                      this.showConfirm=false;
//                      this.getUsersList(this.listType);
//                  }
//                  else {
//                      this.swalService.alert.oops();
//                  }
//              }, (err: HttpErrorResponse) => {
//                  console.error(err);
//                  this.swalService.alert.oops();
//                  this.showConfirm=false;
//              }
//              );
//      }
//   rejectSupplier(data,value) {
//     console.log("data",value)
//     if(value == 3 ){
//     this.showConfirm = true;
//     this.rejectedData = data;
//     // this.underProcess = true;
//     }else{
//         this.showConfirm = false; 
//          this.onStatusChange(data)
//     }
    
// }
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
      const fileToExport = this.buildExportRows();
      const columnWidths = [
          { wch: 5 },
          { wch: 15 },
          { wch: 25 },
          { wch: 20 },
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 20 },
          { wch: 12 },
          { wch: 10 },
      ];

      this.utility.exportToExcel(
          fileToExport,
          this.getExportFileName(),
          columnWidths
      );
  }
  showPropertyProfile(id:any){
    this.showModal = true;
    // this.currentRecord = data;
    // this.paxDetails = data.Passengers
    this.getPropertyList(id)
}
getPropertyList(user) {
    this.subSunk.sink = this.apiHandlerService.apiHandler('findProperties', 'post', {}, {},
        {  "status": user.status == 1 ? true : false,"supplier_id": user.supplier_id || user.id, "auth_role_id":6})
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
}
