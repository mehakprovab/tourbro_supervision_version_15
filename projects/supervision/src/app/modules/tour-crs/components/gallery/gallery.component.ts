import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment';
import { SubSink } from 'subsink/dist/subsink';
const baseUrl = environment.baseUrl;
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    @ViewChild('tabs', { static: true })
tabs!: NgbNav;
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


