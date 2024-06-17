import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Gameweek } from "./gameweek.model";
import { response } from "express";

@Injectable({ providedIn: 'root' })
export class GameWeekService {

  sendGameweek = new BehaviorSubject(null);
  sendSpecificWeek = new BehaviorSubject(null);

  public gameWeeks: Gameweek[] = [
    {
      team_id: '665b05f8941dee3b07d50970',
      weeksArray: [{
        week: 1,
        players: [{ name: 'Rashford', rating: 6 }, { name: 'Tommy', rating: 7 }]
      },
      {
        week: 2,
        players: [{ name: 'Joshua', rating: 6 }, { name: 'Farid', rating: 7 }]
      }]
    },
    {
      team_id: '66549a614774a068fda394f2',
      weeksArray: [{
        week: 1,
        players: [{ name: 'De Jong', rating: 6 }, { name: 'Tommy', rating: 7 }]
      },
      {
        week: 2,
        players: [{ name: 'Mark', rating: 6 }, { name: 'Kevin', rating: 7 }]
      }]
    }
  ];

  // updateGameweek() {
  //   this.sendGameweek.subscribe(response => {
  //     let teamId = response[0].team_id;
  //     console.log(this.gameWeeks);
  //   })
  // }

  getGameWeek() {
    return [...this.gameWeeks];
  }

}
