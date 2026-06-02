import { Injectable, OnDestroy } from "@angular/core";
import { ApiHandlerService } from "../../core/api-handlers";
import { map, shareReplay } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { untilDestroyed } from "../../core/services/until-destroyed";

@Injectable({
  providedIn: "root",
})
export class WellnessCrsService implements OnDestroy {

  constructor(
    private apiHandlerService: ApiHandlerService,
    private httpClient: HttpClient,
  ) {}

  public getEditData = new BehaviorSubject<any>('');

  fetch(data?: any): Observable<any> {
    return this.apiHandlerService
      .apiHandler(data.topic || "", "post", {}, {}, data[0] || {})
      .pipe(
        map((resp) => resp),
        shareReplay(1),
        untilDestroyed(this)
      );
  }

  create(data?: any): Observable<any> {
    return this.apiHandlerService
      .apiHandler(data.topic || "", "post", {}, {}, data[0] || {})
      .pipe(
        map((resp) => resp),
        shareReplay(1),
        untilDestroyed(this)
      );
  }

  update(data): Observable<any> {
    return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0])
        .pipe(
            map(resp => {
                return resp
            }),
            shareReplay(1),
            untilDestroyed(this),
        )
    }

  ngOnDestroy(): void {
    // required for untilDestroyed
  }

  updateRoomImage(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='addPackageImage' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }
}