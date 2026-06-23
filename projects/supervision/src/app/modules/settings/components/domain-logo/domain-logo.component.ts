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

  imageSrc;
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    this.fileError = "";
    this.resetSelectedLogo(false);

    if (!file) {
      return;
    }

    const acceptedTypes = ["image/png", "image/jpeg"];
    if (!acceptedTypes.includes(file.type)) {
      this.rejectFile("Choose a PNG, JPG, or JPEG image.");
      return;
    }

    if (file.size > 100 * 1024) {
      this.rejectFile("The image must be no larger than 100 KB.");
      return;
    }

    this.isValidatingImage = true;
    const reader = new FileReader();
    reader.onload = () => {
      const preview = new Image();
      preview.onload = () => {
        this.isValidatingImage = false;
        if (preview.width !== 200 || preview.height !== 200) {
          this.rejectFile("The image dimensions must be exactly 200px by 200px.");
          return;
        }

        this.imageSrc = reader.result;
        this.bankLogo = "";
        this.imgObj.isLogoToUpdate = true;
        this.logoConfig.patchValue({ domain_logo: file });
        this.logoConfig.get("domain_logo").markAsTouched();
      };
      preview.onerror = () => {
        this.isValidatingImage = false;
        this.rejectFile("The selected image could not be read.");
      };
      preview.src = reader.result as string;
    };
    reader.onerror = () => {
      this.isValidatingImage = false;
      this.rejectFile("The selected image could not be read.");
    };
    reader.readAsDataURL(file);
  }

  private rejectFile(message: string): void {
    this.fileError = message;
    this.resetSelectedLogo(true);
  }

  private resetSelectedLogo(clearInput: boolean): void {
    this.imageSrc = "";
    this.imgObj.isLogoToUpdate = false;
    this.logoConfig.reset();
    if (clearInput && this.fileUploader) {
      this.fileUploader.nativeElement.value = null;
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
