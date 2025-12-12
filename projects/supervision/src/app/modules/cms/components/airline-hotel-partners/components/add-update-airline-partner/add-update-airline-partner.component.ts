import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from '../../../../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-add-update-airline-partner',
  templateUrl: './add-update-airline-partner.component.html',
  styleUrls: ['./add-update-airline-partner.component.scss']
})
export class AddUpdateAirlinePartnerComponent implements OnInit {

    @Output() activateTab = new EventEmitter<any>();
    @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;

    private subSunk = new SubSink();
   // moduleList: Array<any> = [];
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
    error : string;

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private cmsService: CmsService,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService
    ) { }

    moduleList : Array<any> = [
        { id: "Flight", name: "Flight" },
        { id: "Hotel", name: "Hotel" },
    ]

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
                     if(!this.error){
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
            module_name: new FormControl('', [Validators.required]),
            logo: new FormControl(''),
            title: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl('', [Validators.required]),

        });
        this.logoConfig = this.fb.group({
            bank_logo: new FormControl('',[Validators.required])
        })
    }



    getToUpdate() {
        this.subSunk.sink = this.cmsService.hotelAirlineData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    module_name: data.module_name ? data.module_name : '',
                    title: data.title ? data.title : '',
                    description: data.description ? data.description : '',
                    status: data.status == 1 ? '1' : '0',
                }, { emitEvent: false })
                this.bankLogo = data.logo ? data.logo : '';

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
        if (!this.regConfig.valid)
            return;
        if (!this.logoConfig.valid && !this.bankLogo)
            return;
        if (this.error)
            return;

        let req = JSON.parse(JSON.stringify(this.regConfig.value));

        const formData = new FormData();
        if (this.logoConfig.get('bank_logo').value) {
            formData.append('logo', this.logoConfig.get('bank_logo').value);
          }
          if(this.bankLogo){
            formData.append('logo', this.bankLogo);
          }
        formData.append('title', this.regConfig.value.title);
        formData.append('description', this.regConfig.value.description);
        formData.append('module_name', this.regConfig.value.module_name);
        formData.append('status', this.regConfig.get('status').value);
        switch (this.addOrUpdate) {
            case 'add':
               
                delete req.id;
                this.subSunk.sink = this.apiHandlerService.apiHandler('addAirlineHotelPartnerImage', 'post', {}, {}, formData)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Data added successfully.");
                            this.regConfig.reset();
                            this.logoConfig.reset();
                            this.activateTab.emit({ tabId: 'airline_list' });
                        }
                        else {
                            this.swalService.alert.oops(resp.msg);
                        }
                    });
                break;
            case 'update':
                req['title'] = "title";
                req['description'] = "description";
                req['logo'] = this.bankLogo;
                formData.append('id', req['id']);
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateAirlineHotelPartnerContent', 'post', {}, {}, formData)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Data updated successfully.");
                            this.regConfig.reset();
                            this.clearImage();
                            this.activateTab.emit({ tabId: 'airline_list' });
                            this.cmsService.hotelAirlineData.next({});
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
        this.cmsService.hotelAirlineData.next({});
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

}
