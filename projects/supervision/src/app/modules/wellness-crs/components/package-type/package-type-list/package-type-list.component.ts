import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: 'app-package-type-list',
  templateUrl: './package-type-list.component.html',
  styleUrls: ['./package-type-list.component.scss']
})
export class PackageTypeListComponent implements OnInit {

  constructor(
     private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) { }
  
  public showFilters: boolean = false;
  public packageTypeList: any = [];
  public searchText = "";
  public filteredPackageTypeList: any[] = [];

  ngOnInit() {
    this.getAllPackageTypes();
  }

  getAllPackageTypes() {
    const data = {
      topic: "packageTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.packageTypeList = resp.data || [];
        this.filteredPackageTypeList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.packageTypeList = [];
      }
    });
  }

  filterPackageTypes() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllPackageTypes();
      return;
    }
    this.filteredPackageTypeList = this.packageTypeList.filter((item) =>
      item.name.toLowerCase().includes(search),
    );
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updatePackageType";
    data["0"] = {
      id: data1.id,
      name: data1.name,
      status: status,
    };
    this.wellnessCrsService.create(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.getAllPackageTypes();
        this.swalService.alert.success("Package type status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update package type status.");
      }
    });
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/package-type"], {
      queryParams: { tab: "add_package-type" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deletePackageType";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Package type has been deleted successfully`,
              );
              this.getAllPackageTypes();
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },
        );
      }
    });
  }
  
}
