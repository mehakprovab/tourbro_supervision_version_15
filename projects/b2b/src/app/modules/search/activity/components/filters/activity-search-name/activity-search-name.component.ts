import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivitiesService } from '../../../activities.service';

@Component({
  selector: 'app-activity-search-name',
  templateUrl: './activity-search-name.component.html',
  styleUrls: ['./activity-search-name.component.scss']
})
export class ActivitySearchNameComponent implements OnInit {
  public searchIcon: string = "assets/images/awesome-search.png";
  @ViewChild('searchInputRef', { static: true }) searchInputRef: ElementRef;

  constructor(
    private activityService: ActivitiesService
  ) { }

  ngOnInit() {
    this.activityService.clearActivityName.subscribe(flag => {
      if (flag) {
        this.clearActivityName();
      }
    });
  }

  searchActivity(searchText: string) {
    this.activityService.filterByActivityName(searchText);
  }

  clearActivityName() {
    this.searchInputRef.nativeElement.value = ''; // Clear the value of the input field
    this.activityService.filterByActivityName(undefined);
  }

}
