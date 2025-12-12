import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-b2c-transfer',
  templateUrl: './b2c-transfer.component.html',
  styleUrls: ['./b2c-transfer.component.scss']
})
export class B2cTransferComponent implements OnInit {

  private subSunk = new SubSink();
  regConfig: FormGroup;
  respData: Array<any> = [];
  defaultCurrency: string = '';
  supplierList: any[] = [];
displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'value', value: 'Value' },
    { key: 'supplier_type', value: 'Supplier Type' },
    { key: 'action', value: 'Action' }
];
noData: boolean = true;
  constructor(
      private fb: FormBuilder,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private appService: AppService
  ) { }

  ngOnInit() {
      this.defaultCurrency = this.appService.defaultCurrency;
      this.createForm();
      this.getSuppliers();
      this.getMarkUpList();
      this.formValueChanges();
  }

  getMarkUpList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
          "module_type": "b2c_transfer",
          "type": "supplier",
          "is_deleted": 0
      }).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.respData = resp.data;
              this.noData = false;
              this.resetForm();
          } else {
              this.swalService.alert.oops();
          }
      }, (err: HttpErrorResponse) => {
          this.swalService.alert.oops();
      });
  }

  createForm() {
      this.regConfig = this.fb.group({
          markupType: ['percentage', Validators.required],
          markupValue: ['', Validators.required],
          suppliers: ['', Validators.required]
      });
  }

  onSubmit(val) {
      if (this.regConfig.invalid)
          return;

      this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {},
          {
              "type": "supplier",
              "fare_type": "Public",
              "module_type": "b2c_transfer",
              "flight_airline_id": 0,
              "value": parseInt(this.regConfig.get('markupValue').value),
              "value_type": this.regConfig.get('markupType').value,
              "domain_list_fk": 1,
              "supplier": this.booking_source,
              "markup_currency": this.defaultCurrency,
              "auth_user_id":1
          }).subscribe(resp => {
              console.log(resp);
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.swalService.alert.success();
                  this.getMarkUpList();
                  this.resetForm();
                  // this.regConfig.reset();
              }
          }, err => {
              this.swalService.alert.oops();
          })

  }

  formValueChanges() {
      const markupValueControl = this.regConfig.get('markupValue');

      this.regConfig.get('markupType').valueChanges
          .subscribe(markupType => {
              if (markupType == "plus") {
                  markupValueControl.setValidators([Validators.required, Validators.max(100000)]);
              }

              if (markupType == "percentage") {
                  markupValueControl.setValidators([Validators.required, Validators.max(100)]);
              }
              markupValueControl.updateValueAndValidity();
          })
  }

  resetForm() {
    this.regConfig.reset();
    this.regConfig.patchValue({
        markupType: 'percentage'
    });
}


  ngOnDestroy() {
      this.subSunk.unsubscribe();
  }

  getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "transfer",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }

    booking_source: any;
    selectedLocation(suppliers) {
        this.booking_source = `${suppliers['source_key']}`;
        return;
    }

    getSupplier(data) {
        if(data) {
            return JSON.parse(data);
        }
    }

    updateMarkup(data) {
    if(data) {
        this.regConfig.patchValue({
            markupType: data.value_type,
            markupValue: data.value,
            supplier: JSON.parse(data.supplier) === "ZBAPINO00011" ? "Hoppa" : "TransferCrs"
        })
    }
  }

  deleteMarkup(data) {
    this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.delete(data.id);
            } else {
                console.log("Not delete")
            }
        })
  }
    delete(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("Deleted Successfully");
                this.getMarkUpList();
            } else {
                this.swalService.alert.oops(resp.Message);
            }
        }, (err) => {
            this.swalService.alert.error(err.Message);
        })
    }

}
