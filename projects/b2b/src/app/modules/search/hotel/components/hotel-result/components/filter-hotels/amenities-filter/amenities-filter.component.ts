import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
    selector: 'app-amenities-filter',
    templateUrl: './amenities-filter.component.html',
    styleUrls: ['./amenities-filter.component.scss']
})
export class AmenitiesFilterComponent implements OnInit {
    regConfig: FormGroup;
    private subs = new SubSink();
    hotels = [];
    amenitiesList: any;
    showAllAmenities = false;

    constructor(
        private fb: FormBuilder,
        private hotelService: HotelService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.subs.sink = this.hotelService.hotelsCopy.subscribe(data => {
            this.hotels = data;
            this.createForm(this.hotels);
        });
        this.subs.sink = this.hotelService.clearAmenities.subscribe(flag => {
            if(flag) {
                this.clearFilter();
            }
        });
    }

    createForm(hotels) {
        const amenityCheckboxes = this.hotelService.getUniqueAmenities(hotels); // Assuming you have a method to get unique amenities
        const amenityFormArray = amenityCheckboxes.map((amenity) => this.addFields(amenity, amenity));
        this.amenitiesList = amenityCheckboxes;
        this.regConfig = this.fb.group({
            amenities: new FormArray(amenityFormArray),
        });
    }
    
     get amenitiesArray() {
        const array = this.regConfig.get('amenities') as FormArray;
        return this.showAllAmenities ? array.controls : array.controls.slice(0, 5);
    }

    toggleAmenities() {
        this.showAllAmenities = !this.showAllAmenities;
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
        this.hotelService.amenities.next(selectedAmenities);

        // Trigger the filtering process in the service
        this.hotelService.filterByAmenities();
    }


    clearFilter() {
       this.regConfig.reset(); // Reset the form group to its initial state
       this.hotelService.amenities.next([]);
       this.createForm(this.hotels); // Recreate the form with default values
       this.hotelService.filterByAmenities();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
