import { Injectable, OnDestroy } from "@angular/core";
import { ApiHandlerService } from "../../core/api-handlers";
import { map, shareReplay } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { untilDestroyed } from "../../core/services/until-destroyed";

@Injectable({
    providedIn: "root",
})
export class HeliCrsService implements OnDestroy {

    constructor(
        private apiHandlerService: ApiHandlerService,
        private httpClient: HttpClient,
    ) { }

    // Edit Data
    public getEditData = new BehaviorSubject<any>("");
    public tabSwitch$ = new Subject<string>();
    // Fetch API
    fetch(data?: any): Observable<any> {

        return this.apiHandlerService
            .apiHandler(
                data.topic || "",
                "post",
                {},
                {},
                data[0] || {}
            )
            .pipe(
                map((resp) => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    // Create API
    create(data?: any): Observable<any> {

        return this.apiHandlerService
            .apiHandler(
                data.topic || "",
                "post",
                {},
                {},
                data[0] || {}
            )
            .pipe(
                map((resp) => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    // Update API
    update(data?: any): Observable<any> {

        return this.apiHandlerService
            .apiHandler(
                data.topic || "",
                "post",
                {},
                {},
                data[0] || {}
            )
            .pipe(
                map((resp) => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    // Image Upload API
    updateHeliImage(data?: any): Observable<any> {

        return this.apiHandlerService
            .apiHandler(
                data.topic || "",
                "post",
                {},
                {},
                data.topic == "addHeliImage"
                    ? data[0].data
                    : data[0]
            )
            .pipe(
                map((resp) => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    ngOnDestroy(): void {
        // required for untilDestroyed
    }

}