import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthRoutingModule
  ],
})
export class AuthModule { }
