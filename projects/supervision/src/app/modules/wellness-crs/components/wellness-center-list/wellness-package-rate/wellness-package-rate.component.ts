import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
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
  private readonly packageTabIds = ['list_wellness_package', 'add_wellness_package'];
  wellnessList: any;
  packageForm!: FormGroup;

  public therapyList: any[] = [];
  public packageList: any[] = [];
  public durationList = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1} Day${i > 0 ? 's' : ''}`
  }));
  
  public id: any;
  loading: boolean = false;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  public submittedHotelImage: boolean = false;
  public isDataLoaded: boolean = false;
  private therapyListLoaded: boolean = false;
  private packageListLoaded: boolean = false;
  openDropdown: string = '';

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

  @HostListener('document:click')
  closeDropdown(): void {
    this.openDropdown = '';
  }

  onTabSelected(event: any) {
    if (!this.packageTabIds.includes(event.nextId)) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      this.activeIdString = 'list_wellness_package';
      return;
    }

    const isAddPackageClick = event.nextId === 'add_wellness_package' && this.activeIdString !== 'add_wellness_package';
    if (isAddPackageClick) {
      this.prepareAddPackage();
    }

    this.activeIdString = event.nextId;
  }

  triggerTab(data: any) {
    // Not needed
  }

  onPageLoad() {
    this.isDataLoaded = false;
    this.therapyListLoaded = false;
    this.packageListLoaded = false;
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

    this.selactedFlies = [];
    this.imageSrc = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (!allowedTypes.includes(file.type)) {
        this.swalService.alert.oops(`"${file.name}" is not a supported format.`);
        continue;
      }

      if (file.size > maxSize) {
        this.swalService.alert.oops(`"${file.name}" exceeds 500 KB size limit.`);
        continue;
      }

      this.selactedFlies.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc.push(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  getAllTherapyList() {
    const data = {
      topic: "therapyTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.therapyList = this.getListFromResponse(resp)
          .filter((item: any) => item.therapy_name)
          .map((item: any, index: number) => ({
            ...item,
            id: item.id || item.therapy_type_id || item.therapy_id || index + 1
          }));
      } else if (resp.statusCode === 404) {
        this.therapyList = [];
      }
      this.therapyListLoaded = true;
      this.checkDataLoaded();
    }, (err: HttpErrorResponse) => {
      this.therapyList = [];
      this.therapyListLoaded = true;
      this.checkDataLoaded();
    });
  }

  getAllPackageList() {
    const data = {
      topic: "packageTypeList",
    };
    this.wellnessCrsService.fetch(data).subscribe((resp) => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.packageList = this.getListFromResponse(resp)
          .filter((item: any) => item.name)
          .map((item: any, index: number) => ({
            ...item,
            id: item.id || item.package_type_id || index + 1
          }));
      } else if (resp.statusCode === 404) {
        this.packageList = [];
      }
      this.packageListLoaded = true;
      this.checkDataLoaded();
    }, (err: HttpErrorResponse) => {
      this.packageList = [];
      this.packageListLoaded = true;
      this.checkDataLoaded();
    });
  }

  checkDataLoaded() {
    this.isDataLoaded = this.therapyListLoaded && this.packageListLoaded;
  }

  getListFromResponse(resp: any): any[] {
    const data = resp ? resp.data : [];

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    if (data && Array.isArray(data.result)) {
      return data.result;
    }

    if (data && Array.isArray(data.rows)) {
      return data.rows;
    }

    return [];
  }

  ngOnInit() {
    console.log("wellnessOne", this.wellnessOne);
    this.activeIdString = 'list_wellness_package';
    this.createForm();
    this.getPackagesByCenterId();
    this.onPageLoad();
  }

  createForm() {
    this.packageForm = this.fb.group({
      center_code: [''],
      package_name: ['', [Validators.required]],
      package_types: [[], [this.arrayRequired]],
      therapy_types: [[], [this.arrayRequired]],
      duration_days: [[], [this.arrayRequired]],
      description: ['', [Validators.required]],
      faq_policies: this.fb.array([]),
      status: [true]
    });
    
    this.addFaq();
  }

  arrayRequired(control: AbstractControl) {
    return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
  }

  createFaq(): FormGroup {
    return this.fb.group({
      question: [''],
      answer: ['']
    });
  }

  addFaq(): void {
    this.faqPolicies.push(this.createFaq());
  }

  prepareAddPackage(): void {
    this.id = '';
    this.showPackageImageUpload = false;
    this.roomImageList = [];
    this.packageId = null;
    this.imageSrc = [];
    this.selactedFlies = [];
    this.openDropdown = '';

    if (this.packageForm) {
      this.packageForm.reset({
        center_code: '',
        package_name: '',
        package_types: [],
        therapy_types: [],
        duration_days: [],
        description: '',
        status: true
      });
      while (this.faqPolicies.length) {
        this.faqPolicies.removeAt(0);
      }
      this.addFaq();
    } else {
      this.createForm();
    }
  }

  get faqPolicies(): FormArray {
    return this.packageForm?.get('faq_policies') as FormArray;
  }

  removeFaq(index: number): void {
    this.faqPolicies.removeAt(index);
  }

  toggleDropdown(controlName: string): void {
    this.openDropdown = this.openDropdown === controlName ? '' : controlName;
  }

  isDropdownOpen(controlName: string): boolean {
    return this.openDropdown === controlName;
  }

  getSelectedValues(controlName: string): string[] {
    const value = this.packageForm.get(controlName).value;
    return Array.isArray(value) ? value : [];
  }

  isSelected(controlName: string, value: string): boolean {
    return this.getSelectedValues(controlName).includes(value);
  }

  toggleSelection(controlName: string, value: string): void {
    const selectedValues = this.getSelectedValues(controlName);
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];

    this.packageForm.get(controlName).setValue(nextValues);
    this.packageForm.get(controlName).markAsTouched();
    this.packageForm.get(controlName).updateValueAndValidity();
  }

  selectSingle(controlName: string, value: string): void {
    this.packageForm.get(controlName).setValue([value]);
    this.packageForm.get(controlName).markAsTouched();
    this.packageForm.get(controlName).updateValueAndValidity();
    this.openDropdown = '';
  }

  getSelectedText(controlName: string, placeholder: string): string {
    const selectedValues = this.getSelectedValues(controlName);

    if (!selectedValues.length) {
      return placeholder;
    }

    if (selectedValues.length <= 2) {
      return selectedValues.join(', ');
    }

    return `${selectedValues.length} selected`;
  }

  getPackagesByCenterId() {
    const data = [{
      "center_code": this.wellnessOne.center_code,
      "offset": 0,
      "limit": 10
    }];
    data["topic"] = "getPackagesByCenterId";
    this.wellnessCrsService.fetch(data).subscribe((res) => {
      if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
        this.wellnessList = res.data || [];
      }
    }, (err) => {
      console.error(err);
    });
  }

  onSubmit() {
    console.log(this.packageForm.value)
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      this.swalService.alert.oops('Please fill all required fields.');
      return;
    }

    const formData = {
      ...this.packageForm.value,
      ...(this.id && { id: this.id }),
      center_code: this.wellnessOne.center_code,
      therapy_types: this.packageForm.value.therapy_types || [],
      package_types: this.packageForm.value.package_types || [],
      duration_days: this.packageForm.value.duration_days || [],
      faq_policies: this.normalizeToArray(this.packageForm.value.faq_policies)
        .filter((faq: any) => faq.question || faq.answer),
    };

    let data = Object.assign({}, formData);
    data = [data];
    data['topic'] = this.id ? 'updateWellnessPackage' : "addWellnessPackage";
    this.wellnessCrsService.create(data).subscribe(resp => {
      if (resp.Status === true && (resp.statusCode === 200 || resp.statusCode === 201)) {
        this.swalService.alert.success('Package Rate added Successfully.!')
        this.getPackagesByCenterId();
        this.prepareAddPackage();
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
              this.swalService.alert.success(`Package Rate has been deleted successfully`);
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
      const selectedPackageTypes = this.normalizeToArray(data.package_types);
      const selectedTherapyTypes = this.normalizeToArray(data.therapy_types);
      const selectedDurations = this.normalizeToArray(data.duration_days);

      this.faqPolicies.clear();

      this.normalizeToArray(data.faq_policies).forEach(faq => {
        this.faqPolicies.push(
          this.fb.group({
            question: [faq.question],
            answer: [faq.answer]
          })
        );
      });

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

  normalizeToArray(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (data === null || data === undefined || data === '') {
      return [];
    }

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (error) {
        return data.split(',').map(item => item.trim()).filter(item => item);
      }
    }

    return [data];
  }

  addPrice(wellness, tab) {
    this.wellnessCrsService.getEditData.next(wellness);
    this.packageEvent.emit({ rooms: wellness, roomsEditData: '', hoteltrigger: tab });
  }

  onPublish(checked: boolean, index, publishRecord: any) {
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
              this.swalService.alert.success(`Package Rate has been deleted successfully`);
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
    const data = [{ wellness_package_id: this.packageId.id, offset: 0, limit: 10 }]
    data['topic'] = 'listPackageImage';
    this.wellnessCrsService.fetch(data).subscribe(resp => {
      if (resp.statusCode == 200) {
        this.roomImageList = resp['data'];
      }
    });
  }

  goBack() {
    this.activeIdString = 'list_wellness_package';
    this.showPackageImageUpload = false;
  }

  onSubmitWellNessImage() {
    this.loading = true;
    this.imageSrc = '';
    if (this.hotelImageForm.valid) {
      const formData = new FormData();
      this.selactedFlies.forEach(file => {
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
    } else { 
      this.loading = false;
      return; 
    }
  }
}
