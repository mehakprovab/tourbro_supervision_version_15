import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { WellnessCrsService } from '../../wellness-crs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.scss']
})
export class TreatmentsComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbNav;
  activeIdString = 'list_treatments';
  
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
  this.activeIdString = 'add_treatments';
 this.router.navigate([], {
      queryParams: {
        tab: 'add_treatments'
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
