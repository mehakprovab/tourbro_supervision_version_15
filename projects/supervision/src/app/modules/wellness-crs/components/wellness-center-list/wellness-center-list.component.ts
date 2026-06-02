import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-wellness-center-list',
  templateUrl: './wellness-center-list.component.html',
  styleUrls: ['./wellness-center-list.component.scss']
})
export class WellnessCenterListComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbNav;
activeIdString = 'list_wellness';

selected: any;
wellnessData: any;

constructor(private wellnessCrsService: WellnessCrsService, private route: ActivatedRoute, private router: Router) { }

onTabSelected(event: any) {
  this.activeIdString = event.nextId;
  this.router.navigate([], {
      queryParams: {
        tab: event.nextId
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
        this.wellnessCrsService.getEditData.next('');
}

triggerTab(data: any) {
  console.log("data",data)
  this.activeIdString = 'add_wellness';
 this.router.navigate([], {
      queryParams: {
        tab: 'add_wellness'
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
this.wellnessData = data.wellness;
      this.selected = data.wellnessTrigger;

    // this.tabs.select(data.tabId)

}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      if (params['tab']) {
        this.activeIdString = params['tab'];
      }

    });
  }
}
