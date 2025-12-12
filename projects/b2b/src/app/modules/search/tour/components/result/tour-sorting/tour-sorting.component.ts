import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../../../tour.service';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-tour-sorting',
  templateUrl: './tour-sorting.component.html',
  styleUrls: ['./tour-sorting.component.scss']
})
export class TourSortingComponent implements OnInit {

  @ViewChild('searchInputRef', { static: true }) searchInputRef: ElementRef;
  protected subs = new SubSink();
  active = 'byName';
  byBest = true;
  byGuest = true;
  byPrice = true;
  byStars = true;
  byDistance = true;
  byName = true;
  availableSotrs = [];
  tourList: any = [];
	noTourMessage: any;
	isCollapsedArr = [];
  loading: boolean;

  constructor( private tourService:TourService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.tourService.clearTourName.subscribe(flag => {
      if (flag) {
        this.clearTourName();
      }
    });
    this.tourService.tour.subscribe(res => {
			this.setResponse(res)
	  
		  });
  }

  setResponse(res) {
		if (!res.length) {
		  this.tourList = [];
		  if (res.Message)
			this.dialog.closeAll();
		  this.noTourMessage = res.Message;
		} else {
		  this.tourService.loading.next(false);
		  this.isCollapsedArr = new Array(res.length).fill(true);
		  this.tourList = res || [];
		  if (!this.loading) {
			setTimeout(_ => {
			  this.dialog.closeAll();
			}, 100);
		  }
		}
	  }

  searchTour(searchText: string) {
    this.tourService.filterByTourName(searchText);
  }

  clearTourName() {
    this.searchInputRef.nativeElement.value = ''; // Clear the value of the input field
    this.tourService.filterByTourName(undefined);
  }



  isDisabled(n: string): object {
      return { 'anchorDisabled': !this.availableSotrs.includes(n) }
  }

  sortByBest(internalCall: boolean = false) {
    this.active = 'byBest';
    this.byBest = internalCall ? this.byBest : !this.byBest;
  }

  sortByGuest(internalCall: boolean = false) {
    this.active = 'byGuest';
    this.byGuest = internalCall ? this.byGuest : !this.byGuest;
  }

  sortByStars(internalCall: boolean = false) {
    this.active = 'byStars';
    this.byStars = internalCall ? this.byStars : !this.byStars;
  }

  // Keeping this code as it may have use later after client discussion
  // sortByPrice(typeOfSort:string) {
  //   let sortedTourByPrice;
  //   let tours=this.tourService.tour.value;
  //   if(typeOfSort=='highToLow'){
  //     sortedTourByPrice = tours.sort((a, b) => {
  //       const resultA = Number(a['tourPrice'][0]['adult_airliner_price'] ? a['tourPrice'][0]['adult_airliner_price'] : 0);
  //       const resultB = Number(b['tourPrice'][0]['adult_airliner_price'] ? b['tourPrice'][0]['adult_airliner_price'] : 0);
  //       return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
  //   });
  //   }else{
  //     sortedTourByPrice = tours.sort((a, b) => {
  //       const resultA = Number(a['tourPrice'][0]['adult_airliner_price']);
  //       const resultB = Number(b['tourPrice'][0]['adult_airliner_price']);
  //       return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
  //   });

  //   }
  //   this.tourService.tour.next(sortedTourByPrice);
  // }

  // sortByPrice(internalCall: boolean = false ){
  //   this.active = 'byPrice';
  //   this.byPrice = internalCall ? this.byPrice : !this.byPrice;
  //   let sortedTourByPrice;
  //   let tours=this.tourService.tour.value;
  //   if(this.byPrice){
  //     sortedTourByPrice = tours.sort((a, b) => {
  //       const resultA = Number(a['tourPrice'][0]['adult_airliner_price'] ? a['tourPrice'][0]['adult_airliner_price'] : 0);
  //       const resultB = Number(b['tourPrice'][0]['adult_airliner_price'] ? b['tourPrice'][0]['adult_airliner_price'] : 0);
  //       return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
  //   });
  //   }else{
  //     sortedTourByPrice = tours.sort((a, b) => {
  //       const resultA = Number(a['tourPrice'][0]['adult_airliner_price']);
  //       const resultB = Number(b['tourPrice'][0]['adult_airliner_price']);
  //       return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
  //   });

  //   }
  //   this.tourService.tour.next(sortedTourByPrice);
  // }

  sortByDistance(internalCall: boolean = false) {
    this.active = 'byDistance';
    this.byDistance = internalCall ? this.byDistance : !this.byDistance;
  }

  onSortSelectionChange(selectedValue: string) {
    if (selectedValue === 'asc_price') {
      this.byPrice = true;
      this.sortByPriceLowToHigh();
    } else if (selectedValue === 'desc_price') {
      this.byPrice = false;
      this.sortByPriceHighToLow();
    }
  }

  sortByPriceLowToHigh(){
    let sortedTourByPrice;
    let tours=this.tourService.tour.value;
      sortedTourByPrice = tours.sort((a, b) => {
        const resultA = Number(a['tourPrice'][0]['ex_adult_airliner_price'] ? a['tourPrice'][0]['ex_adult_airliner_price'] : 0);
        const resultB = Number(b['tourPrice'][0]['ex_adult_airliner_price'] ? b['tourPrice'][0]['ex_adult_airliner_price'] : 0);
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
    });
    this.tourService.tour.next(sortedTourByPrice);
  }


  sortByPriceHighToLow(){
    let sortedTourByPrice;
    let tours=this.tourService.tour.value;
    sortedTourByPrice = tours.sort((a, b) => {
      const resultA = Number(a['tourPrice'][0]['ex_adult_airliner_price']);
      const resultB = Number(b['tourPrice'][0]['ex_adult_airliner_price']);
      return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
  });
  this.tourService.tour.next(sortedTourByPrice);
  }


  ngOnDestroy() {
      this.subs.unsubscribe();
  }

}
