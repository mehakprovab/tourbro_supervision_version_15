import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { ApiHandlerService } from '../core/api-handlers';
import { SubSink } from 'subsink';
import { untilDestroyed } from '../core/services/until-destroyed';
import { Router } from '@angular/router';

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
    public currentUser: Observable<User>;
    public currentUserPreviliges: BehaviorSubject<any>;
    public token: any = '';
    private subSunk = new SubSink();
    subscriptions: Subscription;
    navigationData = new BehaviorSubject<any>([]);
    userId:any;
    private inactivityTimeout: any;
private tokenRefreshInterval: any;
    constructor(
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentSupervisionUser')));
        this.currentUserPreviliges = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('userPrevilige')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.initAuth();

    }

    private initAuth(): void {
        this.refreshTokenNow(); // 🔹 Immediately refresh token after page reload
        this.startTokenRefresh(); // 🔹 Restart the refresh token interval
        this.startInactivityTimer(); // 🔹 Track user inactivity
      }
    getUserPermissions() {
        return this.apiHandlerService.apiHandler('getPrivilegedUser', 'POST', '', '', {
            'user_id': JSON.parse(sessionStorage.getItem('currentSupervisionUser'))['id']
        }).pipe(delay(100));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    validateOTP(login_id:string,otp: string): Observable<any> {
        return this.apiHandlerService.apiHandler('validateOTP', 'POST', '', '', {
            user_id:login_id,
            otp: otp
        }).pipe(map(res => {
             this.setResponse(this.userId);
            return res;
        }));
    }
    setResponse(res){
        if (res) {
            console.log("res",res)
            // this.removeBookingRequest();
            sessionStorage.setItem('currentSupervisionUser', JSON.stringify(res));
             this.currentUserSubject.next(res);
             this.getPreviligesForUser(res.id);
             localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));

             clearInterval(this.tokenRefreshInterval);
             clearTimeout(this.inactivityTimeout); 
             this.startTokenRefresh(); // 🔹 Restart token refresh after login
         }

    }
    onLogin(username: string, password: string,user_type:string): Observable<any> {
        return this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
            email: username,
            password: password,
            user_type:user_type
        }).pipe(map(res => {
            if (res['statusCode'] == 200 && res['data']['access_token'] != undefined) {
                if(res['data']['auth_role_id'] !== 6 || res['data']['auth_role_id'] !== 7){
                    sessionStorage.setItem('currentSupervisionUser', JSON.stringify(res['data']));
                    localStorage.setItem("currentDomainUser", JSON.stringify(res['data']));
                    this.currentUserSubject.next(res['data']);
                    this.getPreviligesForUser(res['data']['id']);
                    // this.token = setInterval(() => {
                    //     console.log("setInterval refresh token");
                    //     let currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
                    //     if (!currentUser.hasOwnProperty('access_token')) {
                    //         console.log("clear refresh token");
                    //          clearInterval(this.token);
                    //     }
                    //     else {
                    //         console.log("refresh token");
                    //         this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
                    //             token: currentUser['access_token']
                    //         }).pipe(
                    //             untilDestroyed(this)
                    //         ).subscribe(resp => {
                    //             sessionStorage.removeItem('currentSupervisionUser');
                    //             currentUser['access_token'] = resp['data']['access_token'];
                    //             sessionStorage.setItem('currentSupervisionUser', JSON.stringify(currentUser));
                    //             this.currentUserSubject.next(currentUser);
                    //             // return;
                    //         });
                    //     }
                    // }, 66000);


                    // this.token = setInterval(() => {
                    //     const currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
                    //     if (!currentUser.hasOwnProperty('access_token')) {
                    //         clearInterval(this.token);
                    //     }
                    //     this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
                    //         token: currentUser['access_token']
                    //     }).pipe(
                    //         map(res => {
                    //             currentUser['access_token'] = res['data']['access_token'];
                    //             sessionStorage.setItem('currentSupervisionUser', JSON.stringify(currentUser));
                    //             this.currentUserSubject.next(currentUser);
                    //         })
                    //     );
                    // }, Number(res['data']['JwtexpiresInSeconds']) + 24*60*60*1000);
                    
                    clearInterval(this.tokenRefreshInterval);
                    clearTimeout(this.inactivityTimeout);
          
                    this.startTokenRefresh(); // 🔹 Restart token refresh after login
                   
    
   
                }else{
      
                this.userId =res['data']
   
            }
        }
            return res;
        }));
    }

    private refreshTokenNow(): void {
        const currentUser = JSON.parse(sessionStorage.getItem('currentSupervisionUser')) || {};
    
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
            sessionStorage.setItem('currentSupervisionUser', JSON.stringify(currentUser));
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
          this.logoutUser();
        }, 30 * 60 * 1000); // 🔹 Auto-logout after 30 minutes of inactivity
      }
    private logoutUser() {
        console.log("User inactive for 30 minutes, logging out...");
        clearInterval(this.tokenRefreshInterval);
        clearTimeout(this.inactivityTimeout);
        sessionStorage.clear();
        // localStorage.clear();
        this.currentUserSubject.next(null);
        // Redirect to login page
        this.router.navigate(['/']);
    }
    onsupplierLogin(username: string): Observable<any> {
        return this.apiHandlerService.apiHandler('generateOTP', 'post', {}, {}, { email: username}).pipe(
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
    getPreviligesForUser(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegedUser', 'post', {}, {}, { 'user_id': id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.navigationData.next(resp.data) 
                    sessionStorage.setItem('userPrevilige', JSON.stringify(resp.data))
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentSupervisionUser');
        sessionStorage.removeItem('userPrevilige');
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}