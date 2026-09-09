import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from '../../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Component({
    selector: 'app-add-or-update-banner-images',
    templateUrl: './add-or-update-banner-images.component.html',
    styleUrls: ['./add-or-update-banner-images.component.scss']
})
export class AddOrUpdateBannerImagesComponent implements OnInit, OnDestroy {
    @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
    logoConfig: FormGroup;
    regConfig:FormGroup;
    logoBannerUri = baseUrl;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    submitted: boolean = false;
    bannerLogo: string;
    private subSunk = new SubSink();
    displayColumn: { key: string, value: string }[] = [
        { key: 'image', value: 'Image' },
        // { key: 'sequence', value: 'Sequence' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    seqId;
    editingBanner: any = null;

    sequenceList: Array<any> = [
        { name: 1 },
        { name: 2 },
        { name: 3 },
        { name: 4 },
        { name: 5 },
        { name: 6 },
        { name: 7 },
        { name: 8 },
        { name: 9 },
        { name: 10 },
    ]

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService
    ) {

    }

    ngOnInit() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            title: new FormControl('', [Validators.required]),
            description: new FormControl(''),
              banner_type: new FormControl('home', Validators.required)
        });
        this.logoConfig = this.fb.group({
            banner_logo: new FormControl('', Validators.required)
        })
        this.getBannerImages();
    }

    getBannerImages() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('mainBannerImagesList', 'post', {}, {}, {})
            .subscribe(resp => {

                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.respData = resp.data.sort((a, b) => a.sequence - b.sequence);
                    let existedSeq = []
                    let allSeq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    this.respData.forEach((item) => {
                        existedSeq.push(item.sequence)
                    });
                    const missingSeq = allSeq.filter(x => !existedSeq.includes(x));
                    this.seqId = Math.min.apply(null, missingSeq.map(item => item))
                    console.log(this.seqId);
                    
                    this.noData = false;
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            });
    }

    getBannerType(banner): string {
        for (const value of [banner.banner_type, banner.type]) {
            const type = String(value || '').trim().toLowerCase();
            if (type === 'home' || type === 'main') {
                return 'home';
            }
            if (type === 'wellness' || type === 'wellness banner image') {
                return 'wellness';
            }
        }
        return '';
    }

    editBannerImage(banner) {
        this.onReset();
        this.editingBanner = banner;
        this.regConfig.patchValue({
            id: banner.id,
            title: banner.title,
            description: banner.description,
            banner_type: this.getBannerType(banner)
        });
        this.imageSrc = this.logoBannerUri + banner.image_url;
        this.logoConfig.get('banner_logo').clearValidators();
        this.logoConfig.get('banner_logo').updateValueAndValidity();
        this.fileUploader.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    imageSrc;
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (!file) {
            return;
        }
        if (file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
               this.fileUploader.nativeElement.value = null;
                return;
            }
        }
        if (file.name) {
            this.bannerLogo = '';
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'banner_logo': file });
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    onSubmit() {
        if (!this.editingBanner && this.respData.length >= 10) {
            this.swalService.alert.oops("you have exceeded the maximum banners.");
            return;
        }
        this.submitted = true;
        if (this.logoConfig.invalid) {
            return;
        }

        const formData = new FormData();
        const isUpdate = !!this.editingBanner;
        const image = this.logoConfig.get('banner_logo').value;
        if (image) {
            formData.append('image', image);
        }
        if (isUpdate) {
            formData.append('id', this.editingBanner.id);
            if (this.editingBanner.sequence != null) {
                formData.append('sequence', this.editingBanner.sequence);
            }
        }
        formData.append('title',this.regConfig.value.title);
        formData.append('description',this.regConfig.value.description); 
        formData.append('banner_type', this.regConfig.value.banner_type);
      

        this.subSunk.sink = this.apiHandlerService.apiHandler(isUpdate ? 'updateMainBannerImage' : 'uploadImage', 'post', {}, {}, formData)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.submitted = false;
                    this.swalService.alert.success(isUpdate ? "Banner updated successfully." : "Banner added successfully.");
                    this.onReset();
                    const fileInput = document.getElementById('logo') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                    this.getBannerImages();

                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            });
    }

    onReset() {
        this.editingBanner = null;
        this.logoConfig.reset();
        this.logoConfig.get('banner_logo').setValidators(Validators.required);
        this.logoConfig.get('banner_logo').updateValueAndValidity();
        if (this.fileUploader) {
            this.fileUploader.nativeElement.value = '';
        }
        this.regConfig.reset();
        this.bannerLogo = '';
        this.imageSrc = '';
        this.regConfig.patchValue({ banner_type: 'home' });
        //this.fileToUpload = null;
        this.submitted = false;
    }

    onSequenceChange(event, id) {
        console.log(event.target.value, id);
        let data = {
            id: id,
            title: "Title",
            description: "Description",
            sequence: event.target.value
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('updateMainBannerImage', 'post', {}, {}, data)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Sequence Updated Successfully.");
                    this.getBannerImages();
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            });

    }

    deleteBannerImage(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMainBannerImage', 'post', {}, {}, { id })
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.respData.splice(this.respData.findIndex(data => data['id'] == id), 1);
                            if (this.editingBanner && this.editingBanner.id == id) {
                                this.onReset();
                            }
                            this.swalService.alert.success('Your record has been deleted successfully!');
                        } else {
                            this.swalService.alert.oops('Something went wrong! Please retry later.');
                        }
                    }, err => {
                        console.log(err);
                        this.swalService.alert.oops('Something went wrong! Please retry later.');
                    });
            } else {
                console.log('Not deleted');
            }
        })
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

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }


}
