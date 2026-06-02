import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-therapy-type',
  templateUrl: './therapy-type.component.html',
  styleUrls: ['./therapy-type.component.scss']
})
export class TherapyTypeComponent implements OnInit {
 @ViewChild('tabs', { static: true }) public tabs: NgbNav;
activeIdString = 'list_therapy';

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
  this.activeIdString = 'add_therapy';
 this.router.navigate([], {
      queryParams: {
        tab: 'add_therapy'
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
