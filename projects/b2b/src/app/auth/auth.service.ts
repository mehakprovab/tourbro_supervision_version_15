import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, fromEvent, merge, of, throwError } from 'rxjs';
import { catchError, debounceTime, map, shareReplay } from 'rxjs/operators';
import { ApiHandlerService } from '../core/api-handlers';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { untilDestroyed } from '../core/services';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
    private currentUserSubject: BehaviorSubject<User>;
    public b2bUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public currentUserPreviliges: BehaviorSubject<any>;
    registerId = new BehaviorSubject<any>('');
    privillegs = new BehaviorSubject<any>(undefined);
    public token: any = '';
    private subSunk = new SubSink();
    validateData: any;
    activitySubscription: Subscription;
    private inactivityTimeout: any;
    private tokenRefreshInterval: any;
    private readonly INACTIVITY_LIMIT =  60 * 60 * 1000;
    public manageDomainRes = new BehaviorSubject<any>([]);
    public manageDomainRes$ = this.manageDomainRes.asObservable();
    public selectedSuppliers = new BehaviorSubject<any>([]);
    public toggleSidebar = new BehaviorSubject<any>(false);
    constructor(
        private router: Router,
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')) || {});
        this.b2bUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')) || {});
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserPreviliges = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('userPrevilige')));
        this.trackUserActivity();
        this.initAuth();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

      /**
     * Track user activity across mouse movement, clicks, and key presses.
     * Reset inactivity timeout on any user interaction.
     */
      private trackUserActivity() {
        const activityEvents = merge(
            fromEvent(window, 'mousemove'),
            fromEvent(window, 'mousedown'),
            fromEvent(window, 'click'),
            fromEvent(window, 'scroll'),
            fromEvent(window, 'keypress')
        );

        this.activitySubscription = activityEvents.pipe(debounceTime(500)).subscribe(() => {
            this.resetInactivityTimeout();
        });

        this.resetInactivityTimeout(); // Initialize the inactivity timer when the app starts
    }

    private initAuth(): void {
        this.refreshTokenNow(); // 🔹 Immediately refresh token after page reload
        this.startTokenRefresh(); // 🔹 Restart the refresh token interval
        this.startInactivityTimer(); // 🔹 Track user inactivity
      }

    /**
     * Reset the inactivity timeout, logging out the user if no activity occurs within the limit.
     */
    private resetInactivityTimeout() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }

        this.inactivityTimeout = setTimeout(() => {
            this.logout(); // Log out user after inactivity
        }, this.INACTIVITY_LIMIT);
    }


    onActivate(email): Observable<any> {
        return this.apiHandlerService.apiHandler('agentActivate', 'post', '', '', { email }).pipe(map(res => res));
    }

    onLogin(username: string, password: string, uuid: string): Observable<any> {
        return this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
            email: username,
            password: password,
            uuid: uuid
        }).pipe(
            map((res) => {
                if (res['statusCode']) {
                    this.validateData = res['data'];
                    
                    // Save initial login data in session storage
                    // sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
                    sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                    // this.currentUserSubject.next(res['data']);
                    // this.getPreviligesForUser(res['data']['id']);
    
                    /* BOF Added for refresh token concept */
                    // Clear any existing interval to prevent duplicates
                    if (this.token) {
                        clearInterval(this.token);
                    }
    
                    // Calculate dynamic interval or use fallback (11 minutes)
                    const refreshInterval = (res['data']['JwtexpiresInSeconds'] - 10) * 1000 || 660000;
    
                    // this.token = setInterval(() => {
                    //     const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
                    //     if (!currentUser.access_token) {
                    //         // Stop the interval if the token is missing
                    //         clearInterval(this.token);
                    //     } else {
                    //         // Refresh token API call
                    //         this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
                    //             token: currentUser['access_token']
                    //         })
                    //             .pipe(
                    //                 map((refreshRes) => {
                    //                     if (refreshRes.data) {
                    //                         // Update session storage with new token data
                    //                         sessionStorage.setItem('currentUser', JSON.stringify(refreshRes['data']));
                    //                         sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                    //                         this.currentUserSubject.next(refreshRes['data']);
                    //                         this.getPreviligesForUser(refreshRes['data']['id']);
                    //                     }
                    //                 }),
                    //                 catchError((err) => {
                    //                     console.error('Error refreshing token:', err);
                    //                     clearInterval(this.token); // Stop interval on error
                    //                     return of(err);
                    //                 })
                    //             )
                    //             .subscribe();
                    //     }
                    // }, 66000);
                    /* EOF Added for refresh token concept */
                    clearInterval(this.tokenRefreshInterval);
                    clearTimeout(this.inactivityTimeout); 
                    this.startTokenRefresh(); // 🔹 Restart token refresh after login
                }
    
                return res;
            }),
            catchError((err) => {
                console.error('Error during login:', err);
                return of(err);
            })
        );
    }    

    getPreviligesForUser(id) {
        const noPrevilage = [
            {
                id: 0,
                user_type: 2,
                user_id: JSON.parse(sessionStorage.getItem('currentUser')).id,
                p_no: 0,
                description: '',
                url: '',
                parent_key: null,
                source: 'B2B'
            }
        ];
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegedUser', 'post', {}, {}, { user_id: id }).subscribe((resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                if (resp.data.length >= 1 || currentUser.auth_role_id == 2) {
                    this.privillegs.next(resp.data);
                    localStorage.setItem('userPrevilige', JSON.stringify(resp.data));
                } else {
                    this.privillegs.next(noPrevilage);
                    localStorage.setItem('userPrevilige', JSON.stringify(noPrevilage));
                }
            }
        });
    }

    validateOTP(login_id:string,otp: string): Observable<any> {
        return this.apiHandlerService.apiHandler('verifyOtp', 'POST', '', '', {
            user_id:login_id,
            otp: otp
        }).pipe(map(res => {
             this.setResponse(this.validateData);
            return res;
        }));
      }

    // setResponse(validateData) {
    //     sessionStorage.setItem('b2cUser', JSON.stringify(validateData));
    //     this.currentUserSubject.next(validateData);

    //     /* BOF Added for refresh token concept */
    //     sessionStorage.setItem('currentUser', JSON.stringify(validateData));
    //     this.currentUserSubject.next(validateData);
    //     this.getPreviligesForUser(validateData['id']);
    //     sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
    //     const intervalTime = (validateData['JwtexpiresInSeconds'] - 10) * 1000 || 660000;
    //     this.token = setInterval(() => {
            
    //         const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    //         if (!currentUser.hasOwnProperty('access_token')) {
    //             clearInterval(this.token);
    //         } else {
    //             this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
    //                 token: currentUser['access_token']
    //             })
    //                 .pipe(
    //                     map((res) => {
    //                         sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
    //                         sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
    //                         this.currentUserSubject.next(res['data']);
    //                         this.getPreviligesForUser(res['data']['id']);
    //                     }),
    //                     catchError((err) => {
    //                         console.error('Error refreshing token:', err);
    //                         clearInterval(this.token); // Stop interval on error
    //                         return of(err);
    //                     })
    //                 )
    //                 .subscribe();
    //         }
    //     }, 66000);  // validateData['JwtexpiresInSeconds'] - 10);
    //     /* EOF Added for refresh token concept */
    // }
    setResponse(validateData) {
        sessionStorage.setItem('b2cUser', JSON.stringify(validateData));
        this.currentUserSubject.next(validateData);
    
        sessionStorage.setItem('currentUser', JSON.stringify(validateData));
        this.currentUserSubject.next(validateData);
        this.getPreviligesForUser(validateData['id']);
        sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
    
        const sessionTimeout = 20 * 60 * 1000; // 20 minutes
        let lastActivityTime = new Date().getTime();
    
        // Function to refresh token
        // const refreshToken = () => {
        //     const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
        //     if (!currentUser.access_token) {
        //         clearInterval(this.token);
        //     } else {
        //         this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
        //             token: currentUser['access_token']
        //         })
        //             .pipe(
        //                 map((res) => {
        //                     sessionStorage.setItem('currentUser', JSON.stringify(res['data']));
        //                     sessionStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
        //                     this.currentUserSubject.next(res['data']);
        //                     this.getPreviligesForUser(res['data']['id']);
        //                 }),
        //                 catchError((err) => {
        //                     console.error('Error refreshing token:', err);
        //                     clearInterval(this.token);
        //                     return of(err);
        //                 })
        //             )
        //             .subscribe();
        //     }
        // };
    
        // Reset session timer on user activity
        // const resetSessionTimer = () => {
        //     lastActivityTime = new Date().getTime();
        // };
    
        // // Monitor user activity (mouse movement, keyboard events, scrolling)
        // window.addEventListener('mousemove', resetSessionTimer);
        // window.addEventListener('keypress', resetSessionTimer);
        // window.addEventListener('scroll', resetSessionTimer);
        // window.addEventListener('click', resetSessionTimer);
    
        // Check every 1 minute if the user is inactive
        // this.token = setInterval(() => {
        //     const currentTime = new Date().getTime();
        //     if (currentTime - lastActivityTime > sessionTimeout) {
        //         console.warn('Session expired due to inactivity.');
        //         clearInterval(this.token);
        //         sessionStorage.clear();
        //         this.currentUserSubject.next(null);
        //         this.router.navigate(['/login']); // Redirect to login page
        //     } else {
        //         this.startTokenRefresh(); // Refresh token if user is active
        //     }
        // }, 600000); // 10 minutes

        clearInterval(this.tokenRefreshInterval);
        clearTimeout(this.inactivityTimeout);

        this.startTokenRefresh(); // 🔹 Restart token refresh after login
    }

    private refreshTokenNow(): void {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
        if (!currentUser.hasOwnProperty('access_token')) {
          console.log("🔴 No user token found, skipping refresh.");
          return;
        }
    
        console.log("🔄 Immediately refreshing token...");
        this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
          token: currentUser['access_token']
        }).pipe(untilDestroyed(this)).subscribe(resp => {
          if (resp.data && resp.data.access_token) {
            currentUser['access_token'] = resp['data']['access_token'];
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.currentUserSubject.next(currentUser);
            console.log("✅ Token refreshed successfully!");
          } else {
            console.error("❌ Failed to refresh token.");
          }
        });
      }

       private startTokenRefresh(): void {
        clearInterval(this.tokenRefreshInterval);
        this.tokenRefreshInterval = setInterval(() => {
          this.refreshTokenNow();
        }, 66000); // 🔹 Refresh token every 66 seconds
      }
    
      private startInactivityTimer() {
        this.resetInactivityTimer();
        ['mousemove', 'keydown', 'click'].forEach(event =>
          document.addEventListener(event, () => this.resetInactivityTimer())
        );
      }
    
      private resetInactivityTimer() {
        clearTimeout(this.inactivityTimeout);
        this.inactivityTimeout = setTimeout(() => {
          this.logout();
        }, 60 * 60 * 1000); // 🔹 Auto-logout after 30 minutes of inactivity
      }
    
    logout() {

        clearInterval(this.tokenRefreshInterval);
        clearTimeout(this.inactivityTimeout);
        sessionStorage.clear();
        localStorage.clear();
        this.currentUserSubject.next(null);
        clearTimeout(this.inactivityTimeout);
        // clearInterval(this.token);
        sessionStorage.clear();
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('SelectedMenu');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    getStaticContent(title): Observable<any> {
        return this.apiHandlerService.apiHandler('staticPageContentsList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    airlineHotelPartnersList(title): Observable<any> {
        return this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    getSliderList(title): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    getDomainInfo(title): Observable<any> {
        return this.apiHandlerService.apiHandler('ManageDomain', 'POST', '', '', title).pipe(map(res => {
            return res;
        }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                }
                return of(err);
            }));
    }
    getAirline(title): Observable<any> {
        return this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                }
                return of(err);
            }));
    }
    fetch(data?: any): Observable<any> {
        console.log("data",data)
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
      }

    forgotPassword(req): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'POST', '', '', req).pipe(map(res => {

            return res;
        }));
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
    fetchTitleList(): Observable<any> {
        console.log("innn")
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
   
    generateOTP(otp: any): Observable<any> {
        return this.apiHandlerService.apiHandler('generateOTP', 'post', {}, {}, otp).pipe(
          map(res => {
            if (res) {
            //   this.currentUserSubject.subscribe(res => {
            //     sessionStorage.setItem('b2cUser', JSON.stringify(res));
            //   });
              Number(res['data']);
    
              return res;
            } else {
              return throwError('Invalid response');
            }
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      }  
      validateOtp(otp: any): Observable<any> {
        return this.apiHandlerService.apiHandler('validateOTP', 'post', {}, {}, otp).pipe(
          map(res => {
            if (res) {
            //   this.currentUserSubject.subscribe(res => {
            //     sessionStorage.setItem('b2cUser', JSON.stringify(res));
            //   });
               Number(res['data']['JwtexpiresInSeconds']) + 24*60*60*1000;
    
              return res;
            } else {
              return throwError('Invalid response');
            }
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      }  
    ngOnDestroy(): void {
        clearTimeout(this.inactivityTimeout);
        clearInterval(this.token); // Ensure interval is cleared on destroy
        this.subSunk.unsubscribe(); // Unsubscribe from subscriptions
    }
}
