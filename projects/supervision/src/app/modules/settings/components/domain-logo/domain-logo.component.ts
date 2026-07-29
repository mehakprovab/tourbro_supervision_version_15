import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { environment } from "projects/supervision/src/environments";
import { SubSink } from "subsink";
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SettingService } from "../../setting.service";

const baseUrl = environment.baseUrl;
@Component({
  selector: "app-domain-logo",
  templateUrl: "./domain-logo.component.html",
  styleUrls: ["./domain-logo.component.scss"],
})
export class DomainLogoComponent implements OnInit, OnDestroy {
  regConfig: FormGroup;
  bankLogo: string;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };
  logoConfig = new FormGroup({
    domain_logo: new FormControl(null, Validators.required),
  });
  url: any;
  private subSunk = new SubSink();
  submitted: boolean = false;
  loggedInUser: any;
  noData: boolean = true;
  manageDomainData: any;
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  imageUrl: any;
  image: any;
  domainInformation: any;
  fileError = "";
  isValidatingImage = false;

  constructor(private fb: FormBuilder,
     private apiHandlerService: ApiHandlerService,
     private swalService: SwalService,
     private domainLogo : SettingService) { }

  ngOnInit() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.manageDomainData = resp.data[0].domain_logo;
          console.log("manageDomainData", this.manageDomainData);
        }
      });
  }


  imageSrc: string | ArrayBuffer | null = null;

onFileSelected(event: any) {

  this.fileError = '';

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  // Preview immediately
  const reader = new FileReader();

  reader.onload = (e: any) => {

    this.imageSrc = e.target.result;

    const img = new Image();

    img.onload = () => {

      if (file.size > 100 * 1024) {
        this.rejectFile('Image must be less than 100 KB');
        return;
      }

      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        this.rejectFile('Only PNG, JPG and JPEG are allowed');
        return;
      }

      if (img.width !== 200 || img.height !== 200) {
        this.rejectFile('Image must be exactly 200 × 200 pixels');
        return;
      }

      this.logoConfig.patchValue({
        domain_logo: file
      });

      this.logoConfig.get('domain_logo')?.updateValueAndValidity();
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
private rejectFile(message: string): void {
  this.fileError = message;
  this.imageSrc = null;
  this.imgObj.isLogoToUpdate = false;

  this.logoConfig.patchValue({
    domain_logo: null
  });

  this.logoConfig.get('domain_logo')?.markAsTouched();
  this.logoConfig.get('domain_logo')?.updateValueAndValidity();

  if (this.fileUploader) {
    this.fileUploader.nativeElement.value = '';
  }
}
private resetSelectedLogo(clearInput: boolean): void {
  this.imageSrc = null;
  this.imgObj.isLogoToUpdate = false;
  this.fileError = "";

  this.logoConfig.patchValue({
    domain_logo: null
  });

  if (clearInput && this.fileUploader) {
    this.fileUploader.nativeElement.value = '';
  }
}

  onSubmit() {
    this.submitted = true;
    if (this.logoConfig.invalid) {
      this.logoConfig.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('image', this.logoConfig.value.domain_logo);
    formData.append('id', '1');
    this.subSunk.sink = this.apiHandlerService.apiHandler('domainLogo', 'post', {}, {}, formData)
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.swalService.alert.success("logo added successfully.");
          localStorage.setItem("currentUser", JSON.stringify(resp.data.url));
          let user = JSON.parse(localStorage.getItem('currentDomainUser'));
          user.domain_logo = resp.data.url;
          localStorage.setItem("currentDomainUser", JSON.stringify(user));
          this.domainLogo.domainLogo.next(( resp.data.url))
        }
        else {
          this.swalService.alert.oops(resp.msg);
        }
      });
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
