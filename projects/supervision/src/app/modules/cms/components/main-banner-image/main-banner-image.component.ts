import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-banner-image',
  templateUrl: './main-banner-image.component.html',
  styleUrls: ['./main-banner-image.component.scss']
})
export class MainBannerImageComponent implements OnInit {

    @ViewChild('tabs', { static: true })
tabs!: NgbNav;
    activeIdString = "sliderimage_list";
    test: boolean;
    constructor() { }

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
