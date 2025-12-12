import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { ApiHandlerService } from '../../core/api-handlers';
import { SubSink } from 'subsink';
import { DashboardService } from '../dashboard/dashboard.service';
import { Router } from '@angular/router';
import { UtilityService } from '../../core/services/utility.service';
import * as moment from 'moment';
import { CustomDialogWrapperComponent } from '../custom-dialog-wrapper/custom-dialog-wrapper.component';
import { MatDialog } from '@angular/material/dialog';
import { TransferSearchComponent } from '../search/transfer/transfer-search/transfer-search.component';
import { FlightComponent } from '../search/flight/flight.component';
import { HotelComponent } from '../search/hotel/hotel.component';
import { ActivitySearchFormComponent } from '../search/activity/components/activity-search-form/activity-search-form.component';
import { FlightService } from '../search/flight/flight.service';
@Component({
  selector: 'app-cart-booking',
  templateUrl: './cart-booking.component.html',
  styleUrls: ['./cart-booking.component.scss']
})
export class CartBookingComponent implements OnInit {
  cartItems: any;
  totalAmount: number = 0;
  cartList: any; // Initialize with null
  private subs = new SubSink();
  flight: any;
  hotel: any;
  booking_source: any;
  transfer: any;
  airline_logo: string = '';
  hideButton:boolean = false;
  noOfTravellers: any;
  adultCount = 0;
  childCount = 0;
  infantCount = 0;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  FlightDetails: any;
  loading: boolean = true;
  isCartEmpty: boolean = true;
  activity: any;
  travellerAdult: any = 0;
  travellerChild: any = 0;
  totalFare: any;
  currency: any;
  searchTabValue: any;

  constructor(
    private cartService: CartService,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private DashboardService: DashboardService,
    private router: Router,
    private utility: UtilityService,
    private dialog: MatDialog,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    const cartData = JSON.parse(sessionStorage.getItem('cartData'));
    if (cartData) {
      this.cartService.cartItemsSubject.next(cartData);
    }
    this.cartService.cartItems.subscribe((items) => {
      this.cartItems = items;
    });
    this.listCart();
    this.currency = this.utility.readStorage('currentUser', sessionStorage)['currency'];
  }

  listCart(): void {
    
    const req = {
      ResultToken: this.cartItems ? this.cartItems.ResultIndex : ''
    };
    console.log('Cart List',this.cartItems);
    this.subs.sink = this.apiHandlerService
      .apiHandler('getBundleBooking', 'POST', '', '', req)
      .subscribe(
        (res: any) => {
            let activityFare = 0;
            let transferFare = 0;
            let hotelFare = 0;
            let flightFare = 0;
          if (res && res.data) {
            this.isCartEmpty = false;
            this.cartList = res.data;


            if (this.cartList.flight) {
              this.cartService.cartItemsFlight.next(this.cartList.flight);
              this.flight = this.cartList.flight.JourneyList[0];
              this.FlightDetails = this.cartList.flight.FlightInfo.FlightDetails.Details;
              flightFare = this.flight[0].Price.TotalDisplayFare;
              sessionStorage.setItem('cartItemsFlight', JSON.stringify(this.cartList.flight));
            }
            if(!this.cartList.flight){
              this.cartService.cartItemsFlight.next([]);
              sessionStorage.removeItem('cartItemsFlight');
            }

            if (this.cartList.hotel) {
              this.cartService.cartItemsHotel.next(this.cartList.hotel);
              this.hotel = this.cartList.hotel;
              this.hotel.searchRequest.RoomGuests.forEach(element => {
                this.travellerAdult += element.NoOfAdults;
                this.travellerChild += element.NoOfChild;
              });
              this.booking_source = this.cartList.hotel.booking_source;
              hotelFare = this.hotel.Price.Amount;
              sessionStorage.setItem('cartItemsHotel', JSON.stringify(this.cartList.hotel));
            }
            if(!this.cartList.hotel){
              this.cartService.cartItemsHotel.next([]);
              sessionStorage.removeItem('cartItemsHotel');
            }

            if (this.cartList.transfer) {
              this.cartService.cartItemsTransfer.next(this.cartList.transfer);
              this.transfer = this.cartList.transfer;
              this.noOfTravellers =
                this.transfer.body.AdultCount +
                this.transfer.body.ChildCount +
                this.transfer.body.InfantCount;
              transferFare = this.transfer.data.Price.TotalDisplayFare;
              sessionStorage.setItem('cartItemsTransfer', JSON.stringify(this.cartList.transfer));
            }
            if(!this.cartList.transfer){
              this.cartService.cartItemsTransfer.next([]);
              sessionStorage.removeItem('cartItemsTransfer');
            }

            if (this.cartList.activity) {
              this.cartService.cartItemsActivity.next(this.cartList.activity);
              this.activity = this.cartList.activity;
              activityFare = this.activity.Price.TotalDisplayFare;
              sessionStorage.setItem('cartItemsActivity', JSON.stringify(this.cartList.activity));
            }
            if(!this.cartList.activity){
              this.cartService.cartItemsActivity.next([]);
              sessionStorage.removeItem('cartItemsActivity');
            }
          }
          this.totalFare = activityFare + transferFare + hotelFare + flightFare;
          this.loading = false; // Set loading to false once data is fetched
          this.cartService.updateCartItemCount();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error getting item of cart:', error);
          this.loading = false; // Stop loading on error
          this.isCartEmpty = true;
          this.cdr.detectChanges();
        }
      );
  }

  removeCart(data: any): void {
    const req = {
      ResultToken: this.cartItems.ResultIndex,
      refNumber: this.cartItems.refNumber || null,
      module: data,
    };
  
    this.cartService.removeCart(req).subscribe(
      (res) => {
        // Remove the item locally and refresh the cart
        this.cartService.cartItemsSubject.next(res.data);
        sessionStorage.setItem('cartData', JSON.stringify(res.data));
        //sessionStorage.removeItem('cartData');
        if (res.data.length === 0) {
          sessionStorage.removeItem('cartData');
        }

        this.listCart();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error removing cart item:', error);
      }
    );

  }

  
  
  isSameRoomGuests(roomGuests: any[]): boolean {
    if (!roomGuests || roomGuests.length === 0) return false;
    return roomGuests.every(guest => 
        guest.NoOfAdults === roomGuests[0].NoOfAdults && 
        guest.NoOfChild === roomGuests[0].NoOfChild
    );
}

  getBaggage(val: any) {
    if (val) {
      const bg = val.split(' ');
      if (bg.length > 1 && bg[1] !== 'undefined' && parseInt(bg[0]) > 0) {
        return bg[0] + ' ' + (bg[1] === 'Kilograms' || bg[1] === 'Kg' ? 'KG' : bg[1]);
      } else {
        return bg[0] + ' ' + 'KG';
      }
    } else if (val === '') {
      return '0 KG';
    }
  }

  getTime(date: any) {
    return date.substr(11, 5);
  }

  getStarArray(num: number) {
    num = Number(num);
    const starArr = [];
    if (num && num >= 0) {
      starArr.length = Math.round(num);
    }
    return starArr;
  }

  getStarArrayRemaining(num: number) {
    num = Number(num);
    const starArr = [];
    if (num && num >= 0) {
      starArr.length = 5 - Math.round(num);
    }
    return starArr;
  }

  getHotelPhoto(imgArrStr: string, booking_source: string) {
    if (imgArrStr != null) {
      const imgArray = JSON.parse(imgArrStr.replace(/'/g, '"'));
      return imgArray;
    } else {
      return '';
    }
  }

  isAdult(flight: any) {
    const result = flight[0]['Price']['PassengerBreakup'].hasOwnProperty('ADT');
    if (result) {
      this.adultCount = flight[0].Price.PassengerBreakup.ADT.PassengerCount;
    }
    return result;
  }

  isYouth(flight: any) {
    const result = flight[0]['Price']['PassengerBreakup'].hasOwnProperty('YTH');
    if (result) {
      this.adultCount = flight[0].Price.PassengerBreakup.ADT.PassengerCount;
    }
    return result;
  }
  isChild(flight: any) {
    const result = flight[0]['Price']['PassengerBreakup'].hasOwnProperty('CHD');
    if (result) {
      this.childCount = flight[0]['Price']['PassengerBreakup'].CHD.PassengerCount;
    }
    return result;
  }

  isInfant(flight: any) {
    const result = flight[0]['Price']['PassengerBreakup'].hasOwnProperty('INF');
    if (result) {
      this.infantCount = flight[0]['Price']['PassengerBreakup'].INF.PassengerCount;
    }
    return result;
  }

  getTruthyCount(cartList: any): number {
    if (!cartList) {
      return 0;
    }
    const items = [cartList.flight, cartList.hotel, cartList.transfer, cartList.activity];
    return items.filter(Boolean).length;
  }

  navigateToDashboard(type) {
    this.router.navigate(['/dashboard']);
    this.flightService.emitChange(type);
  }
ngAfterViewInit() {
  this.flightService.changeEmitted$.subscribe(
      (tabvalue) => {
        this.searchTabValue = tabvalue;
      }
    );
  }
  // navigateToFlight() {
  //   this.router.navigate(['/']);
  //   window.scroll(0, 0);
  //   this.homeService.headerSearchTab.next('Flights');
  // }

  // navigateToHotel() {
  //   this.router.navigate(['/']);
  //   window.scroll(0, 0);
  //   this.homeService.headerSearchTab.next('Hotels');
  // }

  // navigateToTransfer() {
  //   this.router.navigate(['/']);
  //   window.scroll(0, 0);
  //   this.DashboardService.headerSearchTab.next('Transfers');
  // }

  // navigateToActivity() {
  //   this.router.navigate(['/']);
  //   window.scroll(0, 0);
  //   this.DashboardService.headerSearchTab.next('Activities');
  // }

  continue() {
    this.router.navigate(['cart/guest-detail']);
  }

  proceedToCheckout(): void {
    console.log('Proceeding to checkout...');
  }

  getDateFormat(date) {
   const formatDate =  moment(date).format('DD/MM/YYYY');
   return formatDate;
  }

  formatRoomDescription(desc): string {
    let parts;
    if (this.booking_source === 'TLAPNO00003') {
      parts = desc.RoomType;
    } else {
      parts = desc.Description;
    }
    return parts;
  }

  openSearch(type) {
    if (type === 'flight') {
        this.openFlightSearch();
    } else if (type === 'transfer') {
        this.openTransferSearch();
    }
    else if (type === 'hotel') {
        this.openHotelSearch();
    } else if(type === 'activity') {
      this.openActivitySearch();
    }
  
  }
  
  openFlightSearch(): void {
    sessionStorage.setItem('activeIdString','left');
    this.dialog.open(CustomDialogWrapperComponent, {
        width: '80vw',
        height: '70vh',
        maxWidth: '100vw',
        maxHeight: '65%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
            component: FlightComponent,
            title: 'Flight Search',
            tabvalue: 'flights'
        }
    });
  }

  openActivitySearch(): void {
    sessionStorage.setItem('activeIdString','left');
    this.dialog.open(CustomDialogWrapperComponent, {
        width: '80vw',
        height: '70vh',
        maxWidth: '100vw',
        maxHeight: '65%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
          component: ActivitySearchFormComponent,
          title: 'Activity Search'
      }
    });
  }
  
  openTransferSearch(): void {
    this.dialog.open(CustomDialogWrapperComponent, {
        width: '80vw',
        height: '70vh',
        maxWidth: '100vw',
        maxHeight: '65%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
            component: TransferSearchComponent,
            title: 'Transfer Search'
        }
    });
  }
  openHotelSearch(): void {
    this.dialog.open(CustomDialogWrapperComponent, {
        width: '80vw',
        height: '70vh',
        maxWidth: '100vw',
        maxHeight: '65%',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: {
            component: HotelComponent,
            title: 'Hotel Search'
        }
    });
  }
}