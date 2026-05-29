import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-b2-b-active',
    templateUrl: './b2-b-active.component.html',
    styleUrls: ['./b2-b-active.component.scss']
})
export class B2BActiveComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "b2cUsers_list";
    test: boolean;
    supplier_type:any;
    constructor(  private activatedRoute: ActivatedRoute,) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.supplier_type = params['supplier_type'];
        });
    }

    beforeChange(e) {
    }

    triggerTab(data: any) {
        if (data) {
            this.tabs.select(data.tabId);
        }
    }

}
