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

  gameWeekForm: FormGroup;
  initialGameweek: any = [];
  playersArray: any[] = [];


  ngOnInit(): void {
    this.getGameweek();
    this.postService.formEmiiter.subscribe((response) => {
      if (response !== null && response === 'addPlayers') {
        this.addPlayerMode = true
      }
      else {
        this.addPlayerMode = false
      }
    })
    this.gameweekService.getPlayers();
    this.gameweekService.playersUpdate.subscribe(response => {
      if (response) {
        this.playersArray = response.filter(team => team.teamId === this.teamId);
      }
    })

  }

  getGameweek() {
    this.gameweekService.getGameweek();
    this.gameweekService.sendGameweek.subscribe((response) => {
      if (response) {
        this.initialGameweek = response.filter(team => team.teamId === this.teamId);
      }
    })
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(): FormGroup {
    return this.formBuilder.group({
      player: '',
      rating: '',
    });
  }

  addPlayer() {
    this.players.push(this.newPlayer());
  }

  removePlayer(i: number) {
    this.players.removeAt(i);
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
      this.gameweekService.addPlayersArray(this.teamId, playersArray);
    }
    else {
      Object.keys(data).forEach(key => {
        data[key].forEach(element =>
          playersArray.push(element));
      });

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
        this.gameweekService.addGameWeek(newGameWeek)
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
  }

}
