import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-guide-process-section',
  templateUrl: './guide-process-section.component.html',
  styleUrls: ['./guide-process-section.component.scss']
})
export class GuideProcessSectionComponent implements OnInit {
regConfig: FormGroup;
@ViewChild('fileInput1', { static: false }) fileInput1!: ElementRef;
@ViewChild('fileInput2', { static: false }) fileInput2!: ElementRef;
  respData: any[] = [];
  btnName = "Add";
  editingId = "";

  fileStore: any = {};
  preview: any = {};
  existingImages: any = {};

  constructor(
    private fb: FormBuilder,
    private api: ApiHandlerService,
    private swal: SwalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getList();
  }

  createForm() {
    let group = {};

    for (let i = 1; i <= 4; i++) {
      group['title' + i] = ['', Validators.required];
      group['desc' + i] = ['', Validators.required];
    }

    group['image_1'] = ['', Validators.required];
    group['image_2'] = ['', Validators.required];

    this.regConfig = this.fb.group(group);
  }

  // ✅ FILE UPLOAD
  onFileChange(files: FileList, key: string) {
    const file = files[0];
    if (!file) return;

    const allowed = ['image/jpeg','image/png'];
    if (!allowed.includes(file.type)) {
      this.swal.alert.error("Only JPG/PNG allowed");
      return;
    }

    if (file.size > 1048576) {
      this.swal.alert.error("Max 1MB");
      return;
    }

    this.fileStore[key] = file;

    const reader = new FileReader();
    reader.onload = () => this.preview[key] = reader.result;
    reader.readAsDataURL(file);

    this.regConfig.get(key).clearValidators();
    this.regConfig.get(key).updateValueAndValidity();
  }

  // ✅ GET LIST
  getList() {
    this.api.apiHandler('guideProcessList','post',{}, {}, {})
      .subscribe((res:any)=>{
        this.respData = res.data || [];
      });
  }

  // ✅ ADD / UPDATE
  onSubmit() {
    if (this.regConfig.invalid) {
      this.swal.alert.error("All fields required");
      return;
    }

    let fd = new FormData();
    let val = this.regConfig.value;

    Object.keys(val).forEach(k=>{
      if (!k.includes('img')) {
        fd.append(k, val[k]);
      }
    });

    if (this.editingId) fd.append('id', this.editingId);

    // images
    ['image_1','image_2'].forEach(k=>{
      if (this.fileStore[k]) {
        fd.append(k, this.fileStore[k]);
      } else if (this.existingImages[k]) {
        fd.append('existing_'+k, this.existingImages[k]);
      }
    });

    let api = this.editingId ? 'updateGuideProcess' : 'addGuideProcess';

    this.api.apiHandler(api,'post',{}, {}, fd)
      .subscribe(()=>{
        this.swal.alert.success("Saved successfully");
        this.onReset();
        this.getList();
      });
  }

  // ✅ EDIT
  editData(item) {
    this.onReset();
    this.btnName = "Update";
    this.editingId = item.id;

    this.regConfig.patchValue(item);

    this.preview.image_1 = this.getImage(item.image_1);
    this.preview.image_2 = this.getImage(item.image_2);

    this.existingImages = {
      image_1: item.image_1,
      image_2: item.image_2
    };

    this.regConfig.get('image_1').clearValidators();
    this.regConfig.get('image_2').clearValidators();
    this.regConfig.updateValueAndValidity();

    window.scroll(0,0);
  }

  // ✅ DELETE
  deleteData(id) {
    this.swal.alert.delete((ok)=>{
      if (ok) {
        this.api.apiHandler('deleteGuideProcess','post',{}, {}, {id})
          .subscribe(()=>{
            this.swal.alert.success("Deleted");
            this.getList();
          });
      }
    });
  }

  // ✅ RESET
  onReset() {
    this.btnName = "Add";
    this.editingId = "";
    this.fileStore = {};
    this.preview = {};
    this.existingImages = {};
 // ✅ clear file inputs (IMPORTANT)
  if (this.fileInput1) this.fileInput1.nativeElement.value = '';
  if (this.fileInput2) this.fileInput2.nativeElement.value = '';
    this.regConfig.reset();

    this.regConfig.get('image_1').setValidators([Validators.required]);
    this.regConfig.get('image_2').setValidators([Validators.required]);
    this.regConfig.updateValueAndValidity();
  }

  getImage(img){
    return 'http://54.92.243.81/tourbro/node/dist/apps/supervision/' + img;
  }
}