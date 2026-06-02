import { Component, OnInit } from '@angular/core';
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { WellnessCrsService } from '../../../wellness-crs.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-meal-type-list',
  templateUrl: './meal-type-list.component.html',
  styleUrls: ['./meal-type-list.component.scss']
})
export class MealTypeListComponent implements OnInit {

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) { }

  public showFilters: boolean = false;
  public mealTypeList: any = [];
  public searchText = "";
  public filteredMealTypeList: any[] = [];

  ngOnInit() {
    this.getAllMealTypes();
  }

  getAllMealTypes() {
    const data = {
      topic: "mealPlanList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.mealTypeList = resp.data || [];
        this.filteredMealTypeList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.mealTypeList = [];
      }
    },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },);
  }

  filterMealTypes() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllMealTypes();
      return;
    }
    this.filteredMealTypeList = this.mealTypeList.filter((item) =>
      item.meals.toLowerCase().includes(search),
    );
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updateMealPlan";
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
        this.getAllMealTypes();
        this.swalService.alert.success("Meal type status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update meal type status.");
      }
    },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },);
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/meal-plan"], {
      queryParams: { tab: "add_meal-plan" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id.id }];
        data["topic"] = "deleteMealPlan";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Meal type has been deleted successfully`,
              );
              this.getAllMealTypes();
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
