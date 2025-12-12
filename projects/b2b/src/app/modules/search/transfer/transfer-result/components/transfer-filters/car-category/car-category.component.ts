import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { TransferService } from '../../../../transfer.service';

@Component({
  selector: 'app-car-category',
  templateUrl: './car-category.component.html',
  styleUrls: ['./car-category.component.scss']
})
export class CarCategoryComponent implements OnInit {
 
    regConfig: FormGroup;
    private subs = new SubSink();
    transfer = [];

    constructor(
        private fb: FormBuilder,
        private transferService :TransferService
    ) { }

    ngOnInit(): void {
        this.subs.sink = this.transferService.transferCopy.subscribe(data => {
            this.transfer = data;
            this.createForm(this.transfer);
        });
        this.subs.sink = this.transferService.clearVehicleType.subscribe(flag => {
            if(flag) {
                this.clearFilter();
            }
        });
    }

    createForm(transfer) {
        const vehicleCheckboxes = this.transferService.getUniqueVehicleType(transfer);
        const vehicleFormArray = vehicleCheckboxes.map((vehicle) => this.addFields(vehicle, vehicle));
    
        this.regConfig = this.fb.group({
            vehicleType: new FormArray(vehicleFormArray),
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
    }

    getControls(control: string): FormArray {
        return this.regConfig.get(control) as FormArray;
    }

    filterByVehicleType(isChecked: boolean, vehicleName: string) {
        // Update the state of the checkbox in the form
        const vehicleTypeFormArray = this.regConfig.get('vehicleType') as FormArray;
        const selectedVehicleControl = vehicleTypeFormArray.controls.find(control =>
            control.get('name').value === vehicleName
        );

        if (selectedVehicleControl) {
          selectedVehicleControl.get('isChecked').setValue(isChecked);
        }

        const selectedVehicleType = vehicleTypeFormArray.controls
            .filter(control => control.get('isChecked').value)
            .map(control => ({
                vehicleType: control.get('name').value,
                type: 'vehicleType',
                name: control.get('name').value,
                isChecked: control.get('isChecked').value,
            }));

        // Update the service with the selected amenities
        this.transferService.vehicleType.next(selectedVehicleType);

        // Trigger the filtering process in the service
        this.transferService.filterByVehicleType();
    }

    

    clearFilter() {
       this.regConfig.reset(); // Reset the form group to its initial state
       this.transferService.vehicleType.next([]);
       this.createForm(this.transfer); // Recreate the form with default values
       this.transferService.filterByVehicleType();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}

