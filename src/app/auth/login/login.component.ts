import { Component } from '@angular/core';

import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(public authService: AuthService) {}

  isLoading: boolean = false;
  public authError = false;
  public authErrorMessage: string;

  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.errorStatusSub = this.authService
      .getErrorStatusListener()
      .subscribe((error) => {
        this.authError = true;
        switch (error.errorMessage) {
          case 'No user with that email found!':
            this.authErrorMessage = 'No user found!';
            break;
          case 'Incorrect password!':
            this.authErrorMessage = 'Incorrect password!';
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onLogin(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
