import { Component, OnDestroy, OnInit,ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';

const baseUrl = environment.baseUrl;

const log = new Logger('b2c-cms/DiscountsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-flight-advertisement',
  templateUrl: './flight-advertisement.component.html',
  styleUrls: ['./flight-advertisement.component.scss']
})
export class FlightAdvertisementComponent implements OnInit {

  @ViewChild('labelImport', { static: false })
  labelImport: ElementRef;
      onFileChange(files: FileList) {
          this.discountImage = "";
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
    private subSunk = new SubSink();
    fileToUpload: File = null;
    imageSrc;
    discountImage:string;
      regConfig: FormGroup;  
      pageSize = 10;
      page = 1;
      collectionSize: number;
      displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'status' },
        { key: 'image', value: 'Image' },                
        { key: 'heading', value: 'heading' },                
        { key: 'content', value: 'Content' },                
        { key: 'ad_info', value: 'Ad Info' },                
        // { key: 'discount_type', value: 'Discount Type' },                
      ];
      noData: boolean = true;
      respData: Array<any> = [];
      btnName : string = "Add";
  
    constructor(
       private apiHandlerService: ApiHandlerService,
          private fb: FormBuilder,
          private swalService: SwalService,
          private utility: UtilityService,
          private cdr: ChangeDetectorRef
          ) { }
  
    ngOnInit() {
      this.createForm();
      this.getFlightAdList();
      this.onValueChange();
    }
  
    createForm(){
       this.regConfig = this.fb.group({
              heading: new FormControl('', [Validators.required]),
              content: new FormControl('', [Validators.required]),
              ad_info: new FormControl('', [Validators.required]),
              id: new FormControl(''),
              ad_status: new FormControl('1'),
              image: new FormControl(''),
          });
    }
  
    getFlightAdList(){
      this.subSunk.sink = this.apiHandlerService.apiHandler('flightAdList', 'post', {}, {},{})
              .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                      this.noData = false;
                      this.respData = resp.data || [];
                      respDataCopy = [...this.respData];
                      this.collectionSize = respDataCopy.length;
                  }
                  else {
                      this.noData = false;
                      this.respData=[];
                  }
                }, (err) => {
                    this.noData = false;
                    this.respData = [];
                });
              this.cdr.detectChanges();
    }
   
        sortData(sort: Sort) {
          const data = filterArray.length ? filterArray : [...respDataCopy];
          if (!sort.active || sort.direction === '') {
              this.respData = data;
              return;
          }
          this.respData = data.sort((a, b) => {
              const isAsc = sort.direction === 'asc';
              switch (sort.active) {
                  case 'description': return this.utility.compare('' + a.description.toLocaleLowerCase(), '' + b.description.toLocaleLowerCase(), isAsc);
                  case 'title': return this.utility.compare('' + a.title.toLocaleLowerCase(), '' + b.title.toLocaleLowerCase(), isAsc);
                  case 'discount_type': return this.utility.compare('' + a.discount_type.toLocaleLowerCase(), '' + b.discount_type.toLocaleLowerCase(), isAsc);
                  case 'discount_value': return this.utility.compare('' + a.discount_value.toLocaleLowerCase(), '' + b.discount_value.toLocaleLowerCase(), isAsc);
                  case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
                  default: return 0;
              }
          });
      }
  
      getImage(img){
        return `${baseUrl + '/flight/flight-service/getFlightAdImage/' + img}`;
      }
  
      updateStatus(id,status){
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateflightAdStatus', 'post', {}, {}, {"id":id,"ad_status":status})
        .subscribe(resp => {
          if (resp && resp.data) {
            this.swalService.alert.success("Status Updated successfully.");
              this.getFlightAdList();
          }
      })
      }
      editList(patchData){
        this.regConfig.patchValue({
          heading: patchData['heading'] || '',
          content: patchData['content'] || '',
          ad_info: patchData['ad_info'] || '',
          id: patchData['id'] || '',        
          ad_status: patchData['ad_status'] || 0,        
          image: patchData['image'] || "",        
        });
        this.btnName = 'Update';
        this.imageSrc= "";
        this.discountImage = patchData['image'];
        if(patchData['image'] && patchData['image']!="")
        this.regConfig.get('image').clearValidators();
        this.onValueChange();
        window.scroll(0, 0);
      }
  
      deleteList(id){
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.deletRecord(id);
            }
        })
      }
  
      onReset(){
        this.btnName = 'Add';
        this.fileToUpload = null;
        this.imageSrc= "";
        this.discountImage = "";
        this.regConfig.reset();
        this.labelImport.nativeElement.innerText="Upload Image";
        this.regConfig.get('image').setValidators(Validators.required);
      }
  
    onSearchSubmit() {
      if (this.regConfig.invalid) {
              return;
          }     
         // let req = this.regConfig.value;
         let req = new FormData();
         if(this.fileToUpload)
           req.append('image',this.fileToUpload);
        if(this.regConfig.value.image && !this.fileToUpload)
           req.append('image',this.regConfig.value.image);
         req.append('heading',this.regConfig.value.heading);
         req.append('content',this.regConfig.value.content);        
         req.append('ad_info',this.regConfig.value.ad_info);        
         req.append('ad_status',this.regConfig.value.ad_status);        
         let id = this.regConfig.value.id;        

          if(id && id > 0){
            req.append('id',id);
            req.append('status',this.regConfig.value.ad_status);
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateFlightAd', 'post', {}, {}, req)
            .subscribe(resp => {
              if (resp && resp.Status) {
                this.swalService.alert.success("Updated successfully.");
                this.onReset();
                this.getFlightAdList();
              }
            })
  
          }else{
            // req.append('status',"1");
            this.subSunk.sink = this.apiHandlerService.apiHandler('flightAd', 'post', {}, {}, req)
            .subscribe(resp => {
              if (resp && resp.data) {
                this.swalService.alert.success("Added successfully.");
                this.onReset();
                this.getFlightAdList();
              }
            })
        }
      }
  
      deletRecord(id){
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteFlightAd', 'post', {}, {}, {"id":id,"ad_status":0})
          .subscribe(resp => {
            if (resp && resp.data) {
              this.swalService.alert.success("Deleted successfully.");
                this.getFlightAdList();
            }
        }, (err) => {
            this.swalService.alert.oops(err.message);
        });
      }

      onValueChange(){
        const discountValueControl = this.regConfig.get('discount_value');
        this.regConfig.get('discount_type').valueChanges
        .subscribe(discount_type => {
            if(discount_type == "Plus"){
                discountValueControl.setValidators([Validators.required,Validators.min(0),Validators.max(100000)]);
            }

            if(discount_type == "Percentage"){
                discountValueControl.setValidators([Validators.required,Validators.min(0),Validators.max(100)]);
            }
            discountValueControl.updateValueAndValidity();
        })
      }
      
      omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
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
        this.fileToUpload = null;
        this.imageSrc= "";
        this.discountImage = "";
        this.labelImport.nativeElement.innerText="Upload Image";
        this.regConfig.controls['image'].reset()
        const imageControlControl = this.regConfig.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();
    }
  
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }
    
    ngOnDestroy(): void {
          this.subSunk.unsubscribe();
      }

}
