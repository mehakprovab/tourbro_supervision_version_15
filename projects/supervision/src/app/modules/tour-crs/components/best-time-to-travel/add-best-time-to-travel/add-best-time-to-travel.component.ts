import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { CmsService } from '../../../../cms/cms.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { environment } from 'projects/supervision/src/environments/environment';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-add-best-time-to-travel',
  templateUrl: './add-best-time-to-travel.component.html',
  styleUrls: ['./add-best-time-to-travel.component.scss']
})
export class AddBestTimeToTravelComponent implements OnInit {
    @ViewChild ('theFile',{static: false}) theFile:ElementRef;
    private subSunk = new SubSink();
    logoConfig: FormGroup;
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    bannerLogo: string;
    
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    logoBankUri = baseUrl;
    bankLogo:string;
    fileToUpload: File = null;
    imageSrc;
    flightImage: string = "";
    @Output() staticContentTab = new EventEmitter<any>();
    regConfig: FormGroup;
    addOrUpdate;
    public model = {
        editorData: ''
    };
    onFileChange(files: FileList) {
        this.bankLogo = "";
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        this.fileToUpload = files.item(0);
        const file = files[0];
        if (file && file.size) {
            let result = this.validateFileSize(file.size);
            if (!result) {
              this.clearImage();
                return;
            }
        }
        if (file.name) {
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        }
    }
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
           city_name: new FormControl('', [Validators.required]),
           no_of_packages: new FormControl('', [Validators.required]),
           price: new FormControl('', [Validators.required]),
           image: new FormControl('', [Validators.required]),
           update_image: new FormControl(''),
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
    if (this.regConfig.invalid) {
        return;
    }
   let req = new FormData();
   if(this.fileToUpload){
     req.append('image_url',this.fileToUpload);
   }
  if(this.regConfig.value.update_image && !this.fileToUpload){
   req.append('image_url',this.regConfig.value.update_image);
  }
   //req.append('image_url',this.logoConfig.value.banner_logo);
   req.append('city_name',this.regConfig.value.city_name); 
   req.append('price',this.regConfig.value.price); 
   req.append('no_of_packages',this.regConfig.value.no_of_packages); 
    switch (this.addOrUpdate) {
        case 'add':
            this.subSunk.sink = this.cmsService.addBestTimeToTravel(req)
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
            
        let id = this.regConfig.value.id;    
        req.append('id',id); 
            this.subSunk.sink = this.cmsService.updateBestTimetoTavel(req)
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

    this.subSunk.sink = this.cmsService.StaticContent.subscribe(data => {
        console.log(data)
        if (!this.utility.isEmpty(data)) {

            this.addOrUpdate = 'update';
            this.regConfig.patchValue({
                id: data.id ? data.id : '',
                city_name: data.city_name ? data.city_name : '',
                no_of_packages: data.no_of_packages ? data.no_of_packages : '',
                price: data.price ? data.price : '',
                update_image: data['image_url'] || "", 
            }, { emitEvent: false })
            this.bankLogo = data['image_url'];
            if(data['image_url'] && data['image_url']!="")
            this.regConfig.get('image').clearValidators();
        }else{
          this.addOrUpdate = 'add';
        }
        console.log("this.regConfig",this.regConfig)
    })
} 

    onReset(){
        this.addOrUpdate = 'add';
        this.fileToUpload = null;
        this.imageSrc= "";
        this.bankLogo = "";
        this.regConfig.reset();
        this.labelImport.nativeElement.innerText="Upload Image";
        this.regConfig.get('image').setValidators(Validators.required);
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
                this.regConfig.controls['banner_logo'].reset()
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
      getImage(img) {
        return `${baseUrl + '/' + img}`;
    }
    clearImage(){
        this.fileToUpload = null;
        this.imageSrc= "";
        this.bankLogo = "";
        this.labelImport.nativeElement.innerText="Upload Image";
        this.regConfig.controls['image'].reset()
        const imageControlControl = this.regConfig.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();
    }
  
   
}
