import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { MatSelect } from "@angular/material/select";
import {
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

import { Router } from "@angular/router";

import {
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from "rxjs/operators";

import { Subject } from "rxjs";

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
  selector: "app-add-update-routes-list",
  templateUrl: "./add-update-routes-list.component.html",
  styleUrls: ["./add-update-routes-list.component.scss"]
})

export class AddUpdateRoutesListComponent implements OnInit {
@ViewChild("citySelect", { static: false })
citySelect: MatSelect;

@ViewChild("toCitySelect", { static: false })
toCitySelect: MatSelect;

  addUpdateRoutesForm: any;

  submitted = false;

  isEdit = false;

  countryList: Country[] = [];

  stateList: State[] = [];

  currentCountry: Country = null;

  private destroy$ = new Subject<void>();
fromCityList: City[] = [];

toCityList: City[] = [];

private fromCitySearchSubject =
  new Subject<string>();

private toCitySearchSubject =
  new Subject<string>();

  citySearchText = "";

  loadingCities = false;

  citySkip = 1;

  cityLimit = 20;

  hasMoreCities = true;
  selectedFromCityForEdit: number | null = null;

selectedToCityForEdit: number | null = null;

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
    this.getAllHelipads();
    this.setupCountryChangeListener();
  // FROM CITY SEARCH
this.fromCitySearchSubject
  .pipe(
    debounceTime(300),
    distinctUntilChanged()
  )
  .subscribe(search => {

    this.citySkip = 1;

    this.hasMoreCities = true;

    this.fromCityList = [];

    this.citySearchText = search;

    this.getCityListByCountry(
      this.currentCountry,
      search,
      [],
      'from'
    );

  });

// TO CITY SEARCH
this.toCitySearchSubject
  .pipe(
    debounceTime(300),
    distinctUntilChanged()
  )
  .subscribe(search => {

    this.citySkip = 1;

    this.hasMoreCities = true;

    this.toCityList = [];

    this.citySearchText = search;

    this.getCityListByCountry(
      this.currentCountry,
      search,
      [],
      'to'
    );

  });
    // EDIT DATA
  

  }
  parseHelipad(value: any): any {

  // already array
  if (Array.isArray(value)) {
    return value[0];
  }

  // stringified array like "[1]"
  if (typeof value === 'string') {

    try {

      const parsed = JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed[0]
        : parsed;

    } catch (e) {

      return value;

    }

  }

  return value;

}
onCityDropdownOpen(open: boolean) {

  if (!open) return;

  setTimeout(() => {

    // FROM CITY PANEL
    if (
      this.citySelect &&
      this.citySelect.panel
    ) {

      this.citySelect.panel
        .nativeElement
        .addEventListener(
          "scroll",
          this.onCityScroll.bind(this)
        );

    }

    // TO CITY PANEL
    if (
      this.toCitySelect &&
      this.toCitySelect.panel
    ) {

      this.toCitySelect.panel
        .nativeElement
        .addEventListener(
          "scroll",
          this.onCityScroll.bind(this)
        );

    }

  });

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
  this.citySearchText,
  [],
  'from'
);

this.getCityListByCountry(
  this.currentCountry,
  this.citySearchText,
  [],
  'to'
);





  }

}
  // ================= FORM =================

  createForm() {

    this.addUpdateRoutesForm =
      this.formBuilder.group({

        tripType: new FormControl(
          "within",
          [Validators.required]
        ),

        routeName: new FormControl(
          "",
          [Validators.required]
        ),

        country: [
          null,
          Validators.required
        ],

        // state: [
        //   "",
        //   Validators.required
        // ],

        fromCity: new FormControl(
          "",
          [Validators.required]
        ),

        toCity: new FormControl(
          "",
          [Validators.required]
        ),

        fromHelipad: new FormControl(
          "",
          [Validators.required]
        ),

        toHelipad: new FormControl(
          "",
          [Validators.required]
        ),

        distance: new FormControl(
          "",
          [Validators.required]
        ),

        duration: new FormControl(
          "",
          [Validators.required]
        ),

        description: new FormControl(""),

        status: new FormControl(true)

      });

  }

  // ================= COUNTRY =================

  compareCountries(c1: Country, c2: Country): boolean {

    return c1 && c2
      ? c1.id === c2.id
      : c1 === c2;

  }

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

          const india =
            this.countryList.find(
              c =>
                c.name.toLowerCase() === "india"
            );

         if (india) {

  this.currentCountry = india;

  // EDIT DATA PATCH HERE
  const resp =
    this.heliCrsService
      .getEditData
      .value;

  if (resp) {

    this.isEdit = true;

    this.isEditTrigger = true;

    this.selectedFromCityForEdit =
      resp.city;

    this.selectedToCityForEdit =
      resp.to_city;

    this.addUpdateRoutesForm.patchValue({

      tripType:
        resp.type || resp.trip_type,

      routeName:
        resp.route_name,

      country: india,

      fromHelipad:
        this.parseHelipad(
          resp.from_helipad
        ),

      toHelipad:
        this.parseHelipad(
          resp.to_helipad
        ),

      distance:
        resp.distance,

      duration:
        resp.duration,

      description:
        resp.description,

      status:
        (
          resp.status === "1" ||
          resp.status === 1
        )

    });

  } else {

    this.addUpdateRoutesForm.patchValue({
      country: india
    });

  }

}

        }

      });

  }

  setupCountryChangeListener() {

    this.addUpdateRoutesForm
      .get("country")
      .valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((country: Country) => {

        this.currentCountry = country;

        this.citySkip = 1;
this.fromCityList = [];
this.toCityList = [];

        this.hasMoreCities = true;

        if (!country) {

          // this.stateList = [];

          return;

        }

        // this.getStateList(country);
if (this.isEditTrigger) {

  // FROM CITY
  this.getCityListByCountry(
    country,
    "",
    [this.selectedFromCityForEdit],
    "from"
  );

  // TO CITY
  this.getCityListByCountry(
    country,
    "",
    [this.selectedToCityForEdit],
    "to"
  );

} else {

  this.getCityListByCountry(
    country,
    "",
    [],
    "from"
  );

  this.getCityListByCountry(
    country,
    "",
    [],
    "to"
  );

}

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

          this.stateList =
            resp.data.data || [];

        } else {

          this.stateList = [];

        }

      });

  }
  // ================= CITY =================

onFromCitySearch(value: string) {

  this.fromCitySearchSubject.next(value);

}

onToCitySearch(value: string) {

  this.toCitySearchSubject.next(value);

}

 getCityListByCountry(
 country: Country,
  search: string = "",
  selectedCities: any[] = [],
  type: 'from' | 'to' = 'from'
) {

    if (!country) return;

    this.loadingCities = true;

    const countryParam =
      country.sortname || country.name;
if (search) {

  this.citySkip = 1;

}
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
  cityId: selectedCities
        }
      )
      .subscribe((resp: any) => {

        this.loadingCities = false;

        if (resp.Status && resp.data) {

if (
  this.citySkip === 1 ||
  search
) {

  if (type === 'from') {

    this.fromCityList = resp.data;

  } else {

    this.toCityList = resp.data;

  }

} else {

  if (type === 'from') {

    this.fromCityList = [
      ...this.fromCityList,
      ...resp.data
    ];

  } else {

    this.toCityList = [
      ...this.toCityList,
      ...resp.data
    ];

  }

} 

          if (
            resp.data.length <
            this.cityLimit
          ) {

            this.hasMoreCities = false;

          }
if (
  selectedCities &&
  selectedCities.length
) {

  setTimeout(() => {

    if (type === 'from') {

      const fromFound =
        this.fromCityList.find(
          c =>
            c.id ==
            this.selectedFromCityForEdit
        );

      if (fromFound) {

        this.addUpdateRoutesForm
          .get("fromCity")
          .setValue(fromFound.id);

      }

    }

    if (type === 'to') {

      const toFound =
        this.toCityList.find(
          c =>
            c.id ==
            this.selectedToCityForEdit
        );

      if (toFound) {

        this.addUpdateRoutesForm
          .get("toCity")
          .setValue(toFound.id);

      }

    }

  });

}

        }

      });

  }
  // ================= SUBMIT =================

  onSubmit() {

    this.submitted = true;

    if (this.addUpdateRoutesForm.invalid) {

      this.addUpdateRoutesForm
        .markAllAsTouched();

      return;

    }

    const formValue =
      this.addUpdateRoutesForm.value;

    const payload: any = {

      type:
        formValue.tripType,

      route_name:
        formValue.routeName,

      // country:
      //   formValue.country.id,

      // state:
      //   Number(formValue.state),

      city:
        formValue.fromCity,

      to_city:
        formValue.toCity,

      from_helipad:
        [formValue.fromHelipad]
      ,

      to_helipad:
        [formValue.toHelipad]
      ,

      distance:
        formValue.distance,

      duration:
        formValue.duration,

      description:
        formValue.description,

      status:
        formValue.status
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
      ? "updateHeliRoute"
      : "addHeliRoute";

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
                ? "Route updated successfully."
                : "Route added successfully."
            );
            this.resetForm()
            this.heliCrsService.tabSwitch$.next('list_routes');
            // this.router.navigate(
            //   ["/heli/heli-routes"],
            //   {
            //     queryParams: {
            //       tab: "list_routes"
            //     }
            //   }
            // );

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

    this.addUpdateRoutesForm.reset();

    this.stateList = [];

    const india =
      this.countryList.find(
        c =>
          c.name.toLowerCase() === "india"
      );

    this.addUpdateRoutesForm.patchValue({

      tripType: "within",

      country: india || null,

      status: true

    });

    if (india) {

      this.currentCountry = india;

      // this.getStateList(india);
this.getCityListByCountry(
  india,
  "",
  [],
  "from"
);

this.getCityListByCountry(
  india,
  "",
  [],
  "to"
);

    }

  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }
  helipadList: any[] = [];
  filteredHelipadList: any[] = [];
  getAllHelipads() {

    const data = {
      topic: "listHeliPad"
    };

    this.heliCrsService.fetch(data).subscribe(

      (resp: any) => {

        if (
          resp.Status === true &&
          (
            resp.statusCode === 200 ||
            resp.statusCode === 201
          )
        ) {

          this.helipadList = resp.data || [];
          this.filteredHelipadList = resp.data || [];

        } else {

          this.helipadList = [];
          this.filteredHelipadList = [];

        }

      },

      (err: any) => {

        this.swalService.alert.error(
          err.error.Message || "Something went wrong."
        );

      }

    );

  }
}
