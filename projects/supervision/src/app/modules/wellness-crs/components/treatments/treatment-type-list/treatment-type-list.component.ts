import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-treatment-type-list',
  templateUrl: './treatment-type-list.component.html',
  styleUrls: ['./treatment-type-list.component.scss']
})
export class TreatmentTypeListComponent implements OnInit {

  constructor(
     private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) { }
  
  public showFilters: boolean = false;
  public treatmentTypeList: any = [];
  public searchText = "";
  public filteredTreatmentTypeList: any[] = [];

  ngOnInit() {
    this.getAllTreatmentTypes();
  }

  getAllTreatmentTypes() {
    const data = {
      topic: "treatmentList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.treatmentTypeList = resp.data || [];
        this.filteredTreatmentTypeList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.treatmentTypeList = [];
      }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  filterTreatmentTypes() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllTreatmentTypes();
      return;
    }
    this.filteredTreatmentTypeList = this.treatmentTypeList.filter((item) =>
      item.treatment_name.toLowerCase().includes(search) ||
      item.therapy_name.toLowerCase().includes(search)
    );
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updateTreatment";
    data["0"] = {
      id: data1.id,
      therapy_name: data1.therapy_name,
      treatment_name: data1.treatment_name,
      status: status,
    };
    this.wellnessCrsService.create(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.getAllTreatmentTypes();
        this.swalService.alert.success("Treatment type status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update treatment type status.");
      }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/treatments"], {
      queryParams: { tab: "add_treatments" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deleteTreatment";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Treatment type has been deleted successfully`,
              );
              this.getAllTreatmentTypes();
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
