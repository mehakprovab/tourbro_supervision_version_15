import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { CmsService } from '../../../cms/cms.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-why-choose-us',
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent implements OnInit {

  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  private subSunk = new SubSink();
  logoConfig: FormGroup;
  @ViewChild('labelImport', { static: false })
  bannerLogo: string;
  labelImport: ElementRef;
  imgObj = {
      isLogoToUpdate: false,
      isUploaded: false
  }
  whyChooseData: any;
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
  private cmsService: CmsService,
  private utility: UtilityService) { }

ngOnInit() {
  this.createForm();
  this.getWhyChooseData();
  this.getToUpdate()
}

  createForm() {
      this.regConfig = this.fb.group({
          header1: new FormControl('', [Validators.required]),
          description1: new FormControl('',[Validators.required]),
          header2: new FormControl('', [Validators.required]),
          description2: new FormControl('',[Validators.required]),
          header3: new FormControl('', [Validators.required]),
          description3: new FormControl('',[Validators.required]),
          header4: new FormControl('', [Validators.required]),
          description4: new FormControl('',[Validators.required]),
          header5: new FormControl('', [Validators.required]),
          description5: new FormControl('',[Validators.required]),
          header6: new FormControl('', [Validators.required]),
          description6: new FormControl('',[Validators.required])
      });
      // this.logoConfig = this.fb.group({
      //     banner_logo: new FormControl("",[Validators.required]),
      //   });
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
  let req = {
    header1: this.regConfig.get('header1').value,
    description1: this.regConfig.get('description1').value,
    header2: this.regConfig.get('header2').value,
    description2: this.regConfig.get('description2').value,
    header3: this.regConfig.get('header3').value,
    description3: this.regConfig.get('description3').value,

    header4: this.regConfig.get('header4').value,
    description4: this.regConfig.get('description4').value,
    header5: this.regConfig.get('header5').value,
    description5: this.regConfig.get('description5').value,
    header6: this.regConfig.get('header6').value,
    description6: this.regConfig.get('description6').value
  }
 
  //console.log(this.addOrUpdate,typeof req.id);
 // req['data_source'] = "b2c";
//  let req = new FormData();

//  //req.append('image_url',this.logoConfig.value.banner_logo);
//  req.append('header',this.regConfig.value.header);
//  req.append('description',this.regConfig.value.description);        
//  //req.append('module_type',this.regConfig.value.module_type);        
      
//  let id = this.regConfig.value.id;    
//  req.append('id',id);    
this.subSunk.sink=this.apiHandlerService.apiHandler('addWhyChooseUs', 'POST', {}, {}, req)
.subscribe(resp => {
    if (resp.statusCode == 200 || resp.statusCode == 201) {
        this.swalService.alert.success("Content added successfully.");
        this.staticContentTab.emit({ tabId: 'staticpage_list' });
    } else {
        this.swalService.alert.oops();
    }
}, (err: HttpErrorResponse) => {
    console.error(err);
    this.swalService.alert.oops();
})
//   switch (this.addOrUpdate) {
//       case 'add':
//           this.subSunk.sink = this.cmsService.addWhyChooseUs(req)
//               .subscribe(resp => {
//                   if (resp.statusCode == 200 || resp.statusCode == 201) {
//                       this.swalService.alert.success("Content added successfully.");
//                       this.regConfig.reset();
//                       this.staticContentTab.emit({ tabId: 'staticpage_list' });
//                   } else {
//                       this.swalService.alert.oops();
//                   }
//               }, (err: HttpErrorResponse) => {
//                   console.error(err);
//                   this.swalService.alert.oops();
//               })
//           break;
//       case 'update':
          
          
//           this.subSunk.sink = this.cmsService.updateWhyChooseUs(req)
//               .subscribe(resp => {
//                   console.log("error", resp);
//                   if (resp.statusCode == 200 || resp.statusCode == 201) {
//                       this.swalService.alert.success("Content updated successfully.");
//                       this.regConfig.reset();
//                       this.staticContentTab.emit({ tabId: 'staticpage_list' });
//                   } else {
//                       this.swalService.alert.oops();
//                   }
//               }, (err: HttpErrorResponse) => {
//                   console.error(err);
//                   this.swalService.alert.oops();
//               })
//           break;
//       default:
//           break;
//   }

}

getWhyChooseData(){
    this.subSunk.sink=this.apiHandlerService.apiHandler('whyChooseUs', 'POST', '', '', '')
    .subscribe(res=>{
      if((res.statusCode == 200 || res.statusCode== 201) && res.data){
          this.whyChooseData=res.data[0];
          this.regConfig.patchValue({
            header1: this.whyChooseData ? this.whyChooseData.header1 : '',
            description1: this.whyChooseData ? this.whyChooseData.description1 : '',
            header2: this.whyChooseData ? this.whyChooseData.header2 : '',
            description2: this.whyChooseData ? this.whyChooseData.description2 : '',
            header3: this.whyChooseData ? this.whyChooseData.header3 : '',
            description3: this.whyChooseData ? this.whyChooseData.description3 : '',

            header4: this.whyChooseData ? this.whyChooseData.header4 : '',
            description4: this.whyChooseData ? this.whyChooseData.description4 : '',
            header5: this.whyChooseData ? this.whyChooseData.header5 : '',
            description5: this.whyChooseData ? this.whyChooseData.description5 : '',
            header6: this.whyChooseData ? this.whyChooseData.header6 : '',
            description6: this.whyChooseData ? this.whyChooseData.description6 : '',

        })
      }
    })
  }

getToUpdate() {

  this.subSunk.sink = this.cmsService.StaticContent.subscribe(data => {
      console.log(data)
      if (!this.utility.isEmpty(data)) {

          this.addOrUpdate = 'update';
          this.regConfig.patchValue({
              id: data.id ? data.id : '',
              image:data.image_url ? data.image_url : '',
              module_type: data.module_type
              ? data.module_type
              : '',
              title: data.title ? data.title : '',
              description: data.description ? data.description : '',
              status: data.status ? data.status : '',

          }, { emitEvent: false })
          this.model.editorData=data.page_description;
      }else{
        this.addOrUpdate = 'add';
      }
  })
} 

  onReset(){
      this.cmsService.StaticContent.next({});
      this.regConfig.reset();
      this.addOrUpdate = 'add';
      this.regConfig.patchValue({
          page_description: '',
      })
  } 


  // getImage(img) {
  //     return `${baseUrl + '/' + img}`;
  // }
  onFileSelected($event) {
      const file = $event.target.files[0];
      console.log("file",file)
      if (file && file.size) {
          let result=this.validateFileSize(file.size);
          if(!result){
              //this.bankLogo = "";
              this.imageSrc=""
              this.fileUploader.nativeElement.value = null;
              this.logoConfig.reset();
              return;
          }
      }
      if (file.name) {
        //this.bankLogo = "";
        this.imgObj.isLogoToUpdate = true;
        this.logoConfig.setValue({ banner_logo: file });
        const reader = new FileReader();
        reader.onload = (e) => (this.imageSrc = reader.result);
        reader.readAsDataURL(file);
      } else {
        this.imgObj.isLogoToUpdate = false;
      }
    }
}

