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

    imageSrc;
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
               this.onReset();
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
        if (this.respData.length == 10) {
            this.swalService.alert.oops("you have exceeded the maximum banners.");
            return;
        }
        this.submitted = true;
        if (this.logoConfig.invalid) {
            return;
        }

        const formData = new FormData();
        formData.append('image', this.logoConfig.get('banner_logo').value);
        formData.append('title',this.regConfig.value.title);
        formData.append('description',this.regConfig.value.description); 
      

        this.subSunk.sink = this.apiHandlerService.apiHandler('uploadImage', 'post', {}, {}, formData)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.submitted = false;
                    this.swalService.alert.success("Banner added successfully.");
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
        this.logoConfig.reset();
        this.regConfig.reset();
        this.bannerLogo = '';
        this.imageSrc = '';
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
