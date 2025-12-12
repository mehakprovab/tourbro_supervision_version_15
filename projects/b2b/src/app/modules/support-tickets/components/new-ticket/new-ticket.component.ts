import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss']
})
export class NewTicketComponent implements OnInit {

  
    navLinks = [
        {
            label: 'AGENT CALL BACK SUPPORT',
            icon: '',
            component: 'AGENT_CALLBACK'
        },
        {
            label: 'SENT CALL BACK SUPPORT',
            icon: '',
            component: 'SENT_CALLBACK',
        },
    ]


    constructor() { }

    ngOnInit() {
    }

    onSelect(comp) {
        console.trace('onSelect() called',comp)
       
    }

}
