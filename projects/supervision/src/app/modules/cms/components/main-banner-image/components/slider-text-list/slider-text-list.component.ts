import { Component, EventEmitter, OnInit, Output,OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { environment } from '../../../../../../../environments/environment';

const baseUrl = environment.baseUrl;

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-slider-text-list',
  templateUrl: './slider-text-list.component.html',
  styleUrls: ['./slider-text-list.component.scss']
})
export class SliderTextListComponent implements OnInit,OnDestroy {

    @Output() activateTab = new EventEmitter<any>();
    private subSunk = new SubSink();
    logoBankUri = baseUrl;
    moduleList: Array<any> = [];
    pageSize = 100;
    page = 1;
    collectionSize: number = 100;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'title', value: 'Title' },
        { key: 'description', value: 'Description' },
        { key: 'status', value: 'Status' },
        { key: 'created_at', value: 'Created On' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    
    constructor(
        private cmsService: CmsService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService:ApiHandlerService
    ) { }

    ngOnInit() {
        this.getSliderSettingList();
        this.getModuleList();
    }
    getModuleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getModuleTypes', 'post', '', '').subscribe(res => {
            this.moduleList =   res.data;

        });
    }
    getSliderSettingList() {
        this.respData=[];
        this.noData=true;
        let data = {
            type: "TextContent",
            data_source: "b2b"
        }
        this.subSunk.sink = this.cmsService.fetchSliderList(data)
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
            });
    }


    updateSlider(data) {
        this.cmsService.toUpdateData.next(data);
        this.activateTab.emit({ tabId: 'add_update_slider_text', data });
    }

    onStatusChange(data) {
        console.log(data);
        this.subSunk.sink = this.cmsService.updateSliderListStatus(
            { "status": data.status == 1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Slider status changed successfully.");
                    this.getSliderSettingList();
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
                case 'title': return this.utility.compare('' + a.module.toLocaleLowerCase(), '' + b.module.toLocaleLowerCase(), isAsc);
                case 'created_at': return this.utility.compare('' + a.created_at.toLocaleLowerCase(), '' + b.created_at.toLocaleLowerCase(), isAsc);

                default: return 0;
            }
        });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                module: objData.module,
                created_at: objData.created_at,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

    }

    confirmDelete(id) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.deleteSliderText(id);
            }
        })
    }
    
    deleteSliderText(id) {
        this.subSunk.sink = this.cmsService.deleteSliderContent({ "id": id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("Record deleted successfully.");
                    this.getSliderSettingList();
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
