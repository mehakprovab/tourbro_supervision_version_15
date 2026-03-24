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
imageBaseUrl = 'http://54.92.243.81:2001/sa/tour/tours/getItineraryImages/';
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
timeSlots: string[] = [];
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
  this.generateTimeSlots();
}

generateTimeSlots() {
  const start = 0;   // 00:00
  const end = 24 * 60; // full day

  for (let i = start; i < end; i += 15) {
    const hours = Math.floor(i / 60).toString().padStart(2, '0');
    const minutes = (i % 60).toString().padStart(2, '0');
    this.timeSlots.push(`${hours}:${minutes}`);
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
       programTitle: ['', [Validators.required, Validators.maxLength(1000)]],
       itineraryDayId: [''],
      activities: this.fb.array([this.createActivityGroup()]) // start with 1 activity
    }));
  }
}

createActivityGroup() {
  return this.fb.group({
    time: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    activityId: ['']
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
saveActivity(dayIndex: number) {

 const dayGroup = this.inputFields.at(dayIndex);
  const activitiesArray = dayGroup.get('activities') as FormArray;

  const itineraryId = dayGroup.get('itineraryDayId').value;

  if (!itineraryId) {
    this.swalService.alert.error('Please save day first');
    return;
  }

  const activitiesPayload: any[] = [];
  const formData = new FormData();

  formData.append('itineraryId', itineraryId);

  let isInvalid = false;

  activitiesArray.controls.forEach((activity: any) => {

    const time = activity.get('time').value;
    const title = activity.get('title').value;
    const description = activity.get('description').value;
    const image = activity.get('image').value;

    // ✅ validation
    if (!time || !title || !description || !image) {
      activity.markAllAsTouched();
      isInvalid = true;
      return;
    }

    // ✅ push activity data (NO image here)
    activitiesPayload.push({
      time,
      title,
      description
    });

    // ✅ append image separately (same key multiple times)
    formData.append('Gallery', image);
  });

  if (isInvalid) {
    this.swalService.alert.error('Please fill all activity fields');
    return;
  }

  // ✅ IMPORTANT: stringify activities
  formData.append('activities', JSON.stringify(activitiesPayload));

  console.log('Payload:', activitiesPayload);

  this.apiHandlerService.apiHandler('addItineraryActivities', 'post', {}, {}, formData)
    .subscribe((res: any) => {

      if (res.statusCode === 200 || res.statusCode === 201) {
        this.swalService.alert.success('All activities saved successfully');
      }

    });
}
onImageUpload(event: any, dayIndex: number, activityIndex: number) {
  const file = event.target.files[0];

  if (file) {
    const activity = (this.inputFields.at(dayIndex).get('activities') as FormArray).at(activityIndex);
    
    // Store the File object
    activity.get('image').setValue(file);
    
    // Clear any cached preview for this key
    const previewKey = `day${dayIndex}act${activityIndex}`;
    if (this.imagePreviewMap[previewKey]) {
      URL.revokeObjectURL(this.imagePreviewMap[previewKey]);
      delete this.imagePreviewMap[previewKey];
    }
    
    activity.get('image').markAsDirty();
    activity.get('image').markAsTouched();
    activity.get('image').updateValueAndValidity();
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
    const route = this.isUpdateTourIternary ? '/tour-crs/tour-list' : 'tour-crs/tour-list/add-tour/tour-descriptions';
          this.router.navigate([route]);
  // const apiMethod = this.isUpdateTourIternary ? 'updateTourItinerary' : 'addTourItinerary';

  // this.subSunk.sink = this.apiHandlerService.apiHandler(apiMethod, 'post', {}, {}, payload)
  //   .subscribe(
  //     response => {
  //       if (response.statusCode === 200 || response.statusCode === 201) {
  //         const msg = this.isUpdateTourIternary 
  //                     ? 'Itinerary updated successfully' 
  //                     : 'Itinerary added successfully';
  //         this.swalService.alert.success(msg);
  //         const route = this.isUpdateTourIternary ? '/tour-crs/tour-list' : 'tour-crs/tour-list/add-tour/tour-descriptions';
  //         this.router.navigate([route]);
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.swalService.alert.error(err.error.Message);
  //     }
  //   );
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
      // Patch basic fields
      this.inputFields.at(i).get('visitedCity').patchValue(day.city_name);
      this.inputFields.at(i).get('programTitle').patchValue(day.program_title);
      this.inputFields.at(i).get('itineraryDayId').patchValue(day.id);

      const activitiesArray = this.inputFields.at(i).get('activities') as FormArray;
      activitiesArray.clear();

      // Handle activities if they exist
      if (day.program_des && day.program_des.length > 0) {
        day.program_des.forEach(act => {
          // Create activity group with the image filename
          const activityGroup = this.fb.group({
            time: [act.time || '', Validators.required],
            title: [act.title || '', Validators.required],
            description: [act.description || ''],
            image: [act.image || '', Validators.required], // Store filename as string
            activityId: [act.id || '']
          });
          
          activitiesArray.push(activityGroup);
        });
      }
    }
  });

  // Handle inclusions
  this.selectedCheckboxes = [];
  if (updateData && updateData.length > 0 && updateData[0].inclusions_checks) {
    this.selectedCheckboxes = updateData[0].inclusions_checks.split(',');
  }

  this.isUpdateTourIternary = true;
}

saveDay(dayIndex: number) {
  const dayGroup = this.inputFields.at(dayIndex);


  // ✅ Only mark required DAY fields
  dayGroup.get('visitedCity').markAsTouched();
  dayGroup.get('programTitle').markAsTouched();

  // ✅ Validate ONLY these fields
  if (
    dayGroup.get('visitedCity').invalid ||
    dayGroup.get('programTitle').invalid
  ) {
    return;
  }


  const payload = {
    tourId: this.tourId,
    visitedCity: dayGroup.get('visitedCity').value,
    programTitle: dayGroup.get('programTitle').value,
   visitedCityDay: `Day ${dayIndex + 1}`
  };

  this.apiHandlerService.apiHandler('saveDay', 'post', {}, {}, payload)
    .subscribe((res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
       
        const dayId = res.data.itineraryDayId;

        // ✅ STORE ID
        dayGroup.get('itineraryDayId').patchValue(dayId);

        this.swalService.alert.success('Day saved successfully');
      }
    });
}

imagePreviewMap = {};

getImageSrc(value: any, key?: string): string {
  // If it's a File object (new upload)
  if (value instanceof File) {
    if (!this.imagePreviewMap[key]) {
      this.imagePreviewMap[key] = URL.createObjectURL(value);
    }
    return this.imagePreviewMap[key];
  }

  // If it's a base64 string
  if (typeof value === 'string' && value.startsWith('data:')) {
    return value;
  }

  // If it's a filename string (from API)
  if (typeof value === 'string' && value) {
    return this.imageBaseUrl + value;
  }

  // Return placeholder or empty
  return 'assets/placeholder-image.png'; // Add a placeholder image
}
}
