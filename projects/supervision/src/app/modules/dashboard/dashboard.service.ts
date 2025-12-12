import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Logger } from '../../core/logger/logger.service';

const log = new Logger('DashboardService');

@Injectable({
    providedIn: 'root'
})

export class DashboardService implements OnDestroy {

    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    fetch(data: any): Observable<any> {
        return this.apiHandlerService.apiHandler( data.topic, 'post', {}, {}, data[0] || {})
            .pipe(
        map(resp => {
            log.debug(resp);
            if (resp.Status)
                return {
                    statusCode: 200,
                    data: resp.Data || [],
                    msg: resp.Message || 'OK'
                }
            else
                return {
                    statusCode: 404,
                    data: resp.Data || [],
                    msg: resp.Message || 'NOT FOUND'
                }
        }),
        shareReplay(1),
        untilDestroyed(this),
    )
    }
    ngOnDestroy() { }
}
