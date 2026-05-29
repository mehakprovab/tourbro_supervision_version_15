import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';

@Component({
  selector: 'app-manage-agent-new-listing',
  templateUrl: './manage-agent-new-listing.component.html',
  styleUrls: ['./manage-agent-new-listing.component.scss']
})
export class ManageAgentNewListingComponent implements OnInit {

   @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "b2cUsers_list";
    test: boolean;
    supplier_type:any;
    constructor(
           private activatedRoute: ActivatedRoute,
    ) { }

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
