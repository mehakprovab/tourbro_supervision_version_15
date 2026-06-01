import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gds-commissions',
  templateUrl: './gds-commissions.component.html',
  styleUrls: ['./gds-commissions.component.scss']
})
export class GdsCommissionsComponent implements OnInit {
    @ViewChild('tabs', { static: true })
tabs!: NgbNav;
    activeIdString = 'agent_list';
    navLinks = [
        {
            label: 'UPDATE DEFAULT COMMISSION',
            icon: '',
            component: 'default_commission'
        },
        {
            label: 'GDS COMMISSION DETAIL',
            icon: '',
            component: 'agent_detail'
        },
        {
            label: 'GDS LIST',
            icon: '',
            component: 'agent_list',
        }
    ];
    userData: any;
    hideHeader: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    onSelect(comp) {
        console.trace('onSelect() called')
        if (comp == 'History_Deposit_Request') {
            this.hideHeader = true;
        } else {
            this.hideHeader = false;
        }
    }

    beforeChange($event) {

    }

    triggerTab(data: any) {
        console.log(data);
        if (data.data)
            this.userData = data.data;
        this.tabs.select(data.tabId);
    }

}
