import { Component, OnInit } from "@angular/core";

import { HttpErrorResponse } from "@angular/common/http";

import { Router } from "@angular/router";

import { SwalService } from "projects/supervision/src/app/core/services/swal.service";

import { HeliCrsService } from "../../../heli-crs.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";

@Component({
  selector: "app-helipads-list",
  templateUrl: "./helipads-list.component.html",
  styleUrls: ["./helipads-list.component.scss"]
})

export class HelipadsListComponent implements OnInit {

  constructor(
    private heliCrsService: HeliCrsService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService
  ) { }

  public showFilters: boolean = false;

  public helipadList: any[] = [];

  public filteredHelipadList: any[] = [];

  // FULL SEARCH
  public searchText = "";

  // FILTERS
  public filterData = {

    helipad_name: "",

    helipad_code: "",

    city: "",

    state: ""

  };

  ngOnInit() {

    this.getAllHelipads();

  }

  // ========================= GET ALL =========================

  getAllHelipads() {

    const data = {

      topic: "listHeliPad"

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

          this.helipadList = resp.data || [];

          this.filteredHelipadList =
            resp.data || [];

        } else {

          this.helipadList = [];

          this.filteredHelipadList = [];

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

      status: status

    };

    this.heliCrsService
      .create({
        topic: "updateHelipadStatus",
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
              "Helipad status updated successfully."
            );

            this.getAllHelipads();

          } else {

            this.swalService.alert.error(
              "Failed to update helipad status."
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

          id: id

        };

        this.heliCrsService
          .create({
            topic: "deleteHelipad",
            0: data
          })
          .subscribe(

            (response) => {

              if (
                response.statusCode == 200 ||
                response.statusCode == 201
              ) {

                this.swalService.alert.success(
                  "Helipad deleted successfully."
                );

                this.getAllHelipads();

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

  filterHelipads() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredHelipadList = [
        ...this.helipadList
      ];

      return;

    }

    this.filteredHelipadList =
      this.helipadList.filter((item) => {

        return (

          (item.helipad_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.helipad_code || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.city_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.state_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.country_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.map_location || "")
            .toLowerCase()
            .includes(search)

        );

      });

  }

  // ========================= FILTER SEARCH =========================

  onSearch() {

    this.filteredHelipadList =
      this.helipadList.filter((item) => {

        return (

          (

            !this.filterData.helipad_name ||

            (item.helipad_name || "")
              .toLowerCase()
              .includes(
                this.filterData.helipad_name
                  .toLowerCase()
              )

          )

          &&

          (

            !this.filterData.helipad_code ||

            (item.helipad_code || "")
              .toLowerCase()
              .includes(
                this.filterData.helipad_code
                  .toLowerCase()
              )

          )

          &&

          (

            !this.filterData.city ||

            (item.city_name || "")
              .toLowerCase()
              .includes(
                this.filterData.city
                  .toLowerCase()
              )

          )

          &&

          (

            !this.filterData.state ||

            (item.state_name || "")
              .toLowerCase()
              .includes(
                this.filterData.state
                  .toLowerCase()
              )

          )

        );

      });

  }

  // ========================= RESET FILTER =========================

  resetFilters() {

    this.filterData = {

      helipad_name: "",

      helipad_code: "",

      city: "",

      state: ""

    };

    this.searchText = "";

    this.filteredHelipadList = [
      ...this.helipadList
    ];

  }

  // ========================= UPDATE =========================

  onUpdate(data: any) {
    console.log(data, "yvugtyg")
    this.heliCrsService
      .getEditData
      .next(data);

    this.heliCrsService
      .tabSwitch$
      .next('add_helipads');


  }

  exportExcel(): void {

    const fileToExport = this.filteredHelipadList.map((item: any, index: number) => {
      return {

        "Sl No": index + 1,

        "Status": item.status === 1 || item.status === '1'
          ? 'Active'
          : 'Inactive',

        "Helipad Name": item.helipad_name,
        "City": item.city_name || item.city,
        "State": item.state_name || item.state,
        "Country": item.country_name || item.country,

        "Map Location": item.map_location,
        "Latitude": item.latitude,
        "Longitude": item.longitude,

        "Helipad Code": item.helipad_code,
        "Description": item.description

      };
    });

    const columnWidths = [
      { wch: 6 },   // Sl No
      { wch: 10 },  // Status
      { wch: 25 },  // Helipad Name
      { wch: 18 },  // City
      { wch: 18 },  // State
      { wch: 18 },  // Country
      { wch: 25 },  // Map Location
      { wch: 12 },  // Latitude
      { wch: 12 },  // Longitude
      { wch: 15 },  // Code
      { wch: 30 }   // Description
    ];

    this.utility.exportToExcel(
      fileToExport,
      'Helipads List',
      columnWidths
    );
  }

}