import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
  b2cUserUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  supplierUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  b2bUserUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  staffUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private httpClient: HttpClient
    ) { }


    fetchTitleList(): Observable<any> {
        return this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {})
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

    getUserTypeList(): Observable<any> {
        return this.apiHandlerService.apiHandler('userTypeList', 'post', {}, {})
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

        addSupplier(data): Observable<any> {
        return this.apiHandlerService.apiHandler('crateSupplier', 'post', {}, {}, data)
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
    addAgent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('addAgentGroup', 'post', {}, {}, data)
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
    addUsers(data): Observable<any> {
        return this.apiHandlerService.apiHandler('addUser', 'post', {}, {}, data)
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
    updateSupplier(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateSuppliers', 'post', {}, {}, data)
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
    updateUsers(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateUser', 'post', {}, {}, data)
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

    ngOnDestroy() { }
}
