import { Component, OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }

  title = 'rateMyMates';

  ngOnInit(): void {
    initFlowbite();
    this.authService.onAutoAuthUser();
  }
}
