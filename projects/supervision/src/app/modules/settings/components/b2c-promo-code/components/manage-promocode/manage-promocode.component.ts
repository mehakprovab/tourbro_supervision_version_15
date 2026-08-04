import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SettingService } from "../../../../setting.service";
import { SubSink } from "subsink";
import { SwalService } from "../../../../../../core/services/swal.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UtilityService } from "../../../../../../core/services/utility.service";
import { ApiHandlerService } from "../../../../../../core/api-handlers";
import { formatDate } from "ngx-bootstrap/chronos";
import { environment } from "../../../../../../../environments/environment";

@Component({
  selector: "app-manage-promocode",
  templateUrl: "./manage-promocode.component.html",
  styleUrls: ["./manage-promocode.component.scss"],
})
export class ManagePromocodeComponent implements OnInit, OnDestroy {
  readonly discoverCategory = "Discover";
  categoryList = [
    "Stay",
    "Experience",
    "Wellness",
    "Yatra",
    "Cab",
    "Bus",
    "Heli Service",
    this.discoverCategory,
  ];
  @Output() updatePromoCode = new EventEmitter<any>();
  @ViewChild("labelImport", { static: false })
  labelImport: ElementRef;
  @ViewChild("promoImageInput", { static: false })
  promoImageInput: ElementRef<HTMLInputElement>;
  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    const file = files[0];
    if (file && file.size) {
      let result = this.validateFileSize(file.size);
      if (!result) {
        if (this.promoImageInput) {
          this.promoImageInput.nativeElement.value = "";
        }
        this.labelImport.nativeElement.innerText = "Upload Image";
        this.fileToUpload = null;
        return;
      }
    }
    this.fileToUpload = files.item(0);
  }
  private subSunk = new SubSink();
  fileToUpload: File = null;
  existingPromoImage = "";
  userTitleList: Array<any> = [];
  userTypeList: Array<any> = [];
  phoneCodeList: Array<any> = [];
  regConfig: FormGroup;
  isOpen = false as boolean;
  isExpDateOpen = false as boolean;
  setMinDate: any;
  addOrUpdate: string = "";
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: "DD/MM/YYYY",
    rangeInputFormat: "DD/MM/YYYY",
    containerClass: "theme-blue",
    showWeekNumbers: false,
  };
  minDate = new Date(new Date().setHours(0, 0, 0, 0));

  constructor(
    private router: Router,
    private settingService: SettingService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getToUpdate();
    this.valueChanges();
  }

  createForm() {
    this.regConfig = this.fb.group({
      id: new FormControl(""),
      promo_code: new FormControl("", [Validators.required]),
     promo_visibility: new FormControl(false),
      promo_image: new FormControl(""),
      description: new FormControl("", [Validators.required]),
      category: this.fb.array([], Validators.required),
      promo_type: new FormControl("normal"), // 👈 NEW FIELD

      min_value: new FormControl(""), // 👈 NEW
      max_value: new FormControl(""), // 👈 NEW
      userType: new FormControl("", [Validators.required]),
      discount_type: new FormControl("", [Validators.required]),
      discount_value: new FormControl("", [Validators.required]),
      // use_type: new FormControl("", [Validators.required]),
      start_date: new FormControl("", [Validators.required]),
      expiry_date: new FormControl("", [Validators.required]),
      // limitation: new FormControl(""),
      status: new FormControl("1", [Validators.required]),
    });
  }

getToUpdate() {
  this.subSunk.sink = this.settingService.promoCodeUpdateData.subscribe(
    (data) => {
      console.log(data);
      if (!this.utility.isEmpty(data)) {
        this.addOrUpdate = "update";
        this.fileToUpload = null;
        this.existingPromoImage = data.promo_image ? data.promo_image : "";

        if (this.promoImageInput) {
          this.promoImageInput.nativeElement.value = "";
        }

        if (this.labelImport) {
          this.labelImport.nativeElement.innerText = "Upload Image";
        }
        
        // First patch the basic form controls
        this.regConfig.patchValue(
          {
            id: data.id ? data.id : "",
            promo_code: data.promo_code ? data.promo_code : "",
            promo_visibility: data.promo_visibility ? data.promo_visibility : false,
            promo_image: "",
            description: data.description ? data.description : "",
            userType: data.userType ? data.userType : "", // This should work now
            discount_type: data.discount_type ? data.discount_type : "",
            discount_value: data.discount_value ? data.discount_value : "",
            start_date: data.start_date ? new Date(data.start_date) : "",
            expiry_date: data.expiry_date ? new Date(data.expiry_date) : "",
            status: data.status == 1 ? "1" : "0",
            promo_type: data.promo_type || "normal",
            min_value: data.min_value || "",
            max_value: data.max_value || "",
          },
          { emitEvent: false },
        );

        // Handle category separately
        this.setCategoryValues(data.category);
        
      } else {
        this.addOrUpdate = "add";
        this.fileToUpload = null;
        this.existingPromoImage = "";
        // Clear the category FormArray when adding new
        this.categoryArray.clear();
      }
    },
  );
}

setCategoryValues(categories: any) {
  // Clear existing values
  while (this.categoryArray.length) {
    this.categoryArray.removeAt(0);
  }
  
  let categoryValues: string[] = [];

  if (Array.isArray(categories)) {
    categoryValues = categories;
  } else if (typeof categories === "string") {
    // Categories can also be returned as a comma-separated string.
    categoryValues = categories.split(",").map(category => category.trim());
  }

  categoryValues = categoryValues.filter((category, index, values) =>
    category && values.indexOf(category) === index
  );

  // Discover promos are exclusive, including when an older record being edited
  // contains Discover together with another module.
  if (categoryValues.includes(this.discoverCategory)) {
    categoryValues = [this.discoverCategory];
  }

  categoryValues.forEach(category => {
    this.categoryArray.push(new FormControl(category));
  });
  
  // Mark as touched to trigger validation display if needed
  this.categoryArray.markAsTouched();
}
// Add this method to check if a category is selected
isCategorySelected(category: string): boolean {
  const categoryArray = this.regConfig.get('category') as FormArray;
  return categoryArray.controls.some(control => control.value === category);
}

isCategoryDisabled(category: string): boolean {
  return category !== this.discoverCategory &&
    this.isCategorySelected(this.discoverCategory);
}
  valueChanges(): void {
    // const usetypeControl = this.regConfig.get("useType");
    // const limitationControl = this.regConfig.get("limitation");
    // usetypeControl.valueChanges.subscribe((value) => {
    //   if (value == "Multiple") {
    //     limitationControl.setValidators([
    //       Validators.required,
    //       Validators.pattern(/^-?(0|[1-9]\d*)?$/),
    //       Validators.min(1),
    //     ]);
    //   } else {
    //     limitationControl.setValidators(null);
    //   }
    //   limitationControl.updateValueAndValidity();
    // });
    const promoType = this.regConfig.get("promo_type");
    const minValue = this.regConfig.get("min_value");
    const maxValue = this.regConfig.get("max_value");

    promoType.valueChanges.subscribe((value) => {
      if (value === "range") {
        minValue.setValidators([Validators.required]);
        maxValue.setValidators([Validators.required]);
      } else {
        minValue.clearValidators();
        maxValue.clearValidators();

        minValue.setValue("");
        maxValue.setValue("");
      }

      minValue.updateValueAndValidity();
      maxValue.updateValueAndValidity();
    });
  }

onSubmit() {
  if (this.regConfig.invalid) {
    this.regConfig.markAllAsTouched();
    this.categoryArray.markAsTouched();
    return;
  }

  // Create a clean payload without promo_type
  let req: any = {
    ...this.regConfig.value, // start with all values
    auth_role_id: "4",
    promo_image: this.existingPromoImage,
    use_type:'multiple',
    start_date: formatDate(this.regConfig.value.start_date, "YYYY-MM-DD"),
    expiry_date: formatDate(this.regConfig.value.expiry_date, "YYYY-MM-DD"),
  };

  // Keep the API payload safe even if category values were changed
  // programmatically instead of through the checkboxes.
  if (req.category.includes(this.discoverCategory)) {
    req.category = [this.discoverCategory];
  }

  // Remove promo_type from payload
  delete req.promo_type;

  // Only keep min_value and max_value if promo_type was 'range'
  if (this.regConfig.get("promo_type").value !== "range") {
    delete req.min_value;
    delete req.max_value;
  }

  // Then call add/update API
  switch (this.addOrUpdate) {
    case "add":
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("addPromocode", "post", {}, {}, req)
        .subscribe(
          (resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              if (this.fileToUpload) {
                this.updatePromocodeImage(resp.data.id);
              }
              this.swalService.alert.success("Added successfully.");
              this.regConfig.reset();
              this.updatePromoCode.emit({ tabId: "promocode_list" });
            } else {
              this.swalService.alert.oops();
            }
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops(err.error.Message);
          }
        );
      break;

    case "update":
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("updatePromocode", "post", {}, {}, req)
        .subscribe(
          (resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              if (this.fileToUpload) {
                this.updatePromocodeImage(this.regConfig.value.id);
              }
              this.swalService.alert.success("Updated successfully.");
              this.regConfig.reset();
              this.updatePromoCode.emit({ tabId: "promocode_list" });
            } else {
              this.swalService.alert.oops();
            }
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this.swalService.alert.oops();
          }
        );
      break;
  }
}
  get categoryArray() {
    return this.regConfig.get("category") as FormArray;
  }

  get startDateMinDate(): Date | null {
    return this.addOrUpdate === "add" ? this.minDate : null;
  }

  getPromoImageUrl(): string {
    if (!this.existingPromoImage) {
      return "";
    }

    if (/^https?:\/\//i.test(this.existingPromoImage)) {
      return this.existingPromoImage;
    }

    return `${environment.baseUrl}${this.existingPromoImage}`;
  }

onCategoryChange(event: any) {
  const categories = this.regConfig.get("category") as FormArray;
  const value = event.target.value;

  if (event.target.checked && value === this.discoverCategory) {
    categories.clear();
    categories.push(new FormControl(this.discoverCategory));
  } else if (event.target.checked) {
    // Other modules cannot be combined with Discover.
    if (this.isCategorySelected(this.discoverCategory)) {
      event.target.checked = false;
      return;
    }

    // Check if not already added to prevent duplicates
    const exists = categories.controls.some(control => control.value === value);
    if (!exists) {
      categories.push(new FormControl(value));
    }
  } else {
    const index = categories.controls.findIndex(x => x.value === value);
    if (index !== -1) {
      categories.removeAt(index);
    }
  }
  
  // Mark as touched for validation
  categories.markAsTouched();
}
  updatePromocodeImage(id) {
    let reqBody = new FormData();
    reqBody.append("image", this.fileToUpload);
    reqBody.append("id", id);
    this.apiHandlerService
      .apiHandler("uploadPromoImage", "post", {}, {}, reqBody)
      .subscribe((resp) => {
        if (resp) {
          this.swalService.alert.success("Updated successfully! ..!");
        }
      });
  }

  omitSpecialCharacters(event) {
    return this.utility.omitSpecialCharacters(event);
  }
  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
  }

 onReset() {
  this.settingService.promoCodeUpdateData.next({});
  this.regConfig.reset();
  this.fileToUpload = null;
  this.existingPromoImage = "";

  if (this.promoImageInput) {
    this.promoImageInput.nativeElement.value = "";
  }

  if (this.labelImport) {
    this.labelImport.nativeElement.innerText = "Upload Image";
  }
  
  // Clear category FormArray
  while (this.categoryArray.length) {
    this.categoryArray.removeAt(0);
  }
  
  // Set default values
  this.regConfig.patchValue({
    status: "1",
    promo_type: "normal"
  });
  
  this.addOrUpdate = "add";
}
  validateFileSize(fileSize) {
    if (fileSize > 1048576) {
      this.swalService.alert.oops("Maximum upload file size: 1 MB");
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
