import { Component, OnDestroy, OnInit,ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';

const baseUrl = environment.baseUrl;

const log = new Logger('b2c-cms/TestimonialComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit,OnDestroy {

  @ViewChild('labelImport', { static: false })
  labelImport: ElementRef;
      onFileChange(files: FileList) {
          this.testimonialImage = "";
          this.labelImport.nativeElement.innerText = Array.from(files)
              .map(f => f.name)
              .join(', ');
          this.fileToUpload = files.item(0);
          const file = files[0];
            if (file.name) {
                const reader = new FileReader();
                reader.onload = e => this.imageSrc = reader.result;
                reader.readAsDataURL(file);
            }
      }
    private subSunk = new SubSink();
    fileToUpload: File = null;
    imageSrc;
    testimonialImage : string= "";
      regConfig: FormGroup;  
      pageSize = 10;
      page = 1;
      collectionSize: number;
      displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'status' },
        { key: 'image', value: 'Image' },                
        { key: 'title', value: 'Provided By' },                
        { key: 'description', value: 'Description' },                
      ];
      noData: boolean = true;
      respData: Array<any> = [];
      btnName : string = "Add";
  
    constructor(
       private apiHandlerService: ApiHandlerService,
          private fb: FormBuilder,
          private swalService: SwalService,
          private utility: UtilityService,
          private cdr: ChangeDetectorRef,
          private router: Router) { }
  
    ngOnInit() {
      this.createForm();
      this.getTestimonialList();
    }
  
    createForm(){
       this.regConfig = this.fb.group({
              title: new FormControl('', [Validators.required]),
              description: new FormControl('', [Validators.required]),
              image: new FormControl('',[Validators.required]),
              id: new FormControl(''),
              status: new FormControl(''),
          });
    }
  
    getTestimonialList(){
      this.subSunk.sink = this.apiHandlerService.apiHandler('coreTestimonialContentList', 'post', {}, {},{})
              .subscribe(resp => {
                  if (resp.statusCode == 200 || resp.statusCode == 201) {
                      this.noData = false;
                      this.respData = resp.data || [];
                      respDataCopy = [...this.respData];
                      this.collectionSize = respDataCopy.length;
                  }
                  else {
                      this.noData = true;
                      this.swalService.alert.error(resp.msg || '');
                  }
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
                  default: return 0;
              }
          });
      }
  
      getImage(img){
        return `${baseUrl+img}`;
      }
  
      updateStatus(id,status){
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateTestimonialContentStatus', 'post', {}, {}, {"id":id,"status":status})
        .subscribe(resp => {
          if (resp && resp.data) {
            this.swalService.alert.success("Status Updated successfully.");
              this.getTestimonialList();
          }
      })
      }
      editList(patchData){
        this.regConfig.patchValue({
          title: patchData['title'] || '',
          description: patchData['description'] || '',
          id: patchData['id'] || '',        
          status: patchData['status'] || '',        
        });
        this.testimonialImage = patchData['image'];
        this.imageSrc = "";
        this.btnName = 'Update';
        if(patchData['image'] && patchData['image']!=""){
            const imageControlControl = this.regConfig.get('image');
            imageControlControl.setValidators(null);
            imageControlControl.updateValueAndValidity();   
        }
        window.scroll(0, 0);
      }
  
      deleteList(id){
        if(confirm("Are you sue you want to delete?"))
        this.deleteOldImage(id);
      }
  
      onReset(){
        this.btnName = 'Add';
        this.fileToUpload = null;
        this.testimonialImage = "";
        this.imageSrc = "";
        this.regConfig.reset();
        const imageControlControl = this.regConfig.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();

      }
  
    onSearchSubmit() {
      if (this.regConfig.invalid) {
              return;
          }     
         let req = new FormData();
         req.append('testimonial_image',this.fileToUpload?this.fileToUpload:this.testimonialImage);
         req.append('title',this.regConfig.value.title);
         req.append('description',this.regConfig.value.description);        
         let id = this.regConfig.value.id;        

          if(id && id > 0){
            req.append('id',id);
            req.append('status',this.regConfig.value.status);
            this.subSunk.sink = this.apiHandlerService.apiHandler('updatTestimonialContent', 'post', {}, {}, req)
            .subscribe(resp => {
              if (resp && resp.data) {
                this.swalService.alert.success("Updated successfully.");
                this.onReset();
                this.getTestimonialList();
              }
            })
  
          }else{
            req.append('status',"1");
            this.subSunk.sink = this.apiHandlerService.apiHandler('addTestimonialContent', 'post', {}, {}, req)
            .subscribe(resp => {
              if (resp && resp.data) {
                this.swalService.alert.success("Added successfully.");
                this.getTestimonialList();
              }
            })
        }
      }
  
      deleteOldImage(id){
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTestimonialContent', 'post', {}, {}, {"id":id})
          .subscribe(resp => {
            if (resp && resp.data) {
              this.swalService.alert.success("Deleted successfully.");
                this.getTestimonialList();
            }
        })
      } 

      omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }
  
    ngOnDestroy(): void {
          this.subSunk.unsubscribe();
      }

}
