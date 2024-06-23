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
  public teamId;
  public week;

  ngOnInit(): void {
    initFlowbite();
    this.gameweekService.sendTeamId.subscribe(response => {
      this.teamId = response;
    });
    this.gameweekService.sendSpecificWeek.subscribe(response => {
      this.gameWeekData = response;
      this.week = response.week;
    });
    this.gameweekService.updatedGameweeks.subscribe((response: any[]) => {
      if (response !== null) {
        let newGameweekData = response;
        let gameweeks;
        gameweeks = newGameweekData.filter(team => team.team_id === this.teamId)[0];
        let updatedGameweek = gameweeks.weeksArray[gameweeks.weeksArray.findIndex(el => el.week === this.week)];
        this.gameWeekData = updatedGameweek;
      }
    });
  }

  sendGameweek(gameWeek: any) {
    this.gameweekService.sendGameweek.next(gameWeek);
  }
}
