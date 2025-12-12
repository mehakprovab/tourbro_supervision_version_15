import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TourService } from '../../tour.service';

@Component({
  selector: 'app-tour-search-loader',
  templateUrl: './tour-search-loader.component.html',
  styleUrls: ['./tour-search-loader.component.scss']
})
export class TourSearchLoaderComponent implements OnInit {

  public arrow_right: string = "assets/images/right_arrow.png";
  airline_logo: string = '';
  tourInfo: any
  constructor(
      private tourService: TourService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
      this.tourInfo = this.data.data
  }

  getCity(cityName) {
      let city = String(cityName).split(',')[0];
      return city;
  }

}
