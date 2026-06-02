import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HeliCrsService } from '../../../heli-crs.service';

@Component({
  selector: 'app-add-update-pricing-list',
  templateUrl: './add-update-pricing-list.component.html',
  styleUrls: ['./add-update-pricing-list.component.scss']
})
export class AddUpdatePricingListComponent implements OnInit {

  pricingForm: any;
  submitted = false;
  isEdit = false;

  operatorsList: any[] = [];
  routesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private heliCrsService: HeliCrsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.createForm();

    this.getOperators();
    this.getRoutes();

    // EDIT MODE
    this.heliCrsService.getEditData.subscribe((resp: any) => {

      if (resp) {

        this.isEdit = true;

        this.pricingForm.patchValue({

          operator_name: resp.operator_name,
          route_id: resp.route_id,
          base_fare: resp.base_fare,
          taxes: resp.taxes,
          effective_from: resp.effective_from,
          effective_to: resp.effective_to,
          status: resp.status == 1 || resp.status == "1"

        });

      }

    });

  }

  // ================= FORM =================

  createForm() {

    this.pricingForm = this.fb.group({

      operator_name: new FormControl('', [Validators.required]),
      route_id: new FormControl('', [Validators.required]),

      base_fare: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),

      taxes: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),

      effective_from: new FormControl('', [Validators.required]),
      effective_to: new FormControl('', [Validators.required]),

      status: new FormControl(true)

    });

  }

  // ================= OPERATORS API =================

  getOperators() {

    const data = {
      topic: "listHeliOperator"
    };

    this.heliCrsService.fetch(data).subscribe((resp: any) => {

      if (resp.Status) {
        this.operatorsList = resp.data || [];
      } else {
        this.operatorsList = [];
      }

    });

  }

  // ================= ROUTES API =================

  getRoutes() {

    const data = {
      topic: "listHeliRoutes"
    };

    this.heliCrsService.fetch(data).subscribe((resp: any) => {

      if (resp.Status) {
        this.routesList = resp.data || [];
      } else {
        this.routesList = [];
      }

    });

  }

  // ================= SUBMIT =================

 onSubmit() {

  this.submitted = true;

  if (this.pricingForm.invalid) {
    this.pricingForm.markAllAsTouched();
    return;
  }

  const v = this.pricingForm.value;

  // GET SELECTED ROUTE OBJECT
  const selectedRoute = this.routesList.find(
    (x: any) => x.id == v.route_id
  );

  const payload: any = {

    operator_name: v.operator_name,

    route_id: v.route_id,

    // PASS ROUTE NAME ALSO
    route: selectedRoute
      ? (selectedRoute.route_name || selectedRoute.route)
      : '',

    base_fare: v.base_fare,
    taxes: v.taxes,
    effective_from: v.effective_from,
    effective_to: v.effective_to,

    status: v.status ? "1" : "0"

  };

  if (this.isEdit) {
    payload.id = this.heliCrsService.getEditData.value.id;
  }

  const data: any = [];
  data[0] = payload;

  data["topic"] = this.isEdit
    ? "updatePricingRule"
    : "addPricingRule";

  this.heliCrsService.create(data).subscribe(

    (resp: any) => {

      if (resp.Status && (resp.statusCode == 200 || resp.statusCode == 201)) {

        this.swalService.alert.success(
          this.isEdit
            ? "Pricing updated successfully"
            : "Pricing added successfully"
        );
this.resetForm()
        this.heliCrsService.tabSwitch$.next('list_pricing_rules');

      } else {

        this.swalService.alert.error(resp.Message || "Something went wrong");

      }

    },

    () => {
      this.swalService.alert.error("Something went wrong");
    }

  );

}

  resetForm() {

    this.submitted = false;
    this.isEdit = false;

    this.pricingForm.reset({
      status: true
    });

  }

}