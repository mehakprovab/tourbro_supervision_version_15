import { Component, OnInit } from '@angular/core';
import { TourService } from "../../../tour.service";

@Component({
  selector: 'app-package-type-filter',
  templateUrl: './package-type-filter.component.html',
  styleUrls: ['./package-type-filter.component.scss']
})
export class PackageTypeFilterComponent implements OnInit {

  package:Array<any>=[];
  selectedOptions:Array<string>=[];
  tour:any
  constructor( private tourService:TourService

  ) { }

  ngOnInit(): void {
    this.tourService.tourCopy.subscribe(res => {
      if (res.length) {
          this.tour = res;
      } 
    })

    this.tourService.packageTypeData.subscribe((res)=>{
      this.package=res;
    })
    this.tourService.selectedFilterPackage.subscribe((res)=>{
      this.selectedOptions=res;
    })
  }

  filterByPackage(isChecked:boolean,inputSelectedOption:string){
    this.packageCheckedArray(isChecked,inputSelectedOption);
    this.tourService.selectedFilterPackage.next(this.selectedOptions)
    this.tourService.filterByTourPackage();
  }

  packageCheckedArray(isChecked:boolean,inputSelectedOption:string){
    if(isChecked){
      this.selectedOptions.push(inputSelectedOption);
    }else{
      let deSelectedOptionIndex=this.selectedOptions.indexOf(inputSelectedOption)
      this.selectedOptions.splice(deSelectedOptionIndex,1);
    }
  }
}
