import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { initFlowbite } from 'flowbite';

import { GameWeekService } from './gameweek-service';

@Component({
  selector: 'gameweek',
  templateUrl: './gameweek.component.html',
  styleUrls: ['./gameweek.component.css'],
})
export class GameweekComponent implements OnInit {
  constructor(
    private gameweekService: GameWeekService,
    private router: Router
  ) {}

  public gameWeekData;
  public teamId;
  public week;
  public accessType;
  public userId;

  public actionForPopUp = '';

  ngOnInit(): void {
    initFlowbite();
    this.userId = localStorage.getItem('userId');
    this.accessType = localStorage.getItem('accessType');
    this.gameweekService.sendTeamId.subscribe((response) => {
      this.teamId = response;
    });
    this.gameweekService.sendSpecificWeek.subscribe((response) => {
      this.gameWeekData = response;
      this.week = response.week;
    });
    this.gameweekService.updatedGameweeks.subscribe((response: any[]) => {
      if (response !== null) {
        let newGameweekData = response;
        let gameweeks;
        gameweeks = newGameweekData?.filter(
          (team) => team.team_id === this.teamId
        )[0];
        let updatedGameweek =
          gameweeks.weeksArray[
            gameweeks.weeksArray.findIndex((el) => el.week === this.week)
          ];
        this.gameWeekData = updatedGameweek;
      }
    });
  }

  sendGameweek(gameWeek: any) {
    this.gameweekService.sendGameweek.next(gameWeek);
  }

  popUpAction() {
    this.gameweekService.deleteGameweekClick();
  }

  deleteGameweek(gameWeek: any) {
    let unmodifiedGameweek;
    let onlyOneGameweek;

    this.gameweekService.getGameweek();

    this.gameweekService.sendGameweek.subscribe((response) => {
      unmodifiedGameweek = response?.filter((e) => e.teamId === this.teamId);
      onlyOneGameweek = unmodifiedGameweek[0].weeksArray.length === 1;
    });

    if (onlyOneGameweek) {
      this.gameweekService.deleteOnlyGameweek(this.teamId);
    } else {
      let modifiedGameweek = unmodifiedGameweek[0].weeksArray.filter(
        (e) => e.week !== gameWeek.week
      );
      unmodifiedGameweek[0].weeksArray = modifiedGameweek;
      this.gameweekService.deleteGameweek(unmodifiedGameweek[0]);
    }
  }

  getAverage(rating: any) {
    let sum = 0;
    let length = 0;
    rating.forEach((value) => {
      if (value.rating) {
        sum += value.rating;
        length++;
      }
    });
    return (sum / length).toFixed(1);
  }

  getOwnRating(playerRating: any) {
    let userId = localStorage.getItem('userId');
    let rating = playerRating?.filter((x) => x.ratedBy === userId)[0];
    return rating ? rating.rating : undefined;
  }

  gameResult() {
    const teamScore = this.gameWeekData.teamScore;
    const oppScore = this.gameWeekData.opponentScore;
    let result = '';

    if (teamScore > oppScore) {
      result = 'WIN';
    } else if (teamScore < oppScore) {
      result = 'LOSS';
    } else result = 'DRAW';

    return `${result} ${teamScore}-${oppScore}`;
  }
}
