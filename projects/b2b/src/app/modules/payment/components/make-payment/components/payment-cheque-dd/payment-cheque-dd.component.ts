import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
import { UtilityService } from "../../../../../../core/services/utility.service";
import { SubSink } from "subsink";
import * as moment from "moment";
import { PaymentService } from "../../../../payment.service";
import { environment } from "../../../../../../../../src/environments/environment";
const baseUrl = environment.B2B_URL;
@Component({
  selector: "app-payment-cheque-dd",
  templateUrl: "./payment-cheque-dd.component.html",
  styleUrls: ["./payment-cheque-dd.component.scss"],
})
export class PaymentChequeDdComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  @Input("requestType") requestType;
  @Output() activateSubChildTab = new EventEmitter<string>();
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  maxDate = new Date();
  isOpen = false as boolean;
  // date = false as boolean;
  logoConfig: FormGroup;
  bankLogo: string;
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
  logoBankUri = `${baseUrl}/sa/cms/cms-bankaccounts/`;
  regConfig: FormGroup;
  depositRequestData: any = {};
  respData: any;
  noData: boolean = false;
  bankData:any;
  currency:any;
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private util: UtilityService
  ) {}

  ngOnInit() {
    this.createForm();
    this.currency = this.util.readStorage('currentUser', sessionStorage)['currency'] || 'GBP',
    this.getListBankAccountAccountSys();
    this.paymentService.depositRequestData.subscribe((data) => {
      this.depositRequestData = data;
    });
  }

  createForm() {
    this.regConfig = this.fb.group({
      bankname: new FormControl("Choose one", [
        Validators.required,
        Validators.maxLength(120),
      ]),
      branchname: new FormControl("", [
        Validators.required,
        Validators.maxLength(120),
      ]),
      chequeDDNo: new FormControl("", [
        Validators.required,
        Validators.maxLength(120),
      ]),
      accountnumber: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      amount: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      dateoftransaction: new FormControl("", [
        Validators.required,
        Validators.maxLength(40),
      ]),
      remarks: new FormControl("", [
        // Validators.required,
        Validators.maxLength(120),
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

  getListBankAccountAccountSys() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("listBankAccountAccountSys", "post", {}, {}, {})
      .subscribe((resp) => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.noData = false;
          this.respData = resp.data || [];
        } else {
          this.noData = true;
          this.swalService.alert.error(resp.msg || "");
        }
      });
  }

  onSelect(accountnumber) {
     this.bankData = this.respData.find(
      (element) => element.account_number == accountnumber
    );
    this.regConfig.patchValue({
      branchname: this.bankData.branch_name,
      accountnumber: this.bankData.account_number,
        //bankname: this.bankData.bank_name,
    });
  }

  async onSubmit() {
    if (this.regConfig.invalid) return;
    if(this.logoConfig.invalid){
        this.swalService.alert.oops("Kindly upload transaction document");
        return;
    }

    const reqBody = await new FormData();
    await reqBody.append('transactiontype', this.depositRequestData.requestType);
    await reqBody.append('bankname', this.bankData.bank_name);
    await reqBody.append('branchname',this.regConfig.value.branchname);
    await reqBody.append('accountnumber', this.regConfig.value.accountnumber);
    await reqBody.append('depositedbranch',"");
    await reqBody.append('amount', this.regConfig.value.amount);
    await reqBody.append('dateoftransaction', moment(this.regConfig.value.date).format("YYYY-MM-DD HH:mm:ss"),);
    reqBody.append('remarks', this.regConfig.value.remarks);
    if (this.logoConfig.get('bank_logo').value) {
      await reqBody.append('request_file', this.logoConfig.get('bank_logo').value);
    }
    reqBody.append('transactionnumber', this.regConfig.value.chequeDDNo || 12345);
    
    console.log(reqBody);
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("balanceRequestAccountSys", "post", {}, {}, reqBody)
      .subscribe(
        (resp) => {
          console.log("reqBody", reqBody);
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

  ondateChange(e) {}

  onReset() {
    this.regConfig.reset();
    this.regConfig.clearValidators();
    this.logoConfig.reset();
    this.bankLogo = "";
    this.imageSrc="";
    this.fileUploader.nativeElement.value = null;
  }

  numberOnly(event): boolean {
    return this.util.numberOnly(event);
}

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
