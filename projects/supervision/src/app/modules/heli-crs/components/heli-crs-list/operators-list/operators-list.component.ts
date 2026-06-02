import { Component, OnInit } from "@angular/core";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { HeliCrsService } from "../../../heli-crs.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";

@Component({
  selector: "app-operators-list",
  templateUrl: "./operators-list.component.html",
  styleUrls: ["./operators-list.component.scss"],
})
export class OperatorsListComponent implements OnInit {

  constructor(
    private wellnessCrsService: HeliCrsService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService
  ) { }

  public showFilters: boolean = false;

  public operatorsList: any[] = [];

  public filteredOperatorsList: any[] = [];

  // FULL TEXT SEARCH
  public searchText = "";

  // FILTERS
  public filterData = {
    operator_name: "",
    company_name: "",
    email: "",
    city: "",
  };

  ngOnInit() {

    this.getAllOperators();


  }

  // ========================= GET ALL =========================

  // ========================= GET ALL OPERATORS =========================

  getAllOperators() {

    const data = {
      topic: "listHeliOperator",
    };

    this.wellnessCrsService.fetch(data).subscribe(

      (resp) => {

        if (
          resp.Status === true &&
          (resp.statusCode === 200 ||
            resp.statusCode === 201)
        ) {

          this.operatorsList = resp.data || [];

          this.filteredOperatorsList =
            resp.data || [];

        } else {

          this.operatorsList = [];

          this.filteredOperatorsList = [];

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

    this.wellnessCrsService
      .create({
        topic: "updateHelioperatorStatus",
        0: data
      })
      .subscribe(

        (resp) => {

          if (
            resp.Status === true &&
            (resp.statusCode === 200 ||
              resp.statusCode === 201)
          ) {

            this.swalService.alert.success(
              "Operator status updated successfully."
            );

            this.getAllOperators();

          } else {

            this.swalService.alert.error(
              "Failed to update operator status."
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

        this.wellnessCrsService
          .create({
            topic: "deleteHeliOperator",
            0: data
          })
          .subscribe(

            (response) => {

              if (
                response.statusCode == 200 ||
                response.statusCode == 201
              ) {

                this.swalService.alert.success(
                  "Operator deleted successfully."
                );

                this.getAllOperators();

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

  // ========================= FULL TEXT SEARCH =========================

  filterOperators() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredOperatorsList = [
        ...this.operatorsList
      ];

      return;

    }

    this.filteredOperatorsList =
      this.operatorsList.filter((item) => {

        return (
          (item.operator_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.company_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.email || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.city_name || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.contact_person || "")
            .toLowerCase()
            .includes(search)

          ||

          (item.contact_no || "")
            .toLowerCase()
            .includes(search)
        );

      });

  }

  // ========================= FILTER SEARCH =========================

  onSearch() {

    this.filteredOperatorsList =
      this.operatorsList.filter((item) => {

        return (

          (!this.filterData.operator_name ||

            (item.operator_name || "")
              .toLowerCase()
              .includes(
                this.filterData.operator_name
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.company_name ||

            (item.company_name || "")
              .toLowerCase()
              .includes(
                this.filterData.company_name
                  .toLowerCase()
              )
          )

          &&

          (!this.filterData.email ||

            (item.email || "")
              .toLowerCase()
              .includes(
                this.filterData.email
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

        );

      });

  }

  // ========================= RESET FILTER =========================

  resetFilters() {

    this.filterData = {

      operator_name: "",
      company_name: "",
      email: "",
      city: "",

    };

    this.searchText = "";

    this.filteredOperatorsList = [
      ...this.operatorsList
    ];

  }


  // ========================= UPDATE =========================

  onUpdate(data: any) {

    this.wellnessCrsService
      .getEditData
      .next(data);

    this.wellnessCrsService
      .tabSwitch$
      .next('add_operators');

  }

  exportExcel(): void {

    const fileToExport = this.filteredOperatorsList.map((item: any, index: number) => {
      return {
        "Sl No": index + 1,
        "Status": (item.status === 1 || item.status === "1") ? "Active" : "Inactive",
        "Operator Name": item.operator_name || "-",
        "Company Name": item.company_name || "-",
        "DGCA License Number": item.dgpa_licno || "-",
        "Contact Person": item.contact_person || "-",
        "Contact Number": item.contact_no || "-",
        "Email": item.email || "-",
        "Office Address": item.office_addr || "-",
        "City": item.city_name || item.city || "-",
        "State": item.state_name || item.state || "-",
        "Country": item.country_name || item.country || "-",
        "GST Number": item.gst_no || "-",
        "KYC Document": item.kyc_doc ? item.kyc_doc : "-"
      };
    });

    const columnWidths = [
      { wch: 8 },   // Sl No
      { wch: 10 },  // Status
      { wch: 25 },  // Operator Name
      { wch: 25 },  // Company Name
      { wch: 20 },  // DGCA License
      { wch: 20 },  // Contact Person
      { wch: 15 },  // Contact Number
      { wch: 25 },  // Email
      { wch: 30 },  // Address
      { wch: 15 },  // City
      { wch: 15 },  // State
      { wch: 15 },  // Country
      { wch: 15 },  // GST
      { wch: 25 },  // KYC
    ];

    this.utility.exportToExcel(
      fileToExport,
      'Heli Operator List',
      columnWidths
    );
  }

}