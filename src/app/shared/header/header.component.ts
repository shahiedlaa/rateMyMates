import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;

  constructor(public authService: AuthService) { }

  public authListenerSubs: Subscription;

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthentication();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      })
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
