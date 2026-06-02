import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { HeliCrsService } from "../../../heli-crs.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";

@Component({
  selector: "app-routes-list",
  templateUrl: "./routes-list.component.html",
  styleUrls: ["./routes-list.component.scss"]
})

export class RoutesListComponent implements OnInit {

  constructor(
    private heliCrsService: HeliCrsService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService
  ) { }

  public showFilters = false;

  public tripType = "within";

  public routesList: any[] = [];

  public filteredRoutesList: any[] = [];

  // FULL SEARCH
  public searchText = "";

  // FILTERS
  public filterData = {

    route_name: "",

    city: "",

    from_city: "",

    to_city: "",

    from_helipad_name: "",

    to_helipad_name: "",

  };

  ngOnInit() {

    this.getAllRoutes();

  }

  // ========================= GET ALL ROUTES =========================

  getAllRoutes() {

    const data = {

      topic: "listHeliRoutes",

    };

    this.heliCrsService.fetch(data).subscribe(

      (resp) => {

        if (
          resp.Status === true &&
          (
            resp.statusCode === 200 ||
            resp.statusCode === 201
          )
        ) {

          this.routesList = resp.data || [];

          this.filteredRoutesList = resp.data || [];

        } else {

          this.routesList = [];

          this.filteredRoutesList = [];

        }

      },

      (err: HttpErrorResponse) => {

        this.swalService.alert.error(
          err["error"]["Message"]
        );

      }

    );

  }

  // ========================= STATUS CHANGE =========================

  onStatusChange(event: any, item: any) {

    const status = event.target.checked
      ? 1
      : 0;

    const data = {

      id: item.id,

      status: status,

    };

    this.heliCrsService
      .create({
        topic: "updateHeliRouteStatus",
        0: data
      })
      .subscribe(

        (resp) => {

          if (
            resp.Status === true &&
            (
              resp.statusCode === 200 ||
              resp.statusCode === 201
            )
          ) {

            this.swalService.alert.success(
              "Route status updated successfully."
            );

            this.getAllRoutes();

          } else {

            this.swalService.alert.error(
              "Failed to update route status."
            );

          }

        },

        (err: HttpErrorResponse) => {

          this.swalService.alert.error(
            err["error"]["Message"]
          );

        }

      );

  }

  // ========================= DELETE =========================

  onDelete(id: any) {

    this.swalService.alert.delete((action) => {

      if (action) {

        const data = {

          id: id,

        };

        this.heliCrsService
          .create({
            topic: "deleteHeliRoute",
            0: data
          })
          .subscribe(

            (response) => {

              if (
                response.statusCode === 200 ||
                response.statusCode === 201
              ) {

                this.swalService.alert.success(
                  "Route deleted successfully."
                );

                this.getAllRoutes();

              }

            },

            (err: HttpErrorResponse) => {

              this.swalService.alert.error(
                err["error"]["Message"]
              );

            }

          );

      }

    });

  }

  // ========================= FULL SEARCH =========================

  filterRoutes() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredRoutesList = [
        ...this.routesList
      ];

      return;

    }

    this.filteredRoutesList =
      this.routesList.filter((item) => {

        return (

          (item.route_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.city_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.from_city_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.to_city_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.from_helipad_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.to_helipad_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.distance || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.duration || "")
            .toLowerCase()
            .includes(search)

        );

      });

  }

  // ========================= FILTER SEARCH =========================

  onSearch() {

    this.filteredRoutesList =
      this.routesList.filter((item) => {

        return (

          (!this.filterData.route_name ||

            (item.route_name || "")
              .toLowerCase()
              .includes(
                this.filterData.route_name
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.city ||

            (item.city_name || "")
              .toLowerCase()
              .includes(
                this.filterData.city
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.from_city ||

            (item.from_city_name || "")
              .toLowerCase()
              .includes(
                this.filterData.from_city
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.to_city ||

            (item.to_city_name || "")
              .toLowerCase()
              .includes(
                this.filterData.to_city
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.from_helipad_name ||

            (item.from_helipad_name || "")
              .toLowerCase()
              .includes(
                this.filterData.from_helipad_name
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.to_helipad_name ||

            (item.to_helipad_name || "")
              .toLowerCase()
              .includes(
                this.filterData.to_helipad_name
                  .toLowerCase()
              )
          )

        );

      });

  }

  // ========================= RESET FILTER =========================

  resetFilters() {

    this.filterData = {

      route_name: "",

      city: "",

      from_city: "",

      to_city: "",

      from_helipad_name: "",

      to_helipad_name: "",

    };

    this.searchText = "";

    this.filteredRoutesList = [
      ...this.routesList
    ];

  }

  // ========================= UPDATE =========================

  onUpdate(data: any) {



    this.heliCrsService
      .getEditData
      .next(data);


    this.heliCrsService
      .tabSwitch$
      .next('add_routes');

  }
  exportExcel(): void {

    const dataToExport = this.filteredRoutesList.map((item: any, index: number) => {
      return {
        "Sl No": index + 1,
        "Status": (item.status === 1 || item.status === "1") ? "Active" : "Inactive",
        "Trip Type": item.type || "-",
        "Route Name": item.route_name || "-",
        "From City": item.city_name || item.city || "-",
        "To City": item.to_city_name || item.to_city || "-",
        "From Helipad Name": item.from_helipad_name || "-",
        "To Helipad Name": item.to_helipad_name || "-",
        "Distance": item.distance || "-",
        "Duration (Minutes)": item.duration || "-",
        "Description": item.description || "-"
      };
    });

    const columnWidths = [
      { wch: 8 },   // Sl No
      { wch: 12 },  // Status
      { wch: 12 },  // Trip Type
      { wch: 25 },  // Route Name
      { wch: 15 },  // City
      { wch: 15 },  // From City
      { wch: 15 },  // To City
      { wch: 25 },  // From Helipad
      { wch: 25 },  // To Helipad
      { wch: 12 },  // Distance
      { wch: 18 },  // Duration
      { wch: 30 }   // Description
    ];

    this.utility.exportToExcel(
      dataToExport,
      'Routes List',
      columnWidths
    );
  }
}