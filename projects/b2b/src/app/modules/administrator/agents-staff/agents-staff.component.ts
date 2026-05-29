import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministratorService } from '../administrator.service';

@Component({
    selector: 'app-agents-staff',
    templateUrl: './agents-staff.component.html',
    styleUrls: ['./agents-staff.component.scss']
})
export class AgentsStaffComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbNavModule;
    activeIdString = "subagent_list";
    test:boolean;
    constructor(
        private route: ActivatedRoute,
        private administratorService: AdministratorService,
    ) { }

    ngOnInit() {
    }

    beforeChange(e) {
    }

    triggerTab(data: any) {
        if (data) {
            this.tabs.select(data.tabId);
        }

    }

}
