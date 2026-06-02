import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup , FormArray } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
 

const log = new Logger('b2c-payment-gateway-charges/B2cPaymentGatewayChargesComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-b2c-payment-gateway-charges',
  templateUrl: './b2c-payment-gateway-charges.component.html',
  styleUrls: ['./b2c-payment-gateway-charges.component.scss']
})
export class B2cPaymentGatewayChargesComponent implements OnInit,OnDestroy {

private subSunk = new SubSink();
    regConfig: FormGroup;
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'payment',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };

    constructor(
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private activatedRoute: ActivatedRoute,
        private fb :FormBuilder
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'module', value: 'Module' },
        { key: 'fees_type', value: 'Fees Type' },
        { key: 'fees', value: 'Fees' },
        { key: 'added_per_pax', value: 'Added Per Pax' },
    ];

    ngOnInit() {
        this.createform();
        this.getPaymentChanrges();
    }

    getPaymentChanrges(){
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('corePaymentChargeList', 'post', {}, {},
            {}).subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data.filter(d=> d.module !== 'Bundle' && d.module !== 'Flight') || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    this.updateForm(this.respData.length);
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
            });
            
    }

    createform(){
        let arr=[];  
            this.regConfig =  this.fb.group({   
              paymentDetails: new FormArray([])
            }) 
    }

    BuildFormDynamic(paymentDatas):FormGroup{  
     return this.fb.group({  
            id:[paymentDatas.id],        
           module_type:[paymentDatas.module],  
           fees_type:[paymentDatas.fees_type],  
           fees:[paymentDatas.fees],  
           added_per_pax :[paymentDatas.added_per_pax]  
      })  
    }

     get f() { return this.regConfig.controls; }   
     get t() { return this.f.paymentDetails as FormArray; }

    updateForm(e){
        const numberOfItems = e;
            for(let i=0;i< this.respData.length;i++) {
                if(this.respData[i].id){
                    this.t.push(this.fb.group({
                        id: [''],
                        module_type: [''],
                        fees_type: [''],
                        fees: [''],
                        added_per_pax: ['']
                    }));
                    const controlArray = <FormArray>this.regConfig.get('paymentDetails');
                    controlArray.controls[i].get('id').setValue(this.respData[i].id);
                    controlArray.controls[i].get('module_type').setValue(this.respData[i].module);
                    controlArray.controls[i].get('fees_type').setValue(this.respData[i].fees_type);
                    controlArray.controls[i].get('fees').setValue(this.respData[i].fees);
                    controlArray.controls[i].get('added_per_pax').setValue(this.respData[i].added_per_pax);
                }
            } 
        } 

    get getFormControls() {
        const control = this.regConfig.get('paymentDetails') as FormArray;
        return control;
    }

    updatePaymentCharges(){ 
        this.subSunk.sink = this.apiHandlerService.apiHandler('updatePaymentCharge', 'post', {}, {},this.regConfig.value.paymentDetails)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Updated successfully.");
                    this.getPaymentChanrges();
                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
        })
    }

    resetData(){
        this.getPaymentChanrges();
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return this.utility.compare('' + a.id, '' + b.id, isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);
                case 'module': return this.utility.compare('' + a.email_id.toLocaleLowerCase(), '' + b.email_id.toLocaleLowerCase(), isAsc);

                default: return 0;
            }
        });
    }
    download(type: any, orientation?: string) {
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `newsletter_subscriptions`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
    }

    pdfCallbackFn(pdf: any) {
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
