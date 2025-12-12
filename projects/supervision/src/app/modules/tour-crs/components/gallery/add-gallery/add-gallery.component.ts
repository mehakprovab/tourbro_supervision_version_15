import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { CmsService } from '../../../../cms/cms.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { TourCrsService } from '../../../tour-crs.service';
import { environment } from 'projects/supervision/src/environments/environment';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.component.html',
  styleUrls: ['./add-gallery.component.scss']
})
export class AddGalleryComponent implements OnInit {
    @ViewChild('theFile', { static: true }) theFile: ElementRef;
    private subSunk = new SubSink();
    logoConfig: FormGroup;
    @ViewChild('labelImport', { static: false })
    bannerLogo: string;
    labelImport: ElementRef;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    bankLogo: string;
    fileToUpload: File = null;
    imageSrc;
    flightImage: string = "";
    @Output() staticContentTab = new EventEmitter<any>();
    regConfig: FormGroup;
    addOrUpdate;
    public model = {
        editorData: ''
    };
  constructor(private fb: FormBuilder, private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private tourservice:TourCrsService,
    private utility: UtilityService) { }

  ngOnInit() {
    this.createForm();
    this.getToUpdate()
  }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
        });
        this.logoConfig = this.fb.group({
            banner_logo: new FormControl("",[Validators.required]),
          });
    }

    validateFileSize(fileSize) {
        if (fileSize >1048576) {
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
   let req = new FormData();
 
   req.append('image_url',this.logoConfig.value.banner_logo);      
        
   let id = this.regConfig.value.id;    
  // req.append('id',id);    
 
    switch (this.addOrUpdate) {
        case 'add':
            this.subSunk.sink = this.tourservice.addGallery(req)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("Content added successfully.");
                        this.regConfig.reset();
                        this.staticContentTab.emit({ tabId: 'staticpage_list' });
                    } else {
                        this.swalService.alert.oops();
                    }
                }, (err: HttpErrorResponse) => {
                    console.error(err);
                    this.swalService.alert.oops();
                })
            break;
        case 'update':
            
        req.append('id',id); 
            this.subSunk.sink = this.tourservice.updateGallery(req)
                .subscribe(resp => {
                    console.log("error", resp);
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success("Content updated successfully.");
                        this.regConfig.reset();
                        this.staticContentTab.emit({ tabId: 'staticpage_list' });
                    } else {
                        this.swalService.alert.oops();
                    }
                }, (err: HttpErrorResponse) => {
                    console.error(err);
                    this.swalService.alert.oops();
                })
            break;
        default:
            break;
    }

}
getToUpdate() {

    this.subSunk.sink = this.tourservice.StaticContent.subscribe(data => {
        console.log(data)
        if (!this.utility.isEmpty(data)) {

            this.addOrUpdate = 'update';
            this.regConfig.patchValue({
                id: data.id ? data.id : '',
               
            },
             { emitEvent: false })
             this.bankLogo = data.image_url ? data.image_url : '';
            
        }else{
          this.addOrUpdate = 'add';
        }
    })
} 

    onReset(){
        this.tourservice.StaticContent.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
        this.regConfig.patchValue({
            page_description: '',
        })
    } 


    getImage(img) {
        return `${baseUrl + '/' + img}`;
    }
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
                this.bankLogo = "";
                this.imageSrc=""
                this.theFile.nativeElement.value = null;
                this.logoConfig.reset();
                this.logoConfig.controls['banner_logo'].reset()
                return;
            }
        }
        if (file.name) {
            this.bankLogo = '';
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'banner_logo': file });
            this.regConfig.patchValue({ banner_logo: file });
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }
}
