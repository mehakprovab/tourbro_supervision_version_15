import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CredentialsI {
  // Customize received credentials here
  username: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  /**
   * Authenticate the user here
   * @returns ture if the credentials found
   */
  isLoggedin(): Observable<boolean> {
    if (sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken')) {
      return of(true);
    }
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    localStorage.clear();
    sessionStorage.clear();
    return of(true);
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): CredentialsI | null {
    return { username: `Rajesh` };
  }
}
