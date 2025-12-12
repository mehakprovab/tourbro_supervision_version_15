import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SEOService implements OnDestroy {
    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    fetch(): Observable<any> {
        return this.apiHandlerService.apiHandler('sEO', 'post')
            .pipe(
                map(resp => {
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

    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateSEO', 'post', {}, {}, data)
            .pipe(
                map(resp => {
                    if (resp.Status && resp.Data.msg)
                        return {
                            statusCode: 200,
                            data: resp.Data || [],
                            msg: resp.Message || 'OK'
                        }
                    else if (resp.Status && resp.Data.error_msg)
                        return {
                            statusCode: 400,
                            data: [],
                            msg: resp.Message || 'BAD REQUEST'

                        }
                    else
                        return {
                            statusCode: 404,
                            data: [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    ngOnDestroy() { }
}
