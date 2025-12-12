import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form-extension',
    templateUrl: './form-extension.component.html',
    styleUrls: ['./form-extension.component.scss']
})
export class FormExtensionComponent implements OnInit {
    @Input() regConfig: FormGroup;
    @Input() travellerForm: FormGroup;
    @Input() travellersFadeinn: boolean;
    @Input() fadeinn: boolean;

    constructor() { }

    ngOnInit() {
    }

    onSubmitTraveller() {
        this.travellersFadeinn = false;
    }

    onUpdateTraveller(element: string, operation: string) {
        const control = this.travellerForm.controls[element];
        if (operation === 'minus') {
            control.setValue(control.value < 1 ? control.value : control.value - 1);
        } else {
            control.setValue(control.value + 1);
        }
        this.regConfig.patchValue({
            traveller: this.travellerForm.value
        });

    }

    onChangeCabin(v: any) {
        this.regConfig.patchValue({
            cabinClass: v
        });
        this.fadeinn = false;
    }

}
