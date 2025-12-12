import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of, zip } from 'rxjs';
import { SubSink } from 'subsink';
import { UtilityService } from '../../../core/services/utility.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AppService } from '../../../app.service';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class TourService {
  tourCopy = new BehaviorSubject<any>([]);
  tour = new BehaviorSubject<any>([]);
  formFilled: BehaviorSubject<any> = new BehaviorSubject<any>({});
  loading = new BehaviorSubject<boolean>(false);
  searchingTour = new BehaviorSubject<any>('');
  noTour = new BehaviorSubject<boolean>(false);
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
  addTourBookingPaxDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private subSunk = new SubSink();
  maxPrice = new BehaviorSubject<any>(0);
  minPrice = new BehaviorSubject<any>(0);
  myValue = new BehaviorSubject<any>(0);
  myValueStart = new BehaviorSubject<any>(0);
  searchResponseCopy = new BehaviorSubject<any>(false);
  private _tourCopy: any = [];
  clearTourName = new BehaviorSubject<boolean>(false);
  searchTourName = new BehaviorSubject<string>(undefined);
  bookingTourData = new BehaviorSubject<any>(undefined);
  blockedTourData = new BehaviorSubject<any>(undefined);
  tourTraveller = new BehaviorSubject<any>(undefined);
  userTitleList = new BehaviorSubject<any>([]);
  paxDetails = new BehaviorSubject<any>(undefined);
  tourPromocode = new BehaviorSubject<any>({});
  isCollapsed = new BehaviorSubject<boolean>(true);
  ratingReset = new BehaviorSubject<boolean>(false);
  rating1 = new BehaviorSubject<boolean>(false);
  rating2 = new BehaviorSubject<boolean>(false);
  rating3 = new BehaviorSubject<boolean>(false);
  rating4 = new BehaviorSubject<boolean>(false);
  rating5 = new BehaviorSubject<boolean>(false);
  stars: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  applySortingAfterFilter = new BehaviorSubject<boolean>(false);
  clearRating = new BehaviorSubject<boolean>(false);
  availableOptions: {} = {
    stars: [],
    sorts: []
  };

  isDevelopment = false;
  searchTourSubmitted: any = false;
  serverError = new BehaviorSubject<boolean>(false);
  searchedContinet = new BehaviorSubject<any>([]);
  searchedCountry = new BehaviorSubject<any>([]);
  duration: Array<string> = [];
  packageType: Array<string> = [];
  themType: Array<string> = [];
  durationData = new BehaviorSubject<any>([]);
  packageTypeData = new BehaviorSubject<any>([]);
  themTypeData = new BehaviorSubject<any>([]);
  selectedFilterDuration = new BehaviorSubject<any>([]);
  selectedFilterPackage = new BehaviorSubject<any>([]);
  selectedFilterTheme = new BehaviorSubject<any>([]);
  bookingInfoData = new BehaviorSubject<any>([]);
  selectedContinet = new BehaviorSubject<string>('');
  selectedCountry = new BehaviorSubject<string>('');
  tourPriceBreakDown = new BehaviorSubject<any>([]);

  constructor(private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private appService: AppService,
    private dialog: MatDialog,
  ) { }


  searchResult(data: any) {
    this.tour.next([]);
    const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    data["UserId"] = created_by_id;
    data["UserType"] = "B2B";
    
    const bookingSources = data['Destination_source'].split(',').map(source => source.trim());
    
    // Prepare API requests with error handling
    const requests = bookingSources.map(source => {
      const payload = { 
        "CityId": `${data.FromCityId}`,
        "booking_source": source,
        "Currency": JSON.parse(sessionStorage.getItem('currentUser'))['currency'],
        "UserType": "B2B",
        "UserId": created_by_id
      };
      return this.apiHandlerService.apiHandler('searchTour', 'post', '', '', payload).pipe(
        catchError(error => {
          // Handle error per request
          console.error(`Error with booking source ${source}:`, error);
          return of({ statusCode: 500, data: [] }); // Return an empty result on error
        })
      );
    });
    
    this.searchingTour.next(true);
    this.loading.next(true);
    this.resetSearch();
    this.tour.next([]);
    this.tourCopy.next([]);

    // Combine all requests
    zip(...requests).subscribe(
      (results: any[]) => {
        let allTourResponses = [];
        let errorResponses = [];
        
        results.forEach((response, index) => {
          if (response.statusCode === 200 && response.data && Object.keys(response.data).length > 0) {
            allTourResponses = [...allTourResponses, ...response.data];
          } else {
            errorResponses.push({ bookingSource: bookingSources[index], error: response });
          }
        });
        
        // Handle the combined results
        if (allTourResponses.length > 0) {
          this.getResponse(allTourResponses);
          // this.dialog.closeAll();
        } else {
          this.hideLoader({ message: 'No data found' }); // Adjust this according to your needs
        }
        
        // this.loading.next(false);
        
        if (errorResponses.length > 0) {
          console.warn('Some requests failed:', errorResponses);
          // Optionally, you can process error responses or show a message to the user
        }
        
        this.searchingTour.next(false);
        this.changeDetectionEmitter.emit();
      },
      (error) => {
        // Handle any unexpected errors here
        // this.loading.next(false);
        this.searchingTour.next(false);
        console.error('Error during search:', error);
      }
    );
  }


  hideLoader(searchResponse) {
    this.searchingTour.next(false);
    this.loading.next(false);
    this.tour.next(searchResponse);
    this.noTour.next(true);
  }

  resetSearch() {
    this.tourCopy.next([]);
    this.tour.next([]);
    this.maxPrice.next(0);
    this.minPrice.next(0);
    this.myValue.next(0);
    this.myValueStart.next(0);
    this.changeDetectionEmitter.emit();
  }

  getResponse(searchResponse: any) {
    this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
    this.tour.next(searchResponse);
    this.changeDetectionEmitter.emit();
    const tourCopy = JSON.parse(JSON.stringify(searchResponse));
    this.tourCopy.next(tourCopy);
    this._tourCopy = tourCopy;
    this.searchedContinet.next(this._tourCopy[0]['tours_continent']);
    this.searchedCountry.next(this._tourCopy[0]['tours_country']);
    this.duration = this.getFilterData(this._tourCopy, 'duration');
    this.durationData.next(this.duration);
    this.packageType = this.getFilterData(this._tourCopy, 'module_type');
    this.packageTypeData.next(this.packageType);
    this.themType = this.getThemeType(this._tourCopy);
    this.themTypeData.next(this.themType);
    let maxPrice = Math.max.apply(Math, tourCopy.map(o => o['tourPrice'][0]['ex_adult_airliner_price']));
    maxPrice = maxPrice == -Infinity ? 1 : maxPrice;
    this.maxPrice.next(maxPrice);
    let minPrice = Math.min.apply(Math, tourCopy.map(o => o['tourPrice'][0]['ex_adult_airliner_price']));
    minPrice = minPrice == -Infinity ? 1 : minPrice;
    this.minPrice.next(minPrice);
    this.myValue.next(maxPrice);
    this.myValueStart.next(minPrice);
  }

  getFilterData(resData: any, type: string) {
    let uniqueSet: Set<string> = new Set();
    resData.forEach((item) => {
      uniqueSet.add(item[type])
    })
    const sortedData = Array.from(uniqueSet)
    return sortedData;
  }

  getThemeType(resData) {
    let uniqueThemeSet: Set<string> = new Set();
    resData.forEach((item) => {
      item.theme.forEach((item1) => {
        uniqueThemeSet.add(item1)
      })
    })
    const sortedThemData = Array.from(uniqueThemeSet).sort();
    return sortedThemData;
  }

filterByTourPrice(){
    this.multipleFilterApply();
}

filterByTourDuration(){
    this.multipleFilterApply();
}

filterByTourPackage(){
    this.multipleFilterApply();
}

filterByTourTheme(){
    this.multipleFilterApply();
}

multipleFilterApply(){

    let filteredTour=this.filterPrice()
    filteredTour=this.filterDuration(filteredTour);
    filteredTour=this.filterPackage(filteredTour);
    filteredTour=this.filterTheme(filteredTour);
    this.tour.next(filteredTour);
}

filterDuration(tourData:any){
  let filteredTourData;
  if(this.selectedFilterDuration.value.length==0){
      return tourData
  }
  filteredTourData=tourData.filter(item=>
      this.selectedFilterDuration.value.includes(item['duration'])
  );
  return filteredTourData;
}

filterPackage(tourData:any){
  let filteredTourData;
  if(this.selectedFilterPackage.value.length==0){
      return tourData
  }
  filteredTourData=tourData.filter(item=>
      this.selectedFilterPackage.value.includes(item['module_type'])
  );
  return filteredTourData;
}

filterTheme(tourData:any){
  let filteredTourData;
  if(this.selectedFilterTheme.value.length==0){
      return tourData
  }
  filteredTourData=tourData.filter(item=>
      item['theme'].some(themeItem => 
          this.selectedFilterTheme.value.includes(themeItem)
      )
  );
  return filteredTourData;

}


  changeSlider() {
    this.multipleFiltersApply();

  }

  multipleFiltersApply() {
    let tour = this.filterPrice();
    tour = this.filterByTourNameExt(tour);
    tour = this.filterByStarEtx(tour);
    this.tour.next(tour);
  }

  filterPrice() {
    this.myValue.next(Math.ceil(this.myValue.value));
    this.myValueStart.next(Math.floor(this.myValueStart.value));
    const result = this._tourCopy.filter(tourItem => {
      const result = tourItem['tourPrice'][0]['ex_adult_airliner_price']<= this.myValue.value && tourItem['tourPrice'][0]['ex_adult_airliner_price']>= this.myValueStart.value;
      return result;
    });
    return !result.length ? this._tourCopy : result;
    //return this.tourCopy.value;
  }

  clearPrice() {
    this.myValue.next(this.maxPrice.value);
    this.myValueStart.next(this.minPrice.value);
    this.maxPrice.next(this.maxPrice.value);
    this.minPrice.next(this.minPrice.value);
    this.changeSlider();
  }

  filterByTourName(searchText) {
    this.searchTourName.next(searchText);
    this.multipleFiltersApply();
  }

  filterByTourNameExt(tour) {
    const searchText = this.searchTourName.getValue();
    if (!searchText) {
      return tour;
    }
    let searchTourName = searchText.trim();
    const searchTerm = searchTourName.toLowerCase();
    return tour.filter(tour => tour.package_name.toLowerCase().includes(searchTerm));
  }

  filterByStar() {
    this.multipleFiltersApply();
  }

  filterByStarEtx(tours) {
    const tempStars = this.stars.value.filter(h => h.isChecked);
    if (this.stars.value.length === tempStars.length || tempStars.length === 0) {
      return tours;
    }
    let tempTour = [];
    for (let tour of tours) {
      const result = this.stars.value.find(t => t.stars === Number(tour.StarRating));
      if (typeof result !== 'undefined' && result.isChecked) {
        tempTour.push(tour);
      }
    }
    return tempTour;
  }

resetFilter() {
    this.clearPrice();
    this.selectedFilterDuration.next([]);
    this.selectedFilterPackage.next([]);
    this.selectedFilterTheme.next([]);
    this.selectedContinet.next('');
    this.selectedCountry.next('');
    this.searchTourName.next('');
    this.tour.next(this._tourCopy);
}

resetFilterData(){
    this.searchedContinet.next([]);
    this.searchedCountry.next([]);
    this.durationData.next([]);
    this.packageTypeData.next([]);
    this.themTypeData.next([]);
    this.myValue.next(0);
    this.myValueStart.next(0);
    this.maxPrice.next(0);
    this.minPrice.next(0);
    this.changeSlider();
}

  setPromoCode() {
    const storedState = localStorage.getItem('tourPromocode');
    if (storedState) {
      this.tourPromocode.next({
        promocode: JSON.parse(storedState)
      });
    }
  }

    setHotelInvoiceNumber(appReference) {
        let invoiceNumber = "";
        if (appReference) {
            invoiceNumber = "INV-" + (appReference.split("-")[1]);
        }
        return invoiceNumber;
    }
}
