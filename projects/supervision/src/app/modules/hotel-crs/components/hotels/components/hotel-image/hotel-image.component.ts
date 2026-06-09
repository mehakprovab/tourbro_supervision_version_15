import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { environment } from 'projects/supervision/src/environments/environment';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('Hotel/AddUpdateHotel');
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-hotel-image',
  templateUrl: './hotel-image.component.html',
  styleUrls: ['./hotel-image.component.scss']
})
export class HotelImageComponent implements OnInit {
    @Input() id;
    @Input() hotelOne: any;
    @Input() imageFor: 'hotel' | 'wellness' = 'hotel';
    @Output() callResult = new EventEmitter<boolean>(true);
    hotelImageForm: FormGroup;
    logoConfig:FormGroup;
    UpdateLogo:FormGroup;
    submittedHotelImage: boolean = false;
    hotelImageList;
    addedHotelImage: any;
    isHotelImage: boolean;
    isRoomActive: boolean;
    dropdownSettingsForRoom = {};
    fileToUpload: File = null;
    hotelImages:any=[];
    imageSrc;
    showHotelImage:boolean;
    images: string[] = [];
    selactedFlies:File[]=[];
    hotelImage:any;
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
   // @Output() someEvent = new EventEmitter<any>();
     addedHotelDetail: any;
     displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "image", value: 'Images' },
        { key: "Category", value: 'Category' },
        { key: "action", value: 'Actions' },
    ];
    noDataMessage: string;
    selectedImage: string | null = null;
    loading:boolean =false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    imageUrl: any;
  constructor(    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router:Router,
    // private apiHandlerService:apiHandlerService
) { }

  get isWellnessImageContext(): boolean {
    return this.imageFor === 'wellness';
  }

  get entityLabel(): string {
    return this.isWellnessImageContext ? 'Wellness Centre' : 'Hotel';
  }

  get entityName(): string {
    return this.isWellnessImageContext ? this.hotelOne?.center_name : this.hotelOne?.hotel_name;
  }

  get addImageTopic(): string {
    return this.isWellnessImageContext ? 'addWellnessImage' : 'addHotelImage';
  }

  get imageListTopic(): string {
    return this.isWellnessImageContext ? 'wellnessImageList' : 'hotelImageList';
  }

  get deleteImageTopic(): string {
    return this.isWellnessImageContext ? 'deleteWellnessImage' : 'deleteHotelImage';
  }

  get primaryImageTopic(): string {
    return this.isWellnessImageContext ? 'wellnessPrimaryImage' : 'primaryImage';
  }

  ngOnInit() {
    console.log("enters",)
    this.createHotelImageForm()
    console.log("this.hotelOne",this.hotelOne)
    // if(this.hotelOne){
    //     this.editHotel();
    // }
    this.hotelCrsService.addedHotelDetail.subscribe(res => {
        this.addedHotelDetail = res;
        console.log("seasonCopy",this.addedHotelDetail)
    });
    if(!this.hotelOne){
        this.hotelOne =this.addedHotelDetail;
    }
    this.getHotelImageList()
  }
  createHotelImageForm() {
    this.hotelImageForm = this.fb.group({
        image_url: ['', [Validators.required]],
        hotel_id: [''],
        status: [true]
    });
    this.logoConfig = this.fb.group({
        banner_logo: new FormControl(""),
      });
}
// editHotel(){
//     this.hotelImages =this.hotelOne['image'];
//     this.images = this.hotelImages;
//     console.log(" this.images", this.images)
//     this.imageSrc = "";
// }

previewHotelImage($event) {
    this.hotelImages = "";
    const files = $event.target.files;

    if (files.length > 30) {
        this.swalService.alert.oops("You can upload a maximum of 30 images.");
        return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
    const maxSize = 500 * 1024; // 500 KB

    this.selactedFlies = [];
    this.imageSrc = [];

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // ✅ Type validation
        if (!allowedTypes.includes(file.type)) {
            this.swalService.alert.oops("Only JPG, JPEG, PNG, SVG, and WEBP formats are allowed.");
            continue;
        }

        // ✅ Size validation (500 KB)
        if (file.size > maxSize) {
            this.swalService.alert.oops(`"${file.name}" exceeds 500 KB size limit.`);
            continue;
        }

        // ✅ If valid, proceed
        this.selactedFlies.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageUrl = reader.result;
            this.imageSrc.push(reader.result);
        };
        reader.readAsDataURL(file);
    }

    console.log("Valid selected files:", this.selactedFlies);
}

  onSubmitHotelImage() {
   
console.log("id",this.id)
    this.submittedHotelImage = true;
    console.log("selactedFlies",this.selactedFlies)
    if (this.selactedFlies.length === 0) {
        this.swalService.alert.oops("Please select Image to upload.");
        return
    } else {
        console.log("this.hotelOne",this.hotelOne)
        const formData = new FormData();
        let data: any = [{ data: formData }]
            // formData.append('image', this.logoConfig.value.banner_logo)
            formData.append('id', this.hotelOne['id'])
            this.selactedFlies.forEach(file => {
                console.log("file",file)
                formData.append('image', file, file.name);
              });
            data['topic'] = this.addImageTopic;
                 this.loading =true;
        this.hotelCrsService.addHotelLogo(data).subscribe(resp => {
            if (resp.statusCode == 201) {
            
                log.debug("Image Uploaded Sucessfully...!")
                this.swalService.alert.success(`${this.entityLabel} Image Uploaded Sucessfully...!`);
                this.loading =false;
                this.addedHotelImage = resp
                // this.hotelForm.reset();
                this.isHotelImage = false;
                this.selactedFlies =[]
                this.imageUrl = '';
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = ''; // Clear the input value
                }
                this.getHotelImageList()

                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                // this.router.onSameUrlNavigation = 'reload';
                // this.router.navigate(['/hotels/hotel-crs-lists']);
               //this.isRoomDetail = true;
              // this.callResult.emit(true)
            //    this.showRoomList = true;
                //this.showRoomForm = false;
                this.isRoomActive = true;
                this.dropdownSettingsForRoom = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'room_amenity_name',
                }
                // this.createHotelRoomForm();
                // this.getHotelRoomTypeList();
                // this.getHotelRoomAmenityList();
            } else if (resp.statusCode == 400) {
                         this.loading =false;
                this.swalService.alert.oops(resp.msg)
            }
            else {
                this.loading =false;
                this.swalService.alert.oops(resp.msg);
            }
        },(err =>{
            this.loading =false;
            this.swalService.alert.oops("Kindly upload in the accepted formats of jpg and jpeg, Maximum 30 images only");
        }))
    }
       
}
getImage(img) {
    return `${baseUrl + "/" + img}`;
}
getHotelImageList(){
    const data = [this.isWellnessImageContext
        ? { wellness_id: this.hotelOne['wellness_id'] || this.hotelOne['id'], offset: 0, limit: 10 }
        : { hotel_id: this.hotelOne['id'], offset: 0, limit: 10 }]
    data['topic'] = this.imageListTopic;
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.hotelImage =  resp['data'];
            console.log(" this.hotelImage", this.hotelImage)
        }else if (resp.statusCode == 404) {
            this.noDataMessage = "No records found"
        }

    });
}
// goToHotelList(){
//     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//                 this.router.onSameUrlNavigation = 'reload';
//                 this.router.navigate(['/hotels/hotel-crs-lists']); 
    
// }
goToHotelList() {
    if (this.isWellnessImageContext) {
        this.callResult.emit(true);
        return;
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/hotels/hotel-crs-lists'], { queryParams: { tab: 'list_hotels' } });
    });
}

delete(imageData){
    this.swalService.alert.delete((action)=>{
        if(action){
            console.log("imageData",imageData)
            const data = [this.isWellnessImageContext
                ? { id: this.hotelOne['id'], image_url: imageData }
                : { id: this.hotelOne['id'], image_url: imageData }]
            data['topic'] = this.deleteImageTopic;
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201 ) {
                        this.swalService.alert.success(`${this.entityLabel} Image has been deleted successfully`);
                        this.getHotelImageList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
// delete(imageData){
//     console.log("imageData",imageData)
//     let image_id = this.hotelOne['id']
//     const data = [{ id: image_id ,image_url:imageData}]
//     data['topic'] = 'deleteHotelImage';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             this.hotelImage = resp.data;
//             this.getHotelImageList()
//             console.log(" this.roomTypeList", this.hotelImage)
//             this.swalService.alert.success("Hotel detail deleted successfully!")
//         }

//     });
// }
openImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
  onPublish(checked:boolean,index,publishRecord:any){
    console.log("index",index)
    console.log("publishRecord",publishRecord)
     const data = [this.isWellnessImageContext
        ? { id: this.hotelOne['id'], index: index, offset: 0, limit: 10 }
        : { id: this.hotelOne['id'], index: index, offset: 0, limit: 10 }]
    data['topic'] = this.primaryImageTopic;
    this.hotelCrsService.fetch(data).subscribe(resp => {
   
  
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            if(checked){
                this.swalService.alert.success('Successfully Enabled')
                this.getHotelImageList()
            }else{
                this.swalService.alert.success('Successfully removed from trending list')
            }
        }
    },(err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  
  }

get hotelImg() { return this.hotelImageForm.controls; }
}
