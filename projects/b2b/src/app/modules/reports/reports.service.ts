import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/b2b/src/app/core/services/until-destroyed';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';

@Injectable({
    providedIn: 'root'
})

export class ReportService implements OnDestroy {
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService
    ) { }

    fetchAgentAccountLedger(): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id'] };
        return this.apiHandlerService.apiHandler('agentAccountLedger', 'post', {}, {}, data)
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

    fetchDailySalesReport(): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['user_id'], offset: 0, limit: 10 };
        return this.apiHandlerService.apiHandler('dailySalesReport', 'post', {}, {}, data)
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
            );
    }

    fetchTransactionLogs(): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id'], offset: 0, user_type: 3, limit: 10 };
        return this.apiHandlerService.apiHandler('transactionLogs', 'post', {}, {}, data)
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

    fetchBookingReports(searchForm): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id']};
       
        Object.assign(data, searchForm)
        return this.apiHandlerService.apiHandler('flightReports', 'post', {}, {}, data)
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
                            data: resp.data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    fetchHotelBookingReports(searchForm): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id']};
        
        Object.assign(data, searchForm)
        return this.apiHandlerService.apiHandler('hotelReports', 'post', {}, {}, data)
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
                            data: resp.data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }
    fetchActivityBookingReports(searchForm): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id']};
        
        Object.assign(data, searchForm)
        return this.apiHandlerService.apiHandler('activityReports', 'post', {}, {}, data)
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
                            data: resp.data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }
    fetchCarBookingReports(searchForm): Observable<any> {
        const data = { agent_id: this.utility.readStorage('currentUser', sessionStorage)['id']};
     
        Object.assign(data, searchForm)
        return this.apiHandlerService.apiHandler('carReports', 'post', {}, {}, data)
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
                            data: resp.data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }


    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    if (resp.Status && (resp.Data.msg || resp.Data.data))
                        return {
                            statusCode: 200,
                            data: resp.Data || [],
                            msg: resp.Data.msg || resp.Message || ''
                        }
                    else if (resp.Status && resp.Data.error_msg)
                        return {
                            statusCode: 400,
                            data: [],
                            msg: resp.Data.error_msg || resp.Message || 'BAD REQUEST'

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

    checkWalletBalance(appReference): Observable<any> {        
        return this.apiHandlerService.apiHandler('checkWalletBalance', 'POST', '', '',{ app_reference: appReference } ).pipe(res => {
            catchError((error) => {
                let errorMessage = '';
                console.log("error")
                if (error.error instanceof ErrorEvent) {
                  // client-side error
                  errorMessage = `Error: ${error.error.message}`;
       
                } else {
                  // server-side error 
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                return throwError(errorMessage);   
              })
            return res;
        });
    }

    copy(appReference){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = appReference;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    ngOnDestroy() { }

}
