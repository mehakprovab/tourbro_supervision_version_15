import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment';
import { SubSink } from 'subsink';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-best-time-to-travel',
  templateUrl: './best-time-to-travel.component.html',
  styleUrls: ['./best-time-to-travel.component.scss']
})
export class BestTimeToTravelComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "staticpage_list";
  constructor() { }

  ngOnInit() {
  }
  beforeChange(e){
      
  }

  triggerTab(data: any) {
    if (data) {
        this.tabs.select(data.tabId);
    }
}
}
