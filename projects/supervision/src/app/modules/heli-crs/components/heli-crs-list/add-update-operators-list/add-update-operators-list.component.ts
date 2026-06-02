import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { HeliCrsService } from "../../../heli-crs.service";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from "rxjs/operators";

import { MatSelect } from "@angular/material/select";

import {
  ViewChild
} from "@angular/core"
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";

interface Country {
  id?: number;
  name: string;
  sortname?: string;
  phone_code?: string;
}

interface City {
  id: number;
  city_name: string;
}

interface State {
  id: number;
  name: string;
}

@Component({
  selector: "app-add-update-operators-list",
  templateUrl: "./add-update-operators-list.component.html",
  styleUrls: ["./add-update-operators-list.component.scss"],
})

export class AddUpdateOperatorsListComponent implements OnInit {
  @ViewChild("citySelect", { static: false })
  citySelect: MatSelect;
  public phoneCodes: any[] = [];
  countryList: Country[] = [];

  stateList: State[] = [];

  cityList: City[] = [];

  currentCountry: Country = null;

  private destroy$ = new Subject<void>();

  private searchSubject = new Subject<string>();

  citySearchText = "";

  loadingCities: boolean = false;

  citySkip = 1;

  cityLimit = 20;

  hasMoreCities = true;

  selectedCityForEdit: number | null = null;

  isEditTrigger = false;

  isCityLoadingForEdit = false;
  constructor(
    private heliCrsService: HeliCrsService,
    private formBuilder: FormBuilder,
    private swalService: SwalService,
    private apiHandlerServices: ApiHandlerService,
    private router: Router,
  ) { }

  public addUpdateOperatorsForm: any;
  public submitted: boolean = false;
  public isEdit: boolean = false;
  public existingKycDoc: string = '';
  public selectedKycFile: any = "";

  ngOnInit() {

    this.createForm();
    this.getCountryList();
    this.getPhoneCodeList();
    this.setupCountryChangeListener();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(search => {

        if (this.isEditTrigger) return;

        this.citySkip = 1;

        this.hasMoreCities = true;

        this.cityList = [];

        this.citySearchText = search;

        this.getCityListByCountry(
          this.currentCountry,
          search
        );

      });
   this.heliCrsService.getEditData.subscribe((resp) => {

  if (resp) {

    this.isEdit = true;

    this.isEditTrigger = true;

    // ✅ Find selected country object
   const selectedCountry = this.countryList.find(
  c =>
    c.id == resp.country ||
    c.name.toLowerCase() ==
    String(resp.country).toLowerCase()
);

    // ✅ Store city id for edit
    this.selectedCityForEdit = resp.city;

    // ✅ Prevent scroll api during edit loading
    this.isCityLoadingForEdit = true;

    this.addUpdateOperatorsForm.patchValue({

      operatorName: resp.operator_name,

      companyName: resp.company_name,

      dgcaLicenseNumber: resp.dgpa_licno,

      contactPerson: resp.contact_person,

      contactNumber: resp.contact_no,

      email: resp.email,

      countryCode: resp.country_code,

      officeAddress: resp.office_addr,

      state: resp.state,

      country: selectedCountry,

      gstNumber: resp.gst_no,

      status:
        (resp.status === "1" || resp.status === 1)
          ? true
          : false,

    });

    this.existingKycDoc = resp.kyc_doc || '';

  } else {

    this.isEdit = false;

    this.resetForm();

  }

});

  }
  compareCountries(c1: Country, c2: Country): boolean {

    return c1 && c2
      ? c1.name === c2.name
      : c1 === c2;

  }
  getPhoneCodeList() {

    this.apiHandlerServices
      .apiHandler(
        "phoneCodeList",
        "POST"
      )
      .subscribe((res: any) => {

        if (res && res.data.length) {

          this.phoneCodes = res.data;

        }

      });

  }
  // ========================= COUNTRY LIST =========================

  getCountryList() {

    this.apiHandlerServices
      .apiHandler(
        "supervisionCountryLists",
        "post",
        {},
        {}
      )
      .subscribe((resp: any) => {

        if (resp.Status && resp.data) {

          this.countryList = resp.data;

          const india = this.countryList.find(
            c => c.name.toLowerCase() === "india"
          );

          if (india) {

            this.addUpdateOperatorsForm.patchValue({
              country: india,
            });

            this.currentCountry = india;

          }

        }

      });

  }

  // ========================= STATE LIST =========================

  getStateList(country: any) {

    this.apiHandlerServices
      .apiHandler(
        "getMasterState",
        "POST",
        {},
        {},
        {
          country_id: country.id
        }
      )
      .subscribe((resp: any) => {

        if (resp.Status) {

          this.stateList = resp.data.data || [];

        } else {

          this.stateList = [];

        }

      });

  }

  // ========================= COUNTRY CHANGE =========================

  setupCountryChangeListener() {

    this.addUpdateOperatorsForm
      .get("country")
      .valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((country: Country) => {

        this.currentCountry = country;

        this.citySkip = 1;

        this.cityList = [];

        this.hasMoreCities = true;

        if (!country) return;

        this.getStateList(country);

        // if (this.isCityLoadingForEdit) return;

        const cityIdToSend = this.isEditTrigger
          ? this.selectedCityForEdit
          : null;

        this.getCityListByCountry(
          country,
          "",
          cityIdToSend
        );

      });

  }

  // ========================= CITY SEARCH =========================

  onCitySearch(value: string) {

    this.searchSubject.next(value);

  }

  // ========================= CITY LIST =========================

  getCityListByCountry(
    country: Country,
    search: string = "",
    selectedCity?: any
  ) {

    if (!country) return;

    this.loadingCities = true;

    const countryParam =
      country.sortname || country.name;

    this.apiHandlerServices
      .apiHandler(
        "supervisionCityLists",
        "post",
        {},
        {},
        {
          country_code: countryParam,
          skipLimit: this.citySkip,
          search: search,
          cityId: selectedCity
        }
      )
      .subscribe((resp: any) => {

        this.loadingCities = false;

        if (resp.Status && resp.data) {

          if (this.citySkip === 1) {

            this.cityList = resp.data;

          } else {

            this.cityList = [
              ...this.cityList,
              ...resp.data
            ];

          }

          if (resp.data.length < this.cityLimit) {

            this.hasMoreCities = false;

          }

          if (selectedCity) {

            setTimeout(() => {

              const found = this.cityList.find(
                c => c.id == selectedCity
              );

              if (found) {

                this.addUpdateOperatorsForm
                  .get("city")
                  .setValue(found.id);

                this.selectedCityForEdit = null;

                this.isEditTrigger = false;

                this.isCityLoadingForEdit = false;

              }

            });

          }

        }

      });

  }

  // ========================= CITY DROPDOWN =========================

  onCityDropdownOpen(open: boolean) {

    if (open) {

      setTimeout(() => {

        const panel =
          this.citySelect.panel.nativeElement;

        if (panel) {

          panel.addEventListener(
            "scroll",
            this.onCityScroll.bind(this)
          );

        }

      });

    }

  }

  // ========================= CITY SCROLL =========================

  onCityScroll(event: any) {

    if (this.isCityLoadingForEdit) return;

    const panel = event.target;

    const atBottom =
      panel.scrollHeight - panel.scrollTop
      <= panel.clientHeight + 10;

    if (
      atBottom &&
      this.hasMoreCities &&
      !this.loadingCities
    ) {

      this.citySkip += 1;

      this.getCityListByCountry(
        this.currentCountry,
        this.citySearchText
      );

    }
  }
  createForm() {

    this.addUpdateOperatorsForm = this.formBuilder.group({

      operatorName: new FormControl("", [
        Validators.required,
      ]),

      companyName: new FormControl("", [
        Validators.required,
      ]),
      countryCode: ["", Validators.required],
      dgcaLicenseNumber: new FormControl("", [
        Validators.required,
      ]),

      contactPerson: new FormControl("", [
        Validators.required,
      ]),

      contactNumber: new FormControl("", [
        Validators.required,
      ]),

      email: new FormControl("", [
        Validators.required,
        Validators.email,
      ]),

      officeAddress: new FormControl("", [
        Validators.required,
      ]),

      country: [null, Validators.required],

      state: ["", Validators.required],

      city: ["", Validators.required],

      gstNumber: new FormControl(""),

      status: new FormControl(true),

    });

  }

  // FILE SELECT
  onFileSelect(event: any) {

    if (event.target.files.length > 0) {

      this.selectedKycFile = event.target.files[0];

    }

  }

  onSubmit() {

    this.submitted = true;

    // form validation
    if (
      this.addUpdateOperatorsForm.invalid ||
      (!this.selectedKycFile && !this.isEdit)
    ) {
      return;
    }

    const formData = new FormData();

    formData.append(
      "status",
      this.addUpdateOperatorsForm.value.status ? "1" : "0"
    );

    formData.append(
      "operator_name",
      this.addUpdateOperatorsForm.value.operatorName
    );

    formData.append(
      "company_name",
      this.addUpdateOperatorsForm.value.companyName
    );

    formData.append(
      "dgca_licno",
      this.addUpdateOperatorsForm.value.dgcaLicenseNumber
    );

    formData.append(
      "contact_no",
      this.addUpdateOperatorsForm.value.contactNumber
    );

    formData.append(
      "contact_person",
      this.addUpdateOperatorsForm.value.contactPerson
    );

    formData.append(
      "email",
      this.addUpdateOperatorsForm.value.email
    );

    formData.append(
      "office_addr",
      this.addUpdateOperatorsForm.value.officeAddress
    );

    formData.append(
      "city",
      this.addUpdateOperatorsForm.value.city
    );

    formData.append(
      "country_code",
      this.addUpdateOperatorsForm.value.countryCode
    );

    formData.append(
      "state",
      this.addUpdateOperatorsForm.value.state
    );

    formData.append(
      "country",
      this.addUpdateOperatorsForm.value.country.id
    );

    formData.append(
      "gst_no",
      this.addUpdateOperatorsForm.value.gstNumber
    );

    // FILE HANDLING (add + edit)
    if (this.selectedKycFile) {
      formData.append("kyc_doc", this.selectedKycFile);
    } else if (this.isEdit && this.existingKycDoc) {
      formData.append("kyc_doc", this.existingKycDoc);
    }

    // EDIT ID
    if (this.isEdit) {
      formData.append(
        "id",
        this.heliCrsService.getEditData.value.id
      );
    }

    let data: any = [];
    data[0] = formData;
    data["topic"] = this.isEdit
      ? "updateHeliOperator"
      : "addHeliOperator";

    this.heliCrsService.create(data).subscribe(

      (resp: any) => {

        // SUCCESS
        if (resp.Status === true &&
          (resp.statusCode === 200 || resp.statusCode === 201)) {

          this.swalService.alert.success(
            this.isEdit
              ? "Operator updated successfully"
              : "Operator added successfully"
          );
this.resetForm()
          this.heliCrsService.tabSwitch$.next('list_operators');
          
          this.submitted = false;
          return;
        }

        // ❌ 404 or backend failure
        this.swalService.alert.error(
          resp.Message || "Something went wrong"
        );

      },

      (err: HttpErrorResponse) => {

        // ❌ API ERROR HANDLING (404 included)
        const msg =
          err.status === 404
            ? "API not found (404)"
            : err.error.Message || "Server error occurred";

        this.swalService.alert.error(msg);
      }

    );
  }

  @ViewChild("kycFileInput", { static: false })
  kycFileInput: any;



  resetForm() {

    this.isEdit = false;

    this.addUpdateOperatorsForm.reset();

    this.selectedKycFile = "";

    if (this.kycFileInput) {

      this.kycFileInput.nativeElement.value = "";

    }

    this.cityList = [];

    this.stateList = [];

    this.submitted = false;

    const india = this.countryList.find(
      c => c.name.toLowerCase() === "india"
    );

    const indiaPhone = this.phoneCodes.find(
      p =>
        p.code === "IN" ||
        p.country_code === "IN" ||
        p.phone_code === "91"
    );

    this.addUpdateOperatorsForm.patchValue({

      country: india || null,

      countryCode: indiaPhone
        ? indiaPhone.phone_code
        : "91",

      status: true,

    });

    if (india) {

      this.currentCountry = india;

    }




  }

}
