import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { UtilityService } from '../../core/services/utility.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService implements OnDestroy {
  isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(true);
  subagentUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  travellerUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});


  constructor(
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService
  ) { }

  fetchSubAgentList(): Observable<any> {
    const data = {};
    return this.apiHandlerService.apiHandler('subAgentList', 'post', {}, {})
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

  fetchTitleList(): Observable<any> {
    return this.apiHandlerService.apiHandler('userTitlelist', 'post', {}, {})
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

  fetchPhoneCodeList(): Observable<any> {
    return this.apiHandlerService.apiHandler('phoneCodeList', 'post', {}, {})
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

  addSubAgent(data): Observable<any> {
    return this.apiHandlerService.apiHandler('addSubAgent', 'post', {}, {}, data)
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

  updateSubAgent(data): Observable<any> {
    return this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, data)
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
              resp
              // statusCode: 404,
              // data: resp.Data || [],
              // msg: resp.Message || 'NOT FOUND'
            }
        }),
        shareReplay(1),
        untilDestroyed(this),
      );
  }

  fetchTravellersList(): Observable<any> {
    const data = {};
    return this.apiHandlerService.apiHandler('travellerManagementList', 'post', {}, {})
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

  addTraveller(data): Observable<any> {
    return this.apiHandlerService.apiHandler('addTravellerManagement', 'post', {}, {}, data)
      .pipe(
        map(resp => {
          if (resp.Status)
            return {
              statusCode: 200,
              data: resp.data || [],
              msg: resp.Message || 'OK'
            }
          else
            return resp;
        }),
        shareReplay(1),
        untilDestroyed(this),
      );
  }

  getEmailList(text): Observable<any> {
    let data = { email: text }
    return this.apiHandlerService.apiHandler('autoCompleteEmail', 'post', {}, {}, data)
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

  updateTraveller(data): Observable<any> {
    return this.apiHandlerService.apiHandler('updateTravellerManagement', 'post', {}, {}, data)
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
