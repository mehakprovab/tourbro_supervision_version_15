import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHandlerService } from '../../core/api-handlers';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {

  public cartItemsFlight = new BehaviorSubject<any[]>([]);
  public cartItemsHotel = new BehaviorSubject<any[]>([]);
  public cartItemsTransfer = new BehaviorSubject<any[]>([]);
  public cartItemsActivity = new BehaviorSubject<any[]>([]);
  public cartItemsSubject = new BehaviorSubject<any[]>([]);
  public addBundleBookingPaxDetails = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount = new BehaviorSubject<number>(0); 
  public cartItems = this.cartItemsSubject.asObservable();
  
  private subs = new SubSink();
  cartList: any;
  private cartListSource = new BehaviorSubject<any[]>([]); // Array for cart items
  cartList$ = this.cartListSource.asObservable(); // Observable for the cart list
  cartItemCount: number = 0;
 

  constructor(private apiHandlerService: ApiHandlerService) {}
  getCartItems(): Observable<any[]> {
    return this.cartItems;
  }
  // Add item to cart
  addCart(item: any): void {


    const currentCart = this.cartListSource.value;

    this.cartListSource.next([...currentCart, item]); // Add the new item to the cart
    this.saveCartToStorage(this.cartListSource.value);

    this.subs.sink = this.apiHandlerService
      .apiHandler('addBundleBooking', 'POST', '', '', item)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            sessionStorage.setItem('cartData', JSON.stringify(res.data));
            this.cartItemsSubject.next(res.data); // Update cart items state
            this.cartList = res.data;
            this.updateCartItemCount();
            
          }
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
      
  }

  addAutoSearchData(item:any){
    this.subs.sink = this.apiHandlerService
      .apiHandler('cartSearchInfo', 'POST', '', '', item)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            console.log(res);
            
          }
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
  }
  
  getCartList(): any[] {
    return this.cartListSource.value;
  }

  saveCartToStorage(cart: any[]): void {
    sessionStorage.setItem('cartListSource', JSON.stringify(cart));
  }

  updateCartList(newCartList: any[]): void {
    
    this.cartListSource.next(newCartList);
    this.saveCartToStorage(this.cartListSource.value);
    sessionStorage.setItem('cartData', JSON.stringify(newCartList)); 
    this.updateCartItemCount(); // Update count whenever cart list changes
  }

  updateCartItemCount(): void {
    const currentCart = this.cartListSource.value || []; // Get the current cart list
    const count = currentCart.length; // Count the items
    this.cartCountSubject.next(count); // Update the BehaviorSubject
    //this.cartItemCount = count;
    console.log('Item C', count);
}


  getCurrentCartCount(): number {
    return this.cartCountSubject.getValue();
  }

  removeCart(item: any): Observable<any> {
    const cartListSourrce = JSON.parse(sessionStorage.getItem('cartListSource'));
    this.cartListSource.next(cartListSourrce);
    const currentCart = this.cartListSource.value || [];
    const updatedCart = currentCart.filter(cartItem => cartItem.module !== item.module);
    this.updateCartList(updatedCart); // Update local cart and count
    return this.apiHandlerService.apiHandler('removeBundleBooking', 'POST', '', '', item);
  }

  ngOnDestroy(): void {
    //this.subs.unsubscribe(); // Unsubscribe from all subscriptions to prevent memory leaks
  }
}