import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { IPermissions } from '../../../auth/permissions.interface';
import { AuthService } from '../../../auth/auth.service';
import { SettingService } from '../../../modules/settings/setting.service';
import { environment } from 'projects/supervision/src/environments/environment.prod';

const baseUrl = environment.baseUrl
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public extraParameter: any = ['dashboardsMenus1'];
  manageDomainData: any;
  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService:AuthService,
    private domainLogo:SettingService
  ) {

  }

  @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';
  private subSunk = new SubSink();
  navigationData: any;
  loggedInUser: any;
  userpermissions: IPermissions;
  USER_MANAGEMENT = 'p3';
  REPORTS = 'p6';
  REPORTS_B2B = 'p41';
  GROUP_BOOKING = 'p9';
  TRANSACTION_LOGS = 'p12';
  MASTER_BALANCE_MANAGER = 'p50';
  COMMISSION = 'p54';
  ACCOUNT_MANAGER = 'p58';
  MARKUP = 'p24';
  CONTENT_MANAGEMENT = 'p16';
  USER_MANAGEMENT_B2B = 'p36';
  HOME_PAGE_WIDGET = 'p17';
  B2B_CMS = 'p63';
  SETTINGS = 'p30';
  SETTINGS_B2B = 'p67';
  SETTINGS_G = 'p88';
  HOTELCRS='p71';
 TOUR_CRS='p79';
 ACTIVITY_CRS='p88';
 WELLNESS_CRS='p96';
 TRANSFER_CRS='p95';
 SETTING='p101';

 DMCB2CREPORTSCRS ='p6';
 DMCB2BREPORTSCRS = 'p41';
 DMCHOTELCRS = 'p71';
 DMCACTIVITYCRS = 'p88';
 DMCTRANSFERCRS = 'p94';
 DMCTOURCRS = 'p79';
 showYatraCrs: boolean = false;
 showxperiencesCrs: boolean = false;
 domainSideLogo:any
 domainUser:any;
  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar
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

  showActivityCrs: boolean = false;
  showHotelCrs: boolean = false;
  showWellnessCrs: boolean = false;
    showHeliCrs: boolean = false;
  showTourCrs: boolean = false;
  showTransferCrs: boolean = false;

  showB2CReports: boolean = false;
  showB2BReports: boolean = false;

  private get currentRoleId(): number {
    return Number(this.loggedInUser && this.loggedInUser.auth_role_id);
  }

  private get selectedSupplierKeys(): string[] {
    const suppliers = this.loggedInUser && (
      this.loggedInUser.selectedSuppliers ||
      this.loggedInUser.selected_suppliers ||
      this.loggedInUser.supplier ||
      this.loggedInUser.suppliers
    );
    if (Array.isArray(suppliers)) {
      return suppliers.map((supplier) => this.normalizeSupplierKey(supplier));
    }
    if (typeof suppliers === 'string') {
      try {
        const parsedSuppliers = JSON.parse(suppliers);
        if (Array.isArray(parsedSuppliers)) {
          return parsedSuppliers.map((supplier) => this.normalizeSupplierKey(supplier));
        }
      } catch (_) {
        // Older responses store the selected services as comma-separated text.
      }
      return suppliers.split(',').map((supplier) => this.normalizeSupplierKey(supplier));
    }
    return [];
  }

  private normalizeSupplierKey(supplier: any): string {
    const key = String(supplier || '').trim().toLowerCase();
    const aliases = {
      cab: 'transfer',
      cabs: 'transfer',
      'travel-helicopter': 'heli',
      'travel-heli': 'heli'
    };

    return aliases[key] || key;
  }

  isSupplierPanelUser(): boolean {
    return this.currentRoleId === 6 || this.currentRoleId === 7;
  }

  hasSupplier(supplier: string): boolean {
    if (!this.isSupplierPanelUser()) {
      return true;
    }
    return this.selectedSupplierKeys.includes(this.normalizeSupplierKey(supplier));
  }

  hasAnySupplier(suppliers: string[]): boolean {
    if (!this.isSupplierPanelUser()) {
      return true;
    }
    return suppliers.some((supplier) => this.hasSupplier(supplier));
  }

  shouldShowSupplierModule(supplier: string, currentVisibility: boolean): boolean {
    return this.isSupplierPanelUser() ? this.hasSupplier(supplier) : currentVisibility;
  }

  hasAnyReportMenu(): boolean {
    if (!this.isSupplierPanelUser()) {
      return this.isMenuExists('B2C Hotel Report');
    }

    const supplierTypes = String(this.loggedInUser && this.loggedInUser.supplier_type || '')
      .split(',')
      .map((type) => type.trim().toUpperCase());

    return supplierTypes.includes('B2C') && this.hasAnySupplier([
      'stays',
      'experiences',
      'yatra-packages',
      'cabs',
      'wellness-retreat',
      'travel-heli'
    ]);
  }

  private hasNavigationData(): boolean {
    return Array.isArray(this.navigationData) && this.navigationData.length > 0;
  }

  private hasMenuDescription(menu: string): boolean {
    return this.hasNavigationData() && this.navigationData.some((el) => el.description == menu);
  }

  private hasSubMenuDescription(menu: string, parent_key = null): boolean {
    return this.hasNavigationData() && this.navigationData.some((el) => el.description == menu && el.parent_key == parent_key);
  }

  private hasAnySubMenu(parent_key: string): boolean {
    return this.hasNavigationData() && this.navigationData.some((el) => el.parent_key == parent_key);
  }

  private hasSupplierMenuPermission(menu: string): boolean {
    if (!this.hasNavigationData()) {
      return true;
    }

    return this.hasMenuDescription(menu) || this.hasSupplierMenuSubPermission(menu);
  }

  private hasSupplierMenuSubPermission(menu: string): boolean {
    if (menu == 'Hotel CRS') {
      return this.hasAnySubMenu(this.HOTELCRS);
    }
    if (menu == 'Tour CRS') {
      return this.hasAnySubMenu(this.TOUR_CRS);
    }
    if (menu == 'Activity CRS') {
      return this.hasAnySubMenu(this.ACTIVITY_CRS);
    }
    if (menu == 'Transfer CRS') {
      return this.hasAnySubMenu(this.TRANSFER_CRS) || this.hasAnySubMenu(this.DMCTRANSFERCRS);
    }
    if (menu == 'Wellness CRS') {
      return this.hasAnySubMenu(this.WELLNESS_CRS);
    }

    return false;
  }

  private isSupplierMenuAllowed(menu: string): boolean {
    if (!this.isSupplierPanelUser()) {
      return true;
    }

    const supplierTypes = String(this.loggedInUser && this.loggedInUser.supplier_type || '')
      .split(',')
      .map((type) => type.trim().toUpperCase());

    if (menu == 'B2C') {
      return supplierTypes.includes('B2C');
    }
    if (menu == 'Dashboard') {
      return true;
    }
    if (menu == 'B2C Hotel Report') {
      return supplierTypes.includes('B2C') && this.hasAnySupplier(['stays', 'wellness-retreat', 'heli']);
    }
    if (menu == 'B2C Activity Report') {
      return supplierTypes.includes('B2C') && this.hasSupplier('experiences');
    }
    if (menu == 'B2C Tour Report') {
      return supplierTypes.includes('B2C') && this.hasSupplier('yatra-packages');
    }
    if (menu == 'B2C Transfer Report') {
      return supplierTypes.includes('B2C') && this.hasSupplier('transfer');
    }
    if (menu == 'Hotel CRS') {
      return this.hasSupplier('stays');
    }
    if (menu == 'Tour CRS') {
      return this.showTourCrs;
    }
    if (menu == 'Activity CRS') {
      return this.showActivityCrs;
    }
    if (menu == 'Transfer CRS') {
      return this.hasSupplier('transfer');
    }
    if (menu == 'Wellness CRS') {
      return this.showWellnessCrs;
    }

    return false;
  }

  private isSupplierSubMenuAllowed(menu: string, parent_key = null): boolean {
    if (!this.isSupplierPanelUser()) {
      return true;
    }

    if (parent_key == this.REPORTS) {
      if (menu == 'B2C Hotel Report') {
        return this.showB2CReports && this.hasAnySupplier(['stays', 'wellness-retreat', 'heli']);
      }
      if (menu == 'B2C Activity Report') {
        return this.showB2CReports && this.hasSupplier('experiences');
      }
      if (menu == 'B2C Tour Report') {
        return this.showB2CReports && this.hasSupplier('yatra-packages');
      }
      if (menu == 'B2C Transfer Report') {
        return this.showB2CReports && this.hasSupplier('transfer');
      }

      return false;
    }
    if (parent_key == this.REPORTS_B2B) {
      return this.showB2BReports;
    }
    if (parent_key == this.HOTELCRS) {
      return this.hasSupplier('stays');
    }
    if (parent_key == this.TOUR_CRS) {
      return this.showTourCrs;
    }
    if (parent_key == this.ACTIVITY_CRS) {
      return this.showActivityCrs;
    }
    if (parent_key == this.TRANSFER_CRS || parent_key == this.DMCTRANSFERCRS) {
      return this.hasSupplier('transfer');
    }
    if (parent_key == this.WELLNESS_CRS) {
      const heliMenus = [
        'Heli CRS List',
        'Helipads',
        'Heli Routes',
        'Heli Schedules',
        'Heli Pricing',
        'Terms & Conditions'
      ];

      return heliMenus.includes(menu) ? this.hasSupplier('heli') : this.showWellnessCrs;
    }
    return false;
  }

  hasAnyCrsMenu(): boolean {
    if (this.currentRoleId === 1) {
      return true;
    }

    if (this.isSupplierPanelUser()) {
      return this.isMenuExists('Hotel CRS') ||
        this.isMenuExists('Tour CRS') ||
        this.isMenuExists('Activity CRS') ||
        this.isMenuExists('Transfer CRS') ||
        this.isMenuExists('Wellness CRS') ||
        this.hasAnyHeliMenu();
    }

    if (!this.hasNavigationData()) {
      return this.loggedInUser && this.currentRoleId !== 3;
    }

    return this.isMenuExists('Hotel CRS') ||
      this.isMenuExists('Tour CRS') ||
      this.isMenuExists('Activity CRS') ||
      this.isMenuExists('Transfer CRS') ||
      this.isMenuExists('Wellness CRS') ||
      this.hasAnyHeliMenu();
  }

  hasAnyHeliMenu(): boolean {
    if (this.currentRoleId === 1) {
      return true;
    }

    if (this.isSupplierPanelUser()) {
      return this.hasSupplier('heli');
    }

    const heliMenus = [
      'Heli CRS',
      'Heli CRS List',
      'Helipads',
      'Heli Routes',
      'Heli Schedules',
      'Heli Pricing'
    ];

    return !this.hasNavigationData() || this.navigationData.some((el) => heliMenus.includes(el.description));
  }


  ngOnInit() {
    const storedUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
    this.loggedInUser = storedUser && storedUser.data ? storedUser.data : storedUser;
    this.domainUser = JSON.parse(localStorage.getItem('currentDomainUser'));
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
console.log(this.loggedInUser)
console.log('SIDE BAR')
         this.domainLogo.domainLogo.subscribe((res: any)=>{
          if (res.length > 0) {
            this.domainSideLogo = res ;
          } else {
            this.domainSideLogo = JSON.parse(currentDomainUser)['domain_logo'];
          }
            
        })
    
  //   this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
  // .subscribe(resp => {
  //   if (resp.statusCode == 200 || resp.statusCode == 201) {
  //     const newDomainData = resp.data[0].domain_logo;

  //     // Get stored data from sessionStorage
  //     const storedDomainData = sessionStorage.getItem('manageDomainData');

  //     // Update session storage only if new data is different
  //     if (storedDomainData !== newDomainData) {
  //       sessionStorage.setItem('manageDomainData', newDomainData);
  //       this.manageDomainData = newDomainData;
  //       console.log("Updated manageDomainData:", this.manageDomainData);
  //     } else {
  //       this.manageDomainData = storedDomainData;
  //       console.log("No change in manageDomainData");
  //     }

  //     this.cdr.detectChanges();
  //   }
  // });


    
    // 
const roleId = this.currentRoleId;

// ✅ SUPER ADMIN → show everything
if (roleId === 1) {
  this.showHotelCrs = true;
  this.showActivityCrs = true;
  this.showHeliCrs = true;
  this.showTransferCrs = true;
  this.showTourCrs = true;
  this.showWellnessCrs = true;

} 
// ✅ Other users → apply supplier-based filtering
else if (this.selectedSupplierKeys.length) {
this.showHotelCrs = this.hasSupplier('stays');
this.showActivityCrs = this.hasSupplier('experiences');
this.showTransferCrs = this.hasSupplier('transfer');
this.showTourCrs = this.hasSupplier('yatra-packages');
this.showWellnessCrs = this.hasSupplier('wellness-retreat');
this.showHeliCrs = this.hasSupplier('heli');

} 
// ✅ No suppliers (but not super admin) → hide all OR choose default
else {
  this.showHotelCrs = false;
  this.showHeliCrs = false;
  this.showTourCrs = false;
  this.showWellnessCrs = false;
  this.showActivityCrs = false;
  this.showTransferCrs = false;
  this.showTourCrs = false;
} 
    if(this.loggedInUser['supplier_type']) {
      const supplier_types = this.loggedInUser['supplier_type'].split(',');
      if(supplier_types.includes('B2C')) {
        this.showB2CReports = true;
        this.showB2BReports = false;
      }
      if(supplier_types.includes('B2B')) {
        this.showB2BReports = true;
        this.showB2CReports = false;
      }

      if (supplier_types.includes('B2C') && supplier_types.includes('B2B')) {
        this.showB2CReports = true;
        this.showB2BReports = true;
      }
    }
    
    console.log(this.showB2CReports, this.showB2BReports, this.showActivityCrs )

    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });
    if (this.currentRoleId == 3 ){
      this.getPrevilegeForThisUser();
    }
    if (this.currentRoleId == 6 || this.currentRoleId == 7 ){
      this.setNavigationData()
      this.getPrevilegeForThisUser();
    }
    
    if (this.isSupplierPanelUser()) {
      this.extraParameter = ['hotelCrsMenus'];

    } else {
      // You can set it to another value or leave it undefined if no panel should be active
      this.extraParameter = this.activatedRoute.snapshot.firstChild && this.activatedRoute.snapshot.firstChild.data.extraParameter 
    }
    
    
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }

  isMenuExists(menu) {
    if (this.currentRoleId === 1) {
      return true;
    }

    if (this.isSupplierPanelUser()) {
      return this.isSupplierMenuAllowed(menu);
    }

    if (this.hasNavigationData()) {
      if (this.hasMenuDescription(menu)) {
        return true;
      }

      if (menu == 'Hotel CRS') {
        return this.hasAnySubMenu(this.HOTELCRS);
      }
      if (menu == 'Tour CRS') {
        return this.hasAnySubMenu(this.TOUR_CRS);
      }
      if (menu == 'Activity CRS') {
        return this.hasAnySubMenu(this.ACTIVITY_CRS);
      }
      if (menu == 'Transfer CRS') {
        return this.hasAnySubMenu(this.TRANSFER_CRS) || this.hasAnySubMenu(this.DMCTRANSFERCRS);
      }
      if (menu == 'Wellness CRS') {
        return this.hasAnySubMenu(this.WELLNESS_CRS);
      }

      return false;
    }

    return !this.isSupplierPanelUser() && this.loggedInUser && this.currentRoleId != 3;
  }

  isSubMenuExists(menu, parent_key = null) {
    if (this.currentRoleId === 1) {
      return true;
    }

    if (this.isSupplierPanelUser()) {
      return this.isSupplierSubMenuAllowed(menu, parent_key);
    }

    if (this.hasNavigationData()) {
      return this.hasSubMenuDescription(menu, parent_key);
    }

    return !this.isSupplierPanelUser() && this.loggedInUser && this.currentRoleId != 3;
  }


  getPrevilegeForThisUser() {
    if(this.currentRoleId == 6 || this.currentRoleId == 7)
{
  this.authService.navigationData.subscribe(res=>{
    this.navigationData = res;
  })
} else{
    this.navigationData = JSON.parse(sessionStorage.getItem('userPrevilige'))
  }
}
setNavigationData(){
  const storedState = sessionStorage.getItem('userPrevilige');
  console.log("storedState",storedState)
  if (storedState) {
      this.authService.navigationData.next(JSON.parse(storedState));
  }
}
setDomainLogo(){
  const storedState = JSON.parse(localStorage.getItem("currentUser"));
  console.log("storedState",storedState)
  if (storedState) {
      this.domainLogo.domainLogo.next((storedState));
  }
}
}
