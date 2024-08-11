import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Subject, window } from "rxjs";

import { initFlowbite } from "flowbite";

import { AuthData } from "./auth-data.model";

import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/user"

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  private token;
  private authStatusListener = new Subject<boolean>();
  private userAuthenticated: boolean = false;
  private tokenTimer: any;
  private userId: string;
  public errorStatusListener = new Subject<{ error: boolean, errorMessage: string }>();

  getToken() {
    return this.token;
  }

  getAuthentication() {
    return this.userAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getErrorStatusListener() {
    return this.errorStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string, accessType: string, creatorId: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      accessType: accessType,
      creatorId: creatorId
    };
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      },
        error => {
          console.log('ere');
          this.authStatusListener.next(false);
        });
  }

  login(email: string, password: string) {
    const authData: any = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string, accessType: string, creatorId: string }>(BACKEND_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {

          this.userId = response.userId;

          console.log(response);

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          const timeNow = new Date().getTime();
          const expirationDate = new Date(timeNow + expiresInDuration * 1000);

          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, response.accessType, response.creatorId);
          this.userAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
        });
  }

  logout() {
    this.token = null;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.userAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
    setTimeout(() => {
      initFlowbite();
    });
  }

  onAutoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration) {
    console.log(duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, accessType: string, creatorId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('accessType', accessType);
    localStorage.setItem('creatorId', creatorId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}
