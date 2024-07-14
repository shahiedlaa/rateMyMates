import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";
import { initFlowbite } from "flowbite";

import { environment } from "src/environments/environment";
import { PlayersArray } from "../../../../../backend/models/playersArray"

const BACKEND_URL = environment.apiUrl + "/teams"

@Injectable({ providedIn: 'root' })
export class GameWeekService {

  constructor(private http: HttpClient, private router: Router) { }

  sendGameweek = new BehaviorSubject(null);
  sendSpecificWeek = new BehaviorSubject(null);
  updatedGameweeks = new BehaviorSubject<any>(null);
  sendTeamId = new BehaviorSubject<any>(null);
  playersUpdate = new BehaviorSubject<any>(null);

  private gameWeeks: any[] = [
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
      players: ['Rashford', 'Tommy', 'Joshua', 'Farid'],
    },
    {
      team_id: '66549a614774a068fda394f2',
      // players: ['De Jong', 'Tommy', 'Joshua', 'Farid'],
      players: []
    },
  ];

  getGameWeek() {
    return [...this.gameWeeks];
  }

  getPlayersArray() {
    return [...this.playersArray];
  }


  updateGameweek(team_id, week: number) {
    this.sendGameweek.subscribe(response => {
      let data = response;
      let players = [];
      data.players.forEach((element) => players.push(element));
      let editedWeek = {
        week: week,
        players
      }
      let extractedTeam = this.gameWeeks.filter(team => team.team_id === team_id);
      extractedTeam[0].weeksArray[extractedTeam[0].weeksArray.findIndex(el => el.week === week)] = editedWeek;
      let teamIndex = this.gameWeeks.findIndex(team => team.team_id === team_id);

      this.gameWeeks[teamIndex] = extractedTeam[0];
      this.updatedGameweeks.next(this.gameWeeks);
    })
  }

  addPlayersToRoster(newPlayers, teamId) {
    let extractedPlayers = this.playersArray.filter(team => team.team_id === teamId)[0];
    console.log(extractedPlayers.players.push(...newPlayers));
    console.log(this.playersArray);
  }

  addPlayersArray(teamId: string, players: any) {
    let postData: PlayersArray | FormData;
    postData = {
      teamId: teamId, players: players
    };
    console.log(postData)
    this.http.post<{ message: string, playersArray: PlayersArray }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      })
    setTimeout(() => {
      initFlowbite();
    });
  }

  getPlayers(): any {
    this.http.get<any>(BACKEND_URL)
      .subscribe(responseData => {
        this.playersArray = responseData.players;
        this.playersUpdate.next(this.playersArray);
      });
  }

  updatePlayers(teamId: string, id, players: any) {
    const data = {
      id: id,
      teamId: teamId,
      players: players
    };
    this.http.put(BACKEND_URL + '/' + teamId, data)
      .subscribe((response) => {
        if (response) {
        }
      })
  }

  addGameWeek(teamData: any) {
    console.log(teamData);
    this.http.post<any>(BACKEND_URL + '/addGameweek', teamData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  getGameweek() {
    this.http.get<any>(BACKEND_URL + '/getGameweek')
      .subscribe(responseData => {
        this.gameWeeks = responseData.data;
        this.sendGameweek.next(this.gameWeeks);
      });
  }

}
