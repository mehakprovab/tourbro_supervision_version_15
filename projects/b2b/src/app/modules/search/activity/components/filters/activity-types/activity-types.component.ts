import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { ActivitiesService } from '../../../activities.service';

@Component({
  selector: 'app-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss']
})
export class ActivityTypesComponent implements OnInit {

  regConfig: FormGroup;
  private subs = new SubSink();
  hotels = [];

  constructor(
      private fb: FormBuilder,
      private activityService: ActivitiesService,
      private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
      this.subs.sink = this.activityService.activityCopy.subscribe(data => {
        console.log("data",data)
          this.hotels = data;
          this.createForm(this.hotels);
      });
      this.subs.sink = this.activityService.clearDayTime.subscribe(flag => {
          if(flag) {
              this.clearFilter();
          }
      });
  }

  createForm(hotels) {
      const amenityCheckboxes = this.activityService.getUniqueDayTime(hotels); // Assuming you have a method to get unique amenities
      const amenityFormArray = amenityCheckboxes.map((amenity) => this.addFields(amenity, amenity));
  
      this.regConfig = this.fb.group({
          amenities: new FormArray(amenityFormArray),
      });
  }
  

  addFields(name, value): FormGroup {
      return this.fb.group({
          isChecked: false,
          name,
          value
      })
  }

  ngAfterViewInit() {
      this.cd.detectChanges();
  }

  getControls(control: string): FormArray {
      return this.regConfig.get(control) as FormArray;
  }

  filterByAmenities(isChecked: boolean, amenityName: string) {
      // Update the state of the checkbox in the form
      const amenityFormArray = this.regConfig.get('amenities') as FormArray;
      const selectedAmenityControl = amenityFormArray.controls.find(control =>
          control.get('name').value === amenityName
      );

      if (selectedAmenityControl) {
          selectedAmenityControl.get('isChecked').setValue(isChecked);
      }

      // Build the list of selected amenities
      const selectedAmenities = amenityFormArray.controls
          .filter(control => control.get('isChecked').value)
          .map(control => ({
              amenity: control.get('name').value,
              type: 'amenities',
              name: control.get('name').value,
              isChecked: control.get('isChecked').value,
          }));

      // Update the service with the selected amenities
      this.activityService.dayTime.next(selectedAmenities);

      // Trigger the filtering process in the service
      this.activityService.filterByDayTime();
  }


  clearFilter() {
     this.regConfig.reset(); // Reset the form group to its initial state
     this.activityService.dayTime.next([]);
     this.createForm(this.hotels); // Recreate the form with default values
     this.activityService.filterByDayTime();
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }


}
