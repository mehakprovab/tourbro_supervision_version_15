import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-therapy-list',
  templateUrl: './therapy-list.component.html',
  styleUrls: ['./therapy-list.component.scss']
})
export class TherapyListComponent implements OnInit {

  constructor(
     private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) { }
  
  public showFilters: boolean = false;
  public therapyList: any = [];
  public searchText = "";
  public filteredTherapyList: any[] = [];

  ngOnInit() {
    this.getAllTherapies();
  }

  getAllTherapies() {
    const data = {
      topic: "therapyTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.therapyList = resp.data || [];
        this.filteredTherapyList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.therapyList = [];
      }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }

  filterTherapies() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllTherapies();
      return;
    }
    this.filteredTherapyList = this.therapyList.filter((item) =>
      item.therapy_name.toLowerCase().includes(search),
    );
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updateTherapyType";
    data["0"] = {
      id: data1.id,
      therapy_name: data1.therapy_name,
      status: status,
    };
    this.wellnessCrsService.create(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.getAllTherapies();
        this.swalService.alert.success("Therapy type status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update therapy type status.");
      }
    }, (err: HttpErrorResponse) => {
        this.swalService.alert.error(err['error']['Message']);
      });
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/therapy-type"], {
      queryParams: { tab: "add_therapy" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deleteTherapyType";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Therapy type has been deleted successfully`,
              );
              this.getAllTherapies();
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
