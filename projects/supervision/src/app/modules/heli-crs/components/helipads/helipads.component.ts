import { Component, OnInit } from '@angular/core';
import { HeliCrsService } from '../../heli-crs.service';

@Component({
  selector: 'app-helipads',
  templateUrl: './helipads.component.html',
  styleUrls: ['./helipads.component.scss']
})
export class HelipadsComponent implements OnInit {
  public activeIdString: string = 'list_helipads';
  constructor(private heliCrsService: HeliCrsService) { }

  ngOnInit() {
    this.heliCrsService.tabSwitch$.subscribe(tab => {
      this.activeIdString = tab;
    });
  }
  onTabSelected(event: any) {

    // ADD TAB
    if (event.nextId === "add_helipads") {

      // CLEAR EDIT DATA
      this.heliCrsService.getEditData.next(null);

    }

  }

}
