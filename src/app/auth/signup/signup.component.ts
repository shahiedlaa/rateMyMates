import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Form, NgForm } from "@angular/forms";

import { Subscription } from "rxjs";
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from "flowbite";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html'
})

export class SignUpComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, public myElement: ElementRef) { }

  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;
  public authError = false;
  public authErrorMessage: string;

  isLoading: boolean = false;

  @ViewChild('modalEl', { static: false, read: HTMLElement }) modal;

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.errorStatusSub = this.authService.getErrorStatusListener().subscribe(
      error => {
        this.authError = true;
        switch (error.errorMessage) {
          case 'User validation failed: email: Error, expected `email` to be unique':
            this.authErrorMessage = 'Username already taken!'
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onSubmit(signUpForm: NgForm) {
    if (signUpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signUpForm.value.email, signUpForm.value.password);
  }

}
