import { Injectable } from "@angular/core";  
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";  
import { Observable } from "rxjs";  
import { AuthService } from "./auth.service";
  
@Injectable({ providedIn: 'root' }) 
export class UserPermissionResolve implements Resolve<any> {  
  constructor(private authService: AuthService) {}  
  
  resolve(route: ActivatedRouteSnapshot): Observable<any> {  
    return this.authService.getUserPermissions();
  }  
}