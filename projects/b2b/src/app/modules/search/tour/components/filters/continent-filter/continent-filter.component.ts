import { Component, OnInit } from '@angular/core';
import { TourService } from "../../../tour.service";

           
@Component({
  selector: 'app-continent-filter',
  templateUrl: './continent-filter.component.html',
  styleUrls: ['./continent-filter.component.scss']
})
export class ContinentFilterComponent implements OnInit {

  continentName:string='';
  isCheckedTrue:boolean=false;
  selectedContinet:string='';
  tour:any
  constructor(private tourService:TourService) { }

  ngOnInit(): void {
    this.tourService.tourCopy.subscribe(res => {
      if (res.length) {
          this.tour = res;
      } 
    })

    this.tourService.searchedContinet.subscribe((name)=>{
      this.continentName=name;
    })
    this.tourService.selectedContinet.subscribe((name)=>{
      this.selectedContinet=name;
    })
  }
  
  filterByContinent(isChecked:any){
    if(isChecked){
      this.tourService.selectedContinet.next(this.continentName);
    }else{
      this.tourService.selectedContinet.next('');
    }
  }
}
