import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { HeliCrsService } from "../../../heli-crs.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";

@Component({
  selector: "app-schedules-list",
  templateUrl: "./schedules-list.component.html",
  styleUrls: ["./schedules-list.component.scss"]
})

export class SchedulesListComponent implements OnInit {

  constructor(
    private heliCrsService: HeliCrsService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService
  ) { }

  // ================= LIST =================

  schedulesList: any[] = [];

  filteredList: any[] = [];

  // ================= SEARCH =================

  searchTerm = "";

  searchData: any = {

    operator_name: "",

    route: "",

    helicopter_number: ""

  };

  ngOnInit() {

    this.getAllSchedules();

  }

  // ================= GET ALL =================

  getAllSchedules() {

    const data = {

      topic: "listHeliSchedule"

    };

    this.heliCrsService
      .fetch(data)
      .subscribe(

        (resp: any) => {

          if (
            resp.Status === true &&
            (
              resp.statusCode === 200 ||
              resp.statusCode === 201
            )
          ) {

            this.schedulesList =
              resp.data || [];

            this.filteredList =
              [...this.schedulesList];

          } else {

            this.schedulesList = [];

            this.filteredList = [];

          }

        },

        (err: HttpErrorResponse) => {

          this.swalService.alert.error(
            err["error"]["Message"]
          );

        }

      );

  }

  // ================= FULL TEXT SEARCH =================

  filterList() {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!search) {

      this.filteredList =
        [...this.schedulesList];

      return;

    }

    this.filteredList =
      this.schedulesList.filter((item: any) => {

        return (

          (item.operator_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.route || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.helicopter_model || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.helicopter_type || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.travel_date || "")
            .toLowerCase()
            .includes(search)

        );

      });

  }

  // ================= SEARCH FILTER =================

  search() {

    this.filteredList =
      this.schedulesList.filter((item: any) => {

        return (

          (

            !this.searchData.operator_name ||

            (item.operator_name || "")
              .toLowerCase()
              .includes(
                this.searchData.operator_name
                  .toLowerCase()
              )

          )

          &&

          (

            !this.searchData.route ||

            (item.route || "")
              .toLowerCase()
              .includes(
                this.searchData.route
                  .toLowerCase()
              )

          )

          &&

          (

            !this.searchData.helicopter_number ||

            (item.helicopter_model || "")
              .toLowerCase()
              .includes(
                this.searchData.helicopter_number
                  .toLowerCase()
              )

          )

        );

      });

  }

  // ================= RESET =================

  reset() {

    this.searchData = {

      operator_name: "",

      route: "",

      helicopter_number: ""

    };

    this.searchTerm = "";

    this.filteredList =
      [...this.schedulesList];

  }

  // ================= STATUS UPDATE =================

  updateStatus(item: any) {

    const data = {

      id: item.id,

      status: item.status ? 1 : 0

    };

    this.heliCrsService
      .create({
        topic: "updateHeliScheduleStatus",
        0: data
      })
      .subscribe(

        (resp: any) => {

          if (
            resp.Status === true &&
            (
              resp.statusCode === 200 ||
              resp.statusCode === 201
            )
          ) {

            this.swalService.alert.success(
              "Schedule status updated successfully."
            );

          } else {

            this.swalService.alert.error(
              "Failed to update status."
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

  // ================= DELETE =================

  delete(item: any) {

    this.swalService.alert.delete((action) => {

      if (action) {

        this.heliCrsService
          .create({
            topic: "deleteHeliSchedule",
            0: {
              id: item.id
            }
          })
          .subscribe(

            (resp: any) => {

              if (
                resp.statusCode === 200 ||
                resp.statusCode === 201
              ) {

                this.swalService.alert.success(
                  "Schedule deleted successfully."
                );

                this.getAllSchedules();

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

  // ================= EDIT =================

  edit(item: any) {

    this.heliCrsService
      .getEditData
      .next(item);




    this.heliCrsService
      .tabSwitch$
      .next('add_schedules');

  }
  exportExcel(): void {

    const fileToExport = this.filteredList.map((item: any, index: number) => {
      return {

        "Sl No": index + 1,
        "Status": item.status === 1 || item.status === '1' ? 'Active' : 'Inactive',

        "Operator Name": item.operator_name,
        "Route": item.route,
        "Travel Date": item.travel_date,
        "Departure Time": item.departure_time,
        "Arrival Time": item.arrival_time,
        "Duration (mins)": item.duration,

        "Helicopter Type": item.helicopter_type,
        "Helicopter Model": item.helicopter_model,

        "Total Seats": item.total_seats,
        "Available Seats": item.available_seats,
        "Blocked Seats": item.blocked_seats,

        "Baggage Allowance": item.baggage_allowance,
        "Weight Limit": item.weight_limit,

        "Cancellation Policy": item.cancellation_policy

      };
    });

    const columnWidths = [
      { wch: 6 },   // Sl No
      { wch: 10 },  // Status
      { wch: 20 },  // Operator
      { wch: 15 },  // Route
      { wch: 15 },  // Travel Date
      { wch: 15 },  // Departure
      { wch: 15 },  // Arrival
      { wch: 12 },  // Duration
      { wch: 18 },  // Type
      { wch: 18 },  // Model
      { wch: 10 },  // Total Seats
      { wch: 10 },  // Available
      { wch: 10 },  // Blocked
      { wch: 18 },  // Baggage
      { wch: 12 },  // Weight
      { wch: 25 },  // Cancellation
    ];

    this.utility.exportToExcel(
      fileToExport,
      'Helicopter Schedule List',
      columnWidths
    );
  }

}