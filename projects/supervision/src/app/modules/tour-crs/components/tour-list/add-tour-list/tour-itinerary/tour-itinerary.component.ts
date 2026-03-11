import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tour-itinerary',
  templateUrl: './tour-itinerary.component.html',
  styleUrls: ['./tour-itinerary.component.scss']
})
export class TourItineraryComponent implements OnInit {

  tourItinerayForm;
  inputFields: FormArray;
  tourDuration:string=''
  totalDaysOfTour:number;
  selectedCheckboxes = [];
  tourId:number;
  tourName:string='';
  subSunk=new SubSink();
  cityVisited:any=[];
  inclusions=['Hotel','Meals','Sightseeing','Transfer']
  cityDataList=[];
  updateTourItenary:string='';
  updateTourItenaryData:any[]=[];
  isUpdateTourIternary:boolean=false;

  constructor( private fb:FormBuilder, private router:Router,private apiHandlerService:ApiHandlerService,
                private swalService:SwalService ) { }

ngOnInit() {
  this.tourId = Number(sessionStorage.getItem('tourId'));
  this.tourName = localStorage.getItem('tourName');
  this.tourDuration = localStorage.getItem('tourDuration');
  this.totalDaysOfTour = parseInt(this.tourDuration.split("|")[0]);

  this.createTourItinerayForm();
  this.getTourRelatedData();

  this.updateTourItenary = localStorage.getItem('updateTourPackage');
  if (this.updateTourItenary == 'Yes') {
    this.getUpdateTourItineraryData();
    localStorage.removeItem('updateTourPackage');
  }
}
  getDaysOfTour(tourDuration:string):number{
    let regex = /\d+(?=\sDays)/;
    let result = Number(tourDuration.match(regex)[0]);
    return result
  }

  // createTourItinerayForm(){
  //   this.tourItinerayForm=this.fb.group({
  //     inputFields: this.fb.array([])
  //   });
  //   this.addInputField();
  // }

  getTourRelatedData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getTourItineraryPageData', 'post', {}, {},{
              "toursId":this.tourId
             })
              .subscribe(response => {
                  if (response.statusCode == 200 || response.statusCode == 201) {
                      this.cityDataList = response.data || [];
                  }else{
                    this.swalService.alert.oops(response.Message);
                  }
              });
  }

createTourItinerayForm() {
  this.tourItinerayForm = this.fb.group({
    inputFields: this.fb.array([])
  });
  this.addInputField();
}

addInputField() {
  this.inputFields = this.tourItinerayForm.get('inputFields') as FormArray;
  for (let i = 0; i < this.totalDaysOfTour; i++) {
    this.inputFields.push(this.fb.group({
      visitedCity: ['', Validators.required],
      programTitle: ['', Validators.required],
      activities: this.fb.array([this.createActivityGroup()]) // start with 1 activity
    }));
  }
}

createActivityGroup() {
  return this.fb.group({
    time: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required]
  });
}
 addActivity(dayIndex: number) {
  const activities = (this.inputFields.at(dayIndex).get('activities') as FormArray);
  activities.push(this.createActivityGroup());
}

removeActivity(dayIndex: number, activityIndex: number) {
  const activities = (this.inputFields.at(dayIndex).get('activities') as FormArray);
  if (activities.length > 1) {
    activities.removeAt(activityIndex);
  }
}
onImageUpload(event: any, dayIndex: number, activityIndex: number) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const activities = (this.inputFields.at(dayIndex).get('activities') as FormArray);

      activities.at(activityIndex).get('image').patchValue(reader.result);
      activities.at(activityIndex).get('image').markAsTouched();
    };

    reader.readAsDataURL(file);
  }
}
inclusionSelection(checked: boolean, inclusion: string) {
  if (checked) {
    this.selectedCheckboxes.push(inclusion);
  } else {
    const index = this.selectedCheckboxes.indexOf(inclusion);
    if (index >= 0) this.selectedCheckboxes.splice(index, 1);
  }
}

 submitItineryForm() {
   
  if (this.tourItinerayForm.invalid) {

    // mark main form
    this.tourItinerayForm.markAllAsTouched();

    // mark nested FormArray controls
    const inputFields = this.tourItinerayForm.get('inputFields') as FormArray;

    inputFields.controls.forEach((dayGroup: any) => {

      dayGroup.markAllAsTouched();

      const activities = dayGroup.get('activities') as FormArray;

      activities.controls.forEach((activity: any) => {
        activity.markAllAsTouched();
      });

    });

    return;
  }

  const updatedData = this.inputFields.controls.map((dayGroup, index) => ({
    visitedCity: dayGroup.get('visitedCity').value,
    visitedCityDay: 'Day ' + (index + 1),
    programTitle: dayGroup.get('programTitle').value,
    activities: (dayGroup.get('activities') as FormArray).controls.map(act => ({
      time: act.get('time').value,
      title: act.get('title').value,
      description: act.get('description').value,
      image: act.get('image').value
    }))
  }));

  const payload = {
    tourId: this.tourId,
    itenary: updatedData,
    inclusionsChecks: this.selectedCheckboxes
  };

  const apiMethod = this.isUpdateTourIternary ? 'updateTourItinerary' : 'addTourItinerary';

  this.subSunk.sink = this.apiHandlerService.apiHandler(apiMethod, 'post', {}, {}, payload)
    .subscribe(
      response => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          const msg = this.isUpdateTourIternary 
                      ? 'Itinerary updated successfully' 
                      : 'Itinerary added successfully';
          this.swalService.alert.success(msg);
          const route = this.isUpdateTourIternary ? '/tour-crs/tour-list' : 'tour-crs/tour-list/add-tour/tour-descriptions';
          this.router.navigate([route]);
        }
      },
      (err: HttpErrorResponse) => {
        this.swalService.alert.error(err.error.Message);
      }
    );
}

 getUpdateTourItineraryData() {
  this.subSunk.sink = this.apiHandlerService.apiHandler('getTourItinerary', 'post', {}, {}, { toursId: this.tourId })
    .subscribe(
      response => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.updateTourItenaryData = response.data || [];
          this.sortUpdateData(this.updateTourItenaryData);
          this.preFillFormWithUpdateData(this.updateTourItenaryData);
        }
      },
      (err: HttpErrorResponse) => {
        this.swalService.alert.error(err.error.Message);
      }
    );
}

sortUpdateData(updateTourData: any) {
  updateTourData.sort((a, b) => a.visited_city_day - b.visited_city_day);
}

preFillFormWithUpdateData(updateData: any) {
  this.inputFields = this.tourItinerayForm.get('inputFields') as FormArray;
  updateData.forEach((day, i) => {
    if (this.inputFields.at(i)) {
      this.inputFields.at(i).get('visitedCity').patchValue(day.CityName);
      this.inputFields.at(i).get('programTitle').patchValue(day.program_title);

      const activitiesArray = this.inputFields.at(i).get('activities') as FormArray;
      activitiesArray.clear();

      day.activities.forEach(act => {
        activitiesArray.push(this.fb.group({
          time: [act.time, Validators.required],
          title: [act.title, Validators.required],
          description: [act.description],
          image: [act.image]
        }));
      });
    }
  });

  // ✅ Updated for TS < 3.7
  this.selectedCheckboxes = [];
  if (updateData && updateData.length > 0 && updateData[0].inclusions_checks) {
    this.selectedCheckboxes = updateData[0].inclusions_checks.split(',');
  }

  this.isUpdateTourIternary = true;
}
}
