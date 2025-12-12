import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';
import { ActivatedRoute, Router  } from '@angular/router';
import { ActivityCrsService } from '../../activity-crs.service';

const log = new Logger('activity-crs/ActivityCRSComponent');

@Component({
  selector: 'app-activity-crs',
  templateUrl: './activity-crs.component.html',
  styleUrls: ['./activity-crs.component.scss']
})
export class ActivityCRSComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
activeIdString: string = 'list_activitycrs_list';
  transferTypeData: any;

  constructor(private router: ActivatedRoute,
    private route: Router,
    private activityCRSService: ActivityCrsService
   ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(data=>{
      console.log(data);
      // if(data.tab)
      this.activeIdString = data.tab;
      // this.tabs.select(data.tab);
    })
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
     if(e.nextId === 'list_activitycrs_list'){
      this.activityCRSService.getActivityUpdateData.next([]);
      this.route.navigate([], { queryParams: {}, replaceUrl: true });
    }
     else if(e.nextId === 'add_activitycrs'){
      this.route.navigate([], { queryParams: {tab:'add_activitycrs'}, replaceUrl: true });
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
    
    this.tabs.select(data.tabId);
  }

}
