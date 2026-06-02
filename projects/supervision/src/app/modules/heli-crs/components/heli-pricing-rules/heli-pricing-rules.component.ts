import { Component, OnInit } from '@angular/core';
import { HeliCrsService } from '../../heli-crs.service';

@Component({
  selector: 'app-heli-pricing-rules',
  templateUrl: './heli-pricing-rules.component.html',
  styleUrls: ['./heli-pricing-rules.component.scss']
})
export class HeliPricingRulesComponent implements OnInit {

  public activeIdString: string = 'list_pricing_rules';
  constructor(private heliCrsService: HeliCrsService) { }

  ngOnInit() {
    this.heliCrsService.tabSwitch$.subscribe(tab => {
      this.activeIdString = tab;
    });
  }
  onTabSelected(event: any) {

    // ADD TAB
    if (event.nextId === "add_pricing_rules") {

      // CLEAR EDIT DATA
      this.heliCrsService.getEditData.next(null);

    }

  }

}

