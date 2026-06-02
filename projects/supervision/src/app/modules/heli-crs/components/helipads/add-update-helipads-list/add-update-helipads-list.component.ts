import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";

import {
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

import { Router } from "@angular/router";

import { Subject } from "rxjs";

import {
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from "rxjs/operators";

import { MatSelect } from "@angular/material/select";

import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";

import { SwalService } from "projects/supervision/src/app/core/services/swal.service";

import { HeliCrsService } from "../../../heli-crs.service";

interface Country {
  id?: number;
  name: string;
  sortname?: string;
}

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  city_name: string;
}

@Component({
  selector: "app-add-update-helipads-list",
  templateUrl: "./add-update-helipads-list.component.html",
  styleUrls: ["./add-update-helipads-list.component.scss"]
})

export class AddUpdateHelipadsListComponent implements OnInit {

  @ViewChild("citySelect", { static: false })
  citySelect: MatSelect;

  addUpdateHelipadForm: any;

  submitted: boolean = false;

  isEdit: boolean = false;

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
  constructor(
    private formBuilder: FormBuilder,
    private apiHandlerServices: ApiHandlerService,
    private swalService: SwalService,
    private heliCrsService: HeliCrsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.createForm();

    this.getCountryList();
this.getOperatorsList()
    this.setupCountryChangeListener();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(search => {

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

    // ✅ find country object
    const selectedCountry = this.countryList.find(
      c =>
        c.id == resp.country ||
        c.name.toLowerCase() ==
        String(resp.country).toLowerCase()
    );

    // ✅ store city id
    this.selectedCityForEdit = resp.city;

    this.addUpdateHelipadForm.patchValue({

      operator_id: resp.operator_id,

      helipadName: resp.helipad_name,

      mapLocation: resp.map_location,

      latitude: resp.latitude,

      longitude: resp.longitude,

      helipadCode: resp.helipad_code,

      description: resp.description,

      state: resp.state,

      country: selectedCountry,

      status:
        (resp.status === "1" || resp.status === 1)

    });

  }

});

  }

  createForm() {

    this.addUpdateHelipadForm = this.formBuilder.group({

      helipadName: new FormControl("", [
        Validators.required
      ]),
 operator_id: new FormControl(
          null,
          [Validators.required]
        ),
      country: [null, Validators.required],

      state: ["", Validators.required],

      city: ["", Validators.required],

      mapLocation: new FormControl("", [
        Validators.required
      ]),

      latitude: new FormControl("", [
        Validators.required
      ]),

      longitude: new FormControl("", [
        Validators.required
      ]),

      helipadCode: new FormControl("", [
        Validators.required
      ]),

      description: new FormControl(""),

      status: new FormControl(true)

    });

  }

  compareCountries(c1: Country, c2: Country): boolean {

    return c1 && c2
      ? c1.name === c2.name
      : c1 === c2;

  }

  // ================= COUNTRY =================

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

            this.addUpdateHelipadForm.patchValue({
              country: india
            });

            this.currentCountry = india;

          }

        }

      });

  }

  setupCountryChangeListener() {

    this.addUpdateHelipadForm
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

  // ================= STATE =================

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

  // ================= CITY =================

  onCitySearch(value: string) {

    this.searchSubject.next(value);

  }

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

      this.addUpdateHelipadForm
        .get("city")
        .setValue(found.id);

      this.selectedCityForEdit = null;

      this.isEditTrigger = false;

    }

  });

}

        }

      });

  }

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

  onCityScroll(event: any) {

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

  // ================= SUBMIT =================

  onSubmit() {

    this.submitted = true;

    if (this.addUpdateHelipadForm.invalid) {
      return;
    }

    const payload = {

      status: this.addUpdateHelipadForm.value.status
        ? "1"
        : "0",

      helipad_name:
        this.addUpdateHelipadForm.value.helipadName,

      country:
        this.addUpdateHelipadForm.value.country.id,

      state:
        this.addUpdateHelipadForm.value.state,
operator_id:
        this.addUpdateHelipadForm.value.operator_id,
      city:
        this.addUpdateHelipadForm.value.city,

      map_location:
        this.addUpdateHelipadForm.value.mapLocation,

      latitide:
        this.addUpdateHelipadForm.value.latitude,

      longitude:
        this.addUpdateHelipadForm.value.longitude,

      helipad_code:
        this.addUpdateHelipadForm.value.helipadCode,

      Description:
        this.addUpdateHelipadForm.value.description

    };
console.log(payload,"payghvhj")
    // EDIT ID
    if (this.isEdit) {

      payload["id"] =
        this.heliCrsService.getEditData.value.id;

    }

    let data: any = [];

    data[0] = payload;

    data["topic"] = this.isEdit
      ? "updateHelipad"
      : "addHelipad";

    this.heliCrsService.create(data).subscribe(

      (resp: any) => {

        // SUCCESS
        if (
          resp.Status === true &&
          (
            resp.statusCode === 200 ||
            resp.statusCode === 201
          )
        ) {

          this.swalService.alert.success(

            this.isEdit
              ? "Helipad updated successfully"
              : "Helipad added successfully"

          );
this.resetForm()
          // SWITCH TO LIST TAB
          this.heliCrsService
            .tabSwitch$
            .next('list_helipads');


        } else {
  this.heliCrsService
    .tabSwitch$
    .next('list_helipads');
          // BACKEND FAILURE
          this.swalService.alert.error(
            resp.Message || "Something went wrong"
          );

        }

      },

      (err) => {

        // API ERROR
        this.swalService.alert.error(

          err.error.Message ||
          "Server error occurred"

        );

      }

    );

  }
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
  // ================= RESET =================

  resetForm() {

    this.submitted = false;

    this.isEdit = false;

    this.addUpdateHelipadForm.reset();

    this.cityList = [];

    this.stateList = [];

    const india = this.countryList.find(
      c => c.name.toLowerCase() === "india"
    );

    this.addUpdateHelipadForm.patchValue({

      country: india || null,

      status: true

    });

    if (india) {

      this.currentCountry = india;

    }

  }

}
