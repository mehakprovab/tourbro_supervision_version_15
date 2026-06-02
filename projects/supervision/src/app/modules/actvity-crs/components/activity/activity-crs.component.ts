import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { ActivityCrsService } from '../../activity-crs.service';

const log = new Logger('activity-crs/ActivityCRSComponent');
const LIST_TAB = 'list_activitycrs_list';
const ADD_TAB = 'add_activitycrs';

@Component({
  selector: 'app-activity-crs',
  templateUrl: './activity-crs.component.html',
  styleUrls: ['./activity-crs.component.scss']
})
export class ActivityCRSComponent implements OnInit {

  @ViewChild('tabs', { static: true })
  tabs!: NgbNav;
  activeIdString: string = LIST_TAB;
  transferTypeData: any;

  constructor(private router: ActivatedRoute,
    private route: Router,
    private activityCRSService: ActivityCrsService
   ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(data=>{
      this.activeIdString = data.tab === ADD_TAB ? ADD_TAB : LIST_TAB;
    })
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
     if(e.nextId === LIST_TAB){
      this.activityCRSService.getActivityUpdateData.next([]);
      this.route.navigate([], { queryParams: {}, replaceUrl: true });
    }
     else if(e.nextId === ADD_TAB){
      this.route.navigate([], { queryParams: {tab: ADD_TAB}, replaceUrl: true });
    }
    
    else {
      this.activityCRSService.getActivityUpdateData.next([]);
    }
    
    // this.activeIdString = e.nextId;
    //  this.tabs.select(e.nextId);
  }

  triggerTab(data: any) {
    // if (data.hotel_type)
    // this.transferTypeData = data.hotel_type;

    const tabId = data && data.tabId === ADD_TAB ? ADD_TAB : LIST_TAB;
    this.tabs.select(tabId);
  }

}
