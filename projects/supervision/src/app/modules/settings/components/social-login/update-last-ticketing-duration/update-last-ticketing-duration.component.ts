import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-last-ticketing-duration',
  templateUrl: './update-last-ticketing-duration.component.html',
  styleUrls: ['./update-last-ticketing-duration.component.scss']
})
export class UpdateLastTicketingDurationComponent implements OnInit {
 @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeId = 'update';
  constructor() { }

  ngOnInit() {
  }
  triggerTab(data: any) {
    if (data) {
        this.tabs.select(data.tabId);
    }

}
}
