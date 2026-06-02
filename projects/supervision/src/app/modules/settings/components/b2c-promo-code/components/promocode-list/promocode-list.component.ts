import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SettingService } from '../../../../setting.service';
import { environment } from '../../../../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

const baseUrl = environment.baseUrl;

const log = new Logger('promocode-list/PromocodeListComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-promocode-list',
  templateUrl: './promocode-list.component.html',
  styleUrls: ['./promocode-list.component.scss']
})
export class PromocodeListComponent implements OnInit,OnDestroy {

    @Output() updatePromoCode = new EventEmitter<any>();
    private subSunk = new SubSink();
    regConfig: FormGroup;
    pageSize = 100;
    page = 1;
    collectionSize: number = 40;
    noData: boolean = true;
    respData: Array<any> = [];
    listType: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'active-users-report',
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
        private exportAsService: ExportAsService,
        private settingService : SettingService,
        private fb: FormBuilder
    ) { }

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'promo_code', value: 'Promo Code' },
        { key: 'promo_image', value: 'Promo Image' },
        { key: 'description', value: 'Description' },
        { key: 'discount_type', value: 'Discount' },
        { key: 'expiry_date', value: 'Valid Upto' },
        { key: 'category', value: 'Module' },
        { key: 'status', value: 'Status' },
        { key: 'start_date', value: 'Created On' },
        { key: 'Coupon_Validity', value: 'Promo Validity' },
        { key: 'action', value: 'Action' },
    ];

    ngOnInit() {
        this.regConfig = this.fb.group({
            promo_code: new FormControl('', [Validators.maxLength(20)]),
            category: new FormControl(''),
        });
        this.getPromoCodeList();
        this.settingService.promoCodeUpdateData.next({});
    }

    getPromoCodeList(){
        this.noData=true;
        this.respData=[];
        this.subSunk.sink = this.apiHandlerService.apiHandler('listPromocode', 'post', {}, {},
            {
                "promo_code": this.regConfig.value.promo_code || "",
                "category": this.regConfig.value.category || "",
            })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
            })
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
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }
    
    download(type: SupportedExtensions, orientation?: string) {
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `promoCode_list`).subscribe();
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    onSearchSubmit() {
        this.getPromoCodeList();
    }

    onReset() {
        this.regConfig.reset();
        this.regConfig.patchValue({
            category:''
        })
        this.getPromoCodeList();
    }

    findPromoExpired(expDate){
        if(expDate){
            let d1 = new Date(expDate);
            let d2 = new Date();
            if(d1 > d2)
                return true;
            else
                return false;
        }else{
            return false;
        }
    }

    displayImage(img){
        return `${baseUrl+''+img}`
    }

    updatePromo(data){
        this.settingService.promoCodeUpdateData.next(data);
        this.updatePromoCode.emit({ tabId: 'manage_promocode', data });
    }

    confirmDelete(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.deletePromocode(id);
            } 
        })
    }
    
    deletePromocode(id) {
        this.apiHandlerService.apiHandler('deletePromocode', 'POST', {}, {}, { "id": id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Record deleted successfully.");
                    this.getPromoCodeList();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops(err.message);
            }
            );
    }

   
    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.":index+1,
                "Promo Code": response.promo_code,
                "Description": response.description,
                "Discount": response['discount_value'] +' '+response['discount_type'],
                "Valid Upto": response.expiry_date,
                "Module": response.category,
                "Status": response.status== 1?'Active':'In Active',
                "Created On": response.start_date,
                "Promo Validity":!this.findPromoExpired(response['expiry_date'])?'Validity Expired':'Valid'
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
        ];
        this.utility.exportToExcel(
            fileToExport,
            'B2C Promocode',
            columnWidths
        );
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
