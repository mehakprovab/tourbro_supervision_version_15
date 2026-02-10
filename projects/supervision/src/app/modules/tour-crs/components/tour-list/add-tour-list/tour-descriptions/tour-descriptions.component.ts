import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tour-descriptions',
  templateUrl: './tour-descriptions.component.html',
  styleUrls: ['./tour-descriptions.component.scss']
})
export class TourDescriptionsComponent implements OnInit {

  tourDescriptionsForm:FormGroup
  subSunk=new SubSink();
  tourId:number;
  tourName:string;
  bannerImage;
  gallery:any[]=[];
  video;
  logoConfig: FormGroup;
  currentUser:any;

  constructor( private fb:FormBuilder,private router:Router,private apiHandlerService:ApiHandlerService,
               private  swalService:SwalService) { }

  ngOnInit() {
    const currentDomainUser = sessionStorage.getItem('currentSupervisionUser');
    this.currentUser = JSON.parse(currentDomainUser);
    this.tourId=Number(sessionStorage.getItem('tourId'));
    this.tourName=localStorage.getItem('tourName');
    this.createTourDescriptionsForm();
    this.logoConfig = this.fb.group({
      banner_logo: [''],
      gallery_image: [[]]
  })
  }

  createTourDescriptionsForm(){
    this.tourDescriptionsForm=this.fb.group({
      highlights:[''],
      inclusions:['',Validators.required],
      exclusions:[''],
      termsConditions:[''],
      optionalTours: this.fb.array([]),
      cancellationPolicy:[`<ol>
        <li>If Cancelled on or before 7 days 100% Refundable.</li>
        <li>If Cancelled on or before 5 days 50% Refundable.</li>
        <li>If Cancelled on or before 3 days 10% Rfundable.</li>
      </ol>`],
      MeetingPoint: ['', Validators.required],
      // optionalToursPrice: []
      // tripNotes:['']
    });
    
  }
optionalToursSelection(checked) {
  if (checked) {
    this.addOptionalTour();
  }
  else {
    this.optionalToursPrices.clear();
    this.tourDescriptionsForm.value.optionalTours = [];
  }
} 
  addOptionalTour() {
    this.addOptionalTours();
  }

  get optionalToursPrices(): FormArray {
    return this.tourDescriptionsForm.get('optionalTours') as FormArray;
  }

  addOptionalTours() {
    const addTours = this.fb.group({
      name: [''],
      duration: [''],
      price: ['']
    });
    this.optionalToursPrices.push(addTours);
  }

  removeOptionalTours(index) {
    this.optionalToursPrices.removeAt(index)
  }

  onSubmitTourDescriptionsForm(){
    const updatedFormData ={
      "tourId": this.tourId, 
      "Highlights":this.tourDescriptionsForm.get('highlights').value.replace(/\n$/, ''),
      "Inclusions":this.tourDescriptionsForm.get('inclusions').value.replace(/\n$/, ''),
      "Exclusions":this.tourDescriptionsForm.get('exclusions').value.replace(/\n$/, ''),
      "Terms":this.tourDescriptionsForm.get('termsConditions').value.replace(/\n$/, ''),
      "OptionalTours":this.tourDescriptionsForm.get('optionalTours').value.map((item, index) => ({
        ...item,id: index+1
      })),
      "MeetingPoint": this.tourDescriptionsForm.get('MeetingPoint').value
      // "CancPolicy":this.tourDescriptionsForm.get('cancellationPolicy').value,
      // "TripNotes":this.tourDescriptionsForm.get('tripNotes').value.replace(/\n$/, ''),
      };

      if(this.tourDescriptionsForm.valid){
        if ((this.logoConfig.get('gallery_image').value === '' || this.logoConfig.get('gallery_image').value.length === 0) || this.logoConfig.get('banner_logo').value === '') {
           this.swalService.alert.oops("Please upload Banner and Gallery Images.");
        } else {
//api call to save image
          if(this.logoConfig.get('banner_logo').value){
            this.addImageApiCall();
          }
          
          //api call to save gallery
          if(this.logoConfig.get('gallery_image').value){
            this.addGalleryImageApiCall();
          }
          //api call to save tour description 
          this.subSunk.sink = this.apiHandlerService.apiHandler('addTourDescription', 'post', {}, {},
              updatedFormData
              ).subscribe(response => {
                if ((response.statusCode == 200 || response.statusCode == 201) && response.Status) {
                      this.swalService.alert.success("Tour Description has been saved successfully");
                      const QuaryParam={
                        tourId:this.tourId
                      }
                      this.router.navigate(["tour-crs/tour-list/add-tour/price-management"],{queryParams:QuaryParam});
                }
            },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
        }
        }
  }

  addImageApiCall(){
      const formData = new FormData();
      formData.append('Id', this.tourId.toString());
      formData.append('BannerImage', this.logoConfig.get('banner_logo').value);
      formData.append('Video', 'video.mp4');
      this.subSunk.sink = this.apiHandlerService.apiHandler('uploadBannerImage', 'post', {}, {},
        formData
      ).subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            
          }
      });
  }

  addGalleryImageApiCall(){
      let galleryImage=this.logoConfig.get('gallery_image').value
      const formData = new FormData();
      formData.append('Id', this.tourId.toString());
      for(let i=0;i<galleryImage.length;i++){
        formData.append('Gallery', galleryImage[i]);
      }
      formData.append('Video', 'video.mp4');
      this.subSunk.sink = this.apiHandlerService.apiHandler('uploadGallery', 'post', {}, {},
        formData
      ).subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            
          }
      });
  }


  onImageSelect(event: any) {
    const file: File = event.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    if (file && allowedTypes.includes(file.type)) {
        this.bannerImage = file;
        this.logoConfig.get('banner_logo').patchValue(file);
    } else {
      this.swalService.alert.oops("Only JPG, JPEG and PNG formats are allowed.");
        event.target.value = ''; // Reset file input
    }
}


onGallerySelect(event: any) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  const selectedFiles: FileList = event.target.files;
  const validFiles: File[] = [];

  for (let i = 0; i < selectedFiles.length; i++) {
      if (allowedTypes.includes(selectedFiles[i].type)) {
          validFiles.push(selectedFiles[i]);
      } else {
        this.swalService.alert.oops("Only JPG, JPEG and PNG formats are allowed.");
      }
  }

  if (validFiles.length > 0) {
      this.gallery = validFiles;
      this.logoConfig.get('gallery_image').patchValue(validFiles);
  } else {
      event.target.value = ''; // Reset input if no valid files
  }
}


  
  onVideoSelect($event:any){
    this.video=$event.target.files[0].file;
  }
}
