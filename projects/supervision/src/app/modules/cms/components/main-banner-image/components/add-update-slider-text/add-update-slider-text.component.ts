import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-add-update-slider-text',
  templateUrl: './add-update-slider-text.component.html',
  styleUrls: ['./add-update-slider-text.component.scss']
})
export class AddUpdateSliderTextComponent implements OnInit, OnDestroy {

    @Output() activateTab = new EventEmitter<any>();

    private subSunk = new SubSink();
    moduleList: Array<any> = [];
    regConfig: FormGroup;
    addOrUpdate: string = '';
    submitted: boolean = false;

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private cmsService: CmsService,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService
    ) { }

    omitSpecialCharacters(event) {
        return this.utility.omitSpecialCharacters(event);
    }
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnInit() {
        this.createForm();
        this.getToUpdate();
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
        });
       
    }

    getToUpdate() {

        this.subSunk.sink = this.cmsService.toUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    title: data.title ? data.title : '',
                    description: data.description ? data.description : '',
                    status: data.status == 1 ? '1' : '0',
                }, { emitEvent: false })
               
                console.log(this.regConfig.value);

            } else {
                this.addOrUpdate = 'add';
            }
        })
    }


    onSubmit() {
        if (this.addOrUpdate == "add") {
            this.submitted = true;
        }
        if (this.regConfig.invalid)
            return;
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        const formData = new FormData();
        // formData.append('slider_image', this.logoConfig.get('bank_logo').value);
        formData.append('title', this.regConfig.get('title').value);
        formData.append('description', this.regConfig.get('description').value);
        formData.append('data_source', "b2b");
        formData.append('type', "TextContent");
        formData.append('status', this.regConfig.get('status').value);
        // formData.append('module', this.regConfig.get('module').value);
        switch (this.addOrUpdate) {
            case 'add':
                delete req.id;
                this.subSunk.sink = this.apiHandlerService.apiHandler('addSliderSetting', 'post', {}, {}, formData)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Slider text added successfully.");
                            this.regConfig.reset();
                            this.activateTab.emit({ tabId: 'slider_text_list' });
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    });
                break;
            case 'update':
                
                formData.append('id', req['id']);
                this.cmsService.toUpdateData.next({});
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateCoreSliderSettings', 'post', {}, {}, formData)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Slider text updated successfully.");
                            this.regConfig.reset();
                            this.activateTab.emit({ tabId: 'slider_text_list' });
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    }, err => {
                        this.swalService.alert.oops();
                    });
                break;
            default:
                break;
        }

    }

    onReset() {
        this.cmsService.toUpdateData.next({});
        this.submitted = false;
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
