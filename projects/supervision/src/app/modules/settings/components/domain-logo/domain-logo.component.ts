import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
export class DomainLogoComponent implements OnInit {
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
  onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
        let result=this.validateFileSize( file.size);
        if(!result){
            this.bankLogo = "";
            this.imageSrc=""
            this.fileUploader.nativeElement.value = null;
            this.logoConfig.reset();
            this.imgObj.isLogoToUpdate = false;
            return;
        }
    }

    if (file.name) {
      this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.patchValue({ domain_logo: file });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

  validateFileSize(fileSize) {
    if (fileSize > 100000) {
        this.swalService.alert.oops("Maximum upload file size: 100KB");
        return false;
    }
    else {
        return true
    }
}

  onSubmit() {
    if (this.logoConfig.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('image', this.logoConfig.value.domain_logo);
    formData.append('id', '1');
    this.subSunk.sink = this.apiHandlerService.apiHandler('domainLogo', 'post', {}, {}, formData)
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.submitted = true;
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
}
