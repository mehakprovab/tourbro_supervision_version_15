import { Component, OnInit } from '@angular/core';
import { HeliCrsService } from '../../heli-crs.service';

@Component({
  selector: 'app-heli-schedules',
  templateUrl: './heli-schedules.component.html',
  styleUrls: ['./heli-schedules.component.scss']
})
export class HeliSchedulesComponent implements OnInit {
  public activeIdString: string = 'list_schedules';
  constructor(private heliCrsService: HeliCrsService) { }

  ngOnInit() {
    this.heliCrsService.tabSwitch$.subscribe(tab => {
      this.activeIdString = tab;
    });
  }
  onTabSelected(event: any) {

    // ADD TAB
    if (event.nextId === "add_schedules") {

      // CLEAR EDIT DATA
      this.heliCrsService.getEditData.next(null);

    }

  }

}
