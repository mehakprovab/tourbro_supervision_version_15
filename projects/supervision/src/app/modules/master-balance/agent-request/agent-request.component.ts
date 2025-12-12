import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-request',
  templateUrl: './agent-request.component.html',
  styleUrls: ['./agent-request.component.scss']
})
export class AgentRequestComponent implements OnInit {
    navLinks = [
        {
            label: 'BALANCE UPDATE REQUEST ',
            icon: '',
            component: 'balance_update_request',
        },
    ]

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
}
