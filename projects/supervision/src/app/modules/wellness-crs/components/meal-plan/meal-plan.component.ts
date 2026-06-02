import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss']
})
export class MealPlanComponent implements OnInit {
@ViewChild('tabs', { static: true }) public tabs: NgbNav;
activeIdString = 'list_meal-plan';

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
  this.activeIdString = 'add_meal-plan';
 this.route.navigate([], {
      queryParams: {
        tab: 'add_meal-plan'
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
