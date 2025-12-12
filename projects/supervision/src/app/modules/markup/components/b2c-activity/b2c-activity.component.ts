import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'projects/supervision/src/app/app.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-b2c-activity',
  templateUrl: './b2c-activity.component.html',
  styleUrls: ['./b2c-activity.component.scss'],
})
export class B2cActivityComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  regConfig: FormGroup;
  respData: Array<any> = [];
  defaultCurrency: string = '';
supplierList: any[] = [];
public booking_source: any;
noData: boolean = true;
displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'value', value: 'Value' },
        { key: 'supplier_type', value: 'Supplier Type' },
        { key: 'action', value: 'Action' }
    ];
  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.defaultCurrency = this.appService.defaultCurrency;
    this.createForm();
    this.fetchMarkupData();
    this.handleFormValueChanges();
    this.getSuppliers();
  }

  createForm() {
    this.regConfig = this.fb.group({
      markupType: ['percentage', Validators.required],
      markupValue: ['', Validators.required],
      suppliers: ['']
    });
  }
getSuppliers() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cSupplierList', 'post', {}, {}, {
            "module": "activity",
             "userType":"B2B"
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.supplierList = resp.data;
                console.log(" this.supplierList", this.supplierList)
            }
        });
    }
  fetchMarkupData() {
    const payload = {
      module_type: 'b2c_activity',
      type: 'supplier',
      is_deleted: 0,
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('b2cMarkupList', 'post', {}, {}, payload)
      .subscribe(
        (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.respData = resp.data;
            this.noData = false;
            this.resetForm();
            // if (this.respData.length) {
            //   this.regConfig.patchValue({
            //     markupType: this.respData[0].value_type || 'percentage',
            //     markupValue: this.respData[0].value || '',
            //   });
            // }
          } else {
            this.noData = false;
            this.respData = [];
            this.swalService.alert.oops('Failed to fetch markup data.');
          }
        },
        (err: HttpErrorResponse) => {
          this.noData = false;
            this.respData = [];
          this.swalService.alert.oops('An error occurred while fetching data.');
        }
      );
  }
  selectedLocation(suppliers) {
        this.booking_source = `${suppliers['source_key']}`;
        this.regConfig.patchValue({
          supplier: `${suppliers['source_key']}`,
          supplier_id: `${suppliers['source_key']}`
        })
        return;
    }

  onSubmit() {
    if (this.regConfig.invalid) {
      return;
    }

    const payload = {
      type: 'supplier',
      fare_type: 'Public',
      module_type: 'b2c_activity',
      flight_airline_id: 0,
      value: parseInt(this.regConfig.get('markupValue').value, 10),
      value_type: this.regConfig.get('markupType').value,
      domain_list_fk: 1,
      markup_currency: this.defaultCurrency,
      supplier_id: this.regConfig.value.suppliers === 'Activity CRS' ? 'ZBAPINO00004' : 'ZBAPINO00003',
      supplier: this.regConfig.value.suppliers === 'Activity CRS' ? 'ZBAPINO00004' : 'ZBAPINO00003'
    };

    this.subSunk.sink = this.apiHandlerService
      .apiHandler('addB2cMarkup', 'post', {}, {}, payload)
      .subscribe(
        (resp) => {
          if (resp.statusCode === 200 || resp.statusCode === 201) {
            this.swalService.alert.success('Markup added successfully.');
            this.regConfig.reset();
            this.fetchMarkupData();
          } else {
            this.swalService.alert.oops('Failed to save markup.');
          }
        },
        () => {
          this.swalService.alert.oops('An error occurred while saving data.');
        }
      );
  }

  handleFormValueChanges() {
    const markupValueControl = this.regConfig.get('markupValue');

    this.regConfig.get('markupType').valueChanges.subscribe((markupType) => {
      if (markupType === 'plus') {
        markupValueControl.setValidators([
          Validators.required,
          Validators.max(100000),
        ]);
      } else if (markupType === 'percentage') {
        markupValueControl.setValidators([
          Validators.required,
          Validators.max(100),
        ]);
      }
      markupValueControl.updateValueAndValidity();
    });
  }

  resetForm(): void {
    this.regConfig.reset({
      markupType: 'percentage',
      markupValue: '',
    });
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }

  updateMarkup(data) {
    this.regConfig.patchValue({
      markupType: data.value_type || 'percentage',
      suppliers: data.supplier_id === 'ZBAPINO00004' ?  'Activity CRS' :'Hotelbeds',
      markupValue: data.value

    });
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
                this.fetchMarkupData();
            } else {
                this.swalService.alert.oops(resp.Message);
            }
        }, (err) => {
            this.swalService.alert.error(err.Message);
        })
    }
}
