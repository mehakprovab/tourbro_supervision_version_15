import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../activities.service';

@Component({
  selector: 'app-activity-sorting',
  templateUrl: './activity-sorting.component.html',
  styleUrls: ['./activity-sorting.component.scss']
})
export class ActivitySortingComponent implements OnInit {
  byBest = true;
  active = 'byName';
  byName = true;
  byPrice = true;
  byStars = true;
  constructor(
    private activityService: ActivitiesService
  ) { }

  ngOnInit(): void {
  }

  sortByName(internalCall: boolean = false) {
    this.active = 'byName';
    this.byName = internalCall ? this.byName : !this.byName;
    let sortedActivity;
    const transfers = this.activityService.activity.value;
    if (this.byName) {
      sortedActivity = transfers.sort((a, b) => {
        const resultA = a['ProductName'].toUpperCase();
        const resultB = b['ProductName'].toUpperCase();
        return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
      });
    } else { // descending order
      sortedActivity = transfers.sort((a, b) => {
        const resultA = a['ProductName'].toUpperCase();
        const resultB = b['ProductName'].toUpperCase();
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
      });
    }
    this.activityService.activity.next(sortedActivity);
  }

  sortByStars(internalCall: boolean = false) {
    this.active = 'byStars';
    this.byStars = internalCall ? this.byStars : !this.byStars;
    let sortedActivity;
    const transfer = this.activityService.activity.value;
    if (this.byStars) {
      sortedActivity = transfer.sort((a, b) => {
        const resultA = Number(a['StarRating'] ? a['StarRating'] : 0);
        const resultB = Number(b['StarRating'] ? b['StarRating'] : 0);
        return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
      });
    } else { // descending order
      sortedActivity = transfer.sort((a, b) => {
        const resultA = Number(a['StarRating']);
        const resultB = Number(b['StarRating']);
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
      });
    }
    this.activityService.activity.next(sortedActivity);
  }

  sortByPrice(internalCall: boolean = false) {
    this.active = 'byPrice';
    this.byPrice = internalCall ? this.byPrice : !this.byPrice;
    let sortedTransfer;
    const transfers = this.activityService.activity.value;
    if (this.byPrice) {
      sortedTransfer = transfers.sort((a, b) => {
        const resultA = Number(a['Price']['TotalDisplayFare'] ? a['Price']['TotalDisplayFare'] : 0);
        const resultB = Number(b['Price']['TotalDisplayFare'] ? b['Price']['TotalDisplayFare'] : 0);
        return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
      });
    } else { // descending order
      sortedTransfer = transfers.sort((a, b) => {
        const resultA = Number(a['Price']['TotalDisplayFare']);
        const resultB = Number(b['Price']['TotalDisplayFare']);
        return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
      });
    }
    this.activityService.activity.next(sortedTransfer);
  }
}
