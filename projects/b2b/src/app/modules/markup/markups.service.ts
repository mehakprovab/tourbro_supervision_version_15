import { Injectable,OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class MarkupsService implements OnDestroy {

  constructor(
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService
  ) { }

  fetchMarkupReport(): Observable<any> {
    return this.apiHandlerService.apiHandler('markupReport', 'post', {}, {}, {})
        .pipe(
            map(resp => {
                if (resp.Status)
                    return {
                        statusCode: 200,
                        data: resp.data || [],
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
        );
}
ngOnDestroy() { }

  



}
