import { Component, OnDestroy, OnInit, Output,EventEmitter,ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingService } from '../../../../setting.service';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { formatDate } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-manage-promocode',
  templateUrl: './manage-promocode.component.html',
  styleUrls: ['./manage-promocode.component.scss']
})
export class ManagePromocodeComponent implements OnInit, OnDestroy {

  @Output() updatePromoCode = new EventEmitter<any>();
  @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    onFileChange(files: FileList) {
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');
        const file = files[0];
        if (file && file.size) {
            let result=this.validateFileSize(file.size);
            if(!result){
                this.labelImport.nativeElement.value = null;
                this.labelImport.nativeElement.innerText="Upload Image";
                return;
            }
        }
        this.fileToUpload = files.item(0);
    }
    private subSunk = new SubSink();
    fileToUpload: File = null;
    userTitleList: Array<any> = [];
    userTypeList: Array<any> = [];
    phoneCodeList: Array<any> = [];
    regConfig: FormGroup;
    isOpen = false as boolean;
    isExpDateOpen = false as boolean;
    setMinDate: any;
    addOrUpdate: string = '';
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    minDate = new Date();

  constructor(
          private router: Router,
        private settingService: SettingService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService : ApiHandlerService
      ) { }

  ngOnInit() {
        this.createForm();
        this.getToUpdate();
        this.valueChanges();
  }


    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            promo_code: new FormControl('', [Validators.required]),
            promo_image: new FormControl(''),
            description: new FormControl('',[Validators.required]),
            category: new FormControl('', [Validators.required]),
            discount_type: new FormControl('', [Validators.required]),
            discount_value: new FormControl('', [Validators.required]),
            use_type:new FormControl('Single', [Validators.required]),
            start_date: new FormControl('', [Validators.required]),
            expiry_date: new FormControl('', [Validators.required]),
            limitation: new FormControl(''),
            status: new FormControl('1', [Validators.required]),
        });
    }

    getToUpdate() {
        this.subSunk.sink = this.settingService.promoCodeUpdateData.subscribe(data => {
            console.log(data)
            if (!this.utility.isEmpty(data)) {
                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id:data.id ? data.id : '',
                    promo_code: data.promo_code ? data.promo_code : '',
                    promo_image: data.promo_image ? data.promo_image : '',
                    description: data.description ? data.description : '',
                    category: data.category ? data.category : '',
                    discount_type: data.discount_type ? data.discount_type : '',
                    discount_value: data.discount_value ? data.discount_value : '',
                    use_type: data.use_type ? data.use_type : 'Single',
                    start_date: data.start_date ?  new Date(data.start_date) : '',
                    expiry_date: data.expiry_date ?  new Date(data.expiry_date) : '',
                    limitation: data.limitation ? data.limitation : '',
                    status: data.status == 1 ? '1' : '0'

                }, { emitEvent: false })
                
            } else {
                this.addOrUpdate = 'add';
            }
        })
    }

    valueChanges() : void {
        const usetypeControl = this.regConfig.get('use_type');
        const limitationControl = this.regConfig.get('limitation');
            usetypeControl.valueChanges.subscribe(value => {
                  if(value=="Multiple"){
                    limitationControl.setValidators([Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/),Validators.min(1)]);
                  }else{
                    limitationControl.setValidators(null);
                  }
                  limitationControl.updateValueAndValidity();
            })
        }




    onSubmit() { 
        if (this.regConfig.invalid) {
            return;
        }
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        req['auth_role_id'] = "4";
        req['promo_image'] = "";
        req['start_date'] = formatDate(this.regConfig.value.start_date, 'YYYY-MM-DD');
        req['expiry_date'] = formatDate(this.regConfig.value.expiry_date, 'YYYY-MM-DD');
        switch (this.addOrUpdate) {
            case 'add':
                 this.subSunk.sink = this.apiHandlerService.apiHandler('addPromocode', 'post', {}, {},req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            if(this.fileToUpload){
                                this.updatePromocodeImage(resp.data.id);
                            }
                            this.swalService.alert.success("Added successfully.");
                            this.regConfig.reset();
                            this.updatePromoCode.emit({ tabId: 'promocode_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops(err.error.Message);
                    })
                break;
                case 'update':
                    this.subSunk.sink = this.apiHandlerService.apiHandler('updatePromocode', 'post', {}, {},req)
                        .subscribe(resp => {
                            console.log("error",resp);
                            if (resp.statusCode == 200 || resp.statusCode == 201) {
                                if(this.fileToUpload){
                                    this.updatePromocodeImage(this.regConfig.value.id);
                                }
                                this.swalService.alert.success("Updated successfully.");
                                this.regConfig.reset();
                                this.updatePromoCode.emit({ tabId: 'promocode_list' });
                                
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

    updatePromocodeImage(id){
        let reqBody = new FormData();
          reqBody.append('image',this.fileToUpload);
          reqBody.append('id',id);
             this.apiHandlerService.apiHandler('uploadPromoImage', 'post', {}, {}, reqBody)
              .subscribe(resp => {
            if (resp) {
              this.swalService.alert.success('Updated successfully! ..!');          
            }         
          })
    }

    omitSpecialCharacters(event) {
        return this.utility.omitSpecialCharacters(event);
    }
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    onReset() {
        this.settingService.promoCodeUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }
    validateFileSize(fileSize) {
        if (fileSize >1048576) {
            this.swalService.alert.oops("Maximum upload file size: 1 MB");
            return false;
        }
        else {
            return true
        }
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
