import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('activity-crs/ActivityCountryComponent');
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-activity-country',
    templateUrl:'./activity-country.component.html',
    styleUrls: ['./activity-country.component.scss']
})

export class ActivityCountryComponent implements OnInit {


  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeIdString: string = 'list_activity_country';
  transferTypeData: any;

  constructor(
    private router: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(data=>{
      console.log(data);
      this.activeIdString = data.tab;
    })
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
    if(e.nextId === 'list_activity_country'){
      this.route.navigate(['/activity/activity-country'], { queryParams: {}, replaceUrl: true });
    } 
  }

  triggerTab(data: any) {
    this.tabs.select(data.tabId);
  }

}