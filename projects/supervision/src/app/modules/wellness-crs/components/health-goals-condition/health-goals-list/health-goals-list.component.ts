import { Component, OnInit } from '@angular/core';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-health-goals-list',
  templateUrl: './health-goals-list.component.html',
  styleUrls: ['./health-goals-list.component.scss']
})
export class HealthGoalsListComponent implements OnInit {

  constructor(
     private wellnessCrsService: WellnessCrsService,
    private swalService: SwalService,
    private router: Router,
  ) { }

    public showFilters: boolean = false;
  public healthGoalsList: any = [];
  public searchText = "";
  public filteredHealthGoalsList: any[] = [];
  public imageBaseUrl = 'http://tourbro.com/dev/node/dist/apps/supervision/';

   ngOnInit() {
    this.getAllHealthGoals();
  }

  getAllHealthGoals() {
    const data = {
      topic: "healthGoalConditionList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.healthGoalsList = resp.data || [];
        this.filteredHealthGoalsList = resp.data || [];
      } else if (resp.statusCode === 404) {
        this.healthGoalsList = [];
      }
    });
  }

  filterHealthGoals() {
    const search = this.searchText.toLowerCase().trim();
    if(!search) {
      this.getAllHealthGoals();
      return;
    }
    this.filteredHealthGoalsList = this.healthGoalsList.filter((item) =>
      item.name.toLowerCase().includes(search) ||
      (item.description || '').toLowerCase().includes(search),
    );
  }

  getHealthGoalImageUrl(item: any) {
    const imageUrl = item && (item.image_url || item.image);

    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    return `${this.imageBaseUrl}${imageUrl.replace(/^\/+/, '')}`;
  }

  onStatusChange(event: any, data1: any) {
    const status = event.target.checked;
    const data = {};
    data["topic"] = "updateHealthGoalCondition";
    data["0"] = {
      id: data1.id,
      name: data1.name,
      description: data1.description,
      status: status,
    };
    this.wellnessCrsService.create(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.getAllHealthGoals();
        this.swalService.alert.success("Health goal status updated successfully.");
      } else {
        this.swalService.alert.error("Failed to update health goal status.");
      }
    });
  }
  onUpdate(data: any) {
    // Handle update logic here
    this.router.navigate(["/wellnesscrs/health-goals-condition"], {
      queryParams: { tab: "add_health-goals" },
    });
    this.wellnessCrsService.getEditData.next(data);
  }
  onDelete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deleteHealthGoalCondition";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Health goal condition has been deleted successfully`,
              );
              this.getAllHealthGoals();
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
