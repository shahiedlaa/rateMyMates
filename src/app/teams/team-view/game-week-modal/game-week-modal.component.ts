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
  public editMode: boolean = false;

  constructor(private formBuilder: FormBuilder, private gameweekService: GameWeekService, private postService: PostService) {
    this.gameWeekForm = this.formBuilder.group({
      players: this.formBuilder.array([], { validators: [Validators.required] })
    })
  }

  gameWeekForm: FormGroup;
  initialGameweek: any = [];

  ngOnInit(): void {
    this.initialGameweek = this.gameweekService.getGameWeek().filter(team => team.team_id === this.teamId);
    this.postService.formEmiiter.subscribe((response) => {
      if (response !== null)
        console.log(response);
      this.editMode = response;
    })
  }

  get players(): FormArray {
    return this.gameWeekForm.get('players') as FormArray;
  }

  newPlayer(): FormGroup {
    return this.formBuilder.group({
      player: ''
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

    if (this.editMode) {
      Object.keys(data).forEach(key => {
        data[key].forEach(element =>
          playersArray.push(element['player'])
        );
      });
      this.gameweekService.addPlayersToRoster(playersArray, this.teamId);
    }
    else {
      Object.keys(data).forEach(key => {
        data[key].forEach(element =>
          playersArray.push(element['player'])
        );
      });

      const copiedArray = Array.from(this.initialGameweek);

      let latestWeekNumber = copiedArray[0]['weeksArray'].slice(-1)[0].week;

      let gameWeek = {
        week: latestWeekNumber + 1,
        players: playersArray
      };

      this.initialGameweek[0].weeksArray.push(gameWeek);
      this.gameweekService.sendGameweek.next([...this.initialGameweek]);
    }
  }

}
