import { Component, OnInit } from "@angular/core";
import { WellnessCrsService } from "../../../wellness-crs.service";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: "app-facilities-list",
  templateUrl: "./facilities-list.component.html",
  styleUrls: ["./facilities-list.component.scss"],
})
export class FacilitiesListComponent implements OnInit {
  constructor(
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) {}

  public showFilters: boolean = false;
  public facilitiesList: any = [];
  public searchText = "";
  public filteredFacilitiesList: any[] = [];

  ngOnInit() {
    this.getAllFacilitiesList();
  }

  getAllFacilitiesList() {
    const data = {
      topic: "facilitiesList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.facilitiesList = resp.data || [];
        this.filteredFacilitiesList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.facilitiesList = [];
      }
    });
  }

  filterFacilities() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllFacilitiesList();
      return;
    }
    this.filteredFacilitiesList = this.facilitiesList.filter((item) =>
      item.name.toLowerCase().includes(search),
    );
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updateFacilities";
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
        this.getAllFacilitiesList();
        this.swalService.alert.success("Facility status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update facility status.");
      }
    });
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/facilities"], {
      queryParams: { tab: "add_facilities" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deleteFacilities";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Facility has been deleted successfully`,
              );
              this.getAllFacilitiesList();
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
