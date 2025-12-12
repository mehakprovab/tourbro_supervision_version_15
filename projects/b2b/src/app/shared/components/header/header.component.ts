import { select } from '@angular-redux/store';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { AppService } from 'projects/supervision/src/app/app.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../auth/auth.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { ThemeOptions } from '../../../theme-options';
import { HeaderService } from './header.service';
import { UtilityService } from '../../../core/services/utility.service';
import { CartService } from '../../../modules/cart-booking/cart.service';
import { FlightService } from '../../../modules/search/flight/flight.service';
const baseUrl2 = environment.B2B_URL;
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    logoUri = baseUrl2;
    public bellIcon: string = "assets/images/login-images/assets/bell.png";
    public userProfileLogoAvatar: string = "assets/images/login-images/assets/profile_logo.png";
    public userProfileLogo: string = "assets/images/avatars/1.jpg";
  cartItems: any;
  cartList: any;
  cartItemCount: number = 0;
  isCartEmpty: boolean;
  showButtons: boolean = false;
    @HostBinding('class.isActive')
    get isActiveAsGetter() {
        return this.isActive;
    };
    defaultCurrency: string = '';
    subSink = new SubSink();
    private subs = new SubSink();
    isActive: boolean;
    isMobile = false;
    
  getIsMobile(): boolean {
    const w = document.documentElement.clientWidth;
    const breakpoint = 992;
    // console.log(w);
    if (w > breakpoint) {
      return true;
    } else {
      return false;
    }
  }
  onclick()
  {
    this.isMobile = !this.isMobile
  }

    @select('config') public config$: Observable<any>;
    currentUser: any = {};
    domainInformation: any;
    agentData: any;
    navigationData: any;
    currency:any;
    constructor(
        public globals: ThemeOptions,
        private authService: AuthService,
        private router: Router,
        private appService: AppService,
        private apiHandlerService: ApiHandlerService,
        private headerService: HeaderService,
        private utilityService:UtilityService,
        private cartService: CartService,
        private cdr: ChangeDetectorRef,
        private flightService: FlightService
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
        const cartData = JSON.parse(sessionStorage.getItem('cartData'));
        if (cartData) {
          this.cartService.cartItemsSubject.next(cartData);
        }
        this.cartService.cartItems.subscribe((items) => {
            this.cartItems = items;
          });

          this.listCart();
          this.checkBrowserRefresh();
          
        this.currency = this.utilityService.readStorage('currentUser', sessionStorage)['currency'] || 'GBP',
        this.isMobile = this.getIsMobile();
    window.onresize = () => {
      this.isMobile = this.getIsMobile();
    };
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
        if (this.currentUser ['auth_role_id'] == 5)
        this.getPrevilegeForThisUser();
        this.authService.b2bUserSubject.subscribe(user => {
            if (user) {
                this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            } else {
                this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            }

        });
        if (this.headerService.agentData.subscribe(data => {
            if (data) {
                this.getAgentById();
            }
        }))

            this.getDomain();
           
    }

    checkBrowserRefresh() {
    
       this.cartService.cartList$.subscribe(cartList => {
          this.cartList = cartList;
          this.cartItemCount = this.cartList.length; // Update the count
        });
  }

    listCart(): void {
        const req = {
          ResultToken: this.cartItems ? this.cartItems.ResultIndex : ''
        };
        this.subs.sink = this.apiHandlerService
          .apiHandler('getBundleBooking', 'POST', '', '', req)
          .subscribe(
            (res: any) => {
              if (res && res.data) {
                this.isCartEmpty = false;
                this.cartList = res.data;
                this.updateCartItemCount();
              }
            },
            (error) => {
              console.error('Error getting item of cart:', error);
              this.isCartEmpty = true;
              this.cdr.detectChanges();
            }
          );
      }


      updateCartItemCount(): void {
        let count = 0;
        if (this.cartList.flight) count++;
        if (this.cartList.hotel) count++;
        if (this.cartList.transfer) count++;
        if (this.cartList.activity) count++;
        this.cartItemCount = count;
        this.cartService.updateCartItemCount(); // Update the count in the service
      }

    getAgentById() {
        if (this.currentUser) {
            let userId=this.currentUser.id;
            if (this.currentUser.auth_role_id && this.currentUser.auth_role_id==5){
                userId=this.currentUser.created_by_id; // Added to show agents balance to subagent
            }
            this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'POST', {}, {}, { "id": userId })
                .subscribe(res => {
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        this.agentData = res.data;
                        this.updateButtonVisibility();
                    }
                });
              this.cdr.detectChanges();
        }
    }

    updateButtonVisibility() {
      this.showButtons = (this.agentData.payment_pref != 'Credit Card');
      console.log('Button Visibility:', this.showButtons);
  }

    toggleSidebarMobile() {
        this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
    }

    redirrectToCart(){
      this.router.navigate(["cart/bookings"]);
   }

    toggleHeaderMobile() {
        this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
    }
    onLogout() {
        this.updateLogoutTime();
        this.authService.logout();

    }
    updateLogoutTime() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateLogouttime', 'post', {}, {},
            { "logout_datetime": formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss') })
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {

                }
            })
    }
    toggleDrawer() {
        this.globals.toggleDrawer = !this.globals.toggleDrawer;
    }
    onBalanceClick() {
        this.router.navigate(["payment/make-payment"])
    }
    onCreditLimitClick() {
        this.router.navigate(["payment/update-credit-limit"])
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            })
    }

    getPrevilegeForThisUser() {
        this.navigationData = JSON.parse(sessionStorage.getItem('userPrevilige'))
      }

      isMenuExists(menu) {
        if (this.navigationData && this.navigationData.length > 0) {
          if (this.navigationData.some((el) => el.description == menu)) return true;
          else return false;
        } else {
          return true;
        }
      }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    navigateToFlight() {
      this.flightService.navigateToDashboard.next(true);
    }
}
