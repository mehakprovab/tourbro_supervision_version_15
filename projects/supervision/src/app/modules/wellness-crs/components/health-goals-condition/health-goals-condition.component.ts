import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-health-goals-condition',
  templateUrl: './health-goals-condition.component.html',
  styleUrls: ['./health-goals-condition.component.scss']
})
export class HealthGoalsConditionComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbNav;
 activeIdString = 'list_health-goals';
 
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
  this.activeIdString = 'add_package-type';
 this.router.navigate([], {
      queryParams: {
        tab: 'add_package-type'
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });

}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      if (params['tab']) {
        this.activeIdString = params['tab'];
      }

    });
  }
}
