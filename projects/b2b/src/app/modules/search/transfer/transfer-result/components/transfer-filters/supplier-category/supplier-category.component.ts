import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { TransferService } from '../../../../transfer.service';

@Component({
  selector: 'app-supplier-category',
  templateUrl: './supplier-category.component.html',
  styleUrls: ['./supplier-category.component.scss']
})
export class SupplierCategoryComponent implements OnInit {
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
        this.subs.sink = this.transferService.clearSupplierType.subscribe(flag => {
            if(flag) {
                this.clearFilter();
            }
        });
    }

    createForm(supplier) {
        const supplierCheckboxes = this.transferService.getUniqueSupplierType(supplier);
        const supplierFormArray = supplierCheckboxes.map((supplier) => this.addFields(supplier, supplier));
        this.regConfig = this.fb.group({
            supplierType: new FormArray(supplierFormArray),
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

    filterBySupplierType(isChecked: boolean, supplierName: string) {
        // Update the state of the checkbox in the form
        const supplierTypeFormArray = this.regConfig.get('supplierType') as FormArray;
        const selectedSupplierControl = supplierTypeFormArray.controls.find(control =>
            control.get('name').value === supplierName
        );

        if (selectedSupplierControl) {
          selectedSupplierControl.get('isChecked').setValue(isChecked);
        }
        const selectedSupplierType = supplierTypeFormArray.controls
            .filter(control => control.get('isChecked').value)
            .map(control => ({
                supplierType: control.get('name').value,
                type: 'supplierType',
                name: control.get('name').value,
                isChecked: control.get('isChecked').value,
            }));

        // Update the service with the selected amenities
        this.transferService.supplierType.next(selectedSupplierType);

        // Trigger the filtering process in the service
        this.transferService.filterBySupplierType();
    }


    clearFilter() {
       this.regConfig.reset(); // Reset the form group to its initial state
       this.transferService.supplierType.next([]);
       this.createForm(this.transfer); // Recreate the form with default values
       this.transferService.filterBySupplierType();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}



