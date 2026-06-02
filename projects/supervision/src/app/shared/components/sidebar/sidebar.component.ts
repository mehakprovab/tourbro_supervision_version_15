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
  showTourCrs: boolean = false;
  showTransferCrs: boolean = false;

  showB2CReports: boolean = false;
  showB2BReports: boolean = false;


  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser'));
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
const roleId = this.loggedInUser.auth_role_id;
const suppliers = this.loggedInUser.selectedSuppliers;

// ✅ SUPER ADMIN → show everything
if (roleId === 1) {
  this.showHotelCrs = true;
  this.showActivityCrs = true;
  this.showTransferCrs = true;
  this.showTourCrs = true;

} 
// ✅ Other users → apply supplier-based filtering
else if (suppliers) {
  const selectedServices = JSON.parse(suppliers);

  this.showHotelCrs = selectedServices.includes('stay');
  this.showActivityCrs = selectedServices.includes('experiences');
  this.showTransferCrs = selectedServices.includes('Transfer');
  this.showTourCrs = selectedServices.includes('yatra-packages');

} 
// ✅ No suppliers (but not super admin) → hide all OR choose default
else {
  this.showHotelCrs = false;
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
    if (this.loggedInUser['auth_role_id'] == 3 ){
      this.getPrevilegeForThisUser();
    }
    if (this.loggedInUser['auth_role_id'] == 6 || this.loggedInUser['auth_role_id'] == 7 ){
      this.setNavigationData()
      this.getPrevilegeForThisUser();
    }
    
    if (this.loggedInUser && this.loggedInUser['auth_role_id'] == 6 || this.loggedInUser['auth_role_id'] == 7) {
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
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu))
        return true;
      else
        return false;
    }
    else {
      if(this.loggedInUser['auth_role_id'] == 3 && !this.navigationData.length){
        return false;
      }else{
        return true;
      }
    
    }
  }

  isSubMenuExists(menu, parent_key = null) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu && el.parent_key == parent_key))
        return true;
      else
        return false;
    }
    else {
      if(this.loggedInUser['auth_role_id'] == 3 && !this.navigationData.length){
        return false;
      }else{
        return true;
      }

    }
  }


  getPrevilegeForThisUser() {
    if(this.loggedInUser.auth_role_id == 6 || this.loggedInUser.auth_role_id == 7)
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
