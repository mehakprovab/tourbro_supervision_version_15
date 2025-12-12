import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'projects/supervision/src/environments';
const log = new Logger('CurrencyConversionService');

@Injectable({
    providedIn: 'root'
})

export class CurrencyConversionService implements OnDestroy {
    constructor(
        private apiHandlerService: ApiHandlerService
    ) { }

    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateCurrencyConverison', 'post', {}, {}, data)
            .pipe(
                map(resp => {
                    if (resp.Status) {
                        return {
                            data: resp || [],
                            statusCode: 200,
                            msg: 'OK'
                        }
                    } else if (resp.Status && resp.Data.error_msg) {
                        return {
                            data: [],
                            statusCode: 404,
                            msg: 'NOT FOUND'
                        }
                    }
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    ngOnDestroy(){
    }
}