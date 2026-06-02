import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HeliCrsService } from '../../../heli-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

@Component({
  selector: 'app-pricing-list',
  templateUrl: './pricing-list.component.html',
  styleUrls: ['./pricing-list.component.scss']
})
export class PricingListComponent implements OnInit {

  pricingList: any[] = [];
  filteredPricingList: any[] = [];

  searchTerm = "";

  searchData = {
    operator_name: "",
    route_id: ""
  };

  constructor(
    private heliCrsService: HeliCrsService,
    private swalService: SwalService,
    private router: Router,
    private utility: UtilityService
  ) { }

  ngOnInit() {
    this.getAllPricing();
  }

  // ================= GET ALL =================

  getAllPricing() {

    const data = {
      topic: "listPricingRules"
    };

    this.heliCrsService.fetch(data).subscribe(

      (resp: any) => {

        if (resp.Status && (resp.statusCode === 200 || resp.statusCode === 201)) {

          this.pricingList = resp.data || [];
          this.filteredPricingList = resp.data || [];

        } else {

          this.pricingList = [];
          this.filteredPricingList = [];

        }

      },

      (err: HttpErrorResponse) => {

        this.swalService.alert.error(err.error.Message || "Error");

      }

    );

  }

  // ================= SEARCH BUTTON =================

  search() {

    this.filteredPricingList = this.pricingList.filter(item => {

      return (

        (!this.searchData.operator_name ||
          (item.operator_name || "").toLowerCase()
            .includes(this.searchData.operator_name.toLowerCase())
        )

        &&

        (!this.searchData.route_id ||
          (item.route_id || "").toString()
            .includes(this.searchData.route_id)
        )

      );

    });

  }

  // ================= RESET =================

  reset() {

    this.searchData = {
      operator_name: "",
      route_id: ""
    };

    this.searchTerm = "";

    this.filteredPricingList = [...this.pricingList];

  }

  // ================= FULL TEXT SEARCH =================

  filterList() {

    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      this.filteredPricingList = [...this.pricingList];
      return;
    }

    this.filteredPricingList = this.pricingList.filter(item => {

      return (

        (item.operator_name || "").toLowerCase().includes(search) ||
        (item.route_id || "").toString().includes(search) ||
        (item.base_fare || "").toString().includes(search) ||
        (item.taxes || "").toString().includes(search)

      );

    });

  }

  // ================= STATUS CHANGE =================

  updateStatus(item: any) {

    const data = {
      id: item.id,
      status: item.status ? 1 : 0
    };

    this.heliCrsService.create({
      topic: "updatePricingStatus",
      0: data
    }).subscribe(

      (resp: any) => {

        if (resp.Status) {

          this.swalService.alert.success("Status updated");

          this.getAllPricing();

        } else {

          this.swalService.alert.error("Failed to update status");

        }

      },

      () => {

        this.swalService.alert.error("Error updating status");

      }

    );

  }

  // ================= DELETE =================

  delete(item: any) {

    this.swalService.alert.delete((confirm) => {

      if (confirm) {

        this.heliCrsService.create({
          topic: "deletePricingRule",
          0: { id: item.id }
        }).subscribe(

          (resp: any) => {

            if (resp.statusCode === 200 || resp.statusCode === 201) {

              this.swalService.alert.success("Deleted successfully");

              this.getAllPricing();

            }

          }

        );

      }

    });

  }

  // ================= EDIT =================

  edit(item: any) {


    this.heliCrsService
      .tabSwitch$
      .next('add_pricing_rules');
    this.heliCrsService.getEditData.next(item);



  }
  exportExcel(): void {

    const dataToExport = this.filteredPricingList.map((item: any, index: number) => {
      return {
        "Sl No": index + 1,
        "Status": (item.status === 1 || item.status === "1") ? "Active" : "Inactive",
        "Operator Name": item.operator_name || "-",
        "Route Id": item.route_id || "-",
        "Base Fare": item.base_fare || "-",
        "Taxes": item.taxes || "-",
        "Effective From": item.effective_from || "-",
        "Effective To": item.effective_to || "-"
      };
    });

    const columnWidths = [
      { wch: 8 },   // Sl No
      { wch: 12 },  // Status
      { wch: 25 },  // Operator Name
      { wch: 15 },  // Route Id
      { wch: 15 },  // Base Fare
      { wch: 15 },  // Taxes
      { wch: 18 },  // Effective From
      { wch: 18 }   // Effective To
    ];

    this.utility.exportToExcel(
      dataToExport,
      'Pricing Rules List',
      columnWidths
    );
  }

}