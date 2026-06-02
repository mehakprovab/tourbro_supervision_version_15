import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { environment } from 'projects/b2b/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from 'projects/supervision/src/app/modules/cms/cms.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';

const log = new Logger('AddUpdateCityPackageMasterComponent');
const baseUrl = environment.SA_URL;

@Component({
  selector: 'app-add-update-city-package-master',
  templateUrl: './add-update-city-package-master.component.html',
  styleUrls: ['./add-update-city-package-master.component.scss'],
})
export class AddUpdateCityPackageMasterComponent implements OnInit {
  @ViewChild('theFile', { static: false }) fileUploader: ElementRef;
  @ViewChild('labelImport', { static: false }) labelImport: ElementRef;
  @Output() staticContentTab = new EventEmitter<any>();

  regConfig: FormGroup;
  logoConfig: FormGroup;
  galleryConfig: FormGroup;

  dropdownSettingsForPackage = {
    singleSelection: false,
    idField: 'id',
    textField: 'package_includes',
    maxHeight: 220,
    allowSearchFilter: true,
    itemsShowLimit: 5,
  };
  getGalleryImage: any;
  fromErrorMsg: string;
  packageList: any[] = [];
  galleryImageList: any[] = [];
  locations: Array<any> = [];
  addOrUpdate: string = 'add';
  fileToUpload: File = null;
  imageSrc;
  iconImage: string;
  galleryUploadComplete: boolean = false;
  noData: boolean = false;
  lastKeyupTstamp: number = 0;

  private subSunk = new SubSink();
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false
  }
  gallery: any;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private cmsService: CmsService,
    private swalService: SwalService,
    private utility: UtilityService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.getPacakgeContentList();
    this.getToUpdate();
  }

  get selectedPackages() {
    return this.regConfig.get('package_includes').value;
  }

  createForm() {
    this.regConfig = this.fb.group({
      cityName: ['', Validators.required],
      cityId: [''],
      package_includes: [[], Validators.required],
      description: ['', Validators.required],
      id: [''],
    });

    this.logoConfig = this.fb.group({
      Banner_img: ['', Validators.required],
    });

    this.galleryConfig = this.fb.group({
      gallery_image: ['', Validators.required],
    });
  }

  selectedLocation(location: any) {
    this.regConfig.patchValue({
      cityName: location['CityName'],
      cityId: location['CityId'],
    });
    this.locations.splice(0);
  }

  getAutoCompleteLocations(event: KeyboardEvent) {
    const inpValue = (event.target as HTMLInputElement).value;
    if (inpValue.length > 0 && event.timeStamp - this.lastKeyupTstamp > 10) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler('cityAutocomplete', 'post', {}, {}, { Name: inpValue })
        .subscribe(
          (resp) => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
              this.locations = resp.data || [];
            } else {
              log.error('Error fetching autocomplete locations.');
            }
            this.cdr.detectChanges();
          },
          (err) => log.error(err)
        );
      this.lastKeyupTstamp = event.timeStamp;
    }
  }

  onReset() {
    this.regConfig.reset();
    this.logoConfig.reset();
    this.galleryConfig.reset();
    this.iconImage = '';
    this.addOrUpdate = 'add';
  }

  getImage(img: string): string {
    return `${baseUrl}/sa/common/getImage/${img}`;
  }
  onFileSelected($event) {
    const file = $event.target.files[0];
    console.log("file", file)
    if (file && file.size) {
      let result = this.validateFileSize(file.size);
      if (!result) {
        //this.bankLogo = "";
        this.imageSrc = ""
        this.fileUploader.nativeElement.value = null;
        this.logoConfig.reset();
        return;
      }
    }
    if (file.name) {
      //this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.setValue({ Banner_img: file });
      this.uploadLogo(file, 'banner')
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

  onGallerySelect($event) {
    this.gallery = $event.target.files;
    this.uploadLogo(this.gallery, 'gallery');
    this.galleryConfig.get('gallery_image').patchValue($event.target.files);

  }

  validateFileSize(fileSize) {
    if (fileSize > 1048576) {
      this.swalService.alert.oops("Maximum upload file size: 1 MB");
      const imageControlControl = this.logoConfig.get('Banner_img');
      imageControlControl.setValidators([Validators.required]);
      imageControlControl.updateValueAndValidity();
      return false;
    }
    else {
      return true
    }
  }

  uploadLogo(file: File | FileList, control: string) {
    const req = new FormData();
    if (control === 'banner') {
      req.append('imageFile', file as File);
    } else if (control === 'gallery') {
      this.galleryUploadComplete = false;
      const files = Array.isArray(file) ? file : Array.from(file as FileList);
      files.forEach((f) => req.append('imageFile', f));
    }

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('uploadIncludeMasterLogo', 'post', '', '', req)
      .subscribe(
        (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            if (control === 'banner') {
              this.logoConfig.setValue({ Banner_img: resp.data[0].image_url });
            } else if (control === 'gallery') {
              const imageUrls = resp.data.map((item: any) => item.image_url);
              this.galleryConfig.setValue({ gallery_image: imageUrls });
              this.galleryUploadComplete = true;
            }
          } else {
            this.swalService.alert.oops('File upload failed.');
          }
        },
        (err) => {
          this.swalService.alert.oops(err.error.Message);
        }
      );
  }

  getToUpdate() {
    this.subSunk.sink = this.cmsService.StaticContent.subscribe((data) => {
      if (!this.utility.isEmpty(data)) {
        this.addOrUpdate = 'update';
        this.iconImage = data.Banner_img;

        const selectedPackages = this.getAlreadySelectedPackageIncludes(
          data.package_includes
        );

        this.regConfig.patchValue({
          id: data.id || '',
          description: data.description || '',
          cityName: data.cityname || '',
          package_includes: selectedPackages,
        });
      } else {
        this.onReset();
      }
    });
  }

  getAlreadySelectedPackageIncludes(packageIncludes: any[]): any[] {
    return packageIncludes.map((pkg) => ({
      id: pkg.id,
      package_includes: pkg.package_includes,
    }));
  }

  getPacakgeContentList() {
    this.subSunk.sink = this.cmsService.getPackageIncludeList({}).subscribe(
      (resp) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          this.packageList = resp.data.filter((item: any) => item.status === 1);
        } else {
          this.packageList = [];
        }
      },
      (err) => {
        this.packageList = [];
      }
    );
  }

  onSubmit() {
    if (
      this.regConfig.invalid ||
      this.logoConfig.invalid ||
      this.galleryConfig.invalid
    ) {
      return;
    }

    const req = {
      id: this.regConfig.value.id,
      Banner_img: this.logoConfig.value.Banner_img,
      package_includes: JSON.stringify(this.regConfig.value.package_includes),
      cityname: this.regConfig.value.cityName,
      description: this.regConfig.value.description,
      gallery_image: this.galleryConfig.value.gallery_image,
    };

    if (this.addOrUpdate === 'add') {
      this.subSunk.sink = this.cmsService.addCityPacakageMaster(req).subscribe(
        (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success('Content added successfully.');
            this.onReset();
            this.staticContentTab.emit({ tabId: 'staticpage_list' });
          } else {
            this.swalService.alert.oops('City Package Master already exists!');
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.oops(err.error.Message.replace("400 ", ""));
        }
      );
    } else if (this.addOrUpdate === 'update') {
      this.subSunk.sink = this.cmsService.updatePackageMaster(req).subscribe(
        (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success('Content updated successfully.');
            this.staticContentTab.emit({ tabId: 'staticpage_list' });
          } else {
            this.swalService.alert.oops('Failed to update the content.');
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.oops(err.error.Message);
        }
      );
    }
  }
}
