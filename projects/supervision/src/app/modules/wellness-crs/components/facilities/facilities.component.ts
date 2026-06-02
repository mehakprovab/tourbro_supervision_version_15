import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
@ViewChild('tabs', { static: true }) public tabs: NgbNav;
activeIdString = 'list_facilities';

selected: any;
wellnessData: any;

constructor(
  private route: Router,
  private activatedRoute: ActivatedRoute,
  private weellnessCrsService: WellnessCrsService
) { }

onTabSelected(event: any) {
  this.activeIdString = event.nextId;
  this.route.navigate([], {
      queryParams: {
        tab: event.nextId
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  this.weellnessCrsService.getEditData.next('');
}

triggerTab(data: any) {
  this.activeIdString = 'add_facilities';
  this.route.navigate([], {
      queryParams: {
        tab: 'add_facilities'
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });


}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {

      if (params['tab']) {
        this.activeIdString = params['tab'];
      }

    });
  }

}
