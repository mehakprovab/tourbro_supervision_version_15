import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-b2c-tour',
  templateUrl: './b2c-tour.component.html',
  styleUrls: ['./b2c-tour.component.scss']
})
export class B2cTourComponent implements OnInit {

  private subSunk = new SubSink();
  regConfig: FormGroup;
  respData: Array<any> = [];
  defaultCurrency: string = '';
  public supplierList: any[] = [];
  booking_source: any;
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
      this.getMarkupList();
    //   this.formValueChanges();
      this.getSuppliers();
  }

  getMarkupList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cMarkupList', 'post', {}, {}, {
          "module_type": "b2c_tour",
          "type": "supplier",
          "is_deleted": 0
      }).subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.respData = resp.data;
              this.noData = false;
          } else {
            this.respData = [];
              this.noData = false;
              this.swalService.alert.oops();
          }
      }, (err: HttpErrorResponse) => {
        this.respData = [];
              this.noData = false;
          this.swalService.alert.oops();
      });
  }

  getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "Sightseeing",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }

  createForm() {
      this.regConfig = this.fb.group({
          markupType: ['percentage'],
          markupValue: ['', Validators.required],
          supplierType: ['', Validators.required]
      });
  }

      selectedLocation(suppliers) {
        console.log("suppliers",suppliers)
        this.booking_source = `${suppliers['source_key']}`;
        return;
    }

  onSubmit(val) {
      if (this.regConfig.invalid)
          return;
      const supplierId = this.booking_source;
      this.subSunk.sink = this.apiHandlerService.apiHandler('addB2cMarkup', 'post', {}, {},
          {
              "type": "supplier",
              "fare_type": "Public",
              "module_type": "b2c_tour",
              "flight_airline_id": 0,
              "value": parseInt(this.regConfig.get('markupValue').value),
              "value_type": 'percentage',
              supplier_id: supplierId,
              "domain_list_fk": 1,
              "markup_currency": this.defaultCurrency,
          }).subscribe(resp => {
              console.log(resp);
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                  this.swalService.alert.success();
                  this.regConfig.reset();
                  this.getMarkupList();
              } else {
                this.swalService.alert.oops(resp.Message);
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

  updateMarkup(data) {
    if(data) {
        this.booking_source = data.supplier_id;
        this.regConfig.patchValue({
            markupValue: data.value,
            supplierType: data.supplier_id === 'BGTAPINO00001' ? 'Tour Radar' : 'Tour CRS'
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
                this.getMarkupList();
            } else {
                this.swalService.alert.oops(resp.Message);
            }
        }, (err) => {
            this.swalService.alert.error(err.Message);
        })
    }
}

