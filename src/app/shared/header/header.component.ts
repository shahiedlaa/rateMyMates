import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;

  constructor(public authService: AuthService) {}

  public authListenerSubs: Subscription;

  public userType: string;

  public userLoaded = false;

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthentication();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      });
    this.userType = localStorage.getItem('accessType');
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    localStorage.clear();
    this.authService.logout();
  }
}
