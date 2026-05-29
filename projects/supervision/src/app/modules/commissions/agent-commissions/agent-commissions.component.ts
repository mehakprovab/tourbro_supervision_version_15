import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agent-commissions',
  templateUrl: './agent-commissions.component.html',
  styleUrls: ['./agent-commissions.component.scss']
})
export class AgentCommissionsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    navLinks = [
        {
            label: 'UPDATE DEFAULT COMMISSION',
            icon: '',
            component: 'default_commission'
        },
        {
            label: 'AGENT COMMISSION DETAIL',
            icon: '',
            component: 'agent_detail'
        },
        {
            label: 'AGENT LIST',
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
