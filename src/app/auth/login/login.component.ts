import { Component } from "@angular/core";

import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {
  constructor(public authService: AuthService) { }

  isLoading: boolean = false;

  private authStatusSub: Subscription;

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
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
