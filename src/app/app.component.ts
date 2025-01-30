import { Component, OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  title = 'rateMyMates';
  public userIsAuthenticated: boolean = false;
  public authListenerSubs: Subscription;

  ngOnInit(): void {
    initFlowbite();
    this.authService.onAutoAuthUser();
    this.userIsAuthenticated = this.authService.getAuthentication();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
}
