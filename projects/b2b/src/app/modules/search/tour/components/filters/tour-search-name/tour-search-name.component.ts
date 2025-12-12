import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TourService } from '../../../tour.service';

@Component({
  selector: 'app-tour-search-name',
  templateUrl: './tour-search-name.component.html',
  styleUrls: ['./tour-search-name.component.scss']
})
export class TourSearchNameComponent implements OnInit {
  public searchIcon: string = "assets/images/awesome-search.png";
  @ViewChild('searchInputRef', { static: true }) searchInputRef: ElementRef;

  constructor(
    private tourService: TourService
  ) { }

  ngOnInit() {
    this.tourService.clearTourName.subscribe(flag => {
      if (flag) {
        this.clearTourName();
      }
    });
  }

  searchTour(searchText: string) {
    this.tourService.filterByTourName(searchText);
  }

  clearTourName() {
    this.searchInputRef.nativeElement.value = ''; // Clear the value of the input field
    this.tourService.filterByTourName(undefined);
  }

}
