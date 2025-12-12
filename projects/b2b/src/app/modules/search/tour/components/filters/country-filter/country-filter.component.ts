import { Component, OnInit } from '@angular/core';
import { TourService } from "../../../tour.service";

@Component({
  selector: 'app-country-filter',
  templateUrl: './country-filter.component.html',
  styleUrls: ['./country-filter.component.scss']
})
export class CountryFilterComponent implements OnInit {

  countryName:string='';
  isCheckedTrue:boolean=false;
  selectedCountry:string='';
  tour:any
  constructor(private tourService:TourService) { }

  ngOnInit(): void {
    this.tourService.tourCopy.subscribe(res => {
      if (res.length) {
          this.tour = res;
      } 
    })

    this.tourService.searchedCountry.subscribe((name)=>{
      this.countryName=name;
    })
    this.tourService.selectedCountry.subscribe((name)=>{
      this.selectedCountry=name;
    })
  }
  
  filterByContinent(isChecked:any){
    if(isChecked){
      this.tourService.selectedCountry.next(this.countryName);
    }else{
      this.tourService.selectedCountry.next('');
    }
  }
}
