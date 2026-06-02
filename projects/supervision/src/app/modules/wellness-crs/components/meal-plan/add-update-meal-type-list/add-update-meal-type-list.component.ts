import { Component, OnInit } from "@angular/core";
import { WellnessCrsService } from "../../../wellness-crs.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: "app-add-update-meal-type-list",
  templateUrl: "./add-update-meal-type-list.component.html",
  styleUrls: ["./add-update-meal-type-list.component.scss"],
})
export class AddUpdateMealTypeListComponent implements OnInit {
  constructor(
    private wellnessCrsService: WellnessCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private router: Router,
  ) {}
  public addUpdateMealTypeListForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;

  ngOnInit() {
    this.createForm();
    this.wellnessCrsService.getEditData.subscribe((resp) => {
      if (resp) {
        this.isEdit = true;
        this.addUpdateMealTypeListForm.patchValue({
          meals: resp.meals,
          status: (resp.status === "1" || resp.status === 1) ? true : false,
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  createForm() {
    this.addUpdateMealTypeListForm = this.formBuilder.group({
      meals: new FormControl("", [Validators.required]),
      status: new FormControl(true),
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.addUpdateMealTypeListForm.invalid) {
      return;
    }
    if (this.isEdit) {
      this.addUpdateMealTypeListForm.value["id"] =
        this.wellnessCrsService.getEditData.value.id;
    }
    let data = Object.assign({}, this.addUpdateMealTypeListForm.value);
    data = [data];
    data["topic"] = this.isEdit ? "updateMealPlan" : "addMealPlan";
    this.wellnessCrsService.create(data).subscribe(
      (resp) => {
        if (
          resp.Status === true &&
          (resp.statusCode === 200 || resp.statusCode === 201)
        ) {
          this.router.navigate(["/wellnesscrs/meal-plan"], {
            queryParams: {
              tab: "list_meal-plan",
            },
          });
          this.submitted = false;
          this.swalService.alert.success();
        } else {
          // this.swalService.alert.error();
        }
      },
      (err: HttpErrorResponse) => {
        this.swalService.alert.error(err["error"]["Message"]);
      },
    );
  }

  resetForm() {
    this.addUpdateMealTypeListForm.reset();
    this.submitted = false;
  }
}
