export function tempTraveller() {
  return {
      adults: 1,
      childrens: 1,
      rooms: 0
  }
}
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { SubSink } from 'subsink';
import { UtilityService } from '../../../core/services/utility.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { mergeMap, map, catchError, toArray } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  isDevelopment = false;
  activityCopy = new BehaviorSubject<any>([]);
  activity = new BehaviorSubject<any>([]);
  traveller: any = this.isDevelopment ? tempTraveller() : undefined;
  formFilled: BehaviorSubject<any> = new BehaviorSubject<any>({});
  loading = new BehaviorSubject<boolean>(false);
  searchingActivity = new BehaviorSubject<any>('');
  noActivity = new BehaviorSubject<boolean>(false);
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
  private subSunk = new SubSink();
  maxPrice = new BehaviorSubject<any>(0);
  minPrice = new BehaviorSubject<any>(0);
  myValue = new BehaviorSubject<any>(0);
  myValueStart = new BehaviorSubject<any>(0);
  searchResponseCopy = new BehaviorSubject<any>(false);
  private _activityCopy: any = [];
  clearActivityName = new BehaviorSubject<boolean>(false);
  searchActivityName = new BehaviorSubject<string>(undefined);
  bookingActivityData = new BehaviorSubject<any>(undefined);
  blockedActivityData = new BehaviorSubject<any>(undefined);
  activityTraveller = new BehaviorSubject<any>(undefined);
  userTitleList = new BehaviorSubject<any>([]);
  paxDetails = new BehaviorSubject<any>(undefined);
  activityPromocode = new BehaviorSubject<any>({});
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
  dialogClose = new BehaviorSubject<boolean>(false);
  activityConfirmDetail: BehaviorSubject<any> = new BehaviorSubject<any>({});
  availableOptions: {} = {
    stars: [],
    sorts: []
  };
  clearcategories = new BehaviorSubject<boolean>(false);
  categories: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  clearReacomended = new BehaviorSubject<boolean>(false);
  reacomended: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  clearDayTime = new BehaviorSubject<boolean>(false);
  dayTime: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private dialog: MatDialog
  ) { }

  getEnabledApi() {
    let apiList = this.utility.readStorage('currentUser', sessionStorage)['activity_api_list'];
    // const apiLists = JSON.parse(apiList.replace(/'/g, '"'));
    // let getEnabledApiList = apiLists.flight;
    let getEnabledApiList = apiList;
    return getEnabledApiList;
}
  searchResult(data: any) {
    // const apiList = this.getEnabledApi();
    
    // if (!data['booking_source']) {
    //     console.warn("No booking source provided in the data.");
    //     this.handleNoResults(); // Handle cases where no booking source is provided
    //     return;
    // }

    // Split booking sources and clean them
    // const bookingSources = data.booking_source;

    // if (!bookingSources.length) {
    //     console.warn("Booking source list is empty.");
    //     this.activity.next([]);
    //     this.handleNoResults(); // Handle cases where booking source list is empty
    //     return;
    // }

    // // Handle cases where apiList is not present or empty
    // if (!apiList || apiList.length === 0) {
    //   this.activity.next([]);
    //     this.handleNoResults(); // No results if no APIs are enabled
    //     return;
    // }

    // Check if the booking source matches the enabled API list
    // const validBookingSources = bookingSources.includes(source);
    // if (!validBookingSources.length) {
    //   this.activity.next([]);
    //     this.handleNoResults(); // Handle cases where no valid booking sources are found
    //     return;
    // }
    const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['id'];
    data["UserId"] = created_by_id;
    data["UserType"] = "B2B";
    if (data['paxes']) {
      data['paxes'].forEach(element => {
          element.ChildAge = this.setChildAge(element);
      });
  }
    data.Currency = this.utility.readStorage('currentUser', sessionStorage)['currency'];
    
    this.searchingActivity.next(true);
    this.loading.next(true);
    this.resetSearch();
    this.activity.next([]);

     const bookingSources = data.booking_source.split(',');

    let loaderHidden = false;
    let errorResponses: any[] = [];


    from(bookingSources).pipe(
    mergeMap((source: any) => {
      const payload = { ...data, booking_source: source.replace(' ','') };
      return this.apiHandlerService.apiHandler('availability', 'post', '', '', payload).pipe(
        map((response: any) => {
          if ((response.statusCode === 201 || response.statusCode === 200) && response.data) {
            if (!loaderHidden && response.data) {
              loaderHidden = true;
              this.hideLoader(response);
            } 
            this.getResponse(response.data)
            return { source, data: response.data };
          } else {
            this.hideLoader(response);
            errorResponses.push({ bookingSource: source, error: response });
            return { source, data: [] };
          }
        }),
        catchError(error => {
          this.hideLoader(error);
          errorResponses.push({ bookingSource: source, error });
          return of({ source, data: [] });
        })
      );
    }),
    toArray()
  ).subscribe(
      (searchResponse: any) => {
        console.log(searchResponse)
        const responseData = searchResponse.map(data => data.data).flat();
        console.log(responseData)
        if (responseData.length > 0) {
          this.getResponse(responseData);
        }
        else {
          this.hideLoader(searchResponse);
        }
        this.changeDetectionEmitter.emit();
      }, (error) => {
        this.loading.next(false);
        this.activity.next(error.error);
      }
    );


    // this.subSunk.sink = this.apiHandlerService.apiHandler('availability', 'post', '', '', data).subscribe(
    //   searchResponse => {
    //     if (searchResponse.statusCode == 200 && searchResponse.data && Object.keys(searchResponse.data).length > 0) {
    //       this.getResponse(searchResponse.data);
    //       //this.hideLoader(searchResponse)
    //     }
    //     else {
    //       this.hideLoader(searchResponse);
    //     }
    //     this.changeDetectionEmitter.emit();
    //   }, (error) => {
    //     this.loading.next(false);
    //     //this.dialogClose.next(true);
    //     this.activity.next(error.error);
    //   }
    // );
  }
  handleNoResults() {
    // this.searchHotelSubmitted = true;
    this.searchingActivity.next(true);
    this.loading.next(true);
    this.loading.next(false);
    this.getResponse([]);
 
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
  hideLoader(searchResponse) {
    this.searchingActivity.next(false);
    this.loading.next(false);
    this.activity.next([]);
    this.noActivity.next(true);
    this.dialog.closeAll();
    this.dialogClose.next(true);
  }
  setHotelTraveller(){
    const storedState = localStorage.getItem('activityTraveller');
    if (storedState) {
        this.traveller=(JSON.parse(storedState));
    }
  }
  resetSearch() {
    this.activityCopy.next([]);
    this.activity.next([]);
    this.maxPrice.next(0);
    this.minPrice.next(0);
    this.myValue.next(0);
    this.myValueStart.next(0);
    this.changeDetectionEmitter.emit();
  }

  getResponse(searchResponse: any) {
    this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
    this.activity.next(searchResponse);
    this.changeDetectionEmitter.emit();
    const activityCopy = JSON.parse(JSON.stringify(searchResponse));
    this.activityCopy.next(activityCopy);
    this._activityCopy = activityCopy;
    let maxPrice = Math.max.apply(Math, activityCopy.map(o => o['Price']['TotalDisplayFare']));
    maxPrice = maxPrice == -Infinity ? 1 : maxPrice;
    this.maxPrice.next(maxPrice);
    let minPrice = Math.min.apply(Math, activityCopy.map(o => o['Price']['TotalDisplayFare']));
    minPrice = minPrice == -Infinity ? 1 : minPrice;
    this.minPrice.next(minPrice);
    this.myValue.next(maxPrice);
    this.myValueStart.next(minPrice);
  }

  changeSlider() {
    this.multipleFiltersApply();

  }

  multipleFiltersApply() {
    let activities = this.changeSliderExt();
    activities = this.filterByActivityNameExt(activities);
    activities = this.filterByStarEtx(activities);
    activities = this.filterByCategoriesExt(activities);
    activities = this.filterByRecomendedExt(activities);
    activities = this.filterByDatTimeExt(activities);
    this.activity.next(activities);
  }
  filterByDatTimeExt(activities) {
    const selectedAmenities = this.dayTime.value.filter(a => a.isChecked);
    if (selectedAmenities.length === 0) {
        return activities; // No amenities selected, return all hotels
    }
    return activities.filter(activity => {
        const providedAmenities = (activity['DurationFilter'] || []);
        return selectedAmenities.some(t => {
            const match = t['amenity'];
            return t.isChecked && providedAmenities.includes(match);
        });
    });
}
  filterByRecomendedExt(activities) {
    const selectedAmenities = this.reacomended.value.filter(a => a.isChecked);
    if (selectedAmenities.length === 0) {
        return activities; // No amenities selected, return all hotels
    }
    return activities.filter(activity => {
        const providedAmenities = (activity['Recommendedactivity'] || []);
        return selectedAmenities.some(t => {
            const match = t['amenity'];
            return t.isChecked && providedAmenities.includes(match);
        });
    });
}
  filterByCategoriesExt(activities) {
    const selectedAmenities = this.categories.value.filter(a => a.isChecked);
    if (selectedAmenities.length === 0) {
        return activities; // No amenities selected, return all hotels
    }
    return activities.filter(activity => {
        const providedAmenities = (activity['Category'] || []);
        return selectedAmenities.some(t => {
            const match = t['amenity'];
            return t.isChecked && providedAmenities.includes(match);
        });
    });
}
  changeSliderExt() {
    this.myValue.next(Math.ceil(this.myValue.value));
    this.myValueStart.next(Math.floor(this.myValueStart.value));
    const result = this._activityCopy.filter(activity => {
      const result = activity.Price.TotalDisplayFare <= this.myValue.value && activity.Price.TotalDisplayFare >= this.myValueStart.value;
      return result;
    });
    return !result.length ? this._activityCopy : result;
  }

  clearPrice() {
    this.myValue.next(this.maxPrice.value);
    this.myValueStart.next(this.minPrice.value);
    this.maxPrice.next(this.maxPrice.value);
    this.minPrice.next(this.minPrice.value);
    this.changeSlider();
  }

  filterByActivityName(searchText) {
    this.searchActivityName.next(searchText);
    this.multipleFiltersApply();
  }

  filterByActivityNameExt(activities) {
    const searchText = this.searchActivityName.getValue();
    if (!searchText) {
      return activities;
    }
    let searchActivityName = searchText.trim();
    const searchTerm = searchActivityName.toLowerCase();
    return activities.filter(activities => activities.ProductName.toLowerCase().includes(searchTerm));
  }

  filterByStar() {
    this.multipleFiltersApply();
  }

  filterByStarEtx(activities) {
    const tempStars = this.stars.value.filter(h => h.isChecked);
    if (this.stars.value.length === tempStars.length || tempStars.length === 0) {
      return activities;
    }
    let tempActivity = [];
    for (let activity of activities) {
      const result = this.stars.value.find(t => t.stars === Number(activity.StarRating));
      if (typeof result !== 'undefined' && result.isChecked) {
        tempActivity.push(activity);
      }
    }
    return tempActivity;
  }

  clearRatingFilter() {
    this.clearRating.next(true);
  }

  resetFilter() {
    this.clearPrice();
    this.clearRatingFilter();
    this.clearActivityName.next(true);
    this.clearDayTime.next(true);
    this.clearReacomended.next(true);
    this.clearcategories.next(true);
  }

  setPromoCode() {
    const storedState = localStorage.getItem('activityPromocode');
    if (storedState) {
      this.activityPromocode.next({
        promocode: JSON.parse(storedState)
      });
    }
  }
  getUniqueRecommanded(hotels): string[] {
    // Use Set to ensure uniqueness
    const uniqueAmenitiesSet = new Set<string>();
    hotels.forEach((hotel) => {
        // Check if HotelAmenities is defined and not empty
        if (hotel.Recommendedactivity && hotel.Recommendedactivity.length > 0) {
            hotel.Recommendedactivity.forEach((amenity: string) => {
                uniqueAmenitiesSet.add(amenity);
            });
        }
    });
    // Convert Set back to an array
    return Array.from(uniqueAmenitiesSet);
  }
  filterByCategories() {
    this.multipleFiltersApply();
  }
  filterByRecomended() {
    this.multipleFiltersApply();
  }
  filterByDayTime() {
    this.multipleFiltersApply();
  }
  getUniqueAmenities(hotels): string[] {
    // Use Set to ensure uniqueness
    const uniqueAmenitiesSet = new Set<string>();
    hotels.forEach((hotel) => {
        // Check if HotelAmenities is defined and not empty
        if (hotel.Category && hotel.Category.length > 0) {
            hotel.Category.forEach((amenity: string) => {
                uniqueAmenitiesSet.add(amenity);
            });
        }
    });
    // Convert Set back to an array
    return Array.from(uniqueAmenitiesSet);
}
getUniqueDayTime(hotels): string[] {
  // Use Set to ensure uniqueness
  const uniqueAmenitiesSet = new Set<string>();
  hotels.forEach((hotel) => {
      // Check if HotelAmenities is defined and not empty
      if (hotel.DurationFilter && hotel.DurationFilter.length > 0) {
          hotel.DurationFilter.forEach((amenity: string) => {
              uniqueAmenitiesSet.add(amenity);
          });
      }
  });
  // Convert Set back to an array
  return Array.from(uniqueAmenitiesSet);
}
}
