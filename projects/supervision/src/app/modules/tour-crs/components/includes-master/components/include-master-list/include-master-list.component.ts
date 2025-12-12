import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { CmsService } from 'projects/supervision/src/app/modules/cms/cms.service';
import { environment } from 'projects/supervision/src/environments/environment';

import { SubSink } from 'subsink';
let respDataCopy: Array<any> = [];
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-include-master-list',
  templateUrl: './include-master-list.component.html',
  styleUrls: ['./include-master-list.component.scss']
})
export class IncludeMasterListComponent implements OnInit {

  @Output() staticContentTab = new EventEmitter<any>();
  private subSunk = new SubSink();
  noData: boolean = true;
  collectionSize: number = 100;
  respData: Array<any> = [];
  pageSize = 100;
  page = 1;
  displayColumn: { key: string, value: string }[] = [
      { key: 'id', value: 'S No.' },
      { key: 'pckg_includes', value: 'Package Includes' },
      { key: 'icon', value: 'Icon' },
      { key: 'status', value: 'Status' },
      { key: 'action', value: 'Action' },
  ];
constructor(private cmsService: CmsService,
  private utility: UtilityService,
  private swalService: SwalService,) { }

ngOnInit() {
  this.getContentList()
}

updateContent(data) {
  console.log("data",data)
  this.cmsService.StaticContent.next(data);
  this.staticContentTab.emit({ tabId: 'add_update_staticPage', data });
}
deleteContent(id) {
  this.swalService.alert.delete(willDelete => {
      if (willDelete) {
          this.confirmDelete(id);
      } 
  })
}
confirmDelete(id) {
  this.subSunk.sink = this.cmsService.deleteIncludeMaster({ "id": id })
      .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Record deleted successfully.");
              this.getContentList();
          }
          else {
              this.swalService.alert.oops();
          }
      }, (err: HttpErrorResponse) => {
          this.swalService.alert.oops(err.message);
      }
      );
}
getContentList() {
  let data = {
  }
  this.subSunk.sink = this.cmsService.getPackageIncludeList(data).subscribe(resp => {
      if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
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
    })
}
onStatusChange(data) {
  console.log(data);
  this.subSunk.sink = this.cmsService.updateIncludeMasterStatus(
      { "status": data.status == 1 ? 0 : 1, "id": data.id })
      .subscribe(resp => {
          console.log(resp);
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Content status changed successfully.");
              this.getContentList();
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
getImage(img) {
  return `${baseUrl+'/common/getImage/'+img}`;
}
}
