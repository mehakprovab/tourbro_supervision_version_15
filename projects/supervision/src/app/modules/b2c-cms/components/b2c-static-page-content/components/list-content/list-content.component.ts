import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { CmsService } from '../../../../../cms/cms.service';
import { SubSink } from 'subsink';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-list-content',
    templateUrl: './list-content.component.html',
    styleUrls: ['./list-content.component.scss']
})
export class ListContentComponent implements OnInit, OnDestroy {
    @Output() staticContentTab = new EventEmitter<any>();

    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 100;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'page_title', value: 'Page Title' },
        { key: 'page_seo_title', value: 'Page SEO Title' },
        { key: 'page_seo_keyword', value: 'Page SEO Keyword' },
        { key: 'page_seo_description', value: 'Page SEO Description' },
        { key: 'page_position', value: 'Page Position' },
        { key: 'status', value: 'Status' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];

    constructor(
        private cmsService: CmsService,
        private utility: UtilityService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.getContentList();
    }


    updateContent(data) {
        this.cmsService.StaticContent.next(data);
        this.staticContentTab.emit({ tabId: 'add_update_staticPage', data });
    }

    onStatusChange(data) {
        console.log(data);
        this.subSunk.sink = this.cmsService.updateContentListStatus(
            { "status": data.status == 1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Content status changed successfully.");
                    this.getContentList();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            }
            );
    }

    getContentList() {
        this.noData=true;
        this.respData=[];
        let data = {
            data_source: "b2c",
            module: "",
            id: ""
        }
        this.subSunk.sink = this.cmsService.getStaticContent(data).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
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

    sortData(sort: Sort) {
        console.log(sort)
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

    deleteContent(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.confirmDelete(id);
            } 
        })
    }

    confirmDelete(id) {
        this.subSunk.sink = this.cmsService.deleteStaticPageContent({ "id": id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Record deleted successfully.");
                    this.getContentList();
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops(err.message);
            }
            );
    }

    
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
