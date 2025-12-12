import { Component, OnInit } from '@angular/core';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Router } from '@angular/router';
import { SEOService } from './seo.service';

const log = new Logger('SeoComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-seo',
    templateUrl: './seo.component.html',
    styleUrls: ['./seo.component.scss']
})
export class SeoComponent implements OnInit {
    pageSize = 6;
    page = 1;
    collectionSize: number;
    respData: object[] = [];
    isSEOListDisplayed: boolean = true;
    passData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'title', value: 'Title' },
        { key: 'keyword', value: 'Keyword' },
        { key: 'description', value: 'Description' },
        { key: 'module', value: 'Module' },
        { key: 'action', value: 'Action' }];
    noData: boolean = true;


    constructor(
        private seoService: SEOService,
        private swalService: SwalService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.fetchData();
    }

    fetchData() {
        this.seoService.fetch()
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else if (resp.statusCode == 404) {
                    this.noData = true;
                    this.swalService.alert.error();
                }
            });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterDoc = {
                title: objData.title,
                keyword: objData.keyword,
                description: objData.description,
                module: objData.module
            }
            if (Object.values(filterDoc).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

    }

    onEdit(data) {
        this.isSEOListDisplayed = false;
        this.passData = data;
    }
    getEvent(eventData) {
            this.isSEOListDisplayed = eventData || true;
    }

}
