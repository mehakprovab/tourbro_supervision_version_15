import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiHandlerService } from "../../../../../../core/api-handlers";
import { SwalService } from "../../../../../../core/services/swal.service";
import { SubSink } from "subsink";
import * as moment from "moment";
import { PaymentService } from "../../../../payment.service";
import { environment } from "../../../../../../../../src/environments/environment";
import { UtilityService } from "projects/b2b/src/app/core/services/utility.service";
const baseUrl = environment.B2B_URL;
@Component({
  selector: "app-bkash-deposit",
  templateUrl: "./bkash-deposit.component.html",
  styleUrls: ["./bkash-deposit.component.scss"],
})
export class BkashDepositComponent implements OnInit {
  bankLogo: string;

  private subSunk = new SubSink();
  @Input("requestType") requestType;
  @Output() activateSubChildTab = new EventEmitter<string>();
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  maxDate = new Date();
  isOpen = false as boolean;
  logoBankUri = `${baseUrl}/sa/cms/cms-bankaccounts/`;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };

  bsDateConf = {
    isAnimated: true,
    dateInputFormat: "DD/MM/YYYY",
    rangeInputFormat: "DD/MM/YYYY",
    containerClass: "theme-blue",
    showWeekNumbers: false
};
  regConfig: FormGroup;
  depositRequestData: any = {};
  logoConfig: FormGroup;
  currency:any;
  currentUser: any;
  
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private util:UtilityService
  ) { }

  ngOnInit() {
    this.createForm();
    this.currency = this.util.readStorage('currentUser', sessionStorage)['currency'] || 'GBP',
    this.paymentService.depositRequestData.subscribe((data) => {
      this.depositRequestData = data;
    });
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  ondateChange(e) { }

  createForm() {
    this.regConfig = this.fb.group({
      firstname: new FormControl("", [Validators.required]),
      phoneno: new FormControl("", [
        Validators.required,
        Validators.maxLength(120),
        Validators.pattern("^[0-9]*$")
      ]),
      transrefnumber: new FormControl("", [
        Validators.required,
        Validators.maxLength(12),
      ]),
      amount: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      date: new FormControl("", [Validators.required]),
      remarks: new FormControl("", [
        Validators.minLength(2),
        Validators.maxLength(200),
      ]),
    });
    this.logoConfig = this.fb.group({
      bank_logo: new FormControl("",[Validators.required]),
    });
  }
  imageSrc;
  onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
        let result=this.validateFileSize(file.size);
        if(!result){
            this.bankLogo = "";
            this.imageSrc=""
            this.fileUploader.nativeElement.value = null;
            this.logoConfig.reset();
            return;
        }
    }
    if (file.name) {
      this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.setValue({ bank_logo: file });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

  validateFileSize(fileSize) {
    if (fileSize >1048576) {
        this.swalService.alert.oops("Maximum upload file size: 1 MB");
        return false;
    }
    else {
        return true
    }
}

  onReset() {
    this.regConfig.reset();
    this.regConfig.clearValidators();
    this.logoConfig.reset();
    this.bankLogo = "";
    this.imageSrc="";
    this.fileUploader.nativeElement.value = null;
  }

  async onSubmit() {
    if (this.regConfig.invalid) return;
    if(this.logoConfig.invalid){
        this.swalService.alert.oops("Kindly upload transaction document");
        return;
    }
    const formData = await new FormData();
    await formData.append('transactiontype', this.depositRequestData.requestType);
    await formData.append('bankname', this.regConfig.value.firstname);
    await formData.append('branchname', this.regConfig.value.phoneno);
    await formData.append('accountnumber', "");
    await formData.append('depositedbranch', "");
    await formData.append('amount', this.regConfig.value.amount);
    await formData.append('dateoftransaction', moment(this.regConfig.value.date).format("YYYY-MM-DD HH:mm:ss"),);
    formData.append('remarks', this.regConfig.value.remarks);
    if (this.logoConfig.get('bank_logo').value) {
      await formData.append('request_file', this.logoConfig.get('bank_logo').value);
    }
    const date = new Date();
    const formattedDate = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');

    console.log(formattedDate); 
    const id = this.currentUser.uuid;
    const idLastDigit = id.slice(-4);
    const transactionId = formattedDate.concat(idLastDigit);
    formData.append('transactionnumber', this.regConfig.value.transrefnumber || transactionId);
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("balanceRequestAccountSys", "post", {}, {}, formData)
      .subscribe(
        (resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success();
            this.onReset();
            this.activateSubChildTab.emit("History_Deposit_Request");
          } else {
            this.swalService.alert.oops();
          }
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
        }
      );
  }

  numberOnly(event): boolean {
    return this.util.numberOnly(event);
}

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
