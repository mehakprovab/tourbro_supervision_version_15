import { Component, OnInit,Output,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'projects/supervision/src/environments';

const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-add-theme-type',
  templateUrl: './add-theme-type.component.html',
  styleUrls: ['./add-theme-type.component.scss']
})
export class AddThemeTypeComponent implements OnInit {
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    themeImage: string = "";
    imageSrc;
  subSunk=new SubSink();
  fileToUpload: File = null;
  themeTypeForm:FormGroup;
  @Output() insertedRecord=new EventEmitter<any>();
  onFileChange(files: FileList) {
    this.themeImage = "";
    this.labelImport.nativeElement.innerText = Array.from(files)
        .map(f => f.name)
        .join(', ');
    this.fileToUpload = files.item(0);
    const file = files[0];
    if (file && file.size) {
        let result=this.validateFileSize(file.size);
        if(!result){
            this.fileToUpload=null;
            this.themeImage = "";
            this.imageSrc=""
            this.labelImport.nativeElement.value = null;
            this.labelImport.nativeElement.innerText="Upload Image";
            this.themeTypeForm.controls['image'].reset()
            return;
        }
    }
    if (file.name) {
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(file);
    }
}
  constructor(private fb:FormBuilder,private swalService:SwalService,private apiHandlerService:ApiHandlerService) { }

  ngOnInit() {
    this.createThemeypeForm();
  }
  getImage(img) {
    return `${baseUrl + '/' + img}`;
}
  createThemeypeForm(){
    this.themeTypeForm=this.fb.group({
      themeTypeName:new FormControl('',[Validators.required,this.inputValidator]),
      image: new FormControl('test', [Validators.required]),
    })
  }

  validateFileSize(fileSize) {
    if (fileSize >1048576) {
        this.swalService.alert.oops("Maximum upload file size: 1 MB");
        const imageControlControl = this.themeTypeForm.get('image');
        imageControlControl.setValidators([Validators.required]);
        imageControlControl.updateValueAndValidity();
        return false;
    }
    else {
        return true
    }
}
  onActivitiesSave(){
    //api to save data in db
    
    let req = this.themeTypeForm.value;
    let image =this.themeTypeForm.get('image').value 
    let themeTypeName=this.themeTypeForm.get('themeTypeName').value 
    if(this.themeTypeForm.valid){
      this.subSunk.sink = this.apiHandlerService.apiHandler('addTourTheme', 'post', {}, {},
              {"TourSubtheme":themeTypeName,"image":image})
              .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                  this.themeImage = '';
                  this.imageSrc = '';
                  this.swalService.alert.success("Tour Theme  data has been saved successfully");
                  this.insertedRecord.emit(response.data);
                  this.themeTypeForm.reset();
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }
  }

  inputValidator(control: FormControl) {
    const value = control.value;
    if (value && (value.startsWith(' ') || value.endsWith(' '))) {
      return { startOrEndSpace: true };
    }
    if (value && /\d+/.test(value)) {
      return { invalidString: true };
    }
     return null;
  }

  validateInput() {
    this.themeTypeForm.get('themeTypeName').markAsTouched();
  }
}
