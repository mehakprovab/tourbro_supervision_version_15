export function tempTraveller() {
    return {
        adults: 1,
        childrens: 1,
        rooms: 0
    }
}

import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, from, of, zip } from 'rxjs';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { UtilityService } from '../../../core/services/utility.service';
import * as moment from 'moment';
import { catchError, concatMap, map } from 'rxjs/operators';
import { SwalService } from '../../../core/services/swal.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class HotelService implements OnDestroy {

    isDevelopment = false;
    formFilled: any = false;
    searchHotelSubmitted: any = false;
    hotels = new BehaviorSubject<any>([]);
    hotelsCopy = new BehaviorSubject<any>([]);
    loading = new BehaviorSubject<boolean>(false);
    changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
    private _hotelsCopy: any = [];
    maxPrice = new BehaviorSubject<any>(0);
    minPrice = new BehaviorSubject<any>(0);
    myValue = new BehaviorSubject<any>(0);
    myValueStart = new BehaviorSubject<any>(0);
    searchingHotel = new BehaviorSubject<any>('');
    hotelPromocode = new BehaviorSubject<any>({});
    currentCurrency: any;
    currentCurrencyRate: any;
    noHotel = new BehaviorSubject<boolean>(false);
    allHotelResponses: any[];
    serverError = new BehaviorSubject<boolean>(false);
    searchResponseCopy = new BehaviorSubject<any>(false);
    nearByAirportsCopy = new BehaviorSubject<any>([]);
    traveller: any = this.isDevelopment ? tempTraveller() : undefined;
    resultToken: any;
    appReference: any;
    bookingHotelData = new BehaviorSubject<any>(undefined);
    blockHotelRoom = new BehaviorSubject<any>(undefined);
    userTitleList = new BehaviorSubject<any>([]);
    countryList = new BehaviorSubject<any>(false);
    addHotelBookingPaxDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelConfirmationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelVoucherData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    HotelConfirmDetail: BehaviorSubject<any> = new BehaviorSubject<any>({});
    isCollapsed = new BehaviorSubject<boolean>(true);
    hotel_logo = 'https://www.travelsoho.com/antrip_v1/extras/system/library/images/airline_logo/';
    ratingReset = new BehaviorSubject<boolean>(false);
    rating0 = new BehaviorSubject<boolean>(false);
    rating1 = new BehaviorSubject<boolean>(false);
    rating2 = new BehaviorSubject<boolean>(false);
    rating3 = new BehaviorSubject<boolean>(false);
    rating4 = new BehaviorSubject<boolean>(false);
    rating5 = new BehaviorSubject<boolean>(false);
    stars: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    applySortingAfterFilter = new BehaviorSubject<boolean>(false);
    availableOptions: {} = {
        stars: [],
        sorts: []
    };
    amenities: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    scrollToRoomDetails: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    clearAmenities = new BehaviorSubject<boolean>(false);
    clearAccomodation = new BehaviorSubject<boolean>(false);
    clearRating = new BehaviorSubject<boolean>(false);
    clearHotelName = new BehaviorSubject<boolean>(false);
    private subSunk = new SubSink();
    dialogClose = new BehaviorSubject<boolean>(false);
    searchHotelName=new BehaviorSubject<string>(undefined);
    bookingApiSources = [];
    allTourResponses =[]
    refundable = new BehaviorSubject<boolean>(true);
    nonRefundable = new BehaviorSubject<boolean>(true);
    preferencesReset = new BehaviorSubject<boolean>(false);
    packagingFilter = new BehaviorSubject<any>([]);
    constructor(
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private utility: UtilityService,
        private router: Router,
        private dialog: MatDialog,
 
    ) {
        this.apiHandlerService.apiHandler('userTitleList', 'POST', {}, {}, {}).subscribe(res => {
            this.userTitleList.next(res.data);
        });
        this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(res => {
            this.countryList.next(res.data.popular_countries.concat(res.data.countries));
        });
    }
    counter: number = 0;


   
    
  
    getEnabledApi() {
        let apiList = this.utility.readStorage('Hotel_API_List', sessionStorage);
        const data = apiList
                .map(data => (data.code ));
        // let getEnabledApiList = apiLists.flight;
        // let getEnabledApiList = apiList.split(",");
        return data;
    }

    // searchResult(data: any) {
    
    //     console.log("Initial data:", data);
    //     let hideList: number[] = [];
    //     // Set RoomGuests' child age, prepare base payload data
    //     if (data['RoomGuests']) {
    //         data['RoomGuests'].forEach(element => {
    //             element.ChildAge = this.setChildAge(element);
    //         });
    //     }
    
    //      const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    //     data["UserId"] = created_by_id;
    //     data["UserType"] = "B2B";
    //     data["searchId"] = data['searchId']
    //     // data["Currency"] = this.appGlobal.selectedCurrency.value;
    //     this.searchHotelSubmitted = true;
    //     this.searchingHotel.next(true);
    //     this.resetSearch();
    //     this.hotels.next([]);
    
    //     // Split booking sources
    //     const bookingSources = data['booking_source'].split(',').map(source => source.trim());
    //     let allTourResponses = [];
    //     let errorResponses = [];
    //     let previousToken: string | null = null;
    
    //     // Convert bookingSources to an observable sequence
    //     from(bookingSources).pipe(
    //         concatMap((source, index) => {
    //             // Dynamically construct payload for each request
    //             const payload = { ...data, booking_source: source };
    //             if (previousToken) {
    //                 payload['DeDuToken'] = previousToken; // Set DeDuToken for all requests after the first
    //             }
    
    //             // Log the payload before each request
    //             console.log(`Sending payload for booking source ${source}:`, payload);
    
    //             // Make the API call with the updated payload
    //             return this.apiHandlerService.apiHandler('searchHotel', 'post', '', '', payload).pipe(
    //                 concatMap((response: any) => {
    //                     if (response.statusCode === 200 && response.data.length) {
    //                         if (response.HideList && response.HideList.length > 0) {
    //                             hideList = response.HideList;
    //                         }
    
    //                         // Filter out hotels based on hideList
    //                         const filteredData = response.data.filter(hotel => 
    //                             !hideList.includes(hotel.uniqueHotelId)
    //                         );
    //                         allTourResponses = [...allTourResponses, ...filteredData];
    
    //                         // Extract DeDuToken for the next request
    //                         previousToken = response.DeDuToken;
    //                         console.log(`Received DeDuToken from response for booking source ${source}:`, previousToken);
    //                     } else {
    //                         errorResponses.push({ bookingSource: source, error: response });
    //                         throw new Error(`Request failed for booking source ${source}`);
    //                     }
    //                     return of(response); // Continue to the next request if successful
    //                 }),
    //                 catchError(error => {
    //                     console.error(`Error with booking source ${source}:`, error);
    //                     errorResponses.push({ bookingSource: source, error: error });
    //                     return of({ statusCode: 500, data: [] });
    //                 })
    //             );
    //         })
    //     ).subscribe(
    //         () => {
    //             // Handle all results when requests complete
    //             this.getResponse(allTourResponses);
    //             this.loading.next(false);
    
    //             if (errorResponses.length > 0) {
    //                 console.warn('Some requests failed:', errorResponses);
    //                 // this.dialog.closeAll();
    //             }
    //         },
    //         (error) => {
    //             this.loading.next(false);
    //             console.error('Error during search:', error);
    //         }
    //     );
    // }

    getCountryName(code: string): string {
        const countries = this.countryList.getValue(); // Get latest country list
        const country = countries.find(c => c.code === code);
        return country ? country.name : ''; 
    }

    searchResult(data: any) {
        const apiList = this.getEnabledApi();
        
        const bookingSources = data['booking_source'].split(',').map(source => source.trim());
        if (!bookingSources.length || !apiList || apiList.length === 0) {
            console.warn("No valid booking sources found.");
            this.handleNoResults();
            return;
        }
    
        const validBookingSources = bookingSources.filter(source => apiList.includes(source));
        if (!validBookingSources.length) {
            this.handleNoResults();
            return;
        }
    
        let hideList: number[] = [];
        let previousToken: string | null = null;
        let errorResponses = [];
        
        if (data['RoomGuests']) {
            data['RoomGuests'].forEach(element => {
                element.ChildAge = this.setChildAge(element);
            });
        }
    
        const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
        const currency = this.utility.readStorage('currentUser', sessionStorage)['currency'];
        data["UserId"] = created_by_id;
        data["Currency"] = currency;
        data["UserType"] = "B2B";
        data["searchId"] = data['searchId'];
        data["Nationality"] = this.getCountryName(data.Market);
        data['CountryCode'] = data['CountryCode']
        this.searchHotelSubmitted = true;
        this.searchingHotel.next(true);
        this.resetSearch();
        this.hotels.next([]);
        this.allHotelResponses = [];
    
        const requests = validBookingSources.map(source => {
            const payload = { ...data, booking_source: source };
            if (previousToken) {
                payload['DeDuToken'] = previousToken;
            }
    
            return this.apiHandlerService.apiHandler('searchHotel', 'post', '', '', payload).pipe(
                map((response: any) => {
                    if (response.statusCode === 200 && response.data.length) {
                        if (response.HideList && response.HideList.length > 0) {
                            hideList = response.HideList;
                        }
    
                        const filteredData = response.data.filter(hotel => !hideList.includes(hotel.uniqueHotelId));
                        
                        this.allHotelResponses = [...this.allHotelResponses, ...filteredData];
                        previousToken = response.DeDuToken;
    
                        // ✅ Hide loader as soon as the first valid response arrives
                        this.getResponse(this.allHotelResponses);
                        this.searchingHotel.next(false);
                        return filteredData;
                    } else {
                        errorResponses.push({ bookingSource: source, error: response });
                        return [];
                    }
                }),
                catchError(error => {
                    console.error(`Error with booking source ${source}:`, error);
                    errorResponses.push({ bookingSource: source, error });
                    return of([]);
                })
            );
        });
    
        // ✅ Execute all API calls simultaneously
        forkJoin(requests).subscribe(
            () => {
                this.getResponse(this.allHotelResponses);
                this.loading.next(false);
                
                if (errorResponses.length > 0) {
                    console.warn('Some requests failed:', errorResponses);
                    this.dialog.closeAll();
                    return;
                }
            },
            error => {
                this.loading.next(false);
                console.error('Error during search:', error);
                return;
            }
        );
    }
    
    
    // Utility function to handle no results found
    handleNoResults() {
        // this.searchHotelSubmitted = true;
        this.hotels.next([]);
        this.searchingHotel.next(false);
        this.loading.next(false);
        this.allHotelResponses=[];
        sessionStorage.removeItem('hotelSearchData');
        this.getResponse(this.allHotelResponses);
     
    }
    
    setPromoCode() {
        const storedState = localStorage.getItem('hotelPromocode');
        if (storedState) {
          this.hotelPromocode.next({
            promocode: JSON.parse(storedState)
          });
        }
      }

      getResponse(searchResponse: any) {
        if (!Array.isArray(searchResponse)) return;
    
        const hotelMap = new Map<string, any>();
        const filteredHotels: any[] = [];
        searchResponse.forEach(hotel => {
            if (!hotel || !hotel.Price || !hotel.Price.Amount) return;
    
            if (!hotel.GiataCode) {
                filteredHotels.push(hotel);
                return;
            }
    
            const existingHotel = hotelMap.get(hotel.GiataCode);
    
            if (!existingHotel || hotel.Price.Amount < existingHotel.Price.Amount) {
                hotelMap.set(hotel.GiataCode, hotel);
            }
        });
    
       
        filteredHotels.push(...hotelMap.values());
    
       
        filteredHotels.sort((a, b) => a.Price.Amount - b.Price.Amount);
    
    
        this.searchResponseCopy.next([...filteredHotels]);
        this.hotels.next(filteredHotels);
        this.changeDetectionEmitter.emit();
    
        const hotelsCopy = JSON.parse(JSON.stringify(filteredHotels));
        this.hotelsCopy.next(hotelsCopy);
        this._hotelsCopy = hotelsCopy;
    
     
        let maxPrice = Math.max(...hotelsCopy.map(o => o.Price.Amount));
        let minPrice = Math.min(...hotelsCopy.map(o => o.Price.Amount));
    
        this.maxPrice.next(maxPrice);
        this.minPrice.next(minPrice);
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);
    }
    
    resetSearch() {
        this.hotelsCopy.next([]);
        this.hotels.next([]);
        // localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        this.maxPrice.next(0);
        this.minPrice.next(0);
        this.myValue.next(0);
        this.myValueStart.next(0);
        this.changeDetectionEmitter.emit();
    }

    changeSlider() {
        this.multipleFiltersApply();
    }

    changeSliderExt() {
        this.myValue.next(Math.ceil(this.myValue.value));
        this.myValueStart.next(Math.floor(this.myValueStart.value));
        const result = this._hotelsCopy.filter(hotel => {
            if(hotel != null){
            const result = hotel.Price.Amount <= this.myValue.value && hotel.Price.Amount >= this.myValueStart.value;
            return result;
            }
        });
        return !result.length ? this._hotelsCopy : result;
    }

    filterByStar() {
        this.multipleFiltersApply();
    }

    filterByStarEtx(hotels) {
        const tempStars = this.stars.value.filter(h => h.isChecked);
        if (this.stars.value.length === tempStars.length || tempStars.length === 0) {
            return hotels;
        }
        let tempHotels = [];
        for (let hotel of hotels) {
            const result = this.stars.value.find(t => t.stars === (Number(hotel.StarRating)));
            if (typeof result !== 'undefined' && result.isChecked) {
                tempHotels.push(hotel);
            }
        }
        return tempHotels;
    }

    filterByPackage() {
        this.multipleFiltersApply();
    }

    filterByPackaging(hotels) {
        console.log('filterByPackaging', hotels);
        let packaging: any;
        const packageValue = this.packagingFilter.subscribe((data) => {
           packaging = data;
        });
       
        if (packaging === 'with_packages') {
            return hotels.filter((data) => data.Packaging);
        } else if (packaging === 'without_packages') {
            return hotels.filter((data) => !data.Packaging);
        } else {
            return hotels;
        }
    }

    filterByAmenities() {
        this.multipleFiltersApply();
    }

    filterByAmenitiesExt(hotels) {
        const selectedAmenities = this.amenities.value.filter(a => a.isChecked);
        if (selectedAmenities.length === 0) {
            return hotels; // No amenities selected, return all hotels
        }
        return hotels.filter(hotel => {
            const providedAmenities = (hotel['HotelAmenities'] || []);
            return selectedAmenities.some(t => {
                const match = t['amenity'];
                return t.isChecked && providedAmenities.includes(match);
            });
        });
    }

    filterByHotelNameExt(hotels) {
        const searchText = this.searchHotelName.getValue();
        if (!searchText) {
            return hotels;
        }
        let searchHotelName = searchText.trim();
        const searchTerm = searchHotelName.toLowerCase();
        return hotels.filter(hotel => hotel ? hotel.HotelName.toLowerCase().includes(searchTerm) : '');
        
    }
      
    multipleFiltersApply() {
        let hotels = this.changeSliderExt();
        hotels = this.filterByStarEtx(hotels);
        hotels= this.filterByHotelNameExt(hotels);
        hotels = this.filterByAmenitiesExt(hotels);
        hotels = this.filterByPreferencesExt(hotels);
        hotels = this.filterByPackaging(hotels);
        this.hotels.next(hotels);
        // localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        this.changeDetectionEmitter.emit();
    }
    filterByPreferences() {
        this.multipleFiltersApply();
    }
    filterByPreferencesExt(hotels) {
        const a = this.refundable.value;
        const b = this.nonRefundable.value;
        // const c = this.baggage.value;
 
            if ((a && b) || (!a && !b)) {
                return hotels
            }
            const hotelsCopyTemp = JSON.parse(JSON.stringify(hotels));
            if (a && !b) {
                hotels = hotelsCopyTemp.filter((flight) => flight.Refundable);
            } else if (!a && b) {
                hotels = hotelsCopyTemp.filter((flight) => !flight.Refundable);
            } else if (!a && !b) {
                let flightsTemp = hotelsCopyTemp.filter((flight) => flight.Refundable === "");

                if (flightsTemp)
                    hotels = flightsTemp;
                else
                hotels = [];
            }
            return hotels;
        
       
    }

 
    resetFilter() {
        this.myValue.next(this.maxPrice.value);
        this.myValueStart.next(this.minPrice.value);
        this.maxPrice.next(this.maxPrice.value);
        this.minPrice.next(this.minPrice.value);
        this.clearHotelName.next(true);
        this.clearAmenities.next(true)
        this.ratingReset.next(true);
        this.preferencesReset.next(true);
        this.changeDetectionEmitter.emit();
    }

    setHotelInvoiceNumber(appReference) {
        let invoiceNumber = "";
        if (appReference) {
            invoiceNumber = "INV-" + (appReference.split("-")[1]);
        }
        return invoiceNumber;
    }

    setChildAge(child) {
        let childAge = [];
        if (child && child.ChildAge) {
            child.ChildAge.forEach(element => {
                childAge.push(element.childAge.toString());
            });
            return childAge;
        }
    }
    
    setHotelTraveller(){
        const storedState = localStorage.getItem('b2bHotelTraveller');
        if (storedState) {
            this.traveller=(JSON.parse(storedState));
        }
    }

    filterByHotelName(searchText){
       this.searchHotelName.next(searchText);
        this.multipleFiltersApply();
    }

    getCancelationPolicy(cancellationPolicy, currency) {
        let policy = JSON.parse(cancellationPolicy.replace(/'/gi, "\""));
        if (policy['NonRefundable']) {
            return `Non Refundable`;
        } else if (!policy['NonRefundable']) {
            let penalty = '';
            if (typeof policy['CancelPenalty'] == 'object') {
                policy['CancelPenalty'].forEach((element, i) => {
                    penalty += `Cancellation made <strong>${element.HoursBefore} hours</strong> before checkin <strong>${currency + ' ' + element.Penalty.Value}</strong> will be charged as cancellation penalty`;
                    if (policy['CancelPenalty'].length - 1 != i) {
                        penalty += '<br>'
                    }
                });
                return penalty;
            } else {
                penalty += `You may cancel your booking for <strong>no charge</strong> on or before <strong>${policy['CancelPenalty']}</strong>`;
                return penalty;
            }
        }
    }
    getUniqueAmenities(hotels): string[] {
        // Use Set to ensure uniqueness
        const uniqueAmenitiesSet = new Set<string>();
        hotels.forEach((hotel) => {
            // Check if HotelAmenities is defined and not empty
            if(hotel != null){
            if (hotel.HotelAmenities && hotel.HotelAmenities.length > 0) {
                hotel.HotelAmenities.forEach((amenity: string) => {
                    uniqueAmenitiesSet.add(amenity);
                });
            }
        }
        });
        // Convert Set back to an array
        return Array.from(uniqueAmenitiesSet);
    }
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
