import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-wellness-package-rate',
  templateUrl: './wellness-package-rate.component.html',
  styleUrls: ['./wellness-package-rate.component.scss']
})
export class WellnessPackageRateComponent implements OnInit {

  @Input() wellnessOne: any;
  @ViewChild('tabs', { static: true }) public tabs: NgbNav;
  activeIdString = 'list_wellness_package';
  wellnessList: any;
  packageForm!: FormGroup;

  dropdownSettingsForTherapy = {};
  dropdownSettingsForPackageTypes = {};
  dropdownSettingsForDuration = {};
  public therapyList: any;
  public packageList: any;

  public durationList = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1} Day${i > 0 ? 's' : ''}`
}));
public id: any;
loading:boolean =false;
primaryColour: any;
secondaryColour: any;
loadingTemplate: any;
public submittedHotelImage: boolean = false;

  displayColumn: { key: string, value: string }[] = [
    { key: "Slno", value: 'SI No.' },
    { key: "image", value: 'Image' },
    { key: "action", value: 'Actions' },
  ];
  noData: boolean = false;
  roomImageList: any;
  hotelImageForm!: FormGroup;
  selactedFlies: File[] = [];
  imageSrc: any;
  images: string[] = [];
  public showPackageImageUpload: boolean = false;
  @Output() packageEvent = new EventEmitter<any>();
  public packageId: any;

  constructor(
    private wellnessCrsService: WellnessCrsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private swalService: SwalService
  ) { }
  openImage(imageUrl: string): void {
    // this.selectedImage = imageUrl;
  }
  onTabSelected(event: any) {
    this.activeIdString = event.nextId;
    // this.router.navigate([], {
    //     queryParams: {
    //       tab: event.nextId
    //     },
    //     queryParamsHandling: 'merge',
    //     replaceUrl: true
    //   });
  }

  triggerTab(data: any) {
    //   console.log("data",data)
    //   this.activeIdString = 'add_wellness_package';
    //  this.router.navigate([], {
    //       queryParams: {
    //         tab: 'add_wellness_package'
    //       },
    //       queryParamsHandling: 'merge',
    //       replaceUrl: true
    //     });
    //     this.tabs.select(data.tabId)

  }

  onPageLoad() {
    this.dropdownSettingsForTherapy = {
      singleSelection: false,
      idField: 'id',
      textField: 'therapy_name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };

    this.dropdownSettingsForPackageTypes = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };

    this.dropdownSettingsForDuration = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      maxHeight: 197,
      itemsShowLimit: 2,
    };

    this.getAllTherapyList();
    this.getAllPackageList();
    this.createHotelImageForm();
  }

  createHotelImageForm() {
    this.hotelImageForm = this.fb.group({
      image_url: [''],
      hotel_room_id: [''],
      status: [true]
    });
  }


  previewRoomImage($event) {
    const files = $event.target.files;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
    const maxSize = 500 * 1024; // 500 KB

    this.selactedFlies = [];   // reset
    this.imageSrc = [];        // reset preview array

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      // ✅ File type validation
      if (!allowedTypes.includes(file.type)) {
        this.swalService.alert.oops(`"${file.name}" is not a supported format.`);
        continue;
      }

      // ✅ File size validation (500 KB)
      if (file.size > maxSize) {
        this.swalService.alert.oops(`"${file.name}" exceeds 500 KB size limit.`);
        continue;
      }

      // ✅ Valid file
      this.selactedFlies.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc.push(reader.result);
      };

      reader.readAsDataURL(file); // ❗ this was missing in your code
    }

    console.log("Valid selected files:", this.selactedFlies);
  }

  getAllTherapyList() {
    const data = {
      topic: "therapyTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.therapyList = resp.data.filter((item: any) => item.therapy_name) || [];
      } else if (resp.statusCode === 404) {
        this.therapyList = [];
      }
    }, (err: HttpErrorResponse) => {
      // this.swalService.alert.error(err['error']['Message']);
    });
  }

  getAllPackageList() {
    const data = {
      topic: "packageTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (
        resp.Status === true &&
        (resp.statusCode === 200 || resp.statusCode === 201)
      ) {
        this.packageList = resp.data.filter((item: any) => item.name) || [];
      } else if (resp.statusCode === 404) {
        this.packageList = [];
      }
    }, (err: HttpErrorResponse) => {
      // this.swalService.alert.error(err['error']['Message']);
    });
  }

  ngOnInit() {
    console.log("wellnessOne", this.wellnessOne);
    this.route.queryParams.subscribe(params => {

      if (params['tab']) {
        this.activeIdString = params['tab'];
      }
    });
    this.getPackagesByCenterId();
    this.onPageLoad();
    this.createForm();
  }
  createForm() {
    this.packageForm = this.fb.group({
      center_code: ['', [Validators.required]],
      package_name: ['', [Validators.required]],
      package_types: ['', [Validators.required]],
      therapy_types: ['', [Validators.required]],
      duration_days: ['', [Validators.required]],
      description: ['', [Validators.required]],
      faq_policies: this.fb.array([]),
      status: [true]
    });
    this.createFaq();
    this.addFaq();
  }

  get faqPolicies(): FormArray {
    return this.packageForm.get('faq_policies') as FormArray;
  }


  // create single FAQ
  createFaq(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }


  // add FAQ
  addFaq(): void {
    this.faqPolicies.push(this.createFaq());
  }


  // remove FAQ
  removeFaq(index: number): void {
    this.faqPolicies.removeAt(index);
  }

  getPackagesByCenterId() {
    const data = [{
      "center_code": this.wellnessOne.center_code,
      "offset": 0,
      "limit": 10
    }];
    data["topic"] = "getPackagesByCenterId";
    console.log(data)
    this.wellnessCrsService.fetch(data).subscribe((res) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log("packages", res.data);
        this.id = '';
        this.wellnessList = this.getPackageListFromResponse(res.data);
      } else if (res.statusCode === 404) {
        this.wellnessList = [];
      }
    }, (err) => {
      console.error(err);
      this.wellnessList = [];
    });
  }

  getPackageListFromResponse(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    if (data && Array.isArray(data.packages)) {
      return data.packages;
    }

    if (data && Array.isArray(data.package_list)) {
      return data.package_list;
    }

    if (data && Array.isArray(data.wellness_packages)) {
      return data.wellness_packages;
    }

    if (data && Array.isArray(data.rows)) {
      return data.rows;
    }

    if (data && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  }

  onSubmit() {
    console.log(this.packageForm.value)
    const formData = {
      ...this.packageForm.value,
      ...(this.id && { id: this.id }),
      center_code: this.wellnessOne.center_code,
      therapy_types: this.packageForm.value.therapy_types.map(
        item => item.therapy_name
      ),

      package_types: this.packageForm.value.package_types.map(
        item => item.name
      ),

      duration_days: this.packageForm.value.duration_days.map(
        item => item.name
      ),

    };

    let data = Object.assign({}, formData);
    data = [data];
    data['topic'] = this.id ? 'updateWellnessPackage' : "addWellnessPackage";
    this.wellnessCrsService.create(data).subscribe(resp => {
      if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
        console.log('Wellness Center created successfully:', resp);
        this.swalService.alert.success('Package Rate added Successfully.!')
        this.getPackagesByCenterId();
        this.packageForm.reset();
        this.activeIdString = 'list_wellness_package';
      }
    }, (err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  getPackageType(data) {
    if (Array.isArray(data)) {
      return data.join(', ');
    }

    return data || '';
  }

  deletePackageRate(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id }];
        data["topic"] = "deleteWellnessPackage";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Package Rate has been deleted successfully`,
              );
              this.getPackagesByCenterId();
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },
        );
      }
    });
  }

  updatePackageRate(data) {
    if (data) {
      this.id = data.id;
      const selectedPackageTypes = this.packageList.filter(item =>
        data.package_types.includes(item.name)
      );

      // therapy types
      const selectedTherapyTypes = this.therapyList.filter(item =>
        data.therapy_types.includes(item.therapy_name)
      );

      // duration
      const selectedDurations = this.durationList.filter(item =>
        data.duration_days.includes(item.name)
      );

      // clear existing faq
      this.faqPolicies.clear();

      // add faq rows
      data.faq_policies.forEach(faq => {
        this.faqPolicies.push(
          this.fb.group({
            question: [faq.question],
            answer: [faq.answer]
          })
        );
      });

      // patch form
      this.packageForm.patchValue({
        center_code: data.center_code,
        package_name: data.package_name,
        package_types: selectedPackageTypes,
        therapy_types: selectedTherapyTypes,
        duration_days: selectedDurations,
        description: data.description,
        status: Boolean(data.status)
      });
      this.activeIdString = 'add_wellness_package';
    }

  }

  addPrice(wellness, tab) {
    this.wellnessCrsService.getEditData.next(wellness);
    this.packageEvent.emit({ rooms: wellness, roomsEditData: '', hoteltrigger: tab });
  }
  onPublish(checked: boolean, index, publishRecord: any) {
    let hotel_room_id = this.wellnessOne['id'];
    const data = [{ wellness_package_id: this.packageId.id, id: publishRecord.id }]
    data['topic'] = 'primaryPackageImage';
    this.wellnessCrsService.fetch(data).subscribe(resp => {


      if (resp.statusCode == 200 || resp.statusCode == 201) {
        if (checked) {
          this.swalService.alert.success('Successfully Enabled')
          this.getRoomImageList();
        } else {
          this.swalService.alert.success('Successfully removed from trending list')
        }
      }
    }, (err: HttpErrorResponse) => {
      this.swalService.alert.error(err['error']['Message']);
    });
  }

  delete(id) {
    this.swalService.alert.delete((action) => {
      if (action) {
        const data = [{ id: id.id }];
        data["topic"] = "deletePackageImage";
        this.wellnessCrsService.fetch(data).subscribe(
          (response) => {
            if (response.statusCode == 200 || response.statusCode == 201) {
              this.swalService.alert.success(
                `Package Rate has been deleted successfully`,
              );
              this.getRoomImageList();
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
          },
        );
      }
    });
  }

  get hotelImage() { return this.hotelImageForm.controls; }

  updateCenterImage(data) {
    this.activeIdString = 'add_wellness_package';
    this.packageId = data;
    this.getRoomImageList();
    this.showPackageImageUpload = true;
  }

  getRoomImageList() {
    let hotel_room_id = this.wellnessOne['id'];
    const data = [{ wellness_package_id: this.packageId.id, offset: 0, limit: 10 }]
    data['topic'] = 'listPackageImage';
    this.wellnessCrsService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.roomImageList = resp['data'];
        console.log(" this.hotelImage", this.roomImageList)
      }

    });
  }

  goBack() {
    this.activeIdString = 'list_wellness_package';
  }

  onSubmitWellNessImage() {
    this.loading = true;
    this.imageSrc = '';
    if (this.hotelImageForm.valid) {
      console.log("this.hotelOne", this.wellnessOne)
      const formData = new FormData();
      this.selactedFlies.forEach(file => {
        console.log("file", file)
        formData.append('image', file, file.name);
      });
      formData.append('wellness_package_id', this.packageId.id)
      let data: any = [{ data: formData }];
      data['topic'] = 'addPackageImage';
      this.wellnessCrsService.updateRoomImage(data).subscribe(resp => {
        if (resp.statusCode == 201) {
          this.swalService.alert.success("Image Uploaded Sucessfully...!");
          this.loading = false;
          this.selactedFlies = [];
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          };
          this.getRoomImageList();
        } else if (resp.statusCode == 400) {
          this.swalService.alert.oops(resp.msg)
          this.loading = false;
        }
        else {
          this.swalService.alert.oops(resp.msg);
          this.loading = false;
        }
      }, (err => {
        this.swalService.alert.oops("Kindly upload in the accepted formats of JPG, JPEG and PNG only.");
        this.loading = false;
      }))
    } else { return; }
}
}
