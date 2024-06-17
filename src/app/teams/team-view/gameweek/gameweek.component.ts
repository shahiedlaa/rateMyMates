import { Component, OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';

import { GameWeekService } from './gameweek-service';


@Component({
  selector: 'gameweek',
  templateUrl: './gameweek.component.html',
  styleUrls: ['./gameweek.component.css']
})
export class GameweekComponent implements OnInit {

  constructor(private gameweekService: GameWeekService) { }

  public gameWeekData;

  ngOnInit(): void {
    initFlowbite();
    this.gameweekService.sendSpecificWeek.subscribe(response => {
      this.gameWeekData = response;
    })
  }

  sendGameweek(gameWeek: any) {
    this.gameweekService.sendGameweek.next(gameWeek);
  }
}
