import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
    selector: 'app-add-currency',
    templateUrl: './add-currency.component.html',
    styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit {
    @ViewChild('theFile', { static: false }) fileUploader: ElementRef;
    currencyConfig: FormGroup;
    logoConfig: FormGroup;
    fileToUpload: File = null;
    imageSrc;
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
      }
    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.currencyConfig = this.fb.group({
            currency: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            value: new FormControl('', [Validators.required]),
        });
        this.logoConfig = this.fb.group({
            Banner_img: new FormControl("", [Validators.required]),
          })
    }

    onUpdateStatus(event, data) {
        if (event && event.checked) {
            data.status = 1;
        }
        else {
            data.status = 0;
        }
    }

    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
      }

      onSubmit(){
          if (this.currencyConfig.invalid)
          return;
          else
          this.addCurrency(this.currencyConfig);
      }

    addCurrency(currencyConfig) {
        if (currencyConfig && currencyConfig.value) {
            // currencyConfig.value.value = currencyConfig.value.value.toString();
            // currencyConfig.value.currency = currencyConfig.value.currency.toUpperCase();
            // let flag = this.logoConfig.value.Banner_img;
            let req = {
            value : currencyConfig.value.value.toString(),
            currency : currencyConfig.value.currency.toUpperCase(),
            status:currencyConfig.value.status,
            flag : this.logoConfig.value.Banner_img,
         
              };
            this.apiHandlerService.apiHandler('addCurrencyConversion', 'POST', {}, {}, req).subscribe(resp => {
                if (resp && resp.Status) {
                    this.swalService.alert.success("Currency added successfully.");
                    this.router.navigate(['/settings/currencyConversion']);
                }
            }, (err) => {
                if (err && err.error && err.error && err.error.Message) {
                    this.swalService.alert.oops("Added currency already exist in the system .. ");
                }
            });
        }
    }

      onReset(){
        this.currencyConfig.reset();
      }
      uploadLogo(logo, control) {
        let req = new FormData();
        if (control == 'banner') {
          req.append('imageFile', logo);
        }
  
        this.apiHandlerService.apiHandler('uploadIncludeMasterLogo', 'post', '', '', req).subscribe(response => {
          if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
            if (control == 'banner') {
              this.logoConfig.setValue({ Banner_img: response.data[0].image_url });
            }
       
          }
          else {
            this.swalService.alert.oops();
          }
        }, (err) => {
          this.swalService.alert.oops(err.error.Message);
        });
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
          this.logoConfig.setValue({ Banner_img: file });
          this.uploadLogo(file, 'banner')
          const reader = new FileReader();
          reader.onload = (e) => (this.imageSrc = reader.result);
          reader.readAsDataURL(file);
        } else {
          this.imgObj.isLogoToUpdate = false;
        }
      }
      validateFileSize(fileSize) {
        if (fileSize > 1048576) {
          this.swalService.alert.oops("Maximum upload file size: 1 MB");
          const imageControlControl = this.logoConfig.get('Banner_img');
          imageControlControl.setValidators([Validators.required]);
          imageControlControl.updateValueAndValidity();
          return false;
        }
        else {
          return true
        }
      }
}
