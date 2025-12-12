import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from '../../../../../../../environments/environment.prod';

const baseUrl = environment.baseUrl;

@Component({
    selector: 'app-add-update-slider',
    templateUrl: './add-update-slider.component.html',
    styleUrls: ['./add-update-slider.component.scss']
})
export class AddUpdateSliderComponent implements OnInit {
    @Output() activateTab = new EventEmitter<any>();
    @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;

    private subSunk = new SubSink();
    moduleList: Array<any> = [];
    regConfig: FormGroup;
    logoConfig: FormGroup;
    bankLogo: string;
    addOrUpdate: string = '';
    logoBankUri = baseUrl;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    submitted: boolean = false;
    error: string;

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
        this.getModuleList();
    }

    getModuleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getModuleTypes', 'post', '', '').subscribe(res => {
            this.moduleList = res.data;

        });
    }

    imageSrc;
    onFileSelected($event) {
        this.error = "";
        const file = $event.target.files[0];
        if (file && file.size) {
            let result = this.validateFileSize(file.size);
            if (!result) {
              this.clearImage();
                return;
            }
        }
        if (file.name) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const height = img.naturalHeight;
                    const width = img.naturalWidth;
                    if (!this.error) {
                        this.bankLogo = '';
                        this.imgObj.isLogoToUpdate = true;
                        this.logoConfig.setValue({ 'bank_logo': file });
                        this.imageSrc = reader.result
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            // module: new FormControl('', [Validators.required]),
            title: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),

        });
        this.logoConfig = this.fb.group({
            bank_logo: new FormControl('',[Validators.required])
        })
    }


    getToUpdate() {
        this.subSunk.sink = this.cmsService.toUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    // module: data.module ? data.module : '',
                    title: data.title ? data.title : '',
                    description: data.description ? data.description : '',
                    status: data.status == 1 ? '1' : '0',
                }, { emitEvent: false })
                this.bankLogo = data.image ? data.image : '';

            } else {
                this.addOrUpdate = 'add';
            }
        })
    }

    onSubmit() {
        this.regConfig.patchValue({
            bank_logo: "logo.png"
        })
        if (this.addOrUpdate == "add") {
            this.submitted = true;
        }
        if (this.regConfig.invalid)
            return;
        if (!this.logoConfig.valid &&  !this.bankLogo)
            return;
        if (this.error)
            return;
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        const formData = new FormData();
        formData.append('slider_image', this.logoConfig.get('bank_logo').value);
        formData.append('title', this.regConfig.get('title').value);
        formData.append('description', this.regConfig.get('description').value);
        formData.append('type', "ImageContent");
        formData.append('data_source', "b2b");
        formData.append('status', this.regConfig.get('status').value);
        formData.append('module',"Common");
        // formData.append('module', this.regConfig.get('module').value);
        switch (this.addOrUpdate) {
            case 'add':

                delete req.id;
                this.subSunk.sink = this.apiHandlerService.apiHandler('addSliderSetting', 'post', {}, {}, formData)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Slider added successfully.");
                            this.regConfig.reset();
                            this.activateTab.emit({ tabId: 'sliderimage_list' });
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    });
                break;
            case 'update':
                req['title'] = this.regConfig.get('title').value;
                req['description'] = this.regConfig.get('description').value;
                req['slider_image'] = this.bankLogo;
                req['data_source'] =  "b2b";
                req['type'] =  "ImageContent";
                req['module'] =  "Common";
                formData.append('id', req['id']);
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateCoreSliderSettings', 'post', {}, {}, this.imgObj.isLogoToUpdate ? formData : req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Slider updated successfully.");
                            this.regConfig.reset();
                            this.activateTab.emit({ tabId: 'sliderimage_list' });
                            this.cmsService.toUpdateData.next({});
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
        this.imgObj.isLogoToUpdate = false;
        this.bankLogo = '';
        this.imageSrc = '';
        this.submitted = false;
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    validateFileSize(fileSize) {
        if (fileSize >1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            return false;
        }
        else {
            return true;
        }
    }

    clearImage(){
        this.imgObj.isLogoToUpdate = false;
        this.bankLogo = '';
        this.imageSrc = '';
        this.logoConfig.reset();
        this.fileUploader.nativeElement.value = null;
    }
  
    ngOnDestroy() {
        this.cmsService.toUpdateData.next({});
    }
}
