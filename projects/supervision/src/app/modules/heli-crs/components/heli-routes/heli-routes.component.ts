import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { HeliCrsService } from '../../heli-crs.service';

@Component({
  selector: 'app-heli-routes',
  templateUrl: './heli-routes.component.html',
  styleUrls: ['./heli-routes.component.scss']
})

export class HeliRoutesComponent
  implements OnInit, OnDestroy {

  public activeIdString: string = 'list_routes';

  private destroy$ = new Subject<void>();

  constructor(
    private heliCrsService: HeliCrsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.heliCrsService.tabSwitch$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((tab: string) => {

        this.activeIdString = tab;

        // safer
        this.cdr.markForCheck();

      });

  }

  onTabSelected(event: any) {

    if (event.nextId === "add_routes") {

      this.heliCrsService
        .getEditData
        .next(null);

    }

  }

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}