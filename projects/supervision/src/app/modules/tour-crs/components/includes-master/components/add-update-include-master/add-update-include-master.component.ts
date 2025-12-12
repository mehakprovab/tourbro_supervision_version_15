import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { CmsService } from 'projects/supervision/src/app/modules/cms/cms.service';

import { SubSink } from 'subsink';
const baseUrl = environment.SA_URL;

@Component({
    selector: 'app-add-update-include-master',
    templateUrl: './add-update-include-master.component.html',
    styleUrls: ['./add-update-include-master.component.scss']
})
export class AddUpdateIncludeMasterComponent implements OnInit {

    @ViewChild('theFile', { static: false }) fileUploader: ElementRef;
    private subSunk = new SubSink();
    logoConfig: FormGroup;
    @ViewChild('labelImport', { static: false })
    bannerLogo: string;
    labelImport: ElementRef;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }

    fileToUpload: File = null;
    imageSrc;
    @Output() staticContentTab = new EventEmitter<any>();
    regConfig: FormGroup;
    addOrUpdate = 'add';
    public model = {
        editorData: ''
    };
    bannerImagename: any;
    galleryImageList: any;
    iconImage: any;
    logoUpload: boolean = false;
    constructor(private fb: FormBuilder, private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private cmsService: CmsService,
        private utility: UtilityService) { }

    ngOnInit() {
        this.createForm();
        this.getToUpdate()
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            package_includes: new FormControl('', [Validators.required]),

        });
        this.logoConfig = this.fb.group({
            icon: new FormControl("", [Validators.required]),
        });
    }

    validateFileSize(fileSize) {
        if (fileSize > 1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            const imageControlControl = this.regConfig.get('image');
            imageControlControl.setValidators([Validators.required]);
            imageControlControl.updateValueAndValidity();
            return false;
        }
        else {
            return true
        }
    }
    onSubmit() {
        // console.log(this.addOrUpdate,this.regConfig.value);

        if (this.regConfig.invalid) {
            return;
        }

        //console.log(this.addOrUpdate,typeof req.id);
        // req['data_source'] = "b2c";
        let req = {
            id: this.regConfig.value.id,
            icon: this.logoConfig.value.icon,
            package_includes: this.regConfig.value.package_includes
        };

        //  req.append('icon',this.logoConfig.value.icon);
        //  req.append('package_includes',this.regConfig.value.package_includes); 
        //  req.append('id',this.regConfig.value.id); 
        switch (this.addOrUpdate) {
            case 'add':
                if(this.imageSrc) {
                    this.subSunk.sink = this.cmsService.addIncludeMaster(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Content added successfully.");
                            this.regConfig.reset();
                            this.imageSrc = '';
                            this.iconImage = '';
                            this.staticContentTab.emit({ tabId: 'staticpage_list' });
                        } else {
                            this.swalService.alert.oops('Package Includes already exists!');
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops(err.error.Message);
                    })
                } else {
                    this.swalService.alert.oops('Please Select Image');
                }
                
                break;
            case 'update':


                this.subSunk.sink = this.cmsService.updateIncludeMaster(req)
                    .subscribe(resp => {
                        console.log("error", resp);
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Content updated successfully.");
                            this.regConfig.reset();
                             this.imageSrc = '';
                            this.iconImage = '';
                            this.staticContentTab.emit({ tabId: 'staticpage_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops(err.error.Message);
                    })
                break;
            default:
                break;
        }

    }
    getToUpdate() {

        this.subSunk.sink = this.cmsService.StaticContent.subscribe(data => {
            console.log(data)
            if (!this.utility.isEmpty(data)) {

                this.addOrUpdate = 'update';
                this.logoUpload = true;
                this.iconImage = data.icon;
                this.logoConfig.setValue({ icon: data.icon });
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    package_includes: data.package_includes ? data.package_includes : '',
                }, { emitEvent: false })
                this.model.editorData = data.package_includes;
            } else {
                this.addOrUpdate = 'add';
                this.regConfig.reset();
            }
        })
    }

    onReset() {
        this.cmsService.StaticContent.next({});
        this.regConfig.reset();
        this.logoConfig.reset();
        this.logoUpload = false;
        this.addOrUpdate = 'add';
        this.iconImage = '';
        this.imageSrc = '';
    }


    getImage(img) {
        return `${baseUrl+'/sa/common/getImage/'+img}`;
      }

    getImagetoShow(imageName: any) {
        this.bannerImagename = imageName;
    }

    getGalleryImage(imageName: string) {
        return `${baseUrl + '/tour/tours/getGalleryImages/' + imageName}`;
    }

    getGalleryImagetoShow(inputGalleryImageName: any) {
        if (inputGalleryImageName !== null && inputGalleryImageName !== undefined) {
            this.galleryImageList = inputGalleryImageName.split(',');
        } else {
            this.galleryImageList = [];
        }
    }

    onFileSelected($event) {
        const file = $event.target.files[0];
        console.log("file", file)
        if (file && file.size) {
            let result = this.validateFileSize(file.size);
            if (!result) {
                //this.bankLogo = "";
                this.imageSrc = ""
                this.fileUploader.nativeElement.value = null;
                this.logoConfig.reset();
                return;
            }
        }
        if (file.name) {
            //this.bankLogo = "";
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ icon: file });
            this.uploadLogo(file)
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }


    uploadLogo(logo) {
        let req = new FormData();
        req.append('imageFile', logo);
        this.apiHandlerService.apiHandler('uploadIncludeMasterLogo', 'post', '', '', req).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                this.logoUpload = true;
                this.logoConfig.setValue({ icon: response.data[0].image_url });
            }
            else {
                this.swalService.alert.oops();
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message);
        });
    }
}
