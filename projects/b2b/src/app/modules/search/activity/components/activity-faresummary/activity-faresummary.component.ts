import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ActivitiesService } from '../../activities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-faresummary',
  templateUrl: './activity-faresummary.component.html',
  styleUrls: ['./activity-faresummary.component.scss']
})
export class ActivityFaresummaryComponent implements OnInit {
  @Input() noOfTravellers:any;
  @Input() blockedActivity:any;
  @Input() grandTotal: any;
  @Input() convienienceFee: any;
  protected subs = new SubSink();
  promocode:any;
  discount_value:number= 0.00;
  currentUrl: any;
  showLable: boolean = false;

  constructor(
    private activityService: ActivitiesService,
    private cdRef:ChangeDetectorRef,
    private router:Router
  ) { 
    this.currentUrl = this.router.url;
    console.log("currentUrl",this.currentUrl)
    const currentURL = this.currentUrl.includes('/activity-confirm');
    if (currentURL) {
      this.showLable = true;
    } else {
      this.showLable = false;
    }
  }

  ngOnInit(): void {
    console.log("noOfTravellers",this.noOfTravellers)
    console.log("blockedActivity",this.blockedActivity)
    this.subs.sink = this.activityService.activityPromocode.subscribe(res => {
      if (res && Object.keys(res).length > 0) {
          this.promocode = res['promocode'];
          if (this.promocode && this.promocode!="") {
              if (this.promocode.discount_type == "percentage") {
                  let amount: number
                  amount = (this.promocode.discount_value / 100);
                  this.discount_value = this.blockedActivity.Price.TotalDisplayFare * amount;
              }
              if (this.promocode.discount_type == "plus") {
                  this.discount_value = this.promocode.discount_value;
              }
          }
          else {
              this.discount_value = 0;
          }

      }
      this.cdRef.detectChanges();
  });
  }

}

