import {
  Component,
  OnInit
} from "@angular/core";

import {
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

import { Router } from "@angular/router";

import { SwalService } from "projects/supervision/src/app/core/services/swal.service";

import { HeliCrsService } from "../../../heli-crs.service";

@Component({
  selector: "app-add-update-schedules-list",
  templateUrl: "./add-update-schedules-list.component.html",
  styleUrls: ["./add-update-schedules-list.component.scss"]
})

export class AddUpdateSchedulesListComponent implements OnInit {

  addUpdateScheduleForm: any;

  submitted = false;

  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private heliCrsService: HeliCrsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.createForm();
    this.getOperatorsList()
    this.getRoutesList()

    // EDIT DATA
    this.heliCrsService
      .getEditData
      .subscribe((resp: any) => {

        if (resp) {

          this.isEdit = true;

          this.addUpdateScheduleForm.patchValue({

            operator_name:
              resp.operator_name,

            route_id:
              resp.route_id,

            travel_date:
              resp.travel_date,

            departure_time:
              resp.departure_time,

            arrival_time:
              resp.arrival_time,

            duration:
              resp.duration,

            helicopter_type:
              resp.helicopter_type,

            helicopter_model:
              resp.helicopter_model,

            total_seats:
              resp.total_seats,

            available_seats:
              resp.available_seats,

            blocked_seats:
              resp.blocked_seats,

            baggage_allowance:
              resp.baggage_allowance,

            weight_limit:
              resp.weight_limit,

            cancellation_policy:
              resp.cancellation_policy,


            status:
              (
                resp.status === "1" ||
                resp.status === 1
              )

          });

        }

      });

  }

  // ================= FORM =================

  createForm() {

    this.addUpdateScheduleForm =
      this.formBuilder.group({

        operator_name: new FormControl(
          "",
          [Validators.required]
        ),

        route_id: new FormControl(
          "",
          [Validators.required]
        ),

        travel_date: new FormControl(
          "",
          [Validators.required]
        ),

        departure_time: new FormControl(
          "",
          [Validators.required]
        ),

        arrival_time: new FormControl(
          "",
          [Validators.required]
        ),

        duration: new FormControl(
          "",
          [Validators.required]
        ),

        helicopter_type: new FormControl(
          "",
          [Validators.required]
        ),

        helicopter_model: new FormControl(
          "",
          [Validators.required]
        ),

        total_seats: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$")
          ]
        ),

        available_seats: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$")
          ]
        ),

        blocked_seats: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$")
          ]
        ),

        baggage_allowance: new FormControl(
          "",
          [Validators.required]
        ),

        weight_limit: new FormControl(
          "",
          [Validators.required]
        ),

        cancellation_policy: new FormControl(
          "",
          [Validators.required]
        ),

        status: new FormControl(true)

      });

  }

  // ================= SUBMIT =================

  onSubmit() {

    this.submitted = true;

    if (this.addUpdateScheduleForm.invalid) {

      this.addUpdateScheduleForm
        .markAllAsTouched();

      return;

    }

    const formValue =
      this.addUpdateScheduleForm.value;
    const payload = {

      ...this.addUpdateScheduleForm.value,

      status:
        this.addUpdateScheduleForm.value.status
          ? "1"
          : "0"

    };

    // EDIT
    if (this.isEdit) {

      payload.id =
        this.heliCrsService
          .getEditData
          .value
          .id;

    }

    let data: any = [];

    data[0] = payload;

    data["topic"] = this.isEdit
      ? "updateHeliSchedule"
      : "addHeliSchedule";

    this.heliCrsService
      .create(data)
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
              this.isEdit
                ? "Schedule updated successfully."
                : "Schedule added successfully."
            );
this.resetForm()
            this.heliCrsService.tabSwitch$.next('list_schedules');

          } else {

            this.swalService.alert.error(
              resp.Message ||
              "Something went wrong."
            );

          }

        },

        () => {

          this.swalService.alert.error(
            "Something went wrong."
          );

        }

      );

  }

  // ================= RESET =================

  resetForm() {

    this.submitted = false;

    this.isEdit = false;

    this.addUpdateScheduleForm.reset();

    this.addUpdateScheduleForm.patchValue({

      status: true

    });

  }

  // ================= OPERATORS LIST =================

  operatorsList: any[] = [];

  getOperatorsList() {

    const data = {

      topic: "listHeliOperator"

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

            this.operatorsList =
              resp.data || [];

          } else {

            this.operatorsList = [];

          }

        },

        () => {

          this.operatorsList = [];

        }

      );

  }


  // ================= ROUTES LIST =================

  routesList: any[] = [];

  getRoutesList() {

    const data = {

      topic: "listHeliRoutes"

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

            this.routesList =
              resp.data || [];

          } else {

            this.routesList = [];

          }

        },

        () => {

          this.routesList = [];

        }

      );

  }

}