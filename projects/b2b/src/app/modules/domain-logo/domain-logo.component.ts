import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { SubSink } from "subsink";
import { ActivatedRoute } from "@angular/router";
import { environment } from "projects/b2b/src/environments/environment.prod";
import { DomainLogoService } from "./domain-logo.service";

const baseUrl = environment.B2B_URL;
@Component({
  selector: "app-domain-logo",
  templateUrl: "./domain-logo.component.html",
  styleUrls: ["./domain-logo.component.scss"],
})
export class DomainLogoComponent implements OnInit {
  regConfig: FormGroup;
  bankLogo: string;
  logoBankUri = `${baseUrl}/b2b/common/domainLogo/`;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };
  // logoConfig: FormGroup;
  url: any = "";
  logoConfig = new FormGroup({
    domain_logo: new FormControl(null, Validators.required),
  });
  private subSunk = new SubSink();
  submitted: boolean = false;
  file: any;
  loggedInUser: any;
  image: any;
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;

  constructor(private fb: FormBuilder,
     private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
       private activatedRoute: ActivatedRoute,
       private domainLogo:DomainLogoService
  ) { }


  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.image = this.loggedInUser["domain_logo"];
  }


  imageSrc;
  onFileSelected($event) {
    this.file = $event.target.files[0];
    if (this.file &&  this.file.size) {
        let result=this.validateFileSize( this.file.size);
        if(!result){
            this.bankLogo = "";
            this.imageSrc=""
            this.fileUploader.nativeElement.value = null;
            this.logoConfig.reset();
            this.imgObj.isLogoToUpdate = false;
            return;
        }
    }

    if (this.file.name) {
      this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.patchValue({ domain_logo: this.file });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

    validateFileSize(fileSize) {
        if (fileSize > 100000) {
            this.swalService.alert.oops("Maximum upload file size: 1MB");
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
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const formData = new FormData();
    formData.append('image', this.logoConfig.get('domain_logo').value);
    formData.append('id', user.id);
    this.subSunk.sink = this.apiHandlerService.apiHandler('getDomainLogo', 'post', {}, {}, formData)
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.submitted = false;
          this.swalService.alert.success("logo added successfully.");
          const user = JSON.parse(sessionStorage.getItem('currentUser'));
          user.domain_logo = resp.data.url;
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          this.domainLogo.domainLogo.next((user))
     }
        else {
          this.swalService.alert.oops(resp.msg);
        }
      });
  }
}
