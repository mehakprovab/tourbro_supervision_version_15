import { Component, OnInit } from '@angular/core';
import { TourService } from "../../../tour.service";

@Component({
  selector: 'app-duration-filter',
  templateUrl: './duration-filter.component.html',
  styleUrls: ['./duration-filter.component.scss']
})
export class DurationFilterComponent implements OnInit {

 
  duration:Array<any>=[];
  tour:any
  selectedOptions:Array<string>=[];
   showAllAmenities: boolean = false;
  visibleDurations: any[] = [];
  constructor( private tourService:TourService

  ) { }

  ngOnInit(): void {
    this.tourService.tourCopy.subscribe(res => {
      if (res.length) {
          this.tour = res;
      } 
    })
    this.tourService.durationData.subscribe((res=>{
      this.duration=res.sort((a, b) => {
  const numA = parseInt(a);
  const numB = parseInt(b);
  return numA - numB;
});;
      this.updateVisibleDurations();
    }))
    this.tourService.selectedFilterDuration.subscribe((res)=>{
      this.selectedOptions=res;
    })
  }

  filterByDuration(isChecked:boolean,selectedOption:string){
    this.durationCheckedArray(isChecked,selectedOption);
    this.tourService.selectedFilterDuration.next(this.selectedOptions)
    this.tourService.filterByTourDuration();
  }

  durationCheckedArray(isChecked,inputSelectedOption:string){
    if(isChecked){
      this.selectedOptions.push(inputSelectedOption);
    }else{
      let deSelectedOptionIndex=this.selectedOptions.indexOf(inputSelectedOption)
      this.selectedOptions.splice(deSelectedOptionIndex,1);
    }
  }

  
  toggleAmenities() {
  this.showAllAmenities = !this.showAllAmenities;
  this.updateVisibleDurations();
}

updateVisibleDurations() {
  this.visibleDurations = this.showAllAmenities
    ? this.duration
    : this.duration.slice(0, 5);
}

}

