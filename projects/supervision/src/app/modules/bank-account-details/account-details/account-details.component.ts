import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from '../../../core/api-handlers';
import { Logger } from '../../../core/logger/logger.service';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { BankAccountDetailsService } from '../bank-account-details.servise';
import { environment } from '../../../../environments/environment.prod';

const baseUrl = environment.baseUrl;
const log = new Logger('NoSubMenu/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.component.html",
  styleUrls: ["./account-details.component.scss"],
})
export class AccountDetailsComponent implements OnInit {
  @Output() toUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  searchForm: FormGroup;
  isOpen = false as boolean;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: "YYYY-MM-DD",
    rangeInputFormat: "YYYY-MM-DD",
    containerClass: "theme-blue",
  };
  pageSize = 100;
  page = 1;
  collectionSize: number = 100;
  displayColumn: { key: string; value: string }[] = [
    { key: "id", value: "Sl No." },
    { key: "action", value: "Action" },
    { key: "bank_logo", value: "Bank Logo" },
    { key: "bank_name", value: "Bank Name" },
    { key: "branch_name", value: "Branch Name" },
    { key: "Bank Routing Number", value: "Bank Routing Number" },
    { key: "account_name", value: "Account Name" },
    { key: "account_number", value: "Account Number" },
    { key: "swift_code", value: "SWIFT Code" },
    { key: "iban", value: "IBAN" },
    { key: "created_at", value: "Created on" },
    { key: "status", value: "Status" },
  ];
  noData: boolean = true;
  respData: Array<any> = [];
  logoBankUri = `${baseUrl}/cms/cms-bankaccounts/`;
  
  constructor(
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private utility: UtilityService,
    private bankAccountDetailsService: BankAccountDetailsService
  ) {}

  ngOnInit() {
    this.getListBankAccount();
    this.bankAccountDetailsService.toUpdateData.next({});
  }

  getListBankAccount() {
    this.respData=[];
    this.noData=true;
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("listBankAccount", "post", {}, {}, {})
      .subscribe((resp) => {
        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
          this.noData = false;
          this.respData = resp.data || [];
          respDataCopy = JSON.parse(JSON.stringify(resp.data));
          this.collectionSize = resp.data.length || 0;
        }
        else{
            this.respData=[];
            this.noData=false;
        }
    }, (err) => {
        this.noData = false;
        this.respData = [];
    });
  }

  updateAccount(data) {
    this.bankAccountDetailsService.toUpdateData.next(data);
    this.toUpdate.emit({ tabId: "add_update_bankaccount", data });
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...respDataCopy];
    if (!sort.active || sort.direction === "") {
      this.respData = data;
      return;
    }
    this.respData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "bank_name":
          return this.utility.compare(
            "" + a.bank_name.toLocaleLowerCase(),
            "" + b.bank_name.toLocaleLowerCase(),
            isAsc
          );
        case "branch_name":
          return this.utility.compare(
            "" + a.branch_name,
            "" + b.branch_name,
            isAsc
          );
        case "account_name":
          return this.utility.compare(
            "" + a.account_name,
            "" + b.account_name,
            isAsc
          );
        case "account_number":
          return this.utility.compare(
            +a.account_number.toLocaleLowerCase(),
            +b.account_number.toLocaleLowerCase(),
            isAsc
          );
        case "ifsc_code":
          return this.utility.compare(+a.swift_code, +b.swift_code, isAsc);
        case "ssn":
          return this.utility.compare(
            "" + a.ssn.toLocaleLowerCase(),
            "" + b.ssn.toLocaleLowerCase(),
            isAsc
          );
        case "created_at":
          return this.utility.compare(
            "" + a.created_at.toLocaleLowerCase(),
            "" + b.created_at.toLocaleLowerCase(),
            isAsc
          );
        case "status":
          return this.utility.compare(
            "" + a.status.toLocaleLowerCase(),
            "" + b.status.toLocaleLowerCase(),
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
    filterArray = respDataCopy.slice().filter((objData, index) => {
      const filterOnFields = {
        agent: objData.agent,
        transactiondate: objData.transaction,
        app_refernce: objData.app_refernce,
        transactiontype: objData.transactiontype,
        fare: objData.fare,
        remarks: objData.remarks,
      };
      if (
        Object.values(filterOnFields)
          .join()
          .toLocaleLowerCase()
          .match(`${text}`)
      ) {
        return objData;
      }
    });
    if (filterArray.length && text.length) this.respData = filterArray;
    else
      this.respData =
        !filterArray.length && text.length ? filterArray : [...respDataCopy];
  }
}
