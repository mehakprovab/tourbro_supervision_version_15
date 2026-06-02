import { Component, OnInit } from '@angular/core';
import { HeliCrsService } from '../../heli-crs.service';

@Component({
  selector: 'app-heli-crs-list',
  templateUrl: './heli-crs-list.component.html',
  styleUrls: ['./heli-crs-list.component.scss']
})
export class HeliCrsListComponent implements OnInit {
  public activeIdString: string = 'list_operators';
  constructor(private heliCrsService: HeliCrsService) { }

  ngOnInit() {
    this.heliCrsService.tabSwitch$.subscribe(tab => {
      this.activeIdString = tab;
    });
  }
  onTabSelected(event: any) {

    this.activeIdString = event.nextId;

    // clear only when manually opening add tab
    if (
      event.nextId === "add_operators"
    ) {

      this.heliCrsService.getEditData.next(null);

    }


  }
}
