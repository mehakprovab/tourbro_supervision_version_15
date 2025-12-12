import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject,concat, forkJoin, from, of, zip } from 'rxjs';
import { ApiHandlerService } from "../../../core/api-handlers";
import { SubSink } from "subsink";
import { UtilityService } from "../../../core/services/utility.service";
import * as moment from "moment";
import { catchError, concatMap, map, mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferService{
  loading = new BehaviorSubject<boolean>(false);
  formFilled: BehaviorSubject<any> = new BehaviorSubject<any>({});
  transfer = new BehaviorSubject<any>([]);
  transferCopy = new BehaviorSubject<any>([]);
  searchingTransfer = new BehaviorSubject<any>('');
  addTransferBookingPaxDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
  noTransfer = new BehaviorSubject<boolean>(false);
  maxPrice = new BehaviorSubject<any>(0);
  minPrice = new BehaviorSubject<any>(0);
  myValue = new BehaviorSubject<any>(0);
  myValueStart = new BehaviorSubject<any>(0);
  private subSunk = new SubSink();
  searchResponseCopy = new BehaviorSubject<any>(false);
  private _transferCopy: any = [];
  clearTransferName = new BehaviorSubject<boolean>(false);
  searchTransferName = new BehaviorSubject<string>(undefined);
  bookingTransferData = new BehaviorSubject<any>(undefined);
  blockedTransferData = new BehaviorSubject<any>(undefined);
  transferTraveller = new BehaviorSubject<any>(undefined);
  userTitleList = new BehaviorSubject<any>([]);
  paxDetails = new BehaviorSubject<any>(undefined);
  transferPromocode = new BehaviorSubject<any>({});
  isCollapsed = new BehaviorSubject<boolean>(true);
  dialogClose = new BehaviorSubject<boolean>(false);
  clearVehicleType = new BehaviorSubject<boolean>(false);
  vehicleType: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  clearSupplierType= new BehaviorSubject<boolean>(false);
  supplierType: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  ratings: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  clearTransferRatings= new BehaviorSubject<boolean>(false);
  extrasValues = new BehaviorSubject<any>(0);
  transferConfirmDetail: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,

  ) { }

  searchResult(data: any) {
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;
    const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    data.paxes.forEach(element => {
      adultCount += element.adultCount;
      childCount += element.childCount;
      infantCount += element.infantCount;
    });
    let request = {
      "FromCityId": data.FromCityId,
      "ToCityId": data.ToCityId,
      "Currency":  JSON.parse(sessionStorage.getItem('currentUser'))['currency'],
      "ArrivalDate": moment(data.ArrivalDate).local().format('DD/MM/YYYY'),
      "ArrTime": moment(data.ArrivalDate).format("HH:mm"),
      "AdultCount": adultCount,
      "ChildCount": childCount,
      "InfantCount": infantCount,
      "BookingSource": data.Destination_source,
      "UserId": created_by_id ? created_by_id : 0,
      "UserType": "B2B",
      "IsReturn": data.IsReturn
    }
    let fromL={
      name:data.departureCity,
      latitude:data.departureLatitude,
      longitude:data.departureLongitude,
      country_code:data.deapartureCountryCode,
      CityId: data.departureCityId
    }

    let To={
      name:data.destinationCity,
      latitude:data.destinationLatitude,
      longitude:data.destinationLongitude,
      country_code:data.destinationCountryCode,
      CityId: data.destinationCityId
    }
    request['From']=fromL;
    request['To']=To;
    if (data.IsReturn == 1) {
      request['ReturnDate'] = moment.utc(data.ReturnDate).local().format('DD/MM/YYYY');
      request['RetTime'] = moment.utc(data.ReturnDate).format('HH:mm')
    }
    this.searchingTransfer.next(true);
    this.loading.next(true);
    this.resetSearch();
    this.transfer.next([]);
    const bookingSources = data['Destination_source'].split(',').map(source => source.trim());




    let errorResponses: any[] = [];
        let allTransfersReponse: any[] = [];
        let loaderHidden = false;

    from(bookingSources).pipe(
            mergeMap(source => {
            const payload = { ...request, BookingSource: source };
            return this.apiHandlerService.apiHandler('transferSearch', 'post', '', '', payload).pipe(
                map((response: any) => {
                if ((response.statusCode === 201 || response.statusCode === 200) && response.data) {
                    if (!loaderHidden && response.data.length > 0) {
                      this.getResponse(response.data)
                        this.hideLoader()
                        loaderHidden = true;
                    }
                return { source, data: response.data };
                } else {
                    this.hideLoader()
                    errorResponses.push({ bookingSource: source, error: response });
                    return { source, data: [] };
                }
                }),
                catchError(error => {
                    this.hideLoader()
                    errorResponses.push({ bookingSource: source, error });
                    return of({ source, data: [] });
                })
            );
            }),
            toArray()
        ).subscribe((searchResponse: any) => {
          console.log(searchResponse)
          allTransfersReponse = searchResponse.map(data => data.data).flat();
          if (allTransfersReponse.length > 0) {
            this.getResponse(allTransfersReponse)
          } else {
            this.hideLoader()
          }
        }, (err) => {
          this.loading.next(false);
          this.transfer.next(err.error);
        })
        





    // this.subSunk.sink = this.apiHandlerService.apiHandler('transferSearch', 'post', '', '', request).subscribe(
    //   searchResponse => {
    //     if (searchResponse.statusCode == 200 && searchResponse.data && Object.keys(searchResponse.data).length>0) {
    //       this.getResponse(searchResponse.data);
    //       this.hideLoader(searchResponse);
    //     }
    //     else {
    //       this.hideLoader(searchResponse);
    //     }
    //     this.changeDetectionEmitter.emit();
    //   }, (error) => {
    //     this.loading.next(false);
    //     this.dialogClose.next(true);
    //     this.transfer.next(error.error);
    //   }
    // );
  }

  filterByRatings(){
    this.multipleFiltersApply();
  }

  filterByVehicleType(){
    this.multipleFiltersApply();
  }

  filterByRatingsExt(transfers) {
    const selectedRatings = this.ratings.value;
   // const selectedRatings = this.ratings.value.filter(a => a.isChecked);
    
    // If no ratings are selected, return all transfers
    if (selectedRatings.length === 0) {
      return transfers;
    }
    
    return transfers.filter(transfer => {
      const starRating = transfer['StarRating']; // Assume StarRating is a number, adjust if it's a string
      return selectedRatings.some(t => {
        if (!starRating) return false;
  
        const [minRating, maxRating] = t.split('-').map(Number); // Split the value and convert to numbers
        return (+starRating) >= minRating && (+starRating) <= maxRating; // Check if starRating falls within the range
      });
    });
  }

  
  getUniqueVehicleType(transfer): string[] {
    // Use Set to ensure uniqueness
    const uniqueVehicleSet = new Set<string>();
    transfer.forEach((transfer) => {
      // Check if HotelAmenities is defined and not empty
      uniqueVehicleSet.add(transfer.ProductName);
    });
    // Convert Set back to an array
    return Array.from(uniqueVehicleSet);
  }

  getUniqueSupplierType(transfer): string[] {
    // Use Set to ensure uniqueness
    const uniqueVehicleSet = new Set<string>();
    transfer.forEach((transfer) => {
      // Check if HotelAmenities is defined and not empty
      uniqueVehicleSet.add(transfer.SupplierName);
    });
    // Convert Set back to an array
    return Array.from(uniqueVehicleSet);
  }

  filterBySupplierType(){
    this.multipleFiltersApply();
  }
  
  hideLoader() {
    this.searchingTransfer.next(false);
    this.loading.next(false);
    this.transfer.next([]);
    this.noTransfer.next(true);
    this.dialogClose.next(true);
  }

  resetSearch() {
    this.transferCopy.next([]);
    this.transfer.next([]);
    this.maxPrice.next(0);
    this.minPrice.next(0);
    this.myValue.next(0);
    this.myValueStart.next(0);
    this.changeDetectionEmitter.emit();
  }

  getResponse(searchResponse: any) {
    searchResponse = searchResponse.sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare);
    this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
    this.transfer.next(searchResponse);
    this.changeDetectionEmitter.emit();
    const transferCopy = JSON.parse(JSON.stringify(searchResponse));
    this.transferCopy.next(transferCopy);
    this._transferCopy = transferCopy;
    let maxPrice = Math.max.apply(Math, transferCopy.map(o => o['Price']['TotalDisplayFare']));
    maxPrice = maxPrice == -Infinity ? 1 : maxPrice;
    this.maxPrice.next(maxPrice);
    let minPrice = Math.min.apply(Math, transferCopy.map(o => o['Price']['TotalDisplayFare']));
    minPrice = minPrice == -Infinity ? 1 : minPrice;
    this.minPrice.next(minPrice);
    this.myValue.next(maxPrice);
    this.myValueStart.next(minPrice);
  }

  changeSlider() {
    this.multipleFiltersApply();

  }

  multipleFiltersApply() {
    let transfers = this.changeSliderExt();
    transfers = this.filterByTransferNameExt(transfers);
    transfers=this.filterByVehicleExt(transfers);
    transfers=this.filterBySupplierExt(transfers);
    transfers=this.filterByRatingsExt(transfers);
    this.transfer.next(transfers);
  }

  filterBySupplierExt(transfers) {
    const selectedSupplierType = this.supplierType.value.filter(a => a.isChecked);
    if (selectedSupplierType.length === 0) {
        return transfers; // No amenities selected, return all hotels
    }
    return transfers.filter(transfer => {
        const providedProduct = (transfer['SupplierName'] || []);
        return selectedSupplierType.some(t => {
            const match = t['supplierType'];
            return t.isChecked && providedProduct.includes(match);
        });
    });
  }


  changeSliderExt() {
    this.myValue.next(Math.ceil(this.myValue.value));
    this.myValueStart.next(Math.floor(this.myValueStart.value));
    const result = this._transferCopy.filter(transfer => {
      const result = transfer.Price.TotalDisplayFare <= this.myValue.value && transfer.Price.TotalDisplayFare >= this.myValueStart.value;
      return result;
    });
    return !result.length ? this._transferCopy : result;
  }

  filterByVehicleExt(transfers) {
    const selectedVehicleType = this.vehicleType.value.filter(a => a.isChecked);
    if (selectedVehicleType.length === 0) {
        return transfers; // No amenities selected, return all hotels
    }
    return transfers.filter(transfer => {
        const providedProduct = (transfer['ProductName'] || []);
        return selectedVehicleType.some(t => {
            const match = t['vehicleType'];
            return t.isChecked && providedProduct.includes(match);
        });
    });
}


  clearPrice() {
    this.myValue.next(this.maxPrice.value);
    this.myValueStart.next(this.minPrice.value);
    this.maxPrice.next(this.maxPrice.value);
    this.minPrice.next(this.minPrice.value);
    this.changeSlider();
  }

  filterByTransferName(searchText) {
    this.searchTransferName.next(searchText);
    this.multipleFiltersApply();
  }

  filterByTransferNameExt(transfers) {
    const searchText = this.searchTransferName.getValue();
    if (!searchText) {
      return transfers;
    }
    let searchTransferName = searchText.trim();
    const searchTerm = searchTransferName.toLowerCase();
    return transfers.filter(transfers => transfers ? transfers.ProductName.toLowerCase().includes(searchTerm) : '');
  }

  resetFilter(){
    this.clearPrice();
    this.clearTransferName.next(true);
    this.clearTransferName.next(true);
    this.clearVehicleType.next(true);
    this.clearSupplierType.next(true);
    this.clearTransferRatings.next(true);
  }

  setPromoCode(){
    const storedState = localStorage.getItem('transferPromocode');
    if (storedState) {
        this.transferPromocode.next({
            promocode: JSON.parse(storedState)
        });
    }
}
}