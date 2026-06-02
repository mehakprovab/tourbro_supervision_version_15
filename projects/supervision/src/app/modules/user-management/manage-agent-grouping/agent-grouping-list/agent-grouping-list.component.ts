import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { UserManagementService } from '../../user-management.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Sort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
const log = new Logger('manage-b2c-active/ManageListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-agent-grouping-list',
  templateUrl: './agent-grouping-list.component.html',
  styleUrls: ['./agent-grouping-list.component.scss']
})
export class AgentGroupingListComponent implements OnInit {

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
  userTypeList: Array<any> = [];
  showModal : boolean;
  showMailModal:boolean;
  mealList:any;
  viewList:any;
  showTransfer:any;
  regConfig:FormGroup;
  @Output() b2cUserUpdate = new EventEmitter<any>();
  supplierId:any;
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
      { key: 'first_name', value: 'Agent Name' },
      { key: 'status', value: 'Status' },
      { key: 'action', value: 'Action' },
  ];

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
          this.searchText="";
          this.listType = params['type'] == "active" ? 1 : 0;
          this.getUsersList(this.listType);
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

  createSubAgent() {
      this.router.navigate(['/administrator/createSubAgent'])
  }
  userProfile() {
      this.router.navigate(['/administrator/agencyUserDetails'])
  }

  getUsersList(type) {
      this.noData=true;
      this.respData=[];
      this.subSunk.sink = this.apiHandlerService.apiHandler('agentGroupList', 'post', {}, {},
          { "status": '1',})
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
      // if (type)
      let filename = this.listType == 1 ? "Active Agent Group List" : "Inactive Agent Group List";
      this.config.type = type;
      if (orientation) {
          this.config.options.jsPDF.orientation = orientation;
      }
      const date = new Date().toDateString();
      this.utility.downloadElementAsPdf(this.config.elementIdOrContent, filename, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
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

 

  onStatusChange(data) {
 
    console.log("data",data)
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateAgentGroup', 'post', {}, {},
          { "status": data.status == 1 ? "0" : "1", "id": data.id, "name": data.name })
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
              'Agent Group List',
              columnWidths
          );
      }
  }

  updatesupplier(data) {
    this.userMangementService.supplierUpdateData.next(data);
    this.b2cUserUpdate.emit({ tabId: 'add_update_b2bUser', data });
}

}
