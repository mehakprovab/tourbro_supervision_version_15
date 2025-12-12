import { Component, OnInit } from '@angular/core';
import { TourService } from "../../../tour.service";

@Component({
  selector: 'app-theme-filter',
  templateUrl: './theme-filter.component.html',
  styleUrls: ['./theme-filter.component.scss']
})
export class ThemeFilterComponent implements OnInit {

  theme:Array<any>=[];
  tour:any
  selectedOptions:Array<string>=[];
  constructor( private tourService:TourService

  ) { }

  ngOnInit(): void {
    this.tourService.tourCopy.subscribe(res => {
      if (res.length) {
          this.tour = res;
      } 
    })
    this.tourService.themTypeData.subscribe((res)=>{
      this.theme=res;
    })

    this.tourService.selectedFilterTheme.subscribe((res)=>{
      this.selectedOptions=res;
    })
  }
  
  filterBytheme(isChecked:boolean,inputSelectedOption:string){
    this.themeCheckedArray(isChecked,inputSelectedOption);
    this.tourService.selectedFilterTheme.next(this.selectedOptions);
    this.tourService.filterByTourTheme();
  }

  themeCheckedArray(isChecked:boolean,inputSelectedOption:string){
    if(isChecked){
      this.selectedOptions.push(inputSelectedOption);
    }else{
      let deSelectedOptionIndex=this.selectedOptions.indexOf(inputSelectedOption)
      this.selectedOptions.splice(deSelectedOptionIndex,1);
    }
  }

}
