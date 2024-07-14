import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GameWeekService } from '../gameweek/gameweek-service';
import { PostService } from '../../post-service';

@Component({
  selector: 'game-week-modal',
  templateUrl: './game-week-modal.component.html',
  styleUrls: ['./game-week-modal.component.css']
})
export class GameWeekModalComponent implements OnInit {

  @Input('teamId') teamId;
  public addPlayerMode: boolean = false;

  constructor(private formBuilder: FormBuilder, private gameweekService: GameWeekService, private postService: PostService) {
    this.gameWeekForm = this.formBuilder.group({
      players: this.formBuilder.array([], { validators: [Validators.required] })
    })
  }

  public gameWeekForm: FormGroup;
  private initialGameweek: any = [];
  public playersArray: any[] = [];

  ngOnInit(): void {
    this.gameweekService.getPlayers();
    this.postService.formEmiiter.subscribe((response) => {
      if (response !== null && response === 'addPlayers') {
        this.addPlayerMode = true;
        this.populateData();
      }
      else {
        this.addPlayerMode = false
        const players = this.gameWeekForm.get('players') as FormArray;
        players.clear();
      }
    })
    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === this.teamId);
      }
    })
    this.getGameweek();
    this.postService.getCreatorId().subscribe(response => {
      if (response) {
        localStorage.setItem('creatorId', response);
      }
    })
  }

  getGameweek() {
    this.gameweekService.getGameweek();
    this.gameweekService.sendGameweek.subscribe((response) => {
      if (response && response.length > 0) {
        this.initialGameweek = response.filter(team => team.teamId === this.teamId);
      }
    })
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(data?: any): FormGroup {
    data = data || { name: null, rating: null }
    return this.formBuilder.group({
      player: data.name ? data.name : 'New Player',
      rating: data.rating ? data.rating : null,
    });
  }

  addPlayer() {
    this.players.push(this.newPlayer());
  }

  removePlayer(i: number) {
    this.players.removeAt(i);
  }

  populateData() {
    this.gameweekService.playersUpdate.subscribe(data => {
      if (data) {
        let teamPlayers = data?.filter(team => team.teamId === this.teamId);
        let playerData = teamPlayers[0]?.players;
        const players = this.gameWeekForm.get('players') as FormArray;
        players.clear();
        playerData?.forEach(b => {
          const data = {
            name: b,
            rating: null
          }
          players.push(this.newPlayer(data));
        });
      }
    });
  }

  onSubmit() {
    let data = this.gameWeekForm.value;
    let playersArray = [];

    if (this.addPlayerMode) {
      Object.keys(data).forEach(key => {
        data[key].forEach(element =>
          playersArray.push(element['player'])
        );
      });

      this.gameweekService.playersUpdate.subscribe((response) => {
        let teamExist = response?.filter(team => team.teamId === this.teamId);
        if (teamExist.length !== 0) {
          let objectId = teamExist[0]._id;
          this.gameweekService.updatePlayers(this.teamId, objectId, playersArray);
        }
        else {
          this.gameweekService.addPlayersArray(this.teamId, playersArray);
        }
      })
    }
    else {

      Object.keys(data).forEach(key => {
        data[key].forEach(element =>
          playersArray.push(element)
        );
      });

      const creatorId = localStorage.getItem('creatorId');

      for (let i = 0; i < playersArray.length; i++) {
        let ratingFormat = {
          ratedBy: creatorId,
          rating: playersArray[i].rating
        };
        playersArray[i].rating = ratingFormat;
      }

      console.log(playersArray);

      let createFromScratch = this.initialGameweek.length === 0;

      if (createFromScratch) {
        let newGameWeek =
        {
          team_id: this.teamId,
          weeksArray: [{
            week: 1,
            players: playersArray
          }]
        }
        this.gameweekService.addGameWeek(newGameWeek);
      }
      else {
        const copiedArray = Array.from(this.initialGameweek);

        let latestWeekNumber = copiedArray[0]['weeksArray']?.slice(-1)[0].week;

        let gameWeek = {
          week: latestWeekNumber + 1,
          players: playersArray
        };

        this.initialGameweek[0].weeksArray.push(gameWeek);
        console.log(this.initialGameweek);
      }
    }

    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === this.teamId);
      }
    })
  }



}
