import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { ThemeOptions } from "../../../theme-options";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FlightService } from "../../../modules/search/flight/flight.service";
import { ApiHandlerService } from "../../../core/api-handlers";
import { UtilityService } from "../../../core/services/utility.service";
import { untilDestroyed } from "../../../core/services";
import { NgbAccordion, NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SwalService } from "../../../core/services/swal.service";
import { SubSink } from "subsink";
import { DomainLogoService } from "../../../modules/domain-logo/domain-logo.service";
import { AuthService } from "../../../auth/auth.service";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit, OnDestroy {
  public HeaderLogo: string = "assets/images/login-images/l-logo.svg";
  public searchIcon: string = "assets/images/awesome-search.png";
  public extraParameter: any;
  @ViewChild("myaccordion", { static: true }) accordion: NgbAccordion;
  public logo: any;
  tabSubscription: any;
  searchTabValue: any;
  selectedSidebar: any = "searchMenus";
  regConfig: FormGroup;
  navigationData: any;

  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private flightService: FlightService,
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private swalService: SwalService,
    private domainLogo:DomainLogoService,
    private authService:AuthService
  ) { }

  @select("config") public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = "searchMenus";
  keepActive: boolean = false;
  SEARCH_SYSTEM = "p2";
  ADMINISTRATOR = "p5";
  REPORTS = "p8";
  QUEUE_SYSTEM = "p11";
  ACCOUNT_SYSTEM = "p15";
  AGENT_TOOLS = "p25";
  MARKUP_MANAGEMENT = "p30";
  SUPPORT_TICKETS = "p33";
  DOMAIN_LOGO = "p31";
  loggedInUser: any;
  domainSideLogo:any;
  private subSunk = new SubSink();
  showMakePayment: boolean = true;

  toggleSidebar(menuId?: any) {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar;
    this.authService.toggleSidebar.next(this.globals.toggleSidebar);
  }
  logoConfig = new FormGroup({
    domain_logo: new FormControl(null, Validators.required),
  });

  beforeChange($event: NgbPanelChangeEvent) {
    this.globals.toggleSidebar = false;
    this.flightService.sidebarEventChange($event.panelId);
    sessionStorage.setItem(
      "SelectedMenu",
      JSON.stringify({ activeMenu: $event.panelId })
    );
    this.cdr.detectChanges();
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = true;
  }

  ngOnInit() {
    this.setDomainLogo();
    this.setSubAgentPrivilleges();
    this.loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.loggedInUser)
    {
      this.showMakePayment = this.loggedInUser.payment_pref != 'Credit Card';

    }
    this.domainLogo.domainLogo.subscribe(res=>{
      this.domainSideLogo =res;
    })
    if (this.loggedInUser["auth_role_id"] == 5) this.getPrevilegeForThisUser();
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      console.log(this.innerWidth)
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });
    this.getDomainLogo();
    this.regConfig = this.fb.group({
      input: new FormControl("", [
        Validators.maxLength(50),
        Validators.minLength(10),
      ]),
    });
    const SelectedMenu =
      JSON.parse(sessionStorage.getItem("SelectedMenu")) || {};
    if (SelectedMenu && SelectedMenu.activeMenu) {
      this.selectedSidebar = SelectedMenu.activeMenu;
    }
    // this.getLogo();
  }
  // getLogo() {
  //   const user = JSON.parse(sessionStorage.getItem('currentUser'));
  //   const formData = new FormData();
  //   formData.append('image', this.HeaderLogo);
  //   formData.append('id', user.id);
  //   this.subSunk.sink = this.apiHandlerService.apiHandler('getDomainLogo', 'post', {}, {}, formData)
  //     .subscribe(resp => {
  //       console.log("resp", resp);
  //       if (resp.statusCode == 200 || resp.statusCode == 201) {
  //         window.open(resp.data.url);
  //       }
  //       else {
  //         this.swalService.alert.oops(resp.msg);
  //       }
  //     });
  // }
setDomainLogo(){
  const storedState = JSON.parse(sessionStorage.getItem("currentUser"));
  if (storedState) {
      this.domainLogo.domainLogo.next((storedState));
  }
}
getPrevilegeForThisUser() {
  this.authService.privillegs.subscribe(res=>{
      this.navigationData = res; 
      this.globals.toggleSidebar = false;
  })
}
  ngAfterViewInit() {
    this.tabSubscription = this.flightService.changeEmitted$.subscribe(
      (tabvalue) => {
        this.searchTabValue = tabvalue;
      }
    );
  }

  onKeyUp(e) {
    let app_reference = String(e.target.value).trim();
    app_reference.length > 10 &&
      this.apiHandlerService
        .apiHandler(
          "searchByBookindId",
          "post",
          {},
          {},
          {
            app_reference,
          }
        )
        .pipe(untilDestroyed(this))
        .subscribe(
          (resp) => {
            if (
              (resp.statusCode == 200 || resp.statusCode == 201) &&
              resp.hasOwnProperty("data")
            ) {
              if (resp.data.moduleName == "Flight") {
                this.router.navigate(["/reports/flight-booking-details"], {
                  queryParams: { appRef: resp.data.app_reference },
                });
              } else if (resp.data.moduleName == "Hotel") {
                this.router.navigate(["/reports/hotel-booking-details"], {
                  queryParams: { appRef: resp.data.app_reference },
                });
              }
                else if (resp.data.moduleName == "Tour") {
                  this.router.navigate(["/reports/tour-booking-details"], {
                    queryParams: { appRef: resp.data.app_reference },
                  });
                } else if (resp.data.moduleName == "TourEnquiry") {
                  this.router.navigate(["/reports/tour-enquiry-details"], {
                    queryParams: { appRef: resp.data.app_reference },
                  });
              }
            } else {
            }
          },
          (err) => {
          }
        );
  }

  getDomainLogo() {
    const data = {
      agent_id: this.utility.readStorage("currentUser", sessionStorage)[
        "user_id"
      ],
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    // console.log(this.newInnerWidth)
    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }
  }

  resetSearchForm() {
    this.flightService.formFilled = false;
    this.flightService.resetSearch();
    this.flightService.emitChange("flights");
  }
  goToHotels() {
    this.flightService.emitChange("hotels");
  }
  goToActivity() {
    this.flightService.emitChange("activity");
  }

  goToTransfer() {
    this.flightService.emitChange("transfer");
  }
  goToInsurence() {
    this.flightService.emitChange("insurence");
  }

  goToTour() {
    this.flightService.emitChange("tour");
  }

  isMenuExists(menu) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu)) return true;
      else return false;
    } else {
      return true;
    }
  }

  isSubMenuExists(menu, parent_key = null) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (
        this.navigationData.some(
          (el) => el.description == menu && el.parent_key == parent_key
        )
      )
        return true;
      else return false;
    } else {
      return true;
    }
  }
  setSubAgentPrivilleges() {
    const storedState = localStorage.getItem('userPrevilige');
    if (storedState) {
        this.authService.privillegs.next(JSON.parse(storedState));
    }
}

  // getPrevilegeForThisUser() {
  //   this.navigationData = JSON.parse(sessionStorage.getItem("userPrevilige"));
  //   this.globals.toggleSidebar = false;
  // }

  ngOnDestroy() { }
}
