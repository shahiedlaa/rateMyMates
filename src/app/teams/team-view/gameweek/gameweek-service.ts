import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Gameweek } from "./gameweek.model";
import { response } from "express";

@Injectable({ providedIn: 'root' })
export class GameWeekService {

  sendGameweek = new BehaviorSubject(null);
  sendSpecificWeek = new BehaviorSubject(null);
  changeInGameweek = new BehaviorSubject(null);

  private gameWeeks: Gameweek[] = [
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

  private playersArray = [
    {
      team_id: '665b05f8941dee3b07d50970',
      players: ['Rashford', 'Tommy', 'Joshua', 'Farid']
    },
    {
      team_id: '66549a614774a068fda394f2',
      players: ['De Jong', 'Tommy', 'Joshua', 'Farid']
    },
  ];

  getGameWeek() {
    return [...this.gameWeeks];
  }

  getPlayersArray() {
    return [...this.playersArray];
  }

  updateGameweek(team_id, week: number) {
    this.sendGameweek.subscribe(players => {
      let editedWeek = {
        week: week,
        players: players
      }
      console.log(editedWeek)
      let extractedTeam = this.gameWeeks.filter(team => team.team_id === team_id);
      extractedTeam[0].weeksArray[extractedTeam[0].weeksArray.findIndex(el => el.week === week)] = editedWeek;
      console.log(extractedTeam);
    })


  }

}
