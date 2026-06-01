import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferCrsService } from '../../transfer-crs.service';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
const log = new Logger('transfer-crs/TransferVehiclesComponent');

@Component({
  selector: 'app-vehicles-type',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class TransferVehiclesComponent implements OnInit {

  @ViewChild('tabs', { static: true })
tabs!: NgbNav;
  activeIdString: string = 'list_vehicles';

  transferTypeData: any;

  constructor(
     private route: Router,
    private router: ActivatedRoute,
    private transferCrsService: TransferCrsService
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
     if(e.nextId === 'list_vehicles'){
      this.route.navigate([], { queryParams: {}, replaceUrl: true });
    } else {
      this.transferCrsService.transferUpdateData.next([]);
    }
  }

  triggerTab(data: any) {
    // if (data.hotel_type)
    // this.transferTypeData = data.hotel_type;
    this.tabs.select(data.tabId);
  }

}
