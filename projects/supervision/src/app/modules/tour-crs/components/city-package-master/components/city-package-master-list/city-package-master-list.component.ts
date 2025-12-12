import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from 'projects/supervision/src/app/modules/cms/cms.service';
import { SubSink } from 'subsink';

let respDataCopy: Array<any> = [];
const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-city-package-master-list',
  templateUrl: './city-package-master-list.component.html',
  styleUrls: ['./city-package-master-list.component.scss']
})
export class CityPackageMasterListComponent implements OnInit {

  @Output() staticContentTab = new EventEmitter<any>();
  private subSunk = new SubSink();
  noData: boolean = true;
  collectionSize: number = 100;
  respData: Array<any> = [];
  pageSize = 100;
  page = 1;
  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'S No.' },
    { key: 'city_name', value: 'City Name' },
    { key: 'description', value: 'Description' },
    { key: 'package_includes', value: 'Package Includes' },
    { key: 'icon', value: 'Banner Image' },
    { key: 'status', value: 'Status' },
    { key: 'action', value: 'Action' },
  ];
  packageList: any;
  constructor(private cmsService: CmsService,
    private utility: UtilityService,
    private swalService: SwalService,) { }

  ngOnInit() {
    this.getContentList()
  }

  updateContent(data) {
    console.log("data", data)
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
    this.subSunk.sink = this.cmsService.deletePackageMaster({ "id": id })
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
    let data = {};
    this.subSunk.sink = this.cmsService.getPackageMasterList(data).subscribe(resp => {
      if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
        this.noData = false;
        this.respData = resp.data.map(item => {
          return {
            ...item,
            package_includes: JSON.parse(item.package_includes)
          };
        });
      } else {
        this.noData = false;
        this.respData = [];
      }
    }, (err) => {
      this.noData = false;
      this.respData = [];
    });
  }



  onStatusChange(data) {
    console.log(data);
    this.subSunk.sink = this.cmsService.updatePackageMasterStatus(
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
    return `${baseUrl + '/sa/common/getImage/' + img}`;
  }
}
